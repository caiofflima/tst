import { Directive, ElementRef, Input, OnChanges, QueryList, SimpleChanges } from '@angular/core';
import { CdkStep } from '@angular/cdk/stepper';

@Directive({
  selector: '[ascIncrementerBar]',
})
export class IncrementerBarDirective implements OnChanges {
  @Input('passos')
  steps: QueryList<CdkStep>;

  @Input('index')
  selectedIndex: number;

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const { length } = this.steps;
    const index = this.selectedIndex;
    let width = index === length - 1 ? 95 : (((index * 2) + 1) / ((length - 1) * 2)) * 97.5;
    this.elementRef.nativeElement.style.width = `${ width }%`;
  }

}
