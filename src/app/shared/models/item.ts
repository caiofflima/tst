import { Entity } from '../../../app/arquitetura/shared/models/entity';

export class Item extends Entity {
	public items: any[] = [];
	public itemsSelecionados: any[] = [];
}
