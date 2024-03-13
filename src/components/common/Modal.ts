import { IOrderForm, IProductItem, IShoppingCart, ISuccess } from '../../types';

export interface IModalWindow {
	type: IProductItem | IShoppingCart | IOrderForm | ISuccess;

	openModal(): void;

	closeModal(): void;
}
