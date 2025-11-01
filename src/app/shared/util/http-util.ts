import {HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {MessageService} from '../components/messages/message.service';
import {of} from "rxjs";
import {Observable} from "rxjs";

export class HttpUtil {

  static catchError<T>(messageService: MessageService, callbackError?: () => void): (source: Observable<T>) => Observable<T> {
    return function (source: Observable<T>): Observable<T> {
      return source.pipe(catchError((httpResponseError: HttpErrorResponse) => {
        if (messageService) messageService.addMsgDanger(httpResponseError.error || httpResponseError.message);
        if (callbackError) callbackError();
        throw httpResponseError;
      }));
    }
  }

  static catchErrorAndReturnEmptyObservable<T>(messageService: MessageService, callbackError?: (error: HttpErrorResponse) => void): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => {
      return source.pipe(
        catchError((httpResponseError: HttpErrorResponse) => {
          if (messageService) messageService.addMsgDanger(httpResponseError.error || httpResponseError.message);
          if (callbackError) callbackError(httpResponseError);
          throw of({});
        })
      );
    };
  }

  static catchErrorAndReturnEmptyObservableByKey<T>(messageService: MessageService, key: string, callbackError?: () => void): (source: any) => any {
    return (source: Observable<T>) => {
      return source.pipe(
        catchError((httpResponseError: HttpErrorResponse) => {
          if (messageService) messageService.addMsgDanger(httpResponseError[key]);
          if (callbackError) callbackError();
          return of({})
        })
      );
    };
  }
}
