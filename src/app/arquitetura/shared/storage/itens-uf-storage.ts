import {Storage} from '../../../../app/arquitetura/shared/storage/storage';

export class ItensUfStorage extends Storage<any> {
	constructor() {
		super(Object, 'itens-uf');
	}
}
