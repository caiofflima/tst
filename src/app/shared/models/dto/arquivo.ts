export class Arquivo extends File {
  id?: number;
  idDocTipoProcesso?: number;
  idDocumentoGED?: string;
  isNew?: boolean;
  isToDelete?: boolean;
  data?: Date;
  usuario?: string;
}
