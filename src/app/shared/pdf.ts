import * as kendo from "../../../src/assets/js/kendo/kendo.all.min.js";

export class PdfExport {
    static export(fileName: string, nomeDiv: string) {
        kendo.drawing.drawDOM(nomeDiv, {
            paperSize: "A4",
            margin: {top: "1cm", bottom: "1cm"},
            scale: 0.8,
            height: 500,
            encoded: true
        }).then(function (group) {
            kendo.drawing.pdf.saveAs(group, fileName)
        });
    }
}
