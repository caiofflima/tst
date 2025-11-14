import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortabilidadeDetailComponent } from './portabilidade-detail.component';

describe('PortabilidadeDetailComponent', () => {
  let component: PortabilidadeDetailComponent;
  let fixture: ComponentFixture<PortabilidadeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortabilidadeDetailComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortabilidadeDetailComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
