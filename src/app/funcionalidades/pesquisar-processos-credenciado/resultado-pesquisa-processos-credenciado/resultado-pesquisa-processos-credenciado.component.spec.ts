import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Data } from '../../../shared/providers/data';
import { MessageService, PrestadorExternoService, ProcessoService, SessaoService, SIASCFluxoService } from '../../../shared/services/services';
import { ResultadoPesquisaProcessosCredenciadoComponent } from './resultado-pesquisa-processos-credenciado.component';

describe('ResultadoPesquisaProcessosCredenciadoComponent', () => {
  let component: ResultadoPesquisaProcessosCredenciadoComponent;
  let fixture: ComponentFixture<ResultadoPesquisaProcessosCredenciadoComponent>;

  beforeEach(async () => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showDangerMsg']);
    const siascFluxoServiceSpy = jasmine.createSpyObj('SIASCFluxoService', ['consultarPermissoesFluxoPorPedido']);
    const dataSpy = jasmine.createSpyObj('Data', ['storage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const sessaoServiceSpy = jasmine.createSpyObj('SessaoService', ['getUsuario']);
    const processoServiceSpy = jasmine.createSpyObj('ProcessoService', ['consultarProcessosNaoConclusivosPorOperadorCredenciado', 'consultarRecentesPorOperadorCredenciado']);
    const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
    await TestBed.configureTestingModule({
      declarations: [ResultadoPesquisaProcessosCredenciadoComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SIASCFluxoService, useValue: siascFluxoServiceSpy },
        { provide: Data, useValue: dataSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoPesquisaProcessosCredenciadoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
