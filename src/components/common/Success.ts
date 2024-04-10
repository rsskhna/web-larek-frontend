import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
	total: number;
	id: string;
}

interface ISuccessActions {
	onClick: () => void;
}

export class SuccessView extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
		this._total = container.querySelector('.order-success__description');

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}