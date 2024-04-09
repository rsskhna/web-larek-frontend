import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState, CatalogChangeEvent, CatalogModel, ProductModel, ShoppingCartModel } from './components/AppData';
import { PageView } from './components/Page';
import { ModalView } from './components/common/Modal';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { CardView } from './components/Card';
import { SuccessView } from './components/common/Success';
import { IOrderForm, IProduct } from './types';
import { OrderView } from './components/Order';
import { ShoppingCartView } from './components/common/ShopppingCart';

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
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const formTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const appData = new AppState({}, events);

const page = new PageView(document.body, events);
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);

const cart = new ShoppingCartView(cloneTemplate(shoppingCartTemplate), events);
const order = new OrderView(cloneTemplate(orderTemplate), events);

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
			content: card.render({
				description: item.description,
				image: item.image,
				title: item.title,
				category: item.category,
				price: item.price,
			})
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

events.on('card:add', (item: ProductModel) => {
	appData.setCartItems(item);
})

events.on('cart:changed', () => {
	page.counter = appData.shoppingCart.length;
	cart.items = appData.getCartItems().map((item) => {
		const cartItem = new CardView('card', cloneTemplate(cardCartTemplate), {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});

		return cartItem.render({
			title: item.title,
			price: item.price,
		})
	})
	cart.totalPrice = appData.getTotal();
});

events.on('card:select', (item: ProductModel) => {
	appData.setPreview(item);
});

events.on('cart:open', () => {
	modal.render({
		content:
			cart.render(),
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


