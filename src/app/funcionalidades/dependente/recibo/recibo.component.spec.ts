import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReciboComponent } from './recibo.component';
import { MessageService } from '../../../shared/services/services';
import { Router } from '@angular/router';
import { ReciboModel } from '../models/recibo-form.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock kendo
jest.mock('assets/js/kendo/kendo.all.min.js', () => ({}));

describe('ReciboComponent', () => {
    let component: ReciboComponent;
    let fixture: ComponentFixture<ReciboComponent>;
    let messageService: jest.Mocked<MessageService>;
    let router: jest.Mocked<Router>;

    beforeEach(async () => {
        messageService = {
            addMsgDanger: jest.fn(),
            addMsgSuccess: jest.fn()
        } as unknown as jest.Mocked<MessageService>;

        router = {
            navigate: jest.fn().mockReturnValue(Promise.resolve(true))
        } as unknown as jest.Mocked<Router>;

        await TestBed.configureTestingModule({
            declarations: [ReciboComponent],
            providers: [
                { provide: MessageService, useValue: messageService },
                { provide: Router, useValue: router }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ReciboComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar showProgressBar como false', () => {
        expect(component.showProgressBar).toBe(false);
    });

    it('deve aceitar motivo como Input', () => {
        component.motivo = 'Motivo de teste';

        expect(component.motivo).toBe('Motivo de teste');
    });

    it('deve aceitar pedido como Input', () => {
        const pedido: ReciboModel = {
            idTipoProcesso: 11
        } as ReciboModel;

        component.pedido = pedido;

        expect(component.pedido).toEqual(pedido);
    });

    it('navegarParaMeusProcessos deve navegar para meus-dados/pedidos', async () => {
        await component.navegarParaMeusProcessos();

        expect(router.navigate).toHaveBeenCalledWith(['meus-dados', 'pedidos']);
    });

    it('nomeTipoProcesso deve retornar "Inscrição de dependente" para idTipoProcesso 11', () => {
        component.pedido = { idTipoProcesso: 11 } as ReciboModel;

        const resultado = component.nomeTipoProcesso;

        expect(resultado).toBe('Inscrição de dependente');
    });

    it('nomeTipoProcesso deve retornar "Cancelamento de beneficiário" para idTipoProcesso 12', () => {
        component.pedido = { idTipoProcesso: 12 } as ReciboModel;

        const resultado = component.nomeTipoProcesso;

        expect(resultado).toBe('Cancelamento de beneficiário');
    });

    it('nomeTipoProcesso deve retornar "Alteração de beneficiário" para idTipoProcesso 13', () => {
        component.pedido = { idTipoProcesso: 13 } as ReciboModel;

        const resultado = component.nomeTipoProcesso;

        expect(resultado).toBe('Alteração de beneficiário');
    });

    it('nomeTipoProcesso deve retornar "Renovação de beneficiário" para outros idTipoProcesso', () => {
        component.pedido = { idTipoProcesso: 99 } as ReciboModel;

        const resultado = component.nomeTipoProcesso;

        expect(resultado).toBe('Renovação de beneficiário');
    });

    it('nomeTipoProcesso deve retornar valor padrão quando pedido é null', () => {
        component.pedido = null as any;

        const resultado = component.nomeTipoProcesso;

        expect(resultado).toBe('Renovação de beneficiário');
    });

    it('tituloMotivo deve retornar "Motivo da Atualização" quando idTipoProcesso é 13', () => {
        component.pedido = { idTipoProcesso: 13 } as ReciboModel;

        const resultado = component.tituloMotivo;

        expect(resultado).toBe('Motivo da Atualização');
    });

    it('tituloMotivo deve retornar "Motivo da Solicitação" quando idTipoProcesso não é 13', () => {
        component.pedido = { idTipoProcesso: 11 } as ReciboModel;

        const resultado = component.tituloMotivo;

        expect(resultado).toBe('Motivo da Solicitação');
    });

    it('tituloMotivo deve retornar "Motivo da Solicitação" quando pedido é null', () => {
        component.pedido = null as any;

        const resultado = component.tituloMotivo;

        expect(resultado).toBe('Motivo da Solicitação');
    });

    it('exportarPDF deve ser uma função', () => {
        expect(typeof component.exportarPDF).toBe('function');
    });

    it('deve permitir alterar showProgressBar', () => {
        component.showProgressBar = true;

        expect(component.showProgressBar).toBe(true);
    });

    it('deve aceitar pedido undefined', () => {
        component.pedido = undefined as any;

        expect(component.pedido).toBeUndefined();
    });

    it('nomeTipoProcesso deve retornar valor padrão quando pedido.idTipoProcesso é undefined', () => {
        component.pedido = {} as ReciboModel;

        const resultado = component.nomeTipoProcesso;

        expect(resultado).toBe('Renovação de beneficiário');
    });
});
