import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PrimeNGConfig } from 'primeng/api';
import { PrestadorExternoService, SessaoService } from 'app/shared/services/services';
import { AppComponent } from './app.component';
import { CalendarLocalePt } from './shared/util/calendar-locale-pt';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let sessaoService: jest.Mocked<SessaoService>;
    let primeNGConfig: jest.Mocked<PrimeNGConfig>;
    let prestadorExternoService: jest.Mocked<PrestadorExternoService>;

    beforeEach(async () => {
        sessaoService = {
            inicializarSessao: jest.fn()
        } as unknown as jest.Mocked<SessaoService>;

        primeNGConfig = {
            setTranslation: jest.fn()
        } as unknown as jest.Mocked<PrimeNGConfig>;

        prestadorExternoService = {
            get: jest.fn(),
            consultarUsuarioExternoPorFiltro: jest.fn()
        } as unknown as jest.Mocked<PrestadorExternoService>;

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [AppComponent],
            providers: [
                { provide: SessaoService, useValue: sessaoService },
                { provide: PrimeNGConfig, useValue: primeNGConfig },
                { provide: PrestadorExternoService, useValue: prestadorExternoService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve ter o título "siasc_angular_15"', () => {
        expect(component.title).toEqual('siasc_angular_15');
    });

    it('deve inicializar a sessão no constructor', () => {
        expect(sessaoService.inicializarSessao).toHaveBeenCalled();
        expect(sessaoService.inicializarSessao).toHaveBeenCalledTimes(1);
    });

    it('deve configurar o locale do PrimeNG no ngOnInit', () => {
        fixture.detectChanges(); // Chama ngOnInit

        expect(primeNGConfig.setTranslation).toHaveBeenCalled();
        expect(primeNGConfig.setTranslation).toHaveBeenCalledTimes(1);
    });

    it('deve chamar setTranslation com uma instância de CalendarLocalePt', () => {
        fixture.detectChanges(); // Chama ngOnInit

        const callArg = primeNGConfig.setTranslation.mock.calls[0][0];
        expect(callArg).toBeInstanceOf(CalendarLocalePt);
    });

    it('isJanelaDownload deve retornar true quando a URL contém "downloadArquivo"', () => {
        // Mock da window.location.href
        delete (window as any).location;
        (window as any).location = { href: 'http://localhost:4200/downloadArquivo/123' };

        const resultado = component.isJanelaDownload();

        expect(resultado).toBe(true);
    });

    it('isJanelaDownload deve retornar false quando a URL não contém "downloadArquivo"', () => {
        // Mock da window.location.href
        delete (window as any).location;
        (window as any).location = { href: 'http://localhost:4200/home' };

        const resultado = component.isJanelaDownload();

        expect(resultado).toBe(false);
    });

    it('isJanelaDownload deve retornar false para URL vazia', () => {
        // Mock da window.location.href
        delete (window as any).location;
        (window as any).location = { href: '' };

        const resultado = component.isJanelaDownload();

        expect(resultado).toBe(false);
    });
});
