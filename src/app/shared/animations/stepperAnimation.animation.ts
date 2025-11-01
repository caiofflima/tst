import { animate, state, style, transition, trigger } from "@angular/animations";

export const stepperAnimation = [trigger('stepTransition', [
  state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
  state('current', style({ transform: 'none', visibility: 'visible' })),
  state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
  transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
])]
