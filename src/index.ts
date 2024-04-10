import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import {
	AppState,
	CatalogChangeEvent,
	CatalogModel,
	ProductModel,
	ShoppingCartModel,
	UserDataModel,
} from './components/AppData';
import { PageView } from './components/Page';
import { ModalView } from './components/common/Modal';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { CardView } from './components/Card';
import { SuccessView } from './components/common/Success';
import { IOrderForm, IProduct } from './types';
import { OrderView } from './components/Order';
import { ShoppingCartView } from './components/common/ShoppingCart';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const shoppingCartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);

const page = new PageView(document.body, events);
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);

const cart = new ShoppingCartView(cloneTemplate(shoppingCartTemplate), events);
const order = new OrderView(cloneTemplate(orderTemplate), events);
const form = new OrderView(cloneTemplate(formTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map(item => {
		const card = new CardView('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item)
		});
		return card.render({
			description: item.description,
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
		});
	});

	page.counter = appData.shoppingCart.length;
});

events.on('preview:changed', (item: ProductModel) => {
	const showItem = (item: ProductModel) => {
		const card = new CardView('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				events.emit('card:add', item);
			}
		});

		modal.render({
			content: card.render(
				{
					description: item.description,
					image: item.image,
					title: item.title,
					category: item.category,
					price: item.price,
				},
				appData.getCartItems().includes(item)
			)
		});
	}

	if (item) {
		api.getProductItem(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			})
	} else {
		modal.close();
	}
});

events.on('card:select', (item: ProductModel) => {
	appData.setPreview(item);
});

events.on('cart:changed', () => {
	page.counter = appData.shoppingCart.length;
	cart.items = appData.getCartItems().map((item, index) => {
		const card = new CardView('card', cloneTemplate(cardCartTemplate), {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});

		card.setIndex(index+1);

		return card.render({
			title: item.title,
			price: item.price,
		})
	})
	cart.totalPrice = appData.getTotal();
});

events.on('cart:open', () => {
	modal.render({
		content:
			cart.render(),
	});
});

events.on('card:add', (item: ProductModel) => {
	appData.addItemToCart(item);
	modal.close();
})

events.on('card:delete', (item: ProductModel) => {
	appData.deleteItemFromCart(item);
	events.emit('cart:changed');
})

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderField(data.field, data.value);
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone , address, payment} = errors;
	order.valid =  !address && !payment;
	form.valid = !email && !phone;
	order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
	form.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on('order:open', () => {
	appData.setOrderTotal();
	appData.setOrderItems();
	console.log(appData.order);

	modal.render({
		content: order.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: []
		})
	});
});

events.on('form:open', () => {
	modal.render({
		content: form.render({
			phone: '',
			email: '',
			valid: false,
			errors: []
		})
	});
});

events.on('contacts:submit', () => {
	api.orderProducts(appData.order)
		.then(res => {
			appData.clearOrder();
			appData.clearCart();
			events.emit('cart:changed');
			const success = new SuccessView(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close()
				}
			});

			success.total = res.total;

			modal.render({
				content:
					success.render(),
			});
		})
		.catch(err => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch(err => {
		console.error(err);
	});


