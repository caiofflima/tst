import {Observable, Subject} from "rxjs";
import {distinctUntilChanged, filter, map, take, takeUntil} from "rxjs/operators";
import {isNotUndefinedOrNull} from "../constantes";


export class CustomOperatorsRxUtil {
  private constructor() {
    throw new Error('Class cannot be instantiate')
  }

  /**
   * This method will be apply distinctUntilChanged, filter by value not null or empty, and filter by your predicate
   * @param predicate
   */
  static filterBy<T>(predicate: (value: T) => boolean): (source: Observable<T>) => Observable<T> {
    return function (source: Observable<T>): Observable<T> {
      return source.pipe(
        distinctUntilChanged(),
        filter(isNotUndefinedOrNull),
        filter(predicate)
      )
    }
  }

  static filterNotEmptyAndDistinctUntilChanged<T>(compare?: (x: T, y: T) => boolean): (source: Observable<T>) => Observable<T> {
    return function (source: Observable<T>): Observable<T> {
      return source.pipe(
        filter(isNotUndefinedOrNull),
        distinctUntilChanged(compare)
      )
    }
  }

  static takeOneWhenPredicateIsTrueOrTakeUntil<T>(param: () => boolean, subject: Subject<void>) {
    return function (source: Observable<T>): any {
      let operatorTake = take(1)
      if (param()) operatorTake = takeUntil(subject)
      return source.pipe(operatorTake)
    }
  }

  static takeOne<T>() {
    return function (source: Observable<T>): Observable<T> {
      return source.pipe(take(1))
    }
  }

  static mapToNot<T>(predicate: (param: T) => boolean): (source: Observable<T>) => Observable<boolean> {
    return (source: Observable<T>): Observable<boolean> => {
      return source.pipe(
        map((t: T) => !predicate(t))
      )
    }
  }
}
