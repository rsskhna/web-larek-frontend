import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';

export interface IShoppingCart {
	items: string[];
	total: number;
	addItem(cardInfo: IProduct): void;
	deleteItem(cardInfo: IProduct): void;
}

export class ShoppingCartView extends Component<IShoppingCart> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			}));
		}
	}

	set totalPrice(total: number) {
		this.setText(this._total, total);
	}
}