import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentosTipoProcessoParamComponent } from './documentos-tipo-processo-param.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from '../../../shared/components/messages/message.service';
import { TipoDeficienciaService, ComboService, DocumentoTipoProcessoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { DadoComboDTO } from 'app/shared/models/dtos';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DuvidasService } from 'app/shared/services/comum/duvidas.service';

describe('DocumentosTipoProcessoParamComponent', () => {
  let component: DocumentosTipoProcessoParamComponent;
  let fixture: ComponentFixture<DocumentosTipoProcessoParamComponent>;
  let mockRouter: any;
  let mockLocation: any;
  let mockMessageService: any;
  let mockComboService: any;
  let mockTipoDeficienciaService: any;
  let mockDocumentoTipoProcessoService = jasmine.createSpyObj('DocumentoTipoProcessoService',['getTitle'])
  let mockDuvidasService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate').mockReturnValue(new Promise<any>(null)),
    };

    mockLocation = {
      back: jasmine.createSpy('back')
    };

    mockMessageService = {
      addMsgDanger: jasmine.createSpy('addMsgDanger')
    };

    mockComboService = {
      consultarComboTipoBeneficiario: jasmine.createSpy('consultarComboTipoBeneficiario').mockReturnValue(of([])),
      consultarComboTipoProcesso: jasmine.createSpy('consultarComboTipoProcesso').mockReturnValue(of([]))
    };

    mockTipoDeficienciaService = {
      consultarTodos: jasmine.createSpy('consultarTodos').mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [DocumentosTipoProcessoParamComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ComboService, useValue: mockComboService },
        { provide: TipoDeficienciaService, useValue: mockTipoDeficienciaService },
        { provide: DocumentoTipoProcessoService, useValue: mockDocumentoTipoProcessoService },
        { provide: DuvidasService, useValue: mockDuvidasService }
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosTipoProcessoParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('deve inicializar os combos ao ngOnInit', () => {
    jest.spyOn(component, 'inicializarCombos').and.callThrough(); // Espiona o método
    component.ngOnInit(); // Chama ngOnInit
    expect(component.inicializarCombos).toHaveBeenCalled(); // Verifica se inicializarCombos foi chamado
  });

  it('deve carregar os combos corretamente', () => {
    component.inicializarCombos(); // Chama o método para inicializar os combos
    expect(mockComboService.consultarComboTipoBeneficiario).toHaveBeenCalled(); // Verifica se o serviço de tipo beneficiário foi chamado
    expect(mockComboService.consultarComboTipoProcesso).toHaveBeenCalled(); // Verifica se o serviço de tipo processo foi chamado
  });

  it('deve navegar para a página de busca ao chamar pesquisar', () => {
    component.formulario.controls['tiposProcesso'].setValue([{ value: 1 }]);
    component.formulario.controls['tiposBeneficiario'].setValue([{ value: 2 }]);
    
    component.pesquisar(); // Chama o método pesquisar

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/duvidas/documentos-tipo-pedido/buscar'], {
      queryParams: {
        tiposProcesso: [1],
        tiposBeneficiario: [2],
        descricaoTiposProcesso: '',
        descricaoTiposBeneficiario: ''
      }
    }); // Verifica a navegação com parâmetros corretos
  });

  it('deve limpar os campos corretamente', () => {
    component.formulario.controls['tiposProcesso'].setValue([{ value: 1 }]);
    component.formulario.controls['tiposBeneficiario'].setValue([{ value: 2 }]);
    
    component.limparCampos(); // Chama o método limparCampos
    expect(component.formulario.get('tiposProcesso').value).toBeNull(); // Verifica se o campo foi limpo
    expect(component.formulario.get('tiposBeneficiario').value).toBeNull(); // Verifica se o campo foi limpo
  });

  it('deve retornar a lista de tipo de deficiência', () => {
    component.retornaListaTipoDeficiencia(); // Chama o método retornaListaTipoDeficiencia
    expect(mockTipoDeficienciaService.consultarTodos).toHaveBeenCalled(); // Verifica se o serviço foi chamado
  });
});