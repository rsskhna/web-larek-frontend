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

export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
}

export interface IOrder extends IOrderForm {
	items: IProductItem[]
}

export interface IOrderResult {
	id: string;
}




