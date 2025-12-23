import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  Beneficiario,
  DocumentoTipoProcesso,
} from "app/shared/models/entidades";
import {
  BeneficiarioService,
  DocumentoTipoProcessoService,
  InscricaoDependenteService,
  MessageService,
  ProcessoService,
  SessaoService,
} from "app/shared/services/services";
import { Router } from "@angular/router";
import { FiltroPedidoRegrasInclusao } from "app/shared/models/filtro/filtro-pedido-regras-inclusao";
import { isUndefinedNullOrEmpty, somenteNumeros } from "app/shared/constantes";
import { Util } from "app/arquitetura/shared/util/util";
import { ArquivoParam } from "app/shared/components/asc-file/models/arquivo.param";
import { Arquivo } from "app/shared/models/dto/arquivo";
import {filter, takeUntil} from 'rxjs/operators';
import { Subject } from "rxjs";
import { FiltroDocumentoProcesso } from "app/shared/models/filtro/filtro-documento-processo";
import { IntegracaoCorreiosService } from "app/shared/services/comum/integracao-correios.service";
import { EnderecoCorreios } from "app/shared/models/comum/endereco-correios";
import { Location } from '@angular/common';
@Component({
  selector: "app-dados-cadastrais",
  templateUrl: "./dados-cadastrais-detail.component.html",
  styleUrls: ["./dados-cadastrais-detail.component.scss"],
})
export class DadosCadastraisDetailComponent implements OnInit {
  beneficiario: any;
  isEditarDadosPessoais: boolean = false;
  isEditarEndereco: boolean = false;
  dadosPessoaisForm: FormGroup;
  enderecoForm: FormGroup;
  anexos: File[] = [];

  documentosCadastrados: DocumentoTipoProcesso[] = [];

  documentoSelecionadoControl = new FormControl();
  private readonly subjecUnsubscribe = new Subject();

  documentoForm: FormGroup;

  documentoNaoPossuiArquivos = true;

  // 13 é o Tipo de processo ATUALIZAÇÃO DE BENEFICIÁRIO
  idTipoProcesso: number = 13;

  filtro = new FiltroDocumentoProcesso();

  showProgress: boolean = false;
  
  private indexSelecionado = 0;

  disableBotaoEnvio: boolean = false;

  @ViewChild('file') file;

  titulo: string

  // 94 é o ID do MOTIVO SOLICITAÇÃO 
  idMotivoSolicitacao: number = 94;


  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private processoService: ProcessoService,
    private documentoTipoProcessoService: DocumentoTipoProcessoService,
    private service: BeneficiarioService,
    private inscricaoDependenteService: InscricaoDependenteService,
    private integracaoCorreiosService: IntegracaoCorreiosService,
    private router: Router,
    private location: Location
  ) {

    this.carregarDocumentos();
  }

  get matricula(): string {
    return SessaoService.getMatriculaFuncional();
  }

  ngOnInit() {
    this.titulo = this.service.getTitle()
    this.dadosPessoaisForm = this.formBuilder.group({
      telefone: [null],
      email: [null],
    });

    this.enderecoForm = this.formBuilder.group({
      cep: [null, Validators.required],
      logradouro: [null, Validators.required],
      bairro: [null, Validators.required],
      municipio: [null, Validators.required],
      estado: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null],
    });

    this.documentoForm = this.formBuilder.group({
      documento: [null]
    });

    this.getDadosBeneficiario(this.matricula);
    this.gerenciarIndexSelecionado();
    this.configurarListenerEstado();

  }

  carregarDocumentos() {
    /* Retirada do módulo Iniciar Atendimento
    const familia = sessionStorage.getItem("familia");
    
    if(this.isFamiliaMulticontrato(familia)){
      this.documentoTipoProcessoService.consultarPorMotivoSolicitacaoFamilia(this.idMotivoSolicitacao, this.matricula, familia).subscribe(documentos => {
        this.documentosCadastrados = documentos;
         },
          (err) => {
            this.messageService.addMsgDanger(err.error);
            this.showProgress = false;
          }
        );
    } else {
    */
      this.documentoTipoProcessoService.consultarPorMotivoSolicitacao(this.idMotivoSolicitacao, this.matricula).subscribe(documentos => {
        this.documentosCadastrados = documentos;
        if (this.documentosCadastrados && this.documentosCadastrados.length) {
          this.documentoSelecionadoControl.setValue(this.documentosCadastrados[0], {emitEvent: true});
          this.indexSelecionado = 0;
          this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
        }
         },
          (err) => {
            this.messageService.addMsgDanger(err.error);
            this.showProgress = false;
          }
        );
    //}
  }

  private gerenciarIndexSelecionado() {
    this.documentoSelecionadoControl.valueChanges.pipe(
        filter((documento: DocumentoTipoProcesso) => documento.id !== this.documentosCadastrados[0].id),
        takeUntil(this.subjecUnsubscribe),
    ).subscribe((documento: DocumentoTipoProcesso) => {
        this.indexSelecionado = this.documentosCadastrados.findIndex(doc => documento.id === doc.id);
    });
  }

  private configurarListenerEstado() {
    this.enderecoForm.get('estado').valueChanges
      .pipe(takeUntil(this.subjecUnsubscribe))
      .subscribe(() => {
        if (this.isEditarEndereco) {
          this.enderecoForm.patchValue({ municipio: null }, { emitEvent: false });
        }
      });
  }

  public getDadosBeneficiario(matricula: string) {
    /*  Retirada do módulo Iniciar Atendimento
    const familia = sessionStorage.getItem("familia");
    if(this.isFamiliaMulticontrato(familia)){
      this.service.consultarTitularPorMatriculaFamilia(matricula, true, familia).subscribe(
        (res: Beneficiario) => {
          if (res) {
            this.beneficiario = res;
          }
        },
        (err) => {
          this.messageService.addMsgDanger(err.error);
          console.log("< DEBUG ERRO >");
          console.log(err);
          console.log(err.message);
        }
      );
    } else {
      */
      this.service.consultarTitularPorMatricula(matricula, true).subscribe(
        (res: Beneficiario) => {
          if (res) {
            this.beneficiario = res;
          }
        },
        (err) => {
          this.messageService.addMsgDanger(err.error);
          console.log("< DEBUG ERRO >");
          console.log(err);
          console.log(err.message);
        }
      );
    //}
  }

  //: <AGENCIA>.<OPERACAO>.<CONTA>.<CONTADV>
  formatarContaCompleta(): string{
    if(this.beneficiario
      && this.beneficiario.agencia
      && this.beneficiario.operacao
      && this.beneficiario.conta
      && this.beneficiario.contadv){
        return this.beneficiario.agencia + "."
                        + this.beneficiario.operacao + "."
                        + this.beneficiario.conta + "."
                        + this.beneficiario.contadv
    }

    return "-";
  }

  public redirectCartaoPage(idBeneficiario: number) {
    console.log("redirectCartaoPage(idBeneficiario: number)  ------");
    console.log(this.beneficiario);
    if(idBeneficiario){
      this.router.navigate([`meus-dados/cartoes/detail/${idBeneficiario}`]);
    }
  }

  public redirectDetailPage(idBeneficiario: number) {
    console.log("redirectDetailPage(idBeneficiario: number)  ------");
    console.log(this.beneficiario);
    if(idBeneficiario){
      this.router.navigate([
        `meus-dados/dados-cadastrais/dependente-detail/${idBeneficiario}`,
      ]);
    }
  }

  public redirectDetailPedido(idPedido: number) {
    this.router.navigate([
      `meus-dados/dados-cadastrais/informacoes-pedido-detail/${idPedido}`,
    ]);
  }

  public gerenciarEdicaoDadosPessoais(value: boolean) {
    this.isEditarDadosPessoais = value;

    if (this.beneficiario) {
      this.dadosPessoaisForm.patchValue({
        telefone: this.beneficiario.celular,
        email: this.beneficiario.email,
      });
    }
  }

  public gerenciarEdicaoEndereco(value: boolean) {
    this.isEditarEndereco = value;

    if (this.beneficiario && this.beneficiario.endereco) {
      this.enderecoForm.patchValue({
        cep: this.beneficiario.endereco.cep,
        logradouro: this.beneficiario.endereco.logradouro,
        bairro: this.beneficiario.endereco.bairro,
        estado: this.beneficiario.endereco.estado.id,
        numero: this.beneficiario.endereco.numero,
        complemento: this.beneficiario.endereco.complemento,
      });

      setTimeout(() => {
        this.enderecoForm.patchValue({
          municipio: this.beneficiario.endereco.municipio.id,
        });
      }, 300);

      console.log(this.enderecoForm.value);
    }
  }

  desabilitarBotaoEnviar(): boolean{
    let retorno = false;
    let hasDocumentos = this.documentosCadastrados.length > 0;
    
     if(hasDocumentos) {
      retorno = !this.enderecoForm.valid || this.documentoNaoPossuiArquivos; 
     }

     return retorno;
  }

  public novoBeneficiario() {
    this.router.navigate([`dependente/incluir`]);
  }

  public atualizarDadosPessoais(idMotivoSolicitacao: number) {
    this.disableBotaoEnvio = true;

    let filtro = new FiltroPedidoRegrasInclusao(
      this.idTipoProcesso,
      this.beneficiario.id,
      idMotivoSolicitacao,
      null
    );

    this.confirmaRegraInclusao(filtro);
  }

  cancelarEdicaoDadosPessoais() {
    this.dadosPessoaisForm.reset();
    this.isEditarDadosPessoais = false;
  }

  cancelarEdicaoEndereco() {
    this.enderecoForm.reset();
    this.isEditarEndereco = false;
  }

  public confirmaRegraInclusao(filtro: FiltroPedidoRegrasInclusao) {
    console.log('filtro', filtro);
    this.processoService.consultarPedidosRegrasInclusao(filtro).subscribe(
      (res) => {
        if (!res) {
          this.atualizarDependente(filtro.idMotivoSolicitacao);
        } else {
          this.disableBotaoEnvio = false;
          this.messageService.showDangerMsg(
            "Tipo de pedido já cadastrado e em aberto para a(o) beneficiária(o)."
          );
        }
      },
      (err) => {
        this.disableBotaoEnvio = false;
        this.messageService.showDangerMsg(err.error);
      }
    ); 
  }

  public atualizarDependente(idMotivoSolicitacao: number) {
    this.showProgress = true;
    let pedidoDependente = {
      idBeneficiario: this.beneficiario ? this.beneficiario.id : null,
      idTipoProcesso: this.idTipoProcesso,
      idTipoBeneficiario: this.beneficiario.tipoDependente.id,
      idEstadoCivil: this.beneficiario.estadoCivil.id,
      nomeDependente: this.beneficiario.nome,
      cpfDependente: this.beneficiario.matricula.cpf,
      nomeMaeDependente: this.beneficiario.matricula.nomeMae,
      nomePaiDependente: this.beneficiario.matricula.nomePai,
      dataNascimento: Util.getDate(this.beneficiario.matricula.dataNascimento),
      sexoDependente: this.beneficiario.matricula.sexo,
      email: this.beneficiario.email,
      idMotivoSolicitacao: idMotivoSolicitacao,
      
      deEmailTitular: this.dadosPessoaisForm.value.email,
      coTelefoneTitular: somenteNumeros(this.dadosPessoaisForm.value.telefone),
      coCepTitular: this.enderecoForm.value.cep,
      deLogradouroTitular: this.enderecoForm.value.logradouro,
      deComplementoTitular: this.enderecoForm.value.complemento,
      noBairroTitular: this.enderecoForm.value.bairro,
      nuEnderecoTitular: this.enderecoForm.value.numero,
      nuMunicipioEnderecoTitular: this.enderecoForm.value.municipio,
      nuEstadoEnderecoTitular: this.enderecoForm.value.estado,
    };

    const formData = new FormData();

    /*if (this.anexos) {
      let i = 0;
      this.anexos.forEach((f) => {
          formData.append(`arquivo${i}`, f);
          formData.append(`nomeArquivo${i}`, btoa(f.name));
          formData.append(`idDocumentoTipoProcesso${i}`, f.id);
          i++;
      });
      
    }*/

    if (this.documentosCadastrados) {
      let i = 0;
      this.documentosCadastrados.forEach(file => {
        if(file.arquivos) {
          file.arquivos.forEach(f => {
              formData.append(`arquivo${i}`, f);
              formData.append(`nomeArquivo${i}`, btoa(f.name));
              formData.append(`idDocumentoTipoProcesso${i}`, file.id.toString());
              i++;
          })
        }
      });
  }

    formData.append("data", btoa(JSON.stringify(pedidoDependente)));

    this.inscricaoDependenteService.salvar(formData).subscribe(
      (res) => {
        if (res) {

          this.dadosPessoaisForm.reset();
          this.anexos = null;
  
          this.redirectDetailPedido(res.id);
        }
        this.disableBotaoEnvio = false;
      },
      (err) => {
        this.messageService.addMsgDanger(err.error);
        this.showProgress = false;
        this.disableBotaoEnvio = false;
      }
    );
  }

  onFilesAdded() {
      const files: { [key: string]: File } = this.file.nativeElement.files;

      for (const key in files) {

          if ( files.hasOwnProperty( key ) ) {
              if (!isNaN( parseInt( key, 10 ))) {
                  this.anexos.push(files[key]);
                  console.log(files[key]);
              }
          }
      }
  } 

  addFiles() {
    this.file.nativeElement.click();
  }

  excluirDocumentos(documento) {
    const index: number = this.anexos.indexOf(documento);
    if (index !== -1) {
        this.anexos.splice(index, 1);
    }
  }

  watchDocumentos(documentos: DocumentoTipoProcesso[]) {
    this.documentosCadastrados = documentos;
    this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
  }

  verificarFaltaDeDocumentos(): boolean {
    return this.documentosCadastrados
        && this.documentosCadastrados.length
        && this.documentosCadastrados.some(doc => isUndefinedNullOrEmpty(doc.arquivos));
  }

  arquivosSelecionados(arquivo: ArquivoParam) {
    console.log('arquivosSelecionados')
    if (this.documentosCadastrados && this.documentosCadastrados.length) {
        if (isUndefinedNullOrEmpty(this.documentosCadastrados[this.indexSelecionado].arquivos)) {
            this.documentosCadastrados[this.indexSelecionado].arquivos = [];
        }
        arquivo.files.forEach(file => {
            if (!this.possuiArquivoNaListagem(this.documentosCadastrados[this.indexSelecionado].arquivos, file)) {
                this.documentosCadastrados[this.indexSelecionado].arquivos.push(file);
            }
        });
        this.indexSelecionado = 0;
        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
        console.log(this.documentoNaoPossuiArquivos);
        console.log(this.documentosCadastrados);
    }
}

selecionarTipoDocumento(tipoDocumento: DocumentoTipoProcesso) {
  this.documentoSelecionadoControl.setValue(tipoDocumento);
  this.documentoSelecionadoControl.updateValueAndValidity();
}

possuiArquivoNaListagem(lista: Arquivo[], file: Arquivo): boolean {
  let isDuplicado = false;
  lista.forEach(arquivo => {
      if (arquivo.name === file.name && arquivo.size === file.size && arquivo.type === file.type) {
          isDuplicado = true;
      }
  });
  return isDuplicado;
}

visualizarArquivo(arquivo: any): void {
  if (arquivo instanceof File) {
    const url = URL.createObjectURL(arquivo);
    window.open(url, '_blank');
  } else if (arquivo.url) {
    window.open(arquivo.url, '_blank');
  }
}

excluirArquivoDocumento(docIndex: number, arqIndex: number): void {
  if (this.documentosCadastrados[docIndex] && this.documentosCadastrados[docIndex].arquivos) {
    this.documentosCadastrados[docIndex].arquivos.splice(arqIndex, 1);
    this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
  }
}

 isCartaoExpirado(dataExpiracaoCartao: Date | any) {
    if(!dataExpiracaoCartao) {
      return false;
    }

    if (!(dataExpiracaoCartao instanceof Date)) {
      dataExpiracaoCartao = this.parseDateString(dataExpiracaoCartao);
    }
    
    const today = new Date();
    return dataExpiracaoCartao.getTime() < today.getTime();
}

 parseDateString(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return null; 
    }

    try {
      return new Date(year, month - 1, day); 
    } catch (error) {
      return null; 
    }
 }

 getEnderecoByCEP() {
    const cepInformado = this.enderecoForm.value.cep;
    const cepLimpo = cepInformado?.replace(/\D/g, '');
    console.log('CEP digitado:', cepInformado);
    console.log('CEP limpo:', cepLimpo);

    if (!cepLimpo || cepLimpo.length !== 8) {
      this.messageService.addMsgDanger('CEP inválido. Digite um CEP válido com 8 dígitos.');
      return;
    }

    const cepComHifen = cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');

    this.integracaoCorreiosService.getEnderecoByCEP(cepComHifen).subscribe((endereco: EnderecoCorreios) => {
      console.log('Resposta do serviço:', endereco);
      if (endereco) {
        if(cepLimpo === this.beneficiario.endereco.cep?.replace(/\D/g, '')) {
          this.montarEnderecoComMesmoCEP(endereco);
        } else {
          this.montarEnderecoComCEPDiferentes(endereco);
        }
      } else {
        this.messageService.addMsgDanger('Endereço não encontrado para o cep informado.');
      }
    },
    (err) => {
      console.error('Erro ao buscar CEP:', err);
      this.messageService.addMsgDanger(err.error || 'Erro ao buscar endereço. Tente novamente.');
      this.showProgress = false;
    }
    );
 }

 getLogradouro(endereco: EnderecoCorreios):string{
  let tipo = "";
  let logradouro ="";
  let retorno = "";
  //logradouro: endereco.tipoLogradouro.tipo.trim() + ' ' + endereco.logradouro.trim(),

  if(endereco && endereco.tipoLogradouro && endereco.tipoLogradouro.tipo){
    tipo = endereco.tipoLogradouro.tipo.trim();  
  }

  if(endereco && endereco.logradouro){
    logradouro = endereco.logradouro.trim();
  }

  if(tipo === ""){
    retorno = logradouro;
  }else{
    retorno = tipo + ' ' + logradouro;
  }
  
  return retorno;
 }


 isDataVencida(data: any) {
  if (!data){
    return false;
  }

  let dataFornecida = null;

  if (!(data instanceof Date)) {
    const partesData = data.split('-');
    dataFornecida = new Date(parseInt(partesData[0]), parseInt(partesData[1]) - 1, parseInt(partesData[2]));
  } 
   
  const dataAtual = new Date();
  const dataSemHoras = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
  const dataFornecidaSemHoras = new Date(dataFornecida.getFullYear(), dataFornecida.getMonth(), dataFornecida.getDate());
  return dataFornecidaSemHoras < dataSemHoras;
 }

  public backButton(): void {
    this.location.back();
  }
 
  showProgressSending(): boolean{
    return this.disableBotaoEnvio;
  }

  montarEnderecoComMesmoCEP(endereco: EnderecoCorreios): any {
    this.enderecoForm.patchValue({
      cep: endereco.cep || '',
      logradouro: this.getLogradouro(endereco),
      bairro: endereco.bairro  || '',
      estado: endereco.codigoEstadoSIAGS  || '',
      numero: this.beneficiario.endereco.numero,
      complemento: this.beneficiario.endereco.complemento,
    });

    setTimeout(() => {
      this.enderecoForm.patchValue({
        municipio: endereco.codigoMunicipioSIAGS  || '',
      });
    }, 300);
  }

  montarEnderecoComCEPDiferentes(endereco: EnderecoCorreios): any{
    this.enderecoForm.patchValue({
      cep: endereco.cep || '',
      logradouro: this.getLogradouro(endereco),
      bairro: endereco.bairro  || '',
      estado: endereco.codigoEstadoSIAGS  || '',
      numero: '',
      complemento: '',
    });

    setTimeout(() => {
      this.enderecoForm.patchValue({
        municipio: endereco.codigoMunicipioSIAGS  || '',
      });
    }, 300);
  }

  isFamiliaMulticontrato(familia: string): boolean {
    let resultado: boolean;
    if(familia != null) {
      if(familia.trim() === "") {
        resultado = false;
      } else {
        resultado = true;
      }
    } else {
      resultado = false;
    }
    return resultado;
  }

}
