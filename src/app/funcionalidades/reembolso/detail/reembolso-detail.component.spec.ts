import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReembolsoDetailComponent } from './reembolso-detail.component';

describe('ReembolsoDetailComponent', () => {
  let component: ReembolsoDetailComponent;
  let fixture: ComponentFixture<ReembolsoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReembolsoDetailComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReembolsoDetailComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
