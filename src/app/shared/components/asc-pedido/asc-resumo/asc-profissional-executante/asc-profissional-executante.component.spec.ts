import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizacaoPreviaService, ConselhoProfissionalService, LocalidadeService, MessageService, ProcedimentoPedidoService, ProcessoService } from 'app/shared/services/services';
import { AscProfissionalExecutanteComponent } from './asc-profissional-executante.component';

describe('AscProfissionalExecutanteComponent', () => {
  let component: AscProfissionalExecutanteComponent;
  let fixture: ComponentFixture<AscProfissionalExecutanteComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const localidadeServiceSpy = jasmine.createSpyObj('LocalidadeService',['getDescription']);
  const procedimentoPedidoServiceSpy = jasmine.createSpyObj('ProcedimentoPedidoService',['getDescription']);
  const processoServiceSpy = jasmine.createSpyObj('ProcessoService',['getDescription']);
  const conselhoProfissionalServiceSpy = jasmine.createSpyObj('ConselhoProfissionalService',['getDescription']);
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [AscProfissionalExecutanteComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LocalidadeService, useValue: localidadeServiceSpy },
        { provide: ProcedimentoPedidoService, useValue: procedimentoPedidoServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: ConselhoProfissionalService, useValue: conselhoProfissionalServiceSpy },
        { provide: AutorizacaoPreviaService, useValue: conselhoProfissionalServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscProfissionalExecutanteComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});