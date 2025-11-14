import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacoesPedidoDetailComponent } from './informacoes-pedido-detail.component';

describe('InformacoesPedidoDetailComponent', () => {
  let component: InformacoesPedidoDetailComponent;
  let fixture: ComponentFixture<InformacoesPedidoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformacoesPedidoDetailComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacoesPedidoDetailComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
