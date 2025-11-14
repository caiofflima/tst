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
        } as unknown as jest.Mocked<Router>;

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
        jest.spyOn(router, 'url', 'get').mockReturnValue('/home');

        const resultado = component.isHome;

        expect(resultado).toBe(true);
    });

    it('isHome deve retornar false quando a URL não é /home', () => {
        jest.spyOn(router, 'url', 'get').mockReturnValue('/perfil');

        const resultado = component.isHome;

        expect(resultado).toBe(false);
    });

    it('isHome deve retornar false para URL vazia', () => {
        jest.spyOn(router, 'url', 'get').mockReturnValue('');

        const resultado = component.isHome;

        expect(resultado).toBe(false);
    });

    it('isHome deve retornar false para URL com /home como parte de outro caminho', () => {
        jest.spyOn(router, 'url', 'get').mockReturnValue('/home/perfil');

        const resultado = component.isHome;

        expect(resultado).toBe(false);
    });

    it('isHome deve ser sensível a maiúsculas e minúsculas', () => {
        jest.spyOn(router, 'url', 'get').mockReturnValue('/Home');

        const resultado = component.isHome;

        expect(resultado).toBe(false);
    });
});
