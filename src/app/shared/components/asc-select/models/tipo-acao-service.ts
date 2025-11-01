export interface TipoAcaoService<T, E> {
  service: (service: T) => E
}
