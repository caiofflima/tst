import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredenciadosComponent } from './credenciados.component';

describe('CredenciadosComponent', () => {
  let component: CredenciadosComponent;
  let fixture: ComponentFixture<CredenciadosComponent>;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CredenciadosComponent],
      providers: [
        
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CredenciadosComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});