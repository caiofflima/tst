import { Storage } from '../../../../app/arquitetura/shared/storage/storage';

export class MessageStorage extends Storage<any> {
	constructor() {
		super(Object, 'message');
	}
}
