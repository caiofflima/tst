import {
	AnimationTriggerMetadata,
	trigger,
	state,
	style,
	animate,
	transition,
	group
} from '@angular/animations';

export const ANIMATIONS: AnimationTriggerMetadata[] = [
	trigger('flyInOut', [
		state('in', style({ width: 120, transform: 'translateX(0)', opacity: 1 })),
		transition('void => *', [
			style({ width: 10, transform: 'translateX(50px)', opacity: 0 }),
			group([
				animate('0.3s 0.1s ease', style({
					transform: 'translateX(0)',
					width: 120
				})),
				animate('0.3s ease', style({
					opacity: 1
				}))
			])
		]),
		transition('* => void', [
			group([
				animate('0.3s ease', style({
					transform: 'translateX(50px)',
					width: 10
				})),
				animate('0.3s 0.2s ease', style({
					opacity: 0
				}))
			])
		])
	]),

	trigger('expandableState', [
		transition(':enter', [
			style({ height: '0', opacity: 0 }),
			animate('500ms', style({ height: '*', opacity: 1 })),
		]),
		transition(':leave', [
			style({ height: '*', opacity: 1 }),
			animate('500ms', style({ height: '0', opacity: 0 })),
		]),
	])
];

