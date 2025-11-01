import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AtendimentoService} from "./comum/atendimento.service";
import { ProcessoService } from './comum/processo.service';
import { ExportacaoService } from './comum/exportacao.service';
import { ExportacaoPDFService } from './comum/exportacao/pdf/exportacao-pdf.service';
import { ExportacaoCSVService } from './comum/exportacao/csv/exportacao-csv.service';
import { ExportacaoXLSService } from './comum/exportacao/xls/exportacao-xls.service';
import { BeneficiarioService } from './comum/beneficiario.service';
import { SituacaoPedidoService } from './comum/situacao-pedido.service';
import { SituacaoProcessoService } from './comum/situacao-processo.service';
import { ComposicaoPedidoService } from './components/composicao-pedido.service';
import { AnexoService } from './comum/anexo.service';
import { CaraterSolicitacaoService } from './comum/carater-solicitacao.service';
import { CategoriaBeneficiarioService } from './comum/categoria-beneficiario.service';
import { DocumentoPedidoService } from './comum/documento-pedido.service';
import { DocumentoTipoProcessoService } from './comum/documento-tipo-processo.service';
import { DocumentoService } from './comum/documento.service';
import { EmailService } from './comum/email.service';
import { EmpresaPrestadorExternoService } from './comum/empresa-prestador-externo.service';
import { EstadoCivilService } from './comum/estado-civil.service';
import { FileUploadService } from './comum/file-upload.service';
import { GrauProcedimentoService } from './comum/grau-procedimento.service';
import { GrupoDocumentoService } from './comum/grupo-documento.service';
import { HistoricoProcessoService } from './comum/historico-processo.service';
import { InscricaoDependenteService } from './comum/inscricao-dependente.service';
import { InscricaoProgramasMedicamentosService } from './comum/inscricao-programas-medicamento.service';
import { IntegracaoCorreiosService } from './comum/integracao-correios.service';
import { LaboratorioService } from './comum/laboratorio.service';
import { MedicamentoPatologiaPedidoService } from './comum/medicamento-patologia-pedido.service';
import { MedicamentoPatologiaService } from './comum/medicamento-patologia.service';
import { MensagemPedidoService } from './comum/mensagem-enviada.service';
import { MotivoCancelamentoService } from './comum/motivo-cancelamento.service';
import { MotivoNegacaoService } from './comum/motivo-negacao.service';
import { MotivoSolicitacaoService } from './comum/motivo-solicitacao.service';
import { PatologiaService } from './comum/patologia.service';
import { EspecialidadeService } from './comum/pedido/especialidade.service';
import { MedicamentoService } from './comum/pedido/medicamento.service';
import { PerfilUsuarioExternoService } from './comum/perfil-usuario-externo.service';
import { PrazoTratamentoService } from './comum/prazo-tratamento.service';
import { PrestadorExternoService } from './comum/prestador-externo.service';
import { ProcedimentoPedidoService } from './comum/procedimento-pedido.service';
import { ProcedimentoService } from './comum/procedimento.service';
import { ProfissionalExecutanteService } from './comum/profissional-executante.service';
import { ReembolsoAGSService } from './comum/reembolso-ags.service';
import { ReembolsoSaudeCaixaService } from './comum/reembolso-saude-caixa.service';
import { ReembolsoService } from './comum/reembolso.service';
import { SituacaoPedidoProcedimentoService } from './comum/situacao-pedido-procedimento.service';
import { TipoBeneficiarioService } from './comum/tipo-beneficiario.service';
import { TipoDeficienciaService } from './comum/tipo-deficiencia.service';
import { TipoDependenteService } from './comum/tipo-dependente.service';
import { TipoDestinatarioService } from './comum/tipo-destinatario.service';
import { TipoDocumentoService } from './comum/tipo-documento.service';
import { TipoOcorrenciaService } from './comum/tipo-ocorrencia.service';
import { TipoProcessoService } from './comum/tipo-processo.service';
import { TipoValidacaoService } from './comum/tipo-validacao.service';
import { TrilhaAuditoriaService } from './comum/trilha-auditoria.service';
import { ValidacaoDocumentoPedidoService } from './comum/validacao-documento-pedido.service';
import { AutorizacaoPreviaService, ConselhoProfissionalService, LocalidadeService, SIASCFluxoService, ComboService } from './services';
import { CartaoIdentificacaoService } from './cartao-identificacao/cartao-identificacao.service';
import { MeusDadosService } from './meus-dados/meus-dados.service';
import { FundoInvestimentoService } from './cadastrobasico/fundoinvestimento.service';
import { ItemService } from './cadastrobasico/item.service';
import { ListaRestritivaService } from './cadastrobasico/lista.restritiva.service';

/**
 * Modulo responsável por prover os serviços de integração da aplicação.
*/
@NgModule({
    imports: [
        CommonModule
    ],
    declarations: []
})
export class AppServiceModule {
    
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: AppServiceModule,
            providers: [
                AtendimentoService,
                ProcessoService,
                ExportacaoService,
                ExportacaoPDFService,
                ExportacaoCSVService,
                ExportacaoXLSService,
                BeneficiarioService,
                SituacaoProcessoService,
                SituacaoPedidoService,
                FundoInvestimentoService,
                MedicamentoPatologiaPedidoService,
                ItemService,
                ListaRestritivaService,
                CartaoIdentificacaoService,
                MeusDadosService,
                AutorizacaoPreviaService,
                EspecialidadeService,
                CaraterSolicitacaoService,
                CategoriaBeneficiarioService,
                EmailService,
                GrauProcedimentoService,
                HistoricoProcessoService,
                MotivoNegacaoService,
                MotivoSolicitacaoService,
                ProcedimentoService,
                TipoBeneficiarioService,
                TipoProcessoService,
                ProfissionalExecutanteService,
                TipoDestinatarioService,
                TipoDependenteService,
                MensagemPedidoService,
                ProcedimentoPedidoService,
                DocumentoTipoProcessoService,
                AnexoService,
                FileUploadService,
                PrazoTratamentoService,
                ConselhoProfissionalService,
                LocalidadeService,
                DocumentoService,
                SIASCFluxoService,
                TipoOcorrenciaService,
                TipoValidacaoService,
                ValidacaoDocumentoPedidoService,
                DocumentoPedidoService,
                SituacaoPedidoProcedimentoService,
                ComposicaoPedidoService,
                EmpresaPrestadorExternoService,
                PrestadorExternoService,
                ComboService,
                PerfilUsuarioExternoService,
                TrilhaAuditoriaService,
                PatologiaService,
                MedicamentoService,
                LaboratorioService,
                ReembolsoService,
                MedicamentoPatologiaService,
                InscricaoProgramasMedicamentosService,
                TipoDeficienciaService,
                EstadoCivilService,
                InscricaoDependenteService,
                MotivoCancelamentoService,
                TipoDocumentoService,
                GrupoDocumentoService,
                ReembolsoSaudeCaixaService,
                ReembolsoAGSService, 
                IntegracaoCorreiosService
            ]
        };
    }
}
