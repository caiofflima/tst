import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DuvidasService{
    private title: string = 'Informações'

    getTitle(){
        return this.title
    }
}