import { Model } from './base/Model';
import { FormErrors, IAppState, IOrder, IOrderForm, IProduct, ICatalog } from '../types';
import { IShoppingCart } from '../types';

export type CatalogChangeEvent= {
	catalog: ProductModel[]
}

export class ProductModel extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;

	get productId(): string {
		return this.id;
	}

	get productDescription(): string {
		return this.description;
	}

	get productImage(): string {
		return this.image;
	}

	get productTitle(): string {
		return this.title;
	}

	get productCategory(): string {
		return this.category;
	}

	get productPrice(): number {
		return this.price;
	}
}

export class CatalogModel extends Model<ICatalog> {
	total: number;
	items: IProduct[];

	get totalAmount(): number {
		return this.total;
	}

	get itemsInCatalog(): IProduct[] {
		return this.items;
	}
}

export class UserDataModel extends Model<IOrder> {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];

	get paymentMethod(): string {
		return this.payment;
	}

	get emailValue(): string {
		return this.email;
	}

	get phoneNumber(): string {
		return this.phone;
	}

	get deliveryAddress(): string {
		return this.address;
	}

	get totalPrice(): number {
		return this.total;
	}

	get itemsInOrder(): string[] {
		return this.items;
	}
}

export class ShoppingCartModel extends Model<IShoppingCart> {
	items: string[];
	total: number;

	get itemsInCart(): string[] {
		return this.items;
	}

	get totalPrice(): number {
		return this.total;
	}

	addItem(cardInfo: IProduct): void {
		this.items.push(cardInfo.id);
	};

	deleteItem(cardInfo: IProduct): void {
		if (this.items) {
			const index = this.items.indexOf(cardInfo.id);
			this.items.splice(index, 1);
		}
	};
}

export class AppState extends Model<IAppState> {
	shoppingCart: IProduct[] = [];
	catalog: IProduct[];
	order: IOrder = {
		payment: 'card',
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	getTotal() {
		return this.shoppingCart.reduce((a, c) => a + this.catalog.find(it => it === c).price, 0);
	}

	getCartItems() {
		return this.shoppingCart;
	}

	addItemToCart(item: ProductModel) {
		this.shoppingCart.push(item);
		this.emitChanges('cart:changed');
	}

	deleteItemFromCart(item: ProductModel) {
		const index = this.shoppingCart.indexOf(item);
		this.shoppingCart.splice(index, 1);
	}

	clearCart() {
		this.shoppingCart = [];
	}

	clearOrder() {
		this.order.items = [];
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map(item => new ProductModel(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ProductModel) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setOrderTotal () {
		this.order.total = this.getTotal();
	}

	setOrderItems () {
		if (this.shoppingCart) {
			this.shoppingCart.forEach(product => {
				this.order.items.push(product.id);
			})
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}