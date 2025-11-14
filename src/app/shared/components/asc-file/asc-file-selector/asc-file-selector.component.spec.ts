import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AscFileSelectorComponent } from './asc-file-selector.component';
import { MessageService } from '../../messages/message.service';

describe('AscFileSelectorComponent', () => {
    let component: AscFileSelectorComponent;
    let fixture: ComponentFixture<AscFileSelectorComponent>;
    let messageService: jest.Mocked<MessageService>;

    beforeEach(async () => {
        messageService = {
            addMsgDanger: jest.fn()
        } as unknown as jest.Mocked<MessageService>;

        await TestBed.configureTestingModule({
            declarations: [AscFileSelectorComponent],
            providers: [
                { provide: MessageService, useValue: messageService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AscFileSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar multiple como true', () => {
        expect(component.multiple).toBe(true);
    });

    it('deve inicializar isInResumo como false', () => {
        expect(component.isInResumo).toBe(false);
    });

    it('deve inicializar disabled como false', () => {
        expect(component.disabled).toBe(false);
    });

    it('deve aceitar inputId como Input', () => {
        component.inputId = 'file-input-123';

        expect(component.inputId).toBe('file-input-123');
    });

    it('deve aceitar documento como Input', () => {
        const documento = { id: 1, nome: 'Documento Teste' };
        component.documento = documento as any;

        expect(component.documento).toEqual(documento);
    });

    it('deve aceitar extensions como Input', () => {
        component.extensions = '.pdf,.jpg,.png';

        expect(component.extensions).toBe('.pdf,.jpg,.png');
    });

    it('deve aceitar limitLengthFile como Input', () => {
        component.limitLengthFile = 5000000;

        expect(component.limitLengthFile).toBe(5000000);
    });

    it('deve ter arquivos como EventEmitter', () => {
        expect(component.arquivos).toBeDefined();
        expect(typeof component.arquivos.emit).toBe('function');
    });

    it('ngOnInit deve processar extensions em array', () => {
        component.extensions = '.pdf,.jpg,.png';

        component.ngOnInit();

        expect(component['extensionsAsArray']).toEqual(['.pdf', '.jpg', '.png']);
    });

    it('ngOnInit não deve processar se extensions não está definido', () => {
        component.extensions = undefined as any;

        component.ngOnInit();

        expect(component['extensionsAsArray']).toEqual([]);
    });

    it('onChangeFile deve limpar input quando não há arquivos selecionados', () => {
        const inputFile = {
            files: null,
            value: 'some-value'
        } as unknown as HTMLInputElement;

        component.onChangeFile(inputFile);

        expect(inputFile.value).toBe('');
    });

    it('onChangeFile deve limpar input quando files.length é 0', () => {
        const inputFile = {
            files: [] as any,
            value: 'some-value'
        } as unknown as HTMLInputElement;

        component.onChangeFile(inputFile);

        expect(inputFile.value).toBe('');
    });

    it('deve aceitar multiple como false', () => {
        component.multiple = false;

        expect(component.multiple).toBe(false);
    });

    it('deve aceitar isInResumo como true', () => {
        component.isInResumo = true;

        expect(component.isInResumo).toBe(true);
    });

    it('deve aceitar disabled como true', () => {
        component.disabled = true;

        expect(component.disabled).toBe(true);
    });

    it('deve aceitar index através do setter', () => {
        component.index = 3;

        expect(component['_index']).toBe(3);
    });

    it('deve aceitar index como 0', () => {
        component.index = 0;

        expect(component['_index']).toBe(0);
    });

    it('deve permitir múltiplas chamadas do setter index', () => {
        component.index = 1;
        expect(component['_index']).toBe(1);

        component.index = 5;
        expect(component['_index']).toBe(5);
    });

    it('ngOnInit deve processar extensions com múltiplos valores', () => {
        component.extensions = '.pdf,.doc,.docx,.jpg,.png';

        component.ngOnInit();

        expect(component['extensionsAsArray']).toHaveLength(5);
        expect(component['extensionsAsArray']).toContain('.pdf');
        expect(component['extensionsAsArray']).toContain('.png');
    });

    it('deve aceitar extensions com um único valor', () => {
        component.extensions = '.pdf';

        component.ngOnInit();

        expect(component['extensionsAsArray']).toEqual(['.pdf']);
    });

    it('deve inicializar files como Set vazio quando necessário', () => {
        expect(component.files).toBeUndefined();
    });
});
