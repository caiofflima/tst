import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicamentoPatologiaPedidoService } from 'app/shared/services/comum/medicamento-patologia-pedido.service';
import { AutorizacaoPreviaService, LocalidadeService, MessageService, ProcedimentoPedidoService, ProcessoService } from 'app/shared/services/services';
import { AscCardProcedimentoComponent } from './asc-card-procedimento.component';

describe('AscCardProcedimentoComponent', () => {
  let component: AscCardProcedimentoComponent;
  let fixture: ComponentFixture<AscCardProcedimentoComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const localidadeServiceSpy = jasmine.createSpyObj('LocalidadeService',['getDescription']);
  const procedimentoPedidoServiceSpy = jasmine.createSpyObj('ProcedimentoPedidoService',['getDescription']);
  const processoServiceSpy = jasmine.createSpyObj('ProcessoService',['getDescription']);
  const autorizacaoPreviaServiceSpy = jasmine.createSpyObj('AutorizacaoPreviaService',['getDescription']);
  const medicamentoPatologiaPedidoServiceSpy = jasmine.createSpyObj('MedicamentoPatologiaPedidoService',['getDescription']);
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [AscCardProcedimentoComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LocalidadeService, useValue: localidadeServiceSpy },
        { provide: ProcedimentoPedidoService, useValue: procedimentoPedidoServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: AutorizacaoPreviaService, useValue: autorizacaoPreviaServiceSpy },
        { provide: MedicamentoPatologiaPedidoService, useValue: MedicamentoPatologiaPedidoService },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscCardProcedimentoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});