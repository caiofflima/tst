import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RodapePadraoComponent } from './rodape-padrao.component';

describe('RodapePadraoComponent', () => {
    let component: RodapePadraoComponent;
    let fixture: ComponentFixture<RodapePadraoComponent>;
    let router: jest.Mocked<Router>;

    beforeEach(async () => {
        router = {
            url: '/home'
        } as jest.Mocked<Router>;

        await TestBed.configureTestingModule({
            declarations: [RodapePadraoComponent],
            providers: [
                { provide: Router, useValue: router }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RodapePadraoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('isHome deve retornar true quando a URL é /home', () => {
        Object.defineProperty(router, 'url', { value: '/home', writable: true });

        const resultado = component.isHome;

        expect(resultado).toBe(true);
    });

    it('isHome deve retornar false quando a URL não é /home', () => {
        Object.defineProperty(router, 'url', { value: '/perfil', writable: true });

        const resultado = component.isHome;

        expect(resultado).toBe(false);
    });

    it('isHome deve retornar false para URL vazia', () => {
        Object.defineProperty(router, 'url', { value: '', writable: true });

        const resultado = component.isHome;

        expect(resultado).toBe(false);
    });

    it('isHome deve retornar false para URL com /home como parte de outro caminho', () => {
        Object.defineProperty(router, 'url', { value: '/home/perfil', writable: true });

        const resultado = component.isHome;

        expect(resultado).toBe(false);
    });

    it('isHome deve ser sensível a maiúsculas e minúsculas', () => {
        Object.defineProperty(router, 'url', { value: '/Home', writable: true });

        const resultado = component.isHome;

        expect(resultado).toBe(false);
    });
});
