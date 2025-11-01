/** Provider responsável por permitir a centralização
 * de descrições/mensagens utilizadas na aplicação
 * em um único local.
 */
export interface MessageResource {

  /**
   * Retorna a 'descrição' conforme a 'chave' informada.
   *
   * @param key
   * @returns
   */
  getDescription(key: string): string;
}
