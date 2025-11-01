import {MessageResource} from '../app/shared/components/messages/message-resource';
import {ValidationResource} from '../app/shared/components/validation/validation-resource';

/**
 * Provider responsável por prover as descrições e mensagens utilizadas na aplicação.
 */
export class MessageResourceImpl implements MessageResource, ValidationResource {
  private resource: Object;

  constructor() {
    this.resource = {
      'required': 'Campo de preenchimento obrigatório.',

      'LABEL_CONFIRM_TITLE': 'Confirmação',
      'LABEL_CONFIRM_OK': 'OK',
      'LABEL_CONFIRM_YES': 'Sim',
      'LABEL_CONFIRM_NO': 'Não',

      'LABEL_NOME': 'Nome',
      'LABEL_ACAO': 'Ações',
      'LABEL_GRUPO': 'Grupo',
      'LABEL_PERFIL': 'Perfil',
      'LABEL_USUARIO': 'Usuário',
      'LABEL_DADOS': 'Dados',

      'LABEL_SITUACAO': 'Situação',
      'LABEL_DESCRICAO': 'Descrição',
      'LABEL_VISUALIZAR': 'Visualizar',
      'LABEL_FUNCIONALIDADE': 'Funcionalidade',
      'LABEL_LIBERAR_ACESSO': 'Liberar',

      'LABEL_ATIVAR': 'Ativar',
      'LABEL_INATIVAR': 'Inativar',
      'LABEL_ALTERAR': 'Alterar',
      'LABEL_SALVAR': 'Salvar',
      'LABEL_VOLTAR': 'Voltar',
      'LABEL_CANCELAR': 'Cancelar',
      'LABEL_EXCLUIR': 'Excluir',
      'LABEL_SIMULAR': 'Simular Usuário',

      'TITLE_SIGLA_SISTEMA': 'SIASC',

      'TITLE_LISTAR': 'Listar',
      'TITLE_INCLUIR': 'Incluir',
      'TITLE_ALTERAR': 'Alterar',
      'TITLE_VISUALIZAR': 'Visualizar',
      'TITLE_ATUALIZAR': 'Atualizar',

      'MSG_CONFIRM_ATIVACAO': 'Deseja realmente ativar o registro selecionado?',
      'MSG_CONFIRM_INATIVACAO': 'Deseja realmente inativar o registro selecionado?',

      'MSG_ATIVACAO': '{0} ativado com sucesso!',
      'MSG_INATIVACAO': '{0} inativado com sucesso!',

      'MSG_INCLUSAO': '{0} incluído com sucesso!',
      'MSG_ALTERACAO': '{0} alterado com sucesso!',
    };
  }

  /**
   * Retorna a 'descrição' conforme a 'chave' informada.
   *
   * @param key
   * @returns
   */
  getDescription(key: string): string {
    return this.resource[key];
  }

  /**
   * Retorna a 'mensagem' conforme a 'chave' informada.
   *
   * @param key
   * @returns
   */
  getMessage(key: string): string {
    return this.getDescription(key);
  }
}
