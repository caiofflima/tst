import { Routes, Route } from '@angular/router';

import { CabecalhoPadraoComponent } from 'app/arquitetura/shared/templates/cabecalho-padrao.component';
import { RodapePadraoComponent } from 'app/arquitetura/shared/templates/rodape-padrao.component';

export function addHeaderFooter(config: Array<Route>): Promise<Array<Route>> {
	return new Promise((resolve, reject) => {
		// Trigger change detection so _loadedConfig is available in router
		setTimeout(() => {
			let configIsChanged = false;
			config.forEach(root => {
				if ((root as any)._loadedConfig) {
					RouteUtil.addHeaderFooter((root as any)._loadedConfig.routes);
					configIsChanged = true;
				}
			});
			if (configIsChanged) {
				resolve(config);
			}
			resolve(null);
		}, 0);
	});
}

export class RouteUtil {
	static addHeaderFooter(routes: Routes): Routes {
		/*
		{ path: '', outlet: 'header', component: CabecalhoPadraoComponent },
		{ path: '', outlet: 'footer', component: RodapePadraoComponent },
		*/

		for (let route of routes) {
			if (route.component) {
				if (!route.children) {
					route.children = [];
				}

				route.children = RouteUtil.addHeaderFooterToChildren(route.children);
			}
			else if (route.children) {
				route.children = RouteUtil.addHeaderFooter(route.children);
			}
		}

		return routes;
	}

	static addHeaderFooterToChildren(children: Routes): Routes {
		let isHeaderFound: boolean = false, isFooterFound: boolean = false;
		for (let child of children) {
			if ((child.outlet == 'header') || (child.component.name == CabecalhoPadraoComponent.name)) {
				isHeaderFound = true;
			}
			if ((child.outlet == 'footer') || (child.component.name == RodapePadraoComponent.name)) {
				isFooterFound = true;
			}
		}

		if (!isHeaderFound) {
			children.push(
				{ path: '', outlet: 'header', component: CabecalhoPadraoComponent }
			);
		}
		if (!isFooterFound) {
			children.push(
				{ path: '', outlet: 'footer', component: RodapePadraoComponent }
			);
		}

		return children;
	}
}
