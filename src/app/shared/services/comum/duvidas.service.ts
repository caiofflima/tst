import { Injectable } from "@angular/core";

@Injectable()
export class DuvidasService{
    private title: string = 'Informações'

    getTitle(){
        return this.title
    }
}