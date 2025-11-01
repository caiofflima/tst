import { Location } from "@angular/common";
import { Component, ContentChild, Input } from "@angular/core";

@Component({
    template: ''
})
export class BaseLayout{
    @Input() baseTitulo: string
    @ContentChild('breadcrumb') breadcrumbContent: any;
    
    constructor(protected location: Location){}
    
    voltar(){
        this.location.back()
    }
}