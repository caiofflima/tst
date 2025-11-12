import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { LegacyPageEvent as PageEvent, MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CronogramaLeilaoService } from 'src/app/services/cronograma-leilao.service';
import { DataStorageService } from 'src/app/services/data-storage-service.service';
import { AppMaterialModule } from 'src/app/shared/app-material.module';
import { CronogramaLeilaoCentralizadoraDTO } from 'src/app/shared/model/cronograma-leilao-centralizadora-dto.model';
import { CronogramaLeilaoDTO } from 'src/app/shared/model/cronograma-leilao-dto.model';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { GerarCronogramaLeilaoComponent } from './gerar-cronograma-leilao.component';
import { DscSelectComponent } from 'sidsc-components/dsc-select';
import { DscTableComponent } from 'sidsc-components/dsc-table';
import { DscPaginatorComponent } from 'sidsc-components/dsc-paginator';
import { DscButtonComponent } from 'sidsc-components/dsc-button';
import { DscTextareaComponent } from 'sidsc-components/dsc-textarea';

describe('GerarCronogramaLeilaoComponent', () => {
    let component: GerarCronogramaLeilaoComponent;
    let fixture: ComponentFixture<GerarCronogramaLeilaoComponent>;
    let cronogramaService: jest.Mocked<CronogramaLeilaoService>;
    let toastrService: jest.Mocked<ToastrService>;
    let dialog: jest.Mocked<MatDialog>;

    const cronogramaCentralizadora = new CronogramaLeilaoDTO(
        1,
        2025,
        1,
        'N',
        'N',
        '',
        'AGENCIA TESTE',
        'AGENCIA TESTE',
        [],
        2,
        [new Date()],
        2,
        1,
        60,
        [],
        '',
        null,
        new Date(),
        new Date(),
        2,
        60,
        '',
        false,
        1,
        new CronogramaLeilaoCentralizadoraDTO(2, 3, 'Justificativa Alteração')
    );

    beforeEach(async () => {
        cronogramaService = {
            buscarAgenciasCentralizadoras: jest.fn(),
            atualizarDatasAgencia: jest.fn(),
            salvarCronograma: jest.fn(),
            buscarTiposCategoriasCentralizadora: jest.fn()
        } as unknown as jest.Mocked<CronogramaLeilaoService>;

        toastrService = {
            error: jest.fn(),
            success: jest.fn(),
            warning: jest.fn()
        } as unknown as jest.Mocked<ToastrService>;

        dialog = {
            open: jest.fn()
        } as unknown as jest.Mocked<MatDialog>;

        await TestBed.configureTestingModule({
            imports: [
                MatTableModule,
                MatInputModule,
                MatTooltipModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                RouterTestingModule,
                LoadingBarModule,
                AppMaterialModule,
                PipesModule,
                NgxMaterialTimepickerModule,
                MatCardModule,
                MatOptionModule,
                MatSelectModule,
                MatFormFieldModule,
                MatPaginatorModule,
                MatIconModule,
                FormsModule,
                ReactiveFormsModule,
                MatSlideToggleModule,
                ToastrModule.forRoot(),
                DscSelectComponent,
                DscTableComponent,
                DscPaginatorComponent,
                DscButtonComponent,
                DscTextareaComponent,
            ],
            declarations: [GerarCronogramaLeilaoComponent],
            providers: [
                { provide: CronogramaLeilaoService, useValue: cronogramaService },
                { provide: ToastrService, useValue: toastrService },
                { provide: MatDialog, useValue: dialog },
                { provide: DataStorageService, useValue: new DataStorageService() }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GerarCronogramaLeilaoComponent);
        component = fixture.componentInstance;
        cronogramaService.buscarTiposCategoriasCentralizadora.mockReturnValue(of({
            totalLeiloesMarcados: 10,
            totalPrazoDiasCorrido: 365
        }));

        fixture.detectChanges();
    });

    it('deve criar', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário com valores padrão', () => {
        expect(component.formCronograma.get('dataInicioCronograma').value).toBeNull();
        expect(component.formCronograma.get('dataFimCronograma').value).toBeNull();
    });

    it('deve mostrar mensagem de erro ao salvar com datas inválidas', () => {
        component.dataInvalida = { 0: true };
        component.salvarCronograma(false);
        expect(toastrService.warning).toHaveBeenCalledWith('Corrija as datas inválidas antes de salvar.');
    });

    it('deve validar o ano corretamente com anoCorrenteOuProximoValidator', () => {
        const validator = component.anoCorrenteOuProximoValidator();
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const pastYearDate = new Date(currentYear - 1, 0, 1);
        const currentYearDate = new Date(currentYear, 0, 1);
        const nextYearDate = new Date(nextYear, 0, 1);

        expect(validator({ value: pastYearDate } as AbstractControl)).toEqual({ matDatepickerFilter: true });
        expect(validator({ value: currentYearDate } as AbstractControl)).toBeNull();
        expect(validator({ value: nextYearDate } as AbstractControl)).toBeNull();
    });

    // it('deve chamar método para confirmar a alteração no cronograma da centralizadora e enviar os dados ao service', () => {
    //     // const dialogRefSpyObj = { afterClosed: jest.fn().mockReturnValue(of({ leiloesMarcados: 1, justificativa: 'teste' })) };
    //     // dialog.open.mockReturnValue(dialogRefSpyObj);
    //     cronogramaService.atualizarDatasAgencia.mockReturnValue(of({ datasCronograma: ['01/01/2024'] }));
    //     component.dataSource = new MatTableDataSource<CronogramaLeilaoDTO>([cronogramaCentralizadora]);

    //     component.alterarLeiloesMarcadosComJustificativa(cronogramaCentralizadora, true);

    //     expect(dialog.open).toHaveBeenCalled();
    //     expect(cronogramaService.atualizarDatasAgencia).toHaveBeenCalled();
    //     expect(toastrService.success).toHaveBeenCalledWith('Dados atualizados com sucesso.');
    // });

    // it('deve apresentar mensagem de erro quando método atualizarDatasAgencia da service falhar', () => {
    //     const dialogRefSpyObj = { afterClosed: jest.fn().mockReturnValue(of({ leiloesMarcados: 1, justificativa: 'teste' })) };
    //      dialog.open.mockReturnValue(dialogRefSpyObj);
    //      cronogramaService.atualizarDatasAgencia.mockReturnValue(throwError(() => new Error('Error')));
    //     component.dataSource = new MatTableDataSource<CronogramaLeilaoDTO>([cronogramaCentralizadora]);

    //     component.alterarLeiloesMarcadosComJustificativa(cronogramaCentralizadora, true);

    //     expect(dialog.open).toHaveBeenCalled();
    //     expect(cronogramaService.atualizarDatasAgencia).toHaveBeenCalled();
    //     expect(toastrService.error).toHaveBeenCalledWith(MensagemEnum.MN147);
    // });
});