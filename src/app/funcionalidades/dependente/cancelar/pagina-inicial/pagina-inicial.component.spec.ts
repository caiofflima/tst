import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaInicialComponent } from './pagina-inicial.component';
import { MessageService } from 'app/shared/components/messages/message.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PaginaInicialComponent (Cancelar)', () => {
    let component: PaginaInicialComponent;
    let fixture: ComponentFixture<PaginaInicialComponent>;
    let messageService: jest.Mocked<MessageService>;

    beforeEach(async () => {
        messageService = {
            addMsgDanger: jest.fn(),
            addMsgSuccess: jest.fn()
        } as unknown as jest.Mocked<MessageService>;

        await TestBed.configureTestingModule({
            declarations: [PaginaInicialComponent],
            providers: [
                { provide: MessageService, useValue: messageService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginaInicialComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar index como -1', () => {
        expect(component.index).toBe(-1);
    });

    it('deve inicializar options com 3 elementos', () => {
        expect(component.options).toHaveLength(3);
    });

    it('deve ter options com valores corretos', () => {
        expect(component.options).toEqual([
            "Beneficiário",
            "Documentos",
            "Resumo"
        ]);
    });

    it('deve conter "Beneficiário" nas options', () => {
        expect(component.options).toContain("Beneficiário");
    });

    it('deve conter "Documentos" nas options', () => {
        expect(component.options).toContain("Documentos");
    });

    it('deve conter "Resumo" nas options', () => {
        expect(component.options).toContain("Resumo");
    });

    it('setIndex deve alterar o valor de index', () => {
        component.setIndex(2);

        expect(component.index).toBe(2);
    });

    it('setIndex deve aceitar valor 0', () => {
        component.setIndex(0);

        expect(component.index).toBe(0);
    });

    it('setIndex deve aceitar valores negativos', () => {
        component.setIndex(-5);

        expect(component.index).toBe(-5);
    });

    it('ngOnInit deve executar sem erros', () => {
        expect(() => component.ngOnInit()).not.toThrow();
    });

    it('setIndex deve permitir múltiplas chamadas', () => {
        component.setIndex(1);
        expect(component.index).toBe(1);

        component.setIndex(2);
        expect(component.index).toBe(2);
    });

    it('deve manter options imutável após ngOnInit', () => {
        const originalOptions = [...component.options];

        component.ngOnInit();

        expect(component.options).toEqual(originalOptions);
    });
});
