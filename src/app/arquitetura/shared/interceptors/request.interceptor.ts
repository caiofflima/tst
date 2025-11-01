import {Injectable, Injector} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, mergeMap, tap} from 'rxjs/operators';

import {SessaoService} from '../../../../app/arquitetura/shared/services/seguranca/sessao.service';
import {ConfiguracaoSegurancaService} from '../../../../app/arquitetura/shared/services/seguranca/configuracao-seguranca.service';
import {MessageService} from '../../../../app/shared/components/messages/message.service';
import {Util} from '../../../../app/arquitetura/shared/util/util';

const XSSI_PREFIX = /^\)]}',?\n/;

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    private static readonly HEADER_AUTHORIZATION = 'Authorization';

    private initialized: boolean;
    private sessaoService: SessaoService;

    constructor(
        private injector: Injector,
        private messageService: MessageService
    ) {
        this.initialized = false;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): any {
        console.log("🚀 ~ RequestInterceptor ~ intercept ~ next:", next)
        console.log("🚀 ~ RequestInterceptor ~ intercept ~ req:", req)
        if (req.url.includes('/' + ConfiguracaoSegurancaService.CONFIGURACAO_SEGURANCA_SERVICE_URL)) {
            return this.handleDate(req, next);
        }

        return this.adicionarTokenNoCabecalho(req.headers).pipe(
            mergeMap(() => {
                let token: string = '';
                console.log("🚀 ~ RequestInterceptor ~ mergeMap ~ token:", token)
                let handledReq: HttpRequest<any>;

                if (this.getSessaoService().getToken()) {
                    token = this.getSessaoService().getToken().token;
                    console.log("🚀 ~ RequestInterceptor ~ mergeMap ~ token:", token)

                    handledReq = req.clone({
                        headers: req.headers
                        .set(RequestInterceptor.HEADER_AUTHORIZATION, 'Bearer ' + token)
                    });
                } else {
                    handledReq = req;
                }
                
                console.log("🚀 ~ RequestInterceptor ~ mergeMap ~ handledReq:", handledReq)
                return this.handleDate(handledReq, next).pipe(tap(
                    (event: HttpEvent<any>) => {
                        if (event instanceof HttpResponse) {
                            // nada a fazer
                        }
                    },
                    (err: any) => {
                      this.handleErrorIntercept(err)
                    }));
            })
        );
    }

    private handleErrorIntercept(err:any){
        if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
                this.processarErroAutenticacao();
            } else if (err.status === 403) {
                this.processarErroAutorizacao();
            } else if (err.status === 408) {
                this.processarErroTimeout();
            }
        }
    }

    private adicionarTokenNoCabecalho(headersArg?: HttpHeaders): Observable<any> {
        console.log("🚀 ~ RequestInterceptor ~ adicionarTokenNoCabecalho ~ headersArg:", headersArg)
        return of(async (observer: any) => {
            let headers = headersArg;
            if (!headers) {
                headers = new HttpHeaders();
            }

            try {
                const token: string = await this.getSessaoService().atualizarToken();
                if (token == null) {
                    this.processarErroAutenticacao();
                    observer.error({});
                    return;
                }

                headers = headers.set(RequestInterceptor.HEADER_AUTHORIZATION, 'Bearer ' + token);
                observer.next(headers);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
    }

    /**
     * 401 Unauthorized: apesar do nome, representa erro de autenticação
     */
    private processarErroAutenticacao() {
        this.messageService.addConfirmOk('Sua sessão expirou. Realize o login novamente.',
            () => this.getSessaoService().finalizarSessao(true));
    }

    /**
     * 403 Forbidden: representa erro de autorização
     */
    private processarErroAutorizacao() {
        this.messageService.addConfirmOk('Acesso negado.');
    }

    /**
     * 408 Request Timeout: erro de timeout na requisição.
     */
    private processarErroTimeout() {
        this.messageService.addConfirmOk('Tempo de espera esgotado. Favor, tente novamente.');
    }

    private getSessaoService(): SessaoService {
        if (!this.initialized) {
            this.initialized = true;
            this.sessaoService = this.injector.get(SessaoService);
        }

        return this.sessaoService;
    }

    public handleDate(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("🚀 ~ RequestInterceptor ~ handleDate ~ next:", next)
        console.log("🚀 ~ RequestInterceptor ~ handleDate ~ req:", req)
        if (req.responseType !== 'json') {
            return next.handle(req);
        }

        req = req.clone({
            responseType: 'text'
        });

        return next.handle(req).pipe(map(event => {
            if (!(event instanceof HttpResponse)) {
                return event;
            }

            return this.processJsonResponse(event);
        }))
    }

    private processJsonResponse(res: HttpResponse<string>): HttpResponse<any> {
        console.log("🚀 ~ RequestInterceptor ~ processJsonResponse ~ res:", res)
        let body = res.body;

        if (typeof body === 'string') {
            const originalBody = body;

            body = body.replace(XSSI_PREFIX, '');

            try {
                body = body !== '' ? JSON.parse(body,
                    (key: any, value: any) => this.reviveUtcDate(key, value)) : null;
            } catch (error) {
                throw new HttpErrorResponse({
                    error: {error, text: originalBody},
                    headers: res.headers,
                    status: res.status,
                    statusText: res.statusText,
                    url: res.url || undefined,
                });
            }
        }

        return res.clone({body});
    }

    private reviveUtcDate(key: any, value: any): any {
        if (typeof value !== 'string') {
            return value;
        }

        if (value === '0001-01-01T00:00:00') {
            return null;
        }

        const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        if (!match) {
            return value;
        }

        return new Date(value);
    }
}
