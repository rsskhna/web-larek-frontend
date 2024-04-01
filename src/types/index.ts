import { ApiListResponse } from '../components/base/Api';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface ICatalog {
	total: number;
	items: IProduct[];
}

export interface IAppState {
	catalog: IProduct[];
	shoppingCart: string[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
}

export interface IOrder extends IOrderForm {
	total: number;
	items: string[];
}

export interface IOrderResult extends ApiListResponse<IProduct>{
	id: string;
}




