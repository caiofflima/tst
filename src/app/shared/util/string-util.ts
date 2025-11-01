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

  static utf8ToBase64(str: string): string {
     // Codifica a string UTF-8 usando encodeURIComponent
     const encodedString = encodeURIComponent(str);
        
     // Substitui os caracteres '%' por seus valores correspondentes
     const binaryString = encodedString.replace(/%([0-9A-F]{2})/g, (match, p1) => {
         return String.fromCharCode(parseInt(p1, 16));
     });

     // Retorna a string codificada em Base64
     return btoa(binaryString);
  }

}
