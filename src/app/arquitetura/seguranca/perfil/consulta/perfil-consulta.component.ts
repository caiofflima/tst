import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

import {BaseComponent} from '../../../../../app/shared/components/base.component';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';
import {PerfilService} from '../../../../../app/arquitetura/shared/services/seguranca/perfil.service';
import {Perfil} from '../../../../../app/arquitetura/shared/models/seguranca/perfil';

@Component({
  selector: 'app-perfil-consulta',
  templateUrl: './perfil-consulta.component.html',
  styleUrls: ['./perfil-consulta.component.css']
})
export class PerfilConsultaComponent extends BaseComponent {
  formulario: FormGroup;
  pagina: number = 1;
  itens: any = 5;
  nome: string = '';
  perfis: Perfil[] = null;

  constructor(
    protected override messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private perfilService: PerfilService
  ) {
    super(messageService);

    this.formulario = this.formBuilder.group({
      nome: [{value: this.nome}]
    });
  }

  consultar() {
    this.perfilService.consultarPorNome(this.nome).subscribe((perfis: Perfil[]) => {
      this.perfis = perfis;
    }, () => {
      this.messageService.addMsgDanger('Ocorreu um erro ao pesquisar perfis.');
    });
  }

  incluir() {
    this.router.navigate(['novo'], {relativeTo: this.route.parent});
  }

  alterar(perfil: Perfil) {
    this.router.navigate([perfil.id, 'editar'], {relativeTo: this.route.parent});
  }

  excluir(perfil: Perfil) {
    const indice: number = this.perfis.findIndex(item => item.id == perfil.id);

    this.messageService.addConfirmYesNo('Deseja realmente excluir o perfil de ID ' + perfil.id + '?',
      () => {
        this.perfilService.delete(perfil.id).subscribe(() => {
            this.messageService.addMsgSuccess('Perfil excluído com sucesso.');

            if (indice >= 0) {
              this.perfis.splice(indice, 1);
            }
          }, () => {
            this.messageService.addMsgDanger('Ocorreu um erro ao excluir o perfil.');
          });
      }, null, null, 'Sim', 'Não');
  }

  handleSelectElemChange(evento:Event){
    const valor = +(evento.target as HTMLSelectElement).value
    this.itens = valor

  }
}
