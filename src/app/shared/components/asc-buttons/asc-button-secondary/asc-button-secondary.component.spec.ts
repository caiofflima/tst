import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AscButtonSecondaryComponent } from './asc-button-secondary.component';

describe('AscButtonSecondaryComponent', () => {
    let component: AscButtonSecondaryComponent;
    let fixture: ComponentFixture<AscButtonSecondaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AscButtonSecondaryComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AscButtonSecondaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar disabled como false', () => {
        expect(component.disabled).toBe(false);
    });

    it('deve aceitar buttonId como Input', () => {
        component.buttonId = 'btn-secondary-456';

        expect(component.buttonId).toBe('btn-secondary-456');
    });

    it('deve aceitar routerLink como Input', () => {
        component.routerLink = '/home';

        expect(component.routerLink).toBe('/home');
    });

    it('deve aceitar title como Input', () => {
        component.title = 'Cancelar';

        expect(component.title).toBe('Cancelar');
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
        const emitSpy = jest.jest.spyOn(component.onClick, 'emit');

        component.clickButton(mockEvent);

        expect(emitSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('clickButton deve emitir evento com MouseEvent correto', () => {
        let emittedEvent: MouseEvent | undefined;
        component.onClick.subscribe((event: MouseEvent) => {
            emittedEvent = event;
        });

        const mockEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: false
        });

        component.clickButton(mockEvent);

        expect(emittedEvent).toBe(mockEvent);
        expect(emittedEvent?.bubbles).toBe(true);
        expect(emittedEvent?.cancelable).toBe(false);
    });

    it('deve permitir múltiplas chamadas de clickButton', () => {
        const emitSpy = jest.jest.spyOn(component.onClick, 'emit');
        const mockEvent1 = new MouseEvent('click');
        const mockEvent2 = new MouseEvent('click');
        const mockEvent3 = new MouseEvent('click');

        component.clickButton(mockEvent1);
        component.clickButton(mockEvent2);
        component.clickButton(mockEvent3);

        expect(emitSpy).toHaveBeenCalledTimes(3);
    });

    it('routerLink deve aceitar caminhos diferentes', () => {
        component.routerLink = '/perfil/editar/123';

        expect(component.routerLink).toBe('/perfil/editar/123');
    });

    it('disabled deve controlar estado do botão', () => {
        component.disabled = false;
        expect(component.disabled).toBe(false);

        component.disabled = true;
        expect(component.disabled).toBe(true);
    });
});
