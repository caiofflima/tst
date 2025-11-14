import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComboService } from './combo.service';
import { MessageService } from '../../components/messages/message.service';
import { DadoComboDTO } from '../../models/dto/dado-combo';

describe('ComboService', () => {
  let service: ComboService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/combos';
  const messageServiceSpy = { getDescription: jest.fn() };
  const mockData: DadoComboDTO[] = [{} as DadoComboDTO, {} as DadoComboDTO];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComboService, 
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });
    service = TestBed.inject(ComboService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch combo UF', () => {
    service.consultarComboUF().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/uf`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Filial', () => {
    service.consultarComboFilial().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/filial`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Tipo Processo', () => {
    service.consultarComboTipoProcesso().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipos-processo`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Tipo Processo Credenciado', () => {
    service.consultarComboTipoProcessoCredenciado().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipos-processo/credenciado`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Tipo Processo Autorizacao Previa', () => {
    service.consultarComboTipoProcessoAutorizacaoPrevia().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipos-processo/autorizacao-previa`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Situacao Processo', () => {
    service.consultarComboSituacaoProcesso().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/situacao-processo`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Condicao Processo', () => {
    service.consultarComboCondicaoProcesso().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/condicao-processo`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Tipo Beneficiario', () => {
    service.consultarComboTipoBeneficiario().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipo-beneficiario`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Carater Solicitacao', () => {
    service.consultarComboCaraterSolicitacao().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/carater-solicitacao`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Tipo Destinatario', () => {
    service.consultarTipoDestinatario().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipo-destinatario`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Tipo Beneficiario Por Tipo Processo', () => {
    const tiposProcesso = [1, 2];

    service.consultarComboTipoBeneficiarioPorTipoProcesso(tiposProcesso).subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipo-beneficiario-por-tipo-processo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(tiposProcesso);
    req.flush(mockData);
  });

  it('should fetch combo Municipio Por UF', () => {
    const idEstado = 1;

    service.consultarDadosComboMunicipioPorUF(idEstado).subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/municipio-uf/${idEstado}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Conselhos Profissionais', () => {
    service.consultarComboConselhosProfissionais().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/conselhos-profissionais`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Tipos Auditor', () => {
    service.consultarComboTiposAuditor().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipos-auditor`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Perfis Prestadores Externos', () => {
    service.consultarComboPerfisPrestadoresExternos().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/perfis-prestadores-externos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Finalidade', () => {
    service.consultarComboFinalidade().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/motivos-solicitacao`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Procedimento', () => {
    service.consultarComboProcedimento().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/procedimentos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Documento', () => {
    service.consultarComboDocumento().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/documentos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Estado Civil', () => {
    service.consultarComboEstadoCivil().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/estado-civil`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combo Perfil', () => {
    service.consultarComboPerfil().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/perfis`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
