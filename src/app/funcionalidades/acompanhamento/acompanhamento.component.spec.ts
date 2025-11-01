import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Pedido } from '../../shared/models/comum/pedido';
import { ProcessoService } from '../../shared/services/comum/processo.service';
import { AcompanhamentoComponent } from './acompanhamento.component';

describe('AcompanhamentoComponent', () => {
  let component: AcompanhamentoComponent;
  let fixture: ComponentFixture<AcompanhamentoComponent>;
  let mockActivatedRoute: any;
  let mockProcessoService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => {
          if (key === 'idPedido') return '123'; // Mockando o ID do pedido
          return null; // Retorna null para chaves não reconhecidas
        }
      })
    };
  
    mockProcessoService = {
      consultarPorId: (id: number) => {
        return of(new Pedido()); // Retorna um Pedido mockado
      }
    };
  
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [AcompanhamentoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProcessoService, useValue: mockProcessoService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Para ignorar erros de template
    }).compileComponents();
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(AcompanhamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('deve inicializar o processo no ngOnInit', () => {
    component.ngOnInit(); // Chama o método ngOnInit
    expect(component.processo).toBeDefined(); // Verifica se a propriedade processo está definida
  });

  it('deve aumentar a porcentagem corretamente', () => {
    component.increase(); // Chama o método increase
    expect(component.porcentagem).toBe(10); // Verifica se a porcentagem aumentou para 10
    component.increase(); // Chama o método novamente
    expect(component.porcentagem).toBe(20); // Verifica se a porcentagem aumentou para 20
  });

  it('deve definir a cor corretamente com base na porcentagem', () => {
    component.porcentagem = 30;
    expect(component.setColor()).toBe("#17A2B8"); // Verifica a cor para porcentagem <= 50

    component.porcentagem = 70;
    expect(component.setColor()).toBe("orange"); // Verifica a cor para porcentagem > 50 e <= 80

    component.porcentagem = 90;
    expect(component.setColor()).toBe("red"); // Verifica a cor para porcentagem > 80
  });

  it('deve rolar para o topo', () => {
    spyOn(window, 'scrollTo'); // Espiona a função scrollTo
    component.goToTop(); // Chama o método goToTop
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0); // Verifica se scrollTo foi chamado com os argumentos corretos
  });

  it('deve chamar pedidoProcedimentosAtualizados', () => {
    spyOn(console, 'log'); // Espiona a função console.log
    component.pedidoProcedimentosAtualizados([]); // Chama o método
    expect(console.log).toHaveBeenCalledWith('pedidoProcedimentosAtualizados'); // Verifica se o log foi chamado
  });
});
