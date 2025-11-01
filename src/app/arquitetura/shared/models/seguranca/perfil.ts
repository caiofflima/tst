import {Entity} from '../../../../../app/arquitetura/shared/models/entity';

export class Perfil extends Entity {
  public codigo: string | null = null;
  public nome: string | null = null;
  public descricao: string | null = null;
  public usuarioUltimaAtualizacao: string | null = null;
  public terminalUltimaAtualizacao: string | null = null;
  public dataHoraUltimaAtualizacao: Date | null = null;

  /**
   * AUDITORIA - PROFISSIONAL DE SAÚDE.
   */
  public static readonly AUDITORIA_PROFISSIONAL_SAUDE = 'ASC001';

  /**
   * AUDITORIA - TÉCNICO/ADMINISTRATIVO.
   */
  public static readonly AUDITORIA_TECNICO_ADMINISTRATIVO = 'ASC002';

  /**
   * CENTRAL DE ATENDIMENTO.
   */
  public static readonly CENTRAL_ATENDIMENTO = 'ASC003';

  /**
   * EMPREGADO/TITULAR.
   */
  public static readonly EMPREGADO_TITULAR = 'ASC004';

  /**
   * FILIAL
   */
  public static readonly FILIAL = 'ASC005';

  /**
   * MATRIZ - GESTOR DA REDE.
   */
  public static readonly MATRIZ_GESTOR_REDE = 'ASC006';

  /**
   * MATRIZ - GESTOR DE NEGÓCIO.
   */
  public static readonly MATRIZ_GESTOR_NEGOCIO = 'ASC007';

  /**
   * MÉDICO(A)/DENTISTA DESEMPATADOR.
   */
  public static readonly MEDICO_DENTISTA_DESEMPATADOR = 'ASC008';

  /**
   * PROFISSIONAL ASSISTENTE.
   */
  public static readonly PROFISSIONAL_ASSISTENTE = 'ASC009';

  /**
   * PREPOSTO CREDENCIADO.
   */
  public static readonly PREPOSTO_CREDENCIADO = 'ASC010';

  /**
   * OPERADOR CREDENCIADO.
   */
  public static readonly OPERADOR_CREDENCIADO = 'ASC011';

  /**
   * MSC MOBILE.
   */
  public static readonly CLI_MOB_MSC = 'CLI-MOB-MSC';
}
