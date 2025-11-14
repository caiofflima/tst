import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SessaoService } from '../../../../app/arquitetura/shared/services/seguranca/sessao.service';
import { ExportacaoService } from '../comum/exportacao.service';
import { BeneficiarioService } from '../comum/beneficiario.service';
import { CartaoIdentificacaoService } from '../cartao-identificacao/cartao-identificacao.service';
import { MeusDadosService } from './meus-dados.service';
import { Beneficiario } from '../../../../app/shared/models/comum/beneficiario';
import { PrestadorExternoService } from '../services';

describe('MeusDadosService', () => {
  let service: MeusDadosService;
  let beneficiarioServiceSpy: jest.Mocked<BeneficiarioService>;
  let exportacaoServiceSpy: jest.Mocked<ExportacaoService>;
  let cartaoIdServiceSpy: jest.Mocked<CartaoIdentificacaoService>;
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})

  beforeEach(() => {
    const beneficiarioSpy = { consultarTitularPorMatricula: jest.fn() };
    const exportacaoSpy = { exportarPDF: jest.fn() };
    const cartaoSpy = { enviarCartaoEmail: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        MeusDadosService,
        { provide: SessaoService, useValue: {} },
        { provide: BeneficiarioService, useValue: beneficiarioSpy },
        { provide: ExportacaoService, useValue: exportacaoSpy },
        { provide: CartaoIdentificacaoService, useValue: cartaoSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });

    service = TestBed.inject(MeusDadosService);
    beneficiarioServiceSpy = TestBed.inject(BeneficiarioService) as jest.Mocked<BeneficiarioService>;
    exportacaoServiceSpy = TestBed.inject(ExportacaoService) as jest.Mocked<ExportacaoService>;
    cartaoIdServiceSpy = TestBed.inject(CartaoIdentificacaoService) as jest.Mocked<CartaoIdentificacaoService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarTitularPorMatricula on carregarTitular', () => {
    const matricula = '12345';
    service.carregarTitular(matricula);
    expect(beneficiarioServiceSpy.consultarTitularPorMatricula).toHaveBeenCalledWith(matricula);
  });

  it('should call exportarPDF on exportarPDF', () => {
    const beneficiario: Beneficiario = {} as Beneficiario;
    exportacaoServiceSpy.exportarPDF.mockReturnValue(of({}));
    service.exportarPDF(beneficiario).subscribe();
    expect(exportacaoServiceSpy.exportarPDF).toHaveBeenCalledWith('/beneficiario/declaracao-permanencia', beneficiario);
  });

  it('should call enviarCartaoEmail on enviarCartaoEmail', () => {
    const beneficiario: Beneficiario = {} as Beneficiario;
    cartaoIdServiceSpy.enviarCartaoEmail.mockReturnValue(of({}));
    service.enviarCartaoEmail(beneficiario).subscribe();
    expect(cartaoIdServiceSpy.enviarCartaoEmail).toHaveBeenCalledWith(beneficiario);
  });

  it('should return an empty array from getBeneficiarios', () => {
    expect(service.getBeneficiarios()).toEqual([]);
  });
});
