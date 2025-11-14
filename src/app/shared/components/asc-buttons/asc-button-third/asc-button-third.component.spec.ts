import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AscButtonThirdComponent } from './asc-button-third.component';

describe('AscButtonThirdComponent', () => {
    let component: AscButtonThirdComponent;
    let fixture: ComponentFixture<AscButtonThirdComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AscButtonThirdComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AscButtonThirdComponent);
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
        component.buttonId = 'btn-third-789';

        expect(component.buttonId).toBe('btn-third-789');
    });

    it('deve aceitar title como Input', () => {
        component.title = 'Excluir';

        expect(component.title).toBe('Excluir');
    });

    it('deve aceitar showProgress como Input', () => {
        component.showProgress = true;

        expect(component.showProgress).toBe(true);
    });

    it('deve aceitar disabled como Input', () => {
        component.disabled = true;

        expect(component.disabled).toBe(true);
    });

    it('deve ter onClick como EventEmitter', () => {
        expect(component.onClick).toBeDefined();
        expect(typeof component.onClick.emit).toBe('function');
    });

    it('clickButton deve emitir evento onClick', () => {
        const mockEvent = new MouseEvent('click');
        const emitSpy = jest.spyOn(component.onClick, 'emit');

        component.clickButton(mockEvent);

        expect(emitSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('clickButton deve emitir evento com MouseEvent correto', () => {
        let emittedEvent: MouseEvent | undefined;
        component.onClick.subscribe((event: MouseEvent) => {
            emittedEvent = event;
        });

        const mockEvent = new MouseEvent('click', {
            bubbles: false,
            cancelable: true,
            clientX: 100,
            clientY: 200
        });

        component.clickButton(mockEvent);

        expect(emittedEvent).toBe(mockEvent);
        expect(emittedEvent?.bubbles).toBe(false);
        expect(emittedEvent?.cancelable).toBe(true);
    });

    it('deve permitir múltiplas chamadas de clickButton', () => {
        const emitSpy = jest.spyOn(component.onClick, 'emit');

        for (let i = 0; i < 5; i++) {
            component.clickButton(new MouseEvent('click'));
        } as any

        expect(emitSpy).toHaveBeenCalledTimes(5);
    });

    it('showProgress e disabled podem ser alterados independentemente', () => {
        component.showProgress = true;
        component.disabled = false;

        expect(component.showProgress).toBe(true);
        expect(component.disabled).toBe(false);

        component.showProgress = false;
        component.disabled = true;

        expect(component.showProgress).toBe(false);
        expect(component.disabled).toBe(true);
    });

    it('deve permitir title vazio', () => {
        component.title = '';

        expect(component.title).toBe('');
    });

    it('deve emitir eventos mesmo quando disabled é true', () => {
        const emitSpy = jest.spyOn(component.onClick, 'emit');
        component.disabled = true;

        const mockEvent = new MouseEvent('click');
        component.clickButton(mockEvent);

        expect(emitSpy).toHaveBeenCalledWith(mockEvent);
    });
});
