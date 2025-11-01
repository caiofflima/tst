import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'handleMask'
})
export class HandlePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value){
      let handleFormatado = value.toString();
      if(handleFormatado.length > 0 && handleFormatado.length < 8){
        let diferenca = (8 - handleFormatado.length);
        for(let i=0; i < diferenca; i++){
          handleFormatado = "0"+handleFormatado;
        }
      }
      return handleFormatado;
    }
    return value;
  }

}
