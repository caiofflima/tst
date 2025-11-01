import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PrestadorExternoService, SessaoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const sessaoServiceSpy = jasmine.createSpyObj('SessaoService', ['inicializarSessao']);
    const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
    prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
    await TestBed.configureTestingModule({
      imports: [

  HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers:[
        { provide: SessaoService, useValue: sessaoServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'siasc_angular_15'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('siasc_angular_15');
  });
});
