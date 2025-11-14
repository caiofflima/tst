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
    const messageServiceSpy = { showDangerMsg: jest.fn() };
    const siascFluxoServiceSpy = { consultarPermissoesFluxoPorPedido: jest.fn() };
    const dataSpy = { storage: jest.fn() };
    const routerSpy = { navigateByUrl: jest.fn() };
    const sessaoServiceSpy = { getUsuario: jest.fn() };
    const processoServiceSpy = { consultarProcessosNaoConclusivosPorOperadorCredenciado: jest.fn(), consultarRecentesPorOperadorCredenciado: jest.fn() };
    const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})
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
