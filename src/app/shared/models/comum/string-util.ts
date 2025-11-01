export class StringUtil {
  constructor() {
    throw new Error("class cannot be instantiate")
  }

  static escapeSpecialChar(value: string): string {
    return StringUtil.removerSpecialCaracter(value);
  }

  static removerSpecialCaracter(value: string): string {
    if (!value) {
      return "";
    }

    return value.replace(/[\u0250-\ue007]/g, '');
  }

  static replaceAll(string: string, search: string, replace: string) {
    return string.split(search).join(replace);
  }
}
