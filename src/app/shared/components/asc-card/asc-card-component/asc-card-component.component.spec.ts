import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AscCardComponentComponent } from './asc-card-component.component';

describe('AscCardComponentComponent', () => {
    let component: AscCardComponentComponent;
    let fixture: ComponentFixture<AscCardComponentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AscCardComponentComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AscCardComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve aceitar hasAfterContent como Input', () => {
        component.hasAfterContent = true;

        expect(component.hasAfterContent).toBe(true);
    });

    it('deve aceitar hasAfterContent como false', () => {
        component.hasAfterContent = false;

        expect(component.hasAfterContent).toBe(false);
    });

    it('deve aceitar noSpacing como Input', () => {
        component.noSpacing = true;

        expect(component.noSpacing).toBe(true);
    });

    it('deve aceitar noSpacing como false', () => {
        component.noSpacing = false;

        expect(component.noSpacing).toBe(false);
    });

    it('deve permitir ambas propriedades como true', () => {
        component.hasAfterContent = true;
        component.noSpacing = true;

        expect(component.hasAfterContent).toBe(true);
        expect(component.noSpacing).toBe(true);
    });

    it('deve permitir ambas propriedades como false', () => {
        component.hasAfterContent = false;
        component.noSpacing = false;

        expect(component.hasAfterContent).toBe(false);
        expect(component.noSpacing).toBe(false);
    });

    it('deve permitir hasAfterContent undefined', () => {
        component.hasAfterContent = undefined as any;

        expect(component.hasAfterContent).toBeUndefined();
    });

    it('deve permitir noSpacing undefined', () => {
        component.noSpacing = undefined as any;

        expect(component.noSpacing).toBeUndefined();
    });

    it('deve permitir alteração dinâmica de hasAfterContent', () => {
        component.hasAfterContent = true;
        expect(component.hasAfterContent).toBe(true);

        component.hasAfterContent = false;
        expect(component.hasAfterContent).toBe(false);
    });

    it('deve permitir alteração dinâmica de noSpacing', () => {
        component.noSpacing = false;
        expect(component.noSpacing).toBe(false);

        component.noSpacing = true;
        expect(component.noSpacing).toBe(true);
    });
});
