import { Storage } from '../../../app/arquitetura/shared/storage/storage';
import { Item } from '../../../app/shared/models/item';

export class ItemStorage extends Storage<Item> {
	constructor() {
		super(Item,'item');
	}
}
