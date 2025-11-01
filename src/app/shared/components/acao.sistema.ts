import {ActivatedRoute} from '@angular/router';

export class AcaoSistema {
  private static ACAO_LISTAR = 'listar';
  private static ACAO_INCLUIR = 'incluir';
  private static ACAO_ALTERAR = 'alterar';
  private static ACAO_VISUALIZAR = 'visualizar';

  private acaoVigente: string;

  constructor(route: ActivatedRoute) {
    // verifica se tem o parametro ação na rota atual
    if (route !== null && route !== undefined) {
      const data = route.snapshot.data;
      if (data !== undefined) {
        if (data['acao'] !== undefined) {
          this.acaoVigente = data['acao'];
        }
      }
    }
  }

  /**
   * Verifica se ação é referente a 'Incluir'
   *
   * @return boolean
   */
  public isAcaoIncluir(): boolean {
    return AcaoSistema.ACAO_INCLUIR === this.acaoVigente;
  }

  /**
   * Verifica se ação é referente a 'Alterar'
   *
   * @return boolean
   */
  public isAcaoAlterar(): boolean {
    return AcaoSistema.ACAO_ALTERAR === this.acaoVigente;
  }

  /**
   * Verifica se ação é referente a 'Visualizar'
   *
   * @return boolean
   */
  public isAcaoVisualizar(): boolean {
    return AcaoSistema.ACAO_VISUALIZAR === this.acaoVigente;
  }

  /**
   * Verifica se ação é referente a 'Listar'
   *
   * @return boolean
   */
  public isAcaoListar(): boolean {
    return AcaoSistema.ACAO_LISTAR === this.acaoVigente;
  }
}
