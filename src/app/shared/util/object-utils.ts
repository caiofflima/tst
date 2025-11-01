import {isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty} from '../constantes';

export class ObjectUtils {
  private constructor() {
    throw new Error('Class ObjectUtils cannot be instantiate');
  }

  static applyWhenIsNotEmpty<T, R>(obj: T, action: () => R): R | undefined | null {
    if (isNotUndefinedNullOrEmpty(obj)) {
      return action();
    }
    return null;
  }

  static applyWhenIsEmpty<T, R>(obj: T, action: () => R): R | undefined | null {
    if (isUndefinedNullOrEmpty(obj)) {
      return action();
    }
    return null;
  }

  static readValueFromPossibilityEmpty<T>(param: () => T) {
    try {
      return param();
    } catch (e) {
      return null;
    }
  }
}
