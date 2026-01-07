import {Injectable} from '@angular/core';
import Keycloak from 'keycloak-js'

@Injectable()
export class KeycloakService {
    static auth: any = {};
    static accessTokenLifespan: number = 5;

    static init(aimRealm: string, idCliente: string, urlServidorAutorizacao: string): Promise<any> {
        //console.log("🚀 ~ KeycloakService ~ init ~ urlServidorAutorizacao:", urlServidorAutorizacao)
        //console.log("🚀 ~ KeycloakService ~ init ~ idCliente:", idCliente)
        //console.log("🚀 ~ KeycloakService ~ init ~ aimRealm:", aimRealm)
        //console.log("🚀 ~ KeycloakService ~ init ~ aimRealm:", aimRealm)
        const keycloakAuth: any = new Keycloak({
            url: urlServidorAutorizacao,
            realm: aimRealm,
            clientId: idCliente
        });

        KeycloakService.auth.loggedIn = false;

        //console.log("🚀 ~ KeycloakService ~ init ~ keycloakAuth:", keycloakAuth)
        return new Promise((resolve, reject) => {
            keycloakAuth.init({
                onLoad: 'login-required',
                checkLoginIframe: false,
                responseMode: 'query',
                // flow: 'implicit',
            })
            .then(() => {
                //console.log('sucesso kcs')
                KeycloakService.auth.loggedIn = true;
                KeycloakService.auth.authz = keycloakAuth;
                KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl
                    + '/realms/' + aimRealm + '/protocol/openid-connect/logout?redirect_uri='
                    + document.baseURI;

                resolve(true);
            }).catch(() => {
                console.log('ERROR kcs')
                reject();
            })

        });
    }

    static isAuthenticated(): boolean {
        return KeycloakService.auth.loggedIn;
    }

    static getAccessTokenLifespan(): number {
        return KeycloakService.accessTokenLifespan;
    }

    static getRealm(): string {
        return KeycloakService.auth.authz.realm;
    }

    static setAccessTokenLifespan(accessTokenLifespan: number) {
        KeycloakService.accessTokenLifespan = accessTokenLifespan;
    }

    static getToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (KeycloakService.auth.authz.token) {
                KeycloakService.auth.authz
                .updateToken(KeycloakService.getAccessTokenLifespan())
                .success(() => {
                    resolve(KeycloakService.auth.authz.token);
                })
                .error(() => {
                    reject('Failed to refresh token');
                });
            } else {
                reject('Not loggen in');
            }
        });
    }

    static getLastRetrievedToken(): string {
        return KeycloakService.auth.authz.token;
    }

    static getUsername(): string {
        return KeycloakService.auth.authz.tokenParsed.preferred_username;
    }

    static getFullName(): string {
        return KeycloakService.auth.authz.tokenParsed.name;
    }

    static logout() {
        KeycloakService.auth.loggedIn = false;
        KeycloakService.auth.authz = null;

        window.location.href = KeycloakService.auth.logoutUrl;
    }
}
