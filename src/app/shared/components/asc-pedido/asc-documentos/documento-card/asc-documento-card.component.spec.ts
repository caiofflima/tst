import { Arquivo } from 'app/shared/models/dto/arquivo';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AscDocumentoCardComponent } from './asc-documento-card.component';
import { DocumentoTipoProcesso } from "../../../../models/dto/documento-tipo-processo";
import { Pedido } from "app/shared/models/comum/pedido";
//import { ArquivoParam } from "../../../asc-file/models/arquivo.param";

import { DocumentoTipoProcessoService } from "../../../../services/comum/documento-tipo-processo.service";
import { AnexoService } from "../../../../services/comum/anexo.service";
import { ProcessoService } from "app/shared/services/comum/processo.service";
import { TipoValidacaoService } from "app/shared/services/comum/tipo-validacao.service";
import { ValidacaoDocumentoPedidoService } from "app/shared/services/comum/validacao-documento-pedido.service";
import { DocumentoPedidoService } from "app/shared/services/comum/documento-pedido.service";
import { MessageService, SessaoService } from 'app/shared/services/services';
import { AscModalVisualizarDocumentoComponent } from '../modal-visualizar-documento/asc-modal-visualizar-documento.component';
import { AscModalNavegacaoComponent } from 'app/shared/components/asc-modal/asc-modal-navegacao/asc-modal-navegacao.component';

describe('AscDocumentoCardComponent', () => {
    let component: AscDocumentoCardComponent;
    let fixture: ComponentFixture<AscDocumentoCardComponent>;
    
    const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription','addMsgSuccess','addMsgDanger','addConfirmYesNo']);
    const sessaoServiceSpy = jasmine.createSpyObj('SessaoService',['init']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'url']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['url']);
    
    activatedRouteSpy.params = of({id: 1});
    const mockDocs: DocumentoTipoProcesso[] = [ {id:1, texto:"RG", assunto:"RG"} as DocumentoTipoProcesso] ;
    const mockPedido: Pedido = {id:1} as Pedido ;
    //const mockArquivos: Arquivo[] = [ {id:1} as Arquivo] ;
    const mockArquivo: Arquivo = {id:1} as Arquivo ;
    const mockDocumentoTipoProcesso: DocumentoTipoProcesso = {id:1} as DocumentoTipoProcesso ;

    const documentoTipoProcessoServiceSpy = jasmine.createSpyObj('DocumentoTipoProcessoService', ['get', 'post', 'put', 'delete']);
    documentoTipoProcessoServiceSpy.post.and.returnValue(of({}));
    documentoTipoProcessoServiceSpy.put.and.returnValue(of({}));

    const anexoServiceSpy = jasmine.createSpyObj('AnexoService', ['get', 'post', 'put', 'delete']);
    anexoServiceSpy.post.and.returnValue(of({}));
    anexoServiceSpy.put.and.returnValue(of({}));

    const processoServiceSpy = jasmine.createSpyObj('ProcessoService', ['get', 'post', 'put', 'delete']);
    processoServiceSpy.post.and.returnValue(of({}));
    processoServiceSpy.put.and.returnValue(of({}));

    const tipoValidacaoServiceSpy = jasmine.createSpyObj('TipoValidacaoService', ['get', 'post', 'put', 'delete']);
    tipoValidacaoServiceSpy.post.and.returnValue(of({}));
    tipoValidacaoServiceSpy.put.and.returnValue(of({}));
    tipoValidacaoServiceSpy.get.and.returnValue(of({}));

    const validacaoDocumentoPedidoServiceSpy = jasmine.createSpyObj('ValidacaoDocumentoPedidoService', ['get', 'post', 'put', 'delete']);
    validacaoDocumentoPedidoServiceSpy.post.and.returnValue(of({}));
    validacaoDocumentoPedidoServiceSpy.put.and.returnValue(of({}));

    const documentoPedidoServiceSpy = jasmine.createSpyObj('DocumentoPedidoService', ['get', 'post', 'put', 'delete']);
    documentoPedidoServiceSpy.post.and.returnValue(of({}));
    documentoPedidoServiceSpy.put.and.returnValue(of({}));
  
    //tipoDocumentoServiceSpy.consultarTodos.and.returnValue(of({}));
    //documentoServiceSpy.get.and.returnValue(of({}));

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [AscDocumentoCardComponent,
          AscModalVisualizarDocumentoComponent,
          AscModalNavegacaoComponent,
        ],
        providers: [
          { provide: MessageService, useValue: messageServiceSpy },
          { provide: SessaoService, useValue: sessaoServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: DocumentoTipoProcessoService, useValue: documentoTipoProcessoServiceSpy },
          { provide: AnexoService, useValue: anexoServiceSpy },
          { provide: ProcessoService, useValue: processoServiceSpy },
          { provide: TipoValidacaoService, useValue: tipoValidacaoServiceSpy },
          { provide: ValidacaoDocumentoPedidoService, useValue: validacaoDocumentoPedidoServiceSpy },
          { provide: DocumentoPedidoService, useValue: documentoPedidoServiceSpy },
        ]
      }).compileComponents();
    });
  
    beforeEach(() => {
      const atualizacaoValidacoesSubject = new Subject<void>();
      validacaoDocumentoPedidoServiceSpy.atualizacaoValidacoes$ =  atualizacaoValidacoesSubject.asObservable();

      fixture = TestBed.createComponent(AscDocumentoCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });
  
    it('deve retornar documentos', () => {
        const result = component['_documentos'] = mockDocs;
        expect(result).toEqual(mockDocs);
    });

    it('deve atribuir documentos', () => {
        component.documentos = mockDocs;
        const result = component.documentos;
        expect(result).toEqual(mockDocs);
    });
  
    it('deve retornar pedido', () => {
        const result = component['_processo'] = mockPedido;
        expect(result).toEqual(mockPedido);
    });

    it('deve atribuir pedido', () => {
        component.processo = mockPedido;
        const result = component.processo;
        expect(result).toEqual(jasmine.objectContaining({id:1}));
    });

    it('deve verificar se está editando', () => {
        expect(component.isEditing).toBe(false);
    });

    it('deve verificar se é processo novo', () => {
        expect(component.processoNovo).toBe;
    });

    it('deve verificar se pode excluir', () => {
      expect(component.isPermiteRemover(mockArquivo, mockDocumentoTipoProcesso)).toBe;
    }); 
   
  });
