import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { ItemStorage } from '../../../../app/shared/storage/item-storage';
import { Item } from '../../../../app/shared/models/item';

@Injectable()
export class ItemService {
	private itemStorage: ItemStorage;
	private item: Item;
	
	constructor(private router: Router) {
		this.itemStorage = new ItemStorage();		
		this.item = null;
	}
		
	public inicializarItem(items: any[]) {
		this.item = new Item();
		this.item.items = items;
		this.itemStorage.gravar(this.item);
	}

	public lerItem():any {
		return this.item = this.itemStorage.ler();
	}
	

	public finalizarItem() {
		this.itemStorage.limpar();
	}

}
