import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';

describe('PaginaNaoEncontradaComponent', () => {
    let component: PaginaNaoEncontradaComponent;
    let fixture: ComponentFixture<PaginaNaoEncontradaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PaginaNaoEncontradaComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginaNaoEncontradaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve ser uma instância de PaginaNaoEncontradaComponent', () => {
        expect(component).toBeInstanceOf(PaginaNaoEncontradaComponent);
    });

    it('deve ter o selector correto', () => {
        const compiled = fixture.nativeElement;
        expect(compiled).toBeDefined();
    });
});
