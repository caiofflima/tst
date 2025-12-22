import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import {PaginaNaoEncontradaComponent} from "app/arquitetura/shared/templates/pagina-nao-encontrada.component";
import { DownloadViewerComponent } from "./shared/components/asc-pedido/asc-documentos/documento-card/download-viewer.component";


const appRoutes: Routes = [

 
    {
        path: 'home',
        loadChildren: () => import('app/arquitetura/home/home.module').then(x => x.HomeModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'seguranca',
        loadChildren: () => import('app/arquitetura/seguranca/seguranca.module').then(x => x.SegurancaModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'meus-dados',
        loadChildren: () => import('app/funcionalidades/meus-dados/meus-dados.module').then(x => x.MeusDadosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'pedido/autorizacao-previa',
        loadChildren: () => import('app/funcionalidades/processos/autorizacao-previa/autorizacao-previa.module').then(x => x.AutorizacaoPreviaModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'meus-dados/pedidos',
        loadChildren: () => import('app/funcionalidades/processos/processos.module').then(x => x.ProcessosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'meus-dados/cartoes',
        loadChildren: () => import('app/funcionalidades/cartoes/cartoes.module').then(x => x.CartoesModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'meus-dados/portabilidade',
        loadChildren: () => import('app/funcionalidades/portabilidade/portabilidade.module').then(x => x.PortabilidadeModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'meus-dados/financeiro/extrato/reeembolso',
        loadChildren: () => import('app/funcionalidades/reembolso/reembolso.module').then(x => x.ReembolsoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'meus-dados/financeiro/extrato-irpf',
        loadChildren: () => import('app/funcionalidades/extrato/extrato.module').then(x => x.ExtratoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'meus-dados/dados-cadastrais',
        loadChildren: () => import('app/funcionalidades/dados-cadastrais/dados-cadastrais.module').then(x => x.DadosCadastraisModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'duvidas/procedimentos',
        loadChildren: () => import('app/funcionalidades/procedimentos/procedimentos.module').then(x => x.ProcedimentosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'duvidas/documentos-tipo-pedido',
        loadChildren: () => import('app/funcionalidades/documentos-tipo-processo/documentos-tipo-processo.module').then(x => x.DocumentosTipoProcessoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'duvidas/consultar-procedimentos-cobertos',
        loadChildren: () => import('app/funcionalidades/procedimentos-cobertos/procedimentos-cobertos.module').then(x => x.ProcedimentosCobertosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'pedidos',
        loadChildren: () => import('app/funcionalidades/processos/processos.module').then(x => x.ProcessosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'pedidos/autorizacao-previa',
        loadChildren: () => import('app/funcionalidades/processos/autorizacao-previa/autorizacao-previa.module').then(x => x.AutorizacaoPreviaModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'pedidos/liberacao-alcada',
        loadChildren: () => import('app/funcionalidades/processos/liberacao-alcada/liberacao-alcada.module').then(x => x.LiberacaoAlcadaModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'pedidos/reembolso',
        loadChildren: () => import('app/funcionalidades/processos/reembolso/reembolso.module').then(x => x.ReembolsoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'acesso-credenciados/pedidos',
        loadChildren: () => import('app/funcionalidades/processos/processos.module').then(x => x.ProcessosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'pedidos/inscricao/programas-medicamentos',
        loadChildren: () => import('app/funcionalidades/processos/inscricao-programas-medicamentos/inscricao-programas-medicamentos.module').then(x => x.InscricaoProgramasMedicamentosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/consulta/pedidos',
        loadChildren: () => import('app/funcionalidades/pesquisar-processos/pesquisar-processos.module').then(x => x.PesquisarProcessosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/parametros/email',
        loadChildren: () => import('app/funcionalidades/email-situacao/email-situacao.module').then(x => x.EmailSituacaoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'seguranca/prestador-externo',
        loadChildren: () => import('app/funcionalidades/prestador-externo/prestador-externo.module').then(x => x.PrestadorExternoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'seguranca/perfil-usuario-externo',
        loadChildren: () => import('app/funcionalidades/perfil-usuario-externo/perfil-usuario-externo.module').then(x => x.PerfilUsuarioExternoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/empresa-prestador-externo',
        loadChildren: () => import('app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo.module').then(x => x.EmpresaPrestadorExternoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'pesquisar-pedidos-credenciado',
        loadChildren: () => import('app/funcionalidades/pesquisar-processos-credenciado/pesquisar-processos-credenciado.module').then(x => x.PesquisarProcessosCredenciadoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'empresa-credenciada',
        loadChildren: () => import('app/funcionalidades/preposto-credenciado/preposto-credenciado.module').then(x => x.EmpresaCredenciadaModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'novo-pedido-credenciado',
        loadChildren: () => import('app/funcionalidades/novo-pedido-credenciado/novo-pedido-credenciado.module').then(x => x.NovoPedidoCredenciadoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'trilha-auditoria/:modulo',
        loadChildren: () => import('app/funcionalidades/trilha-auditoria/trilha-auditoria.module').then(x => x.TrilhaAuditoriaModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'relatorios/analitico',
        loadChildren: () => import('app/funcionalidades/relatorios/relatorios.module').then(x => x.RelatorioAnaliticoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'relatorios/procedimentos-solicitados-por-profissional',
        loadChildren: () => import('app/funcionalidades/relatorios/relatorios.module').then(x => x.RelatorioProcedimentosSolicitadosPorProfissionalModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'relatorios/controle-prazos-pedidos',
        loadChildren: () => import('app/funcionalidades/relatorios/relatorios.module').then(x => x.RelatorioControlePrazosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'relatorios/tempo-medio-pedidos',
        loadChildren: () => import('app/funcionalidades/relatorios/relatorios.module').then(x => x.RelatorioTempoMedioProcessosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'relatorios/junta-medica-odontologica',
        loadChildren: () => import('app/funcionalidades/relatorios/relatorios.module').then(x => x.RelatorioJuntaMedicaOdontologicaModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'relatorios/pesquisar-pedido-reembolso',
        loadChildren: () => import('app/funcionalidades/pesquisar-processo-reembolso/pesquisar-processo-reembolso.module').then(x => x.PesquisarProcessoReembolsoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'dependente',
        loadChildren: () => import('app/funcionalidades/dependente/dependente.module').then(x => x.DependenteModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'cancelar-dependente',
        loadChildren: () => import('app/funcionalidades/dependente/cancelar/cancelar-dependente.module').then(x => x.CancelarDependenteModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'renovar-dependente',
        loadChildren: () => import('app/funcionalidades/dependente/renovar/renovar-dependente.module').then(x => x.RenovarDependenteModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'adesao-titular',
        loadChildren: () => import('app/funcionalidades/adesao-titular/adesao-titular.module').then(x => x.AdesaoTitularModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'acompanhar-pedido',
        loadChildren: () => import('app/funcionalidades/acompanhamento/acompanhamento.module').then(x => x.AcompanhamentoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/parametros/documentos',
        loadChildren: () => import('app/funcionalidades/parametrizacao-documentos/parametrizacao-documentos.module').then(x => x.ParametrizacaoDocumentosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/parametros/motivo-negacao',
        loadChildren: () => import('app/funcionalidades/parametrizacao-motivo-negacao/parametrizacao-motivo-negacao.module').then(x => x.ParametrizacaoMotivoNegacaoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/parametros/prazos-status',
        loadChildren: () => import('app/funcionalidades/parametrizacao-prazos/parametrizacao-prazos.module').then(x => x.ParametrizacaoPrazosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/parametros/documento-pedido',
        loadChildren: () => import('app/funcionalidades/parametrizacao-documento-processo/parametrizacao-documento-processo.module').then(x => x.ParametrizacaoDocumentoProcessoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'atendimento/navegacao-titular',
        loadChildren: () => import('app/funcionalidades/navegacao-titular/navegacao-titular.module').then(x => x.NavegacaoTitularModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'credenciados/consultar-credenciados',
        loadChildren: () => import('app/funcionalidades/credenciados/credenciados.module').then(x => x.CredenciadosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/patologia',
        loadChildren: () => import('app/funcionalidades/patologia/patologia.module').then(x => x.PatologiaoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/vinc-med-patologia',
        loadChildren: () => import('app/funcionalidades/vinc-med-patologia/vinc-med-patologia.module').then(x => x.VincMedPatologiaModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/parametros/tipobeneficiario-tipopedido',
        loadChildren: () => import('app/funcionalidades/beneficiario-pedido/beneficiario-pedido.module').then(x => x.BeneficiarioPedidoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/motivo-solicitacao',
        loadChildren: () => import('app/funcionalidades/motivo-solicitacao/motivo-solicitacao.module').then(x => x.MotivoSolicitacaoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/parametros/motivo-tipo-pedido',
        loadChildren: () => import('app/funcionalidades/parametrizacao-motivo-tipo-pedido/parametrizacao-motivo-tipo-pedido.module').then(x => x.ParametrizacaoMotivoTipoPedidoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/parametros/motivo-negacao-tipo-pedido',
        loadChildren: () => import('app/funcionalidades/parametrizacao-motivo-negacao-tipo-pedido/motivo-negacao-tipo-pedido.module').then(x => x.MotivoNegacaoTipoPedidoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'downloadArquivo',
        component: DownloadViewerComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {
        path: 'manutencao/parametros/gerenciar-medicamentos',
        loadChildren: () => import('../app/funcionalidades/parametrizacao-medicamentos/parametrizacao-medicamentos.module').then(x => x.ParametrizacaoMedicamentosModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {   
        path: 'duvidas/consultar-medicamentos',
        loadChildren: () => import('../app/funcionalidades/medicamentos/procedimentos-medicamento.module').then(x => x.ProcedimentosMedicamentoModule),
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard],
        canLoad: [AuthGuard]
    },
    {path: '', pathMatch: 'full', redirectTo: '/home'},
    {path: '**', component: PaginaNaoEncontradaComponent, canActivate: [AuthGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
