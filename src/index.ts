import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState, CatalogChangeEvent, CatalogModel, ProductModel } from './components/AppData';
import { PageView } from './components/Page';
import { ModalView } from './components/common/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardView } from './components/Card';
import { SuccessView } from './components/common/Success';
import { IOrderForm } from './types';
import { OrderView } from './components/Order';

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
		const card = new CardView('card', cloneTemplate(cardPreviewTemplate));

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

events.on('card:select', (item: ProductModel) => {
	appData.setPreview(item);
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


