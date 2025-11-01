import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-rodape-padrao',
    templateUrl: './rodape-padrao.component.html',
    styleUrls: ['./rodape-padrao.component.scss']
})
export class RodapePadraoComponent {

    constructor(
        private router: Router
    ) {
    }

    get isHome(): boolean {
        return this.router.url === '/home';
    }
}
