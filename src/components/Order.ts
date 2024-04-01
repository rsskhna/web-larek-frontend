import { FormView } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/Events';

export class OrderView extends FormView<IOrderForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
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

	set payment(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}