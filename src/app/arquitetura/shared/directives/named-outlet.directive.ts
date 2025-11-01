import {
  Directive,
  OnInit,
  OnDestroy,
  Input,
  ViewContainerRef,
  ComponentFactoryResolver,
  ChangeDetectorRef
} from "@angular/core";
import {
  RouterOutlet,
  ChildrenOutletContexts,
  Route,
  OutletContext,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from "@angular/router";
import {CabecalhoPadraoComponent} from "../../../../app/arquitetura/shared/templates/cabecalho-padrao.component";
import {RodapePadraoComponent} from "../../../../app/arquitetura/shared/templates/rodape-padrao.component";

/**
 * Diretiva que permite implementar um outlet da mesma forma que a tag 'router-outlet' o faz.
 * Por exemplo, ao invés de escrever no template do componente:
 *   <router-outlet name="header"></router-outlet>
 * Pode ser definido como:
 *   <named-outlet name="header"></named-outlet>
 *
 * Nesse caso, ao utilizar esta diretiva ao invés do outlet padrão, não será mais necessário
 * definir a rota filha de cabeçalho e rodapé padrão em cada componente. Portanto, o
 * roteamento:
 *   path: '',
 *   component: ExemploComponent,
 *   children: [
 *     { path: '', outlet: 'header', component: CabecalhoPadraoComponent },
 *     { path: '', outlet: 'footer', component: RodapePadraoComponent }
 *   ]
 * Poderá simplesmente ser definido como:
 *   path: '',
 *   component: ExemploComponent
 *
 * Uso no template da página:
 *   <named-outlet name="[nome-outlet]"></named-outlet>
 */
@Directive({
  selector: 'named-outlet',
  exportAs: 'outlet'
})
export class NamedOutletDirective implements OnInit, OnDestroy {
  @Input() public name: string;
  public outlet: RouterOutlet;

  constructor(
    private parentContexts: ChildrenOutletContexts,
    private location: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.outlet = new RouterOutlet();

    // Se o outlet não está ativo (definido no roteamento), mas possui um dos
    // nomes previstos de terem um roteamento padrão ...
    if ((!this.outlet.isActivated) && ((this.name == 'header') || (this.name == 'footer'))) {

      let route: Route = {};
      route.path = '';
      route.outlet = this.name;

      // Preenche o componente esperado na rota
      switch (this.name) {
        case 'header': {
          route.component = CabecalhoPadraoComponent;
          break;
        }
        case 'footer': {
          route.component = RodapePadraoComponent;
          break;
        }
      }

      let context: OutletContext = this.parentContexts.getOrCreateContext(this.name);
      context.route = new ActivatedRoute();
      (context.route as any)._futureSnapshot = new ActivatedRouteSnapshot();
      (context.route as any)._futureSnapshot._routeConfig = route;
    }
  }

  ngOnDestroy() {
    if (this.outlet) {
      this.outlet.ngOnDestroy();
    }
  }
}
