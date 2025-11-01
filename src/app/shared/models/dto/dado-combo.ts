export class DadoComboDTO {

  public label: string = "";
  public value: any = null;
  public descricao: string;

  constructor(label: string = "", value: any= null, descricao: string= ""){
    this.label = label;
    this.value = value;
    this.descricao = descricao;
  }

}
