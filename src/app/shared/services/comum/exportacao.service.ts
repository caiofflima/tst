import { ExportacaoCSVService } from './exportacao/csv/exportacao-csv.service';
import { ExportacaoPDFService } from './exportacao/pdf/exportacao-pdf.service';
import { ExportacaoXLSService } from './exportacao/xls/exportacao-xls.service';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class ExportacaoService {

    constructor( private csv: ExportacaoCSVService, private pdf: ExportacaoPDFService, private xls: ExportacaoXLSService ) { }

    public exportarCSV( endpoint: string, body: any ): Observable<any> {
        return this.csv.exportar( endpoint, body );
    }

    public exportarPDF( endpoint: string, body: any ): Observable<any> {
        return this.pdf.exportar( endpoint, body );
    }
    
    public exportarXLS( endpoint: string, body: any ): Observable<any> {
        return this.xls.exportar( endpoint, body );
    }
}