import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'app/shared/components/messages/message.service';
import { AscApresentadorComponent } from './apresentador.component';

describe('AscApresentadorComponent', () => {
    let component: AscApresentadorComponent<any>;
    let fixture: ComponentFixture<AscApresentadorComponent<any>>;
    let messageService: jest.Mocked<MessageService>;

    beforeEach(async () => {
        messageService = {} as jest.Mocked<MessageService>;

        await TestBed.configureTestingModule({
            declarations: [AscApresentadorComponent],
            providers: [
                { provide: MessageService, useValue: messageService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AscApresentadorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar com valores padrão', () => {
        expect(component.tituloModal).toBe('Exibição');
        expect(component.display).toBe(false);
        expect(component.apresentaveis).toEqual([]);
    });

    it('deve inicializar emitter como EventEmitter', () => {
        expect(component['emitter']).toBeDefined();
        expect(typeof component['emitter'].emit).toBe('function');
    });

    it('setHeader deve definir o header', () => {
        component.setHeader('Novo Header');

        expect(component.header).toBe('Novo Header');
    });

    it('setApresentaveis deve definir os apresentaveis', () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

        component.setApresentaveis(items);

        expect(component.apresentaveis).toEqual(items);
    });

    it('apresentar deve configurar currentInfo e display', () => {
        const item = { id: 1, nome: 'Teste' };

        component.apresentar(item);

        expect(component.currentInfo).toEqual(item);
        expect(component.display).toBe(true);
        expect(component.header).toBe('');
    });

    it('apresentar deve emitir evento com currentInfo', () => {
        const item = { id: 1, nome: 'Teste' };
        const emitSpy = jest.jest.jest.spyOn(component['emitter'], 'emit');

        component.apresentar(item);

        expect(emitSpy).toHaveBeenCalledWith(item);
    });

    it('close deve desabilitar display e navegação', () => {
        component.display = true;
        component.disabledAnterior = false;
        component.disabledProximo = false;

        component.close();

        expect(component.display).toBe(false);
        expect(component.disabledAnterior).toBe(true);
        expect(component.disabledProximo).toBe(true);
    });

    it('disableNav deve desabilitar navegação', () => {
        component.disabledAnterior = false;
        component.disabledProximo = false;

        component.disableNav();

        expect(component.disabledAnterior).toBe(true);
        expect(component.disabledProximo).toBe(true);
    });

    it('enableNav deve habilitar navegação', () => {
        component.disabledAnterior = true;
        component.disabledProximo = true;

        component.enableNav();

        expect(component.disabledAnterior).toBe(false);
        expect(component.disabledProximo).toBe(false);
    });

    it('temAnterior deve retornar false quando não há item anterior', () => {
        const items = [{ id: 1 }, { id: 2 }];
        component.setApresentaveis(items);
        component.currentInfo = items[0];

        const resultado = component.temAnterior();

        expect(resultado).toBe(false);
    });

    it('temAnterior deve retornar true quando há item anterior', () => {
        const items = [{ id: 1 }, { id: 2 }];
        component.setApresentaveis(items);
        component.currentInfo = items[1];

        const resultado = component.temAnterior();

        expect(resultado).toBe(true);
    });

    it('temProximo deve retornar false quando não há próximo item', () => {
        const items = [{ id: 1 }, { id: 2 }];
        component.setApresentaveis(items);
        component.currentInfo = items[1];

        const resultado = component.temProximo();

        expect(resultado).toBe(false);
    });

    it('temProximo deve retornar true quando há próximo item', () => {
        const items = [{ id: 1 }, { id: 2 }];
        component.setApresentaveis(items);
        component.currentInfo = items[0];

        const resultado = component.temProximo();

        expect(resultado).toBe(true);
    });

    it('apresentarProximo deve apresentar o próximo item', () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
        component.setApresentaveis(items);
        component.apresentar(items[0]);

        component.apresentarProximo();

        expect(component.currentInfo).toEqual(items[1]);
    });

    it('apresentarAnterior deve apresentar o item anterior', () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
        component.setApresentaveis(items);
        component.apresentar(items[1]);

        component.apresentarAnterior();

        expect(component.currentInfo).toEqual(items[0]);
    });

    it('apresentarProximo não deve fazer nada se não há próximo', () => {
        const items = [{ id: 1 }, { id: 2 }];
        component.setApresentaveis(items);
        component.apresentar(items[1]);

        component.apresentarProximo();

        expect(component.currentInfo).toEqual(items[1]);
    });

    it('apresentarAnterior não deve fazer nada se não há anterior', () => {
        const items = [{ id: 1 }, { id: 2 }];
        component.setApresentaveis(items);
        component.apresentar(items[0]);

        component.apresentarAnterior();

        expect(component.currentInfo).toEqual(items[0]);
    });

    it('deve emitir evento ao navegar para próximo', () => {
        const items = [{ id: 1 }, { id: 2 }];
        const emitSpy = jest.jest.jest.spyOn(component['emitter'], 'emit');
        component.setApresentaveis(items);
        component.apresentar(items[0]);

        emitSpy.mockClear();
        component.apresentarProximo();

        expect(emitSpy).toHaveBeenCalledWith(items[1]);
    });

    it('temAnterior deve retornar false quando apresentaveis é null', () => {
        component.apresentaveis = null as any;

        const resultado = component.temAnterior();

        expect(resultado).toBe(false);
    });

    it('temProximo deve retornar false quando apresentaveis é null', () => {
        component.apresentaveis = null as any;

        const resultado = component.temProximo();

        expect(resultado).toBe(false);
    });
});
