import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ItemService } from './item.service';
import { ItemStorage } from '../../../../app/shared/storage/item-storage';
import { Item } from '../../../../app/shared/models/item';

describe('ItemService', () => {
  let service: ItemService;
  let routerSpy: jasmine.SpyObj<Router>;
  const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
  const itemStorageSpy = jasmine.createSpyObj('ItemStorage', ['gravar', 'ler', 'limpar']);
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemService,
        { provide: Router, useValue: routerSpyObj },
        { provide: ItemStorage, useValue: itemStorageSpy }
      ]
    });

    service = TestBed.inject(ItemService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('inicializarItem', () => {
    it('should initialize item and save it to storage', () => {
      const items = [{ id: 1, name: 'Item 1' }];
      service.inicializarItem(items);

      expect(service['item']).toBeTruthy();
      expect(service['item'].items).toEqual(items);
    });
  });


});
