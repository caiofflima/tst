import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaInicialAdesaoTitularComponent } from './pagina-inicial-adesao-titular.component';
import { MessageService } from 'app/shared/components/messages/message.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PaginaInicialAdesaoTitularComponent', () => {
    let component: PaginaInicialAdesaoTitularComponent;
    let fixture: ComponentFixture<PaginaInicialAdesaoTitularComponent>;
    let messageService: jest.Mocked<MessageService>;

    beforeEach(async () => {
        messageService = {
            addMsgDanger: jest.fn(),
            addMsgSuccess: jest.fn()
        } as unknown as jest.Mocked<MessageService>;

        await TestBed.configureTestingModule({
            declarations: [PaginaInicialAdesaoTitularComponent],
            providers: [
                { provide: MessageService, useValue: messageService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginaInicialAdesaoTitularComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar index como -1', () => {
        expect(component.index).toBe(-1);
    });

    it('deve inicializar options com 5 elementos', () => {
        expect(component.options).toHaveLength(5);
    });

    it('deve ter options com valores corretos', () => {
        expect(component.options).toEqual([
            "Titular",
            "Complemento",
            "Contato",
            "Documentos",
            "Resumo"
        ]);
    });

    it('deve conter "Titular" nas options', () => {
        expect(component.options).toContain("Titular");
    });

    it('deve conter "Complemento" nas options', () => {
        expect(component.options).toContain("Complemento");
    });

    it('deve conter "Contato" nas options', () => {
        expect(component.options).toContain("Contato");
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

    it('setIndex deve aceitar valores maiores que tamanho do array', () => {
        component.setIndex(10);

        expect(component.index).toBe(10);
    });

    it('setIndex deve permitir múltiplas chamadas', () => {
        component.setIndex(1);
        expect(component.index).toBe(1);

        component.setIndex(3);
        expect(component.index).toBe(3);
    });

    it('deve manter options imutável após criação', () => {
        const originalOptions = [...component.options];

        component.setIndex(2);

        expect(component.options).toEqual(originalOptions);
    });
});
