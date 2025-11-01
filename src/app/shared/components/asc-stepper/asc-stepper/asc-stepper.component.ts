import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output
} from '@angular/core';
import {CdkStepper, StepContentPositionState} from '@angular/cdk/stepper';
import {SessaoService} from '../../../services/services';
import {Router} from "@angular/router";
import {enterLeaveAnimation} from "../../../animations/enterLeave.animation";
import {fadeAnimation} from "../../../animations/faded.animation";
import {stepperAnimation} from "../../../animations/stepperAnimation.animation";
import {Subject} from "rxjs";
import {distinctUntilChanged, takeUntil} from "rxjs/operators";
import {Beneficiario} from "../../../models/comum/beneficiario";
import {AtendimentoService} from "../../../services/comum/atendimento.service";

@Component({
    selector: 'asc-stepper',
    templateUrl: './asc-stepper.component.html',
    styleUrls: ['./asc-stepper.component.scss'],
    providers: [{provide: CdkStepper, useExisting: AscStepperComponent}],
    animations: [...enterLeaveAnimation, ...fadeAnimation, ...stepperAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AscStepperComponent extends CdkStepper implements OnDestroy, AfterContentInit,AfterViewInit {

    private readonly unsubscribe$ = new Subject<void>();

    @Input() beneficiario: Beneficiario;

    @Input() disableClickOnLabel = false;

    @Input() router: Router;

    @Input() routerLinkTo = "/"

    @Input() breadcrumbOptions: Array<string>;

    @Input() fitScreen: boolean;

    @Output() readonly animationDone = new EventEmitter<void>();

    readonly _animationDone = new Subject<AnimationEvent>();

    showInfoTitular: boolean;

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }

    onClick(index: number): void {
        console.log("🚀 ~ AscStepperComponent ~ onClick ~ index:", index)
        if (!this.disableClickOnLabel) {
            this.selectedIndex = index;
        }
    }

    greaterThan(index) {
        return index < this.breadcrumbOptions.length;
    }

    override reset(): void {
        this.selectedIndex = 0;
    }

    override ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    override ngAfterContentInit(): void {
    
        super.ngAfterContentInit()
        console.log('arriba',this.selected)
        this._steps.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this._stateChanged();
        });

        this._animationDone.pipe(
            distinctUntilChanged((x: any, y: any) => {
                return x.fromState === y.fromState && x.toState === y.toState;
            }),
            takeUntil(this.unsubscribe$)
        ).subscribe((event: any) => {
            if ((event.toState as StepContentPositionState) === 'current') {
                this.animationDone.emit();
            }
        });
    }

    fecharInfoTitular() {
        this.showInfoTitular = false;
    }
}
