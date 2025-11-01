import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
    template:''
})
export class CredenciadosComponent implements OnInit {

    constructor(
        private readonly router: Router,
        private location: Location,
    ) {
    }

    ngOnInit() {
        const URL = 'https://saude.caixa.gov.br/PORTALPRD/RedeAtendimento';
        window.open(URL, 'blank_');
        this.router.navigate(['/home']);
        //this.location.back();
    }
}
