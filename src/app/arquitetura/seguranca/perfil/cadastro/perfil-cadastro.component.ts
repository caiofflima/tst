import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BaseComponent} from '../../../../../app/shared/components/base.component';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';
import {PerfilService} from '../../../../../app/arquitetura/shared/services/seguranca/perfil.service';
import {Perfil} from '../../../../../app/arquitetura/shared/models/seguranca/perfil';
import {DATAHORA_MASK} from '../../../../../app/shared/util/masks';
import {Util} from '../../../../../app/arquitetura/shared/util/util';

@Component({
  selector: 'app-perfil-cadastro',
  templateUrl: './perfil-cadastro.component.html',
  styleUrls: ['./perfil-cadastro.component.css']
})
export class PerfilCadastroComponent extends BaseComponent {
  formulario: FormGroup;
  maskDataHora: Array<string | RegExp>;
  perfil: Perfil = null;

  constructor(
    protected override messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private perfilService: PerfilService,
  ) {
    super(messageService);

    this.maskDataHora = DATAHORA_MASK;
    this.perfil = new Perfil();

    this.route.params.subscribe(
      (params: any) => {
        let id: number = params['id'];

        if (!Util.isEmpty(id)) {
          this.perfilService.get(id).subscribe((perfil: Perfil) => {
            this.perfil = perfil;
          }, () => {
            this.messageService.addMsgDanger('Ocorreu um erro ao carregar o perfil.');
          });
        }
      }
    );

    this.formulario = this.formBuilder.group({
      id: [{value: this.perfil.id, disabled: true}],
      nome: [{value: this.perfil.codigo}, [Validators.required]],
      descricao: [{value: this.perfil.descricao}, [Validators.required]],
      usuarioUltimaAtualizacao: [{value: this.perfil.usuarioUltimaAtualizacao, disabled: true}],
      terminalUltimaAtualizacao: [{value: this.perfil.terminalUltimaAtualizacao, disabled: true}],
      dataHoraUltimaAtualizacao: [{value: this.perfil.dataHoraUltimaAtualizacao, disabled: true}]
    });
  }

  isNew(): boolean {
    return Util.isEmpty(this.perfil.id);
  }

  gravar() {
    if (!this.formulario.valid) {
      this.messageService.addMsgDanger('Preencha os campos Obrigatórios.');
      return;
    }

    if (this.isNew()) {
      this.perfilService.post(this.perfil).subscribe((perfil: Perfil) => {
        this.messageService.addMsgSuccess('Perfil inserido com sucesso.');
        this.router.navigate([perfil.id, 'editar'], {relativeTo: this.route.parent});
      }, () => {
        this.messageService.addMsgDanger('Ocorreu um erro ao incluir o perfil.');
      });
    } else {
      this.perfilService.put(this.perfil).subscribe((perfil: Perfil) => {
        this.perfil = perfil;
        this.messageService.addMsgSuccess('Perfil alterado com sucesso.');
      }, () => {
        this.messageService.addMsgDanger('Ocorreu um erro ao alterar o perfil.');
      });
    }
  }

  excluir() {
    this.messageService.addConfirmYesNo('Deseja realmente excluir o perfil?', () => {
      this.perfilService.delete(this.perfil.id).subscribe(() => {
        this.messageService.addMsgSuccess('Perfil excluído com sucesso.');

        this.router.navigate(['novo'], {relativeTo: this.route.parent});
      }, () => {
        this.messageService.addMsgDanger('Ocorreu um erro ao excluir o perfil.');
      });
    }, null, null, 'Sim', 'Não');
  }

  consultar() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  isAlteracao(): boolean {
    return !this.isNew();
  }

}
