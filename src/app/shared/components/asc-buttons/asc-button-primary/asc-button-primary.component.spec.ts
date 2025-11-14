import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AscButtonPrimaryComponent } from './asc-button-primary.component';

describe('AscButtonPrimaryComponent', () => {
    let component: AscButtonPrimaryComponent;
    let fixture: ComponentFixture<AscButtonPrimaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AscButtonPrimaryComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AscButtonPrimaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar showProgress como false', () => {
        expect(component.showProgress).toBe(false);
    });

    it('deve inicializar disabled como false', () => {
        expect(component.disabled).toBe(false);
    });

    it('deve aceitar buttonId como Input', () => {
        component.buttonId = 'btn-primary-123';

        expect(component.buttonId).toBe('btn-primary-123');
    });

    it('deve aceitar title como Input', () => {
        component.title = 'Salvar';

        expect(component.title).toBe('Salvar');
    });

    it('deve aceitar showProgress como Input', () => {
        component.showProgress = true;

        expect(component.showProgress).toBe(true);
    });

    it('deve aceitar disabled como Input', () => {
        component.disabled = true;

        expect(component.disabled).toBe(true);
    });

    it('deve aceitar faIcon como Input', () => {
        component.faIcon = 'fa-save';

        expect(component.faIcon).toBe('fa-save');
    });

    it('deve aceitar styleButton como Input', () => {
        const style = { color: 'red', 'font-size': '16px' };
        component.styleButton = style;

        expect(component.styleButton).toEqual(style);
    });

    it('deve ter onClick como EventEmitter', () => {
        expect(component.onClick).toBeDefined();
        expect(typeof component.onClick.emit).toBe('function');
    });

    it('clickButton deve emitir evento onClick', () => {
        const mockEvent = new MouseEvent('click');
        const emitSpy = jest.jest.jest.jest.jest.spyOn(component.onClick, 'emit');

        component.clickButton(mockEvent);

        expect(emitSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('clickButton deve emitir evento com as propriedades corretas do MouseEvent', () => {
        let emittedEvent: MouseEvent | undefined;
        component.onClick.subscribe((event: MouseEvent) => {
            emittedEvent = event;
        });

        const mockEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        });

        component.clickButton(mockEvent);

        expect(emittedEvent).toBe(mockEvent);
        expect(emittedEvent?.bubbles).toBe(true);
        expect(emittedEvent?.cancelable).toBe(true);
    });

    it('deve permitir múltiplas chamadas de clickButton', () => {
        const emitSpy = jest.jest.jest.jest.jest.spyOn(component.onClick, 'emit');
        const mockEvent1 = new MouseEvent('click');
        const mockEvent2 = new MouseEvent('click');

        component.clickButton(mockEvent1);
        component.clickButton(mockEvent2);

        expect(emitSpy).toHaveBeenCalledTimes(2);
    });
});
