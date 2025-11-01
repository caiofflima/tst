import { Observable } from 'rxjs';

export interface TipoAcaoDoService<P, T> {
  action: (params?: P) => Observable<T[]>;
}
