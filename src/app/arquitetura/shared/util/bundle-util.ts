import {MessageStorage} from "../storage/message-storage";


export class BundleUtil {
  private static mensagens: any;

  static fromBundle(key: string, args?: any) {
    if (!BundleUtil.mensagens) {
      BundleUtil.mensagens = new MessageStorage().ler();
    }
    let msg = BundleUtil.mensagens[key];
    if (!msg || msg.length == 0) {
      msg = key;
    }
    if (args) {
      msg = this.replaceKeys(msg, args);
    }
    return msg;
  }

  private static replaceKeys(msg: string, args: any): string {
    if (!Array.isArray(args)) {
      args = [args];
    }
    let str = msg;
    let keys = str && str.match ? str.match(/{\d+}/g) : [];
    for (let kIndex in keys) {
      if (keys[kIndex]) {
        let index = keys[kIndex].toString().match(/\d+/g)[0];
        str = str.replace(keys[kIndex], args[index]);
      }
    }
    return str;
  }

}
