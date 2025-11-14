import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizacaoPreviaService, ConselhoProfissionalService, LocalidadeService, MessageService, ProcedimentoPedidoService, ProcessoService } from 'app/shared/services/services';
import { AscProfissionalExecutanteComponent } from './asc-profissional-executante.component';

describe('AscProfissionalExecutanteComponent', () => {
  let component: AscProfissionalExecutanteComponent;
  let fixture: ComponentFixture<AscProfissionalExecutanteComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
  const localidadeServiceSpy = { getDescription: jest.fn() };
  const procedimentoPedidoServiceSpy = { getDescription: jest.fn() };
  const processoServiceSpy = { getDescription: jest.fn() };
  const conselhoProfissionalServiceSpy = { getDescription: jest.fn() };
 
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