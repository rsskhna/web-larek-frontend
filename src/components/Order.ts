import { FormView } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/Events';
import { ensureAllElements } from '../utils/utils';

export type ButtonActions = {
	onClick: (button: string) => void
}

export class OrderView extends FormView<IOrderForm> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents, actions?: ButtonActions) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

		this._buttons.forEach(button => {
			button.addEventListener('click', () => {
				actions?.onClick?.(button.name);
			});
		})
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	set payment(name: string) {
		this._buttons.forEach(button => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
			this.setDisabled(button, button.name === name)
		});
	}
}
