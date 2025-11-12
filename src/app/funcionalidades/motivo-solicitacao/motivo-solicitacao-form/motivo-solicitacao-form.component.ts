import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from 'app/arquitetura/shared/util/util';
import { BaseComponent } from 'app/shared/components/base.component';
import { Loading } from 'app/shared/components/loading/loading-modal.component';
import { isNotUndefinedOrNull } from 'app/shared/constantes';
import { MotivoSolicitacao } from 'app/shared/models/entidades';
import { MessageService, MotivoSolicitacaoService } from 'app/shared/services/services';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { CheckboxChangeEvent } from 'primeng/checkbox';
@Component({
  selector: 'asc-motivo-solicitacao-form',
  templateUrl: './motivo-solicitacao-form.component.html',
  styleUrls: ['./motivo-solicitacao-form.component.scss']
})
export class MotivoSolicitacaoFormComponent extends BaseComponent {
  titulo: string
  loading: boolean
  loadingRM: boolean
  motivoSolicitacao:any = new MotivoSolicitacao();
  dataInativacao = this.formBuilder.control(null);
  inativo = this.formBuilder.control(false);
  prestadorExclusivo = this.formBuilder.control(false);
  
  override baseURL: string
  rotaListar: string
  formulario: FormGroup = this.formBuilder.group({
      id: this.formBuilder.control(null),
      nome: this.formBuilder.control(null,[Validators.required]),
      dataInativacao: this.dataInativacao,
      prestadorExclusivo: this.prestadorExclusivo,
      inativo: this.inativo
  })
  
  loadginBehavior = new BehaviorSubject<boolean>(false)
  id: number
  constructor(
      private readonly router: Router,
      private readonly location: Location,
      private readonly route: ActivatedRoute,
      private readonly formBuilder: FormBuilder,
      private readonly service: MotivoSolicitacaoService,
      override readonly messageService: MessageService
  ) {
      super(messageService);
      this.id = this.route.snapshot.params['id'];
      this.validarDadosDoParametro()
      
      
      this.titulo = service.getTitulo()
      this.baseURL = this.service.getRotaBase()
      this.rotaListar = `${this.baseURL}/listar`
      this.atualizaLoading()
      this.consultarDados();
  }

  validarDadosDoParametro(){
    if( this.id ){
        this.consultarDados()
    }
  }

  
  get nome (){
      return this.formulario.get('nome')
  }


  private consultarDados(): void {
      if (this.id) {
          this.loadingScreen()
          this.service.get(this.id).pipe(
              take<MotivoSolicitacao>(1)
          ).subscribe((motivoSolicitacao:any) => {
              
            this.motivoSolicitacao = motivoSolicitacao;
            this.motivoSolicitacao.dataInativacao = Util.getDate ( motivoSolicitacao.dataInativacao )
        
            for (let key in this.motivoSolicitacao) {
                if (this.formulario.get(key) != undefined) {
                    this.formulario.get(key).setValue(this.motivoSolicitacao[key]);
                }
            }

            this.inativo.setValue( motivoSolicitacao.inativo === 'SIM' ) 
                this.prestadorExclusivo.setValue( motivoSolicitacao.prestadorExclusivo === 'SIM' ) 
                this.loadingScreen(false)
      
          });
         
      } 
  }

  

  public limparCampos(): void {
      this.formulario.reset();
      this.formulario.markAsPristine();
      this.formulario.markAsUntouched();
      this.formulario.updateValueAndValidity();
  }

  public restaurarCampos(): void {
      this.consultarDados();
  }

  public excluir(): void {
      this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
          this.loadingRM = true
          this.loadingScreen()
     
          this.service.delete(this.id).subscribe(async () => {
              this.showSuccessMsg(this.bundle("MA039"));
              await this.router.navigate([this.rotaListar]);
          }, err => {
              this.loadingRM = false              
              Loading.stop();
              this.loadingScreen(this.loadingRM)
              this.showDangerMsg(err.error)
          });
      });
  }

  public voltar(): void {
      this.location.back();
  }

  public salvar(): void {
      this.loading = true;
      this.loadingScreen()
      
      let motivoSolicitacao: MotivoSolicitacao = {
          id: this.id ,
          ...this.formulario.value, 
          inativo: this.inativo.value ? 'SIM' : 'NAO',
          prestadorExclusivo: this.prestadorExclusivo.value ? 'SIM' : 'NAO',
          dataInativacao: this.dataInativacao.value,
         
      };
      
      
      const queryParams = {
        codigo: this.id
      }
      if (this.id) {
        this.service.put(motivoSolicitacao).pipe(take(1)).subscribe(() => {
              this.showSuccessMsg(this.bundle("MA022"));

              this.router.navigate([this.rotaListar], { queryParams });
          }, err => {
              this.loading = false
              this.loadingScreen(this.loading)
              this.showDangerMsg(err.error)
          });
      } else {
      
        this.service.post(motivoSolicitacao).pipe(take<MotivoSolicitacao>(1)  
          ).subscribe((res: any) => {
            this.showSuccessMsg(this.bundle("MA038"));
            this.router.navigate([this.rotaListar], { queryParams: {codigo:  res.id}});
          }, err => {
              this.loading = false
              this.loadingScreen(false)
              this.showDangerMsg(err.error)
          });
      }
  }


  public onChangeInativo(event: CheckboxChangeEvent) {
      if (event.checked) {
          this.dataInativacao.setValue(new Date())
          this.dataInativacao.setValidators(Validators.required);
      } else {
          this.dataInativacao.clearValidators();
          this.dataInativacao.setValue(null);
          this.dataInativacao.markAsPristine();
          this.dataInativacao.markAsUntouched();
          this.dataInativacao.updateValueAndValidity();
      }
  }

  isNull(data){
      return isNotUndefinedOrNull(data)
  }

  loadingScreen(loading = true){
      setTimeout(() => this.loadginBehavior.next(loading), 200);
  }

  atualizaLoading(){
      this.loadginBehavior
          .pipe(
              switchMap(p => of(p)),
              tap(p =>{
                  if(p) Loading.start();
                  else Loading.stop()
              })
          ).subscribe()
  }

}
