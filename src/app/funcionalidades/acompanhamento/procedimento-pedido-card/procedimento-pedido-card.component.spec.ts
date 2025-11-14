import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrestadorExternoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { ProcedimentoPedidoCardComponent } from './procedimento-pedido-card.component';

describe('ProcedimentoPedidoCardComponent', () => {
  let component: ProcedimentoPedidoCardComponent;
  let fixture: ComponentFixture<ProcedimentoPedidoCardComponent>;
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({}));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedimentoPedidoCardComponent],
      providers:[        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimentoPedidoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('deve ter procedimentos inicializados corretamente', () => {
    expect(component.procedimentos).toBeDefined(); // Verifica se a propriedade procedimentos está definida
    expect(component.procedimentos.length).toBe(2); // Verifica se existem 2 procedimentos
    expect(component.procedimentos[0]).toEqual({
      procedimento: '30307147 - tratamento ocular',
      grau: 'Despesas hospitalares',
      quantidade: 5
    }); // Verifica se o primeiro procedimento está correto
  });
});