import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProcedimentosComReembolsoComponent } from '../procedimentos-cobertos/listar-procedimentos-com-reembolso/listar-procedimentos-com-reembolso.component';

describe('ListarProcedimentosComReembolsoComponent', () => {
  let component: ListarProcedimentosComReembolsoComponent;
  let fixture: ComponentFixture<ListarProcedimentosComReembolsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarProcedimentosComReembolsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarProcedimentosComReembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
