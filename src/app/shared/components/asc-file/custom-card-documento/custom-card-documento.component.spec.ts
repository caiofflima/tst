import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomCardDocumentoComponent } from './custom-card-documento.component';
import { ArquivoParam } from '../models/arquivo.param';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustomCardDocumentoComponent', () => {
    let component: CustomCardDocumentoComponent;
    let fixture: ComponentFixture<CustomCardDocumentoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomCardDocumentoComponent],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomCardDocumentoComponent);
        component = fixture.componentInstance;
        // Inicializa documento com a estrutura necessária para o template
        component.documento = {
            idTipoDocumento: 1,
            documento: { nome: 'Teste', descricao: 'Descrição teste' },
            arquivos: []
        };
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar showSucess como false', () => {
        expect(component.showSucess).toBe(false);
    });

    it('deve aceitar documento como Input', () => {
        const documento = { id: 1, nome: 'Documento Teste' };
        component.documento = documento;

        expect(component.documento).toEqual(documento);
    });

    it('deve aceitar showSucess como Input', () => {
        component.showSucess = true;

        expect(component.showSucess).toBe(true);
    });

    it('deve aceitar index como Input', () => {
        component.index = 5;

        expect(component.index).toBe(5);
    });

    it('deve ter removerArquivo como EventEmitter', () => {
        expect(component.removerArquivo).toBeDefined();
        expect(typeof component.removerArquivo.emit).toBe('function');
    });

    it('removerDocumento deve emitir evento removerArquivo', () => {
        const arquivo = { name: 'teste.pdf', size: 1024 };
        const emitSpy = jest.jest.spyOn(component.removerArquivo, 'emit');

        component.removerDocumento(arquivo);

        expect(emitSpy).toHaveBeenCalledWith(arquivo);
    });

    it('removerDocumento deve emitir evento com arquivo correto', () => {
        let emittedArquivo: any;
        component.removerArquivo.subscribe((arquivo: any) => {
            emittedArquivo = arquivo;
        });

        const arquivo = { id: 123, nome: 'documento.pdf' };
        component.removerDocumento(arquivo);

        expect(emittedArquivo).toBe(arquivo);
    });

    it('arquivosSelecionados deve logar no console', () => {
        const consoleSpy = jest.jest.spyOn(console, 'log').mockImplementation();
        const param: ArquivoParam = {
            files: new Set<File>(),
            param: { id: 1 }
        };

        component.arquivosSelecionados(param, { tipo: 'teste' });

        expect(consoleSpy).toHaveBeenCalledWith('arquivosSelecionados');
        consoleSpy.mockRestore();
    });

    it('deve permitir múltiplas chamadas de removerDocumento', () => {
        const emitSpy = jest.jest.spyOn(component.removerArquivo, 'emit');
        const arquivo1 = { name: 'file1.pdf' };
        const arquivo2 = { name: 'file2.pdf' };

        component.removerDocumento(arquivo1);
        component.removerDocumento(arquivo2);

        expect(emitSpy).toHaveBeenCalledTimes(2);
    });

    it('deve aceitar documento como null', () => {
        component.documento = null;

        expect(component.documento).toBeNull();
    });

    it('deve aceitar index como 0', () => {
        component.index = 0;

        expect(component.index).toBe(0);
    });

    it('deve aceitar index como número negativo', () => {
        component.index = -1;

        expect(component.index).toBe(-1);
    });
});
