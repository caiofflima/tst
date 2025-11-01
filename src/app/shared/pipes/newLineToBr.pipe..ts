import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'newLineToBr'
})
export class NewLineToBrPipe implements PipeTransform {
    transform(value: string): string {
        return value ? value.replace(/(\r\n|\n|\r)/g, '<br>') : value;
      }
}