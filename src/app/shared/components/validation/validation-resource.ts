/**
 * Interface provider responsável por permitir a
 * centralização de mensagem de validação.
 */
export interface ValidationResource {
  /**
   * Retorna a 'mensagem' conforme a 'chave' informada.
   *
   * @param key
   * @returns
   */
  getMessage(key: string): string;
}
