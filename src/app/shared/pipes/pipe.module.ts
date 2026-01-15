import {LOCALE_ID, NgModule} from '@angular/core';
import {CpfPipe} from './cpf.pipe';
import {CampoVazioHifen, CampoVazioPipe} from './campo-vazio.pipe';
import {FlagSimNaoPipe} from './flag-sim-nao.pipe';
import {MesPipe} from './mes.pipe';
import {OrderBy} from './orderby.pipe';
import {CurrencyFormatPipe} from './currency-format.pipe';
import {IdadePipe} from './idade.pipe';
import {MatriculaPipe} from './matricula.pipe';
import {ProcessoPipe} from './processo.pipe';
import {EstruturaProcedimentoPipe} from './estrutura-procedimento.pipe';
import {CnpjPipe} from './cnpj.pipe';
import {CpfCnpjPipe} from './cpf-cnpj.pipe';
import {AtuacaoProfissionalPipe} from './atuacao-profissional.pipe';
import {PerfilPipe} from './pefil.pipe';
import {TelefonePipe} from './telefone.pipe';
import {SafeHtml} from './safe-html.pipe';
import {AutorizacaoPreviaPedidoPipe} from './autorizacao-previa-pedido.pipe';
import {HandlePipe} from './handle.pipe';
import { DateUTC } from './date-utc.pipe';
import { DateStringFormat } from './date-string-format.pipe';
import { CepMaskPipe } from './cep.pipe';
import { EhObrigatorioPipe } from './eh-obrigatorio.pipe';


@NgModule({
    imports: [],
    declarations: [
        CpfPipe,
        CnpjPipe,
        CpfCnpjPipe,
        CampoVazioPipe,
        FlagSimNaoPipe,
        MesPipe,
        OrderBy,
        CurrencyFormatPipe,
        IdadePipe,
        MatriculaPipe,
        ProcessoPipe,
        EstruturaProcedimentoPipe,
        AtuacaoProfissionalPipe,
        PerfilPipe,
        TelefonePipe,
        CampoVazioHifen,
        SafeHtml,
        AutorizacaoPreviaPedidoPipe,
        HandlePipe,
        DateUTC,
        DateStringFormat,
        CepMaskPipe,
        EhObrigatorioPipe
    ],
    exports: [
        CpfPipe,
        CnpjPipe,
        CpfCnpjPipe,
        CampoVazioPipe,
        FlagSimNaoPipe,
        OrderBy,
        CurrencyFormatPipe,
        IdadePipe,
        MatriculaPipe,
        ProcessoPipe,
        EstruturaProcedimentoPipe,
        AtuacaoProfissionalPipe,
        PerfilPipe,
        TelefonePipe,
        CampoVazioHifen,
        SafeHtml,
        AutorizacaoPreviaPedidoPipe,
        HandlePipe,
        DateUTC,
        DateStringFormat,
        CepMaskPipe,
        EhObrigatorioPipe
    ],
})
export class PipeModule {
    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [ {
                provide: LOCALE_ID,
                useValue: 'pt'
            },],
        };
    }
}
