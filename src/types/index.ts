export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IProductList {
	total: number;
	items: IProductItem[];
}

export interface IShoppingCart {
	items: IProductItem[];
	totalPrice: number | null;

	addItem(cardInfo: IProductItem): void;

	deleteItem(cardInfo: IProductItem): void;
}

export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface ISuccess {
	total: number;
}




