import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'asc-checkbox',
  templateUrl: './asc-checkbox.component.html',
  styleUrls: ['./asc-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AscCheckboxComponent),
      multi: true
    }
  ]
})
export class AscCheckboxComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() name?: string;
  @Input() disabled: boolean = false;
  @Input() trueValue: string = 'S';
  @Input() falseValue: string = 'N';
  @Input() valoresTrueOrFalse: boolean = true;

  @Input() set value(v: string | undefined) {
    if (v !== undefined && v !== null && v !== '') {
      this.trueValue = v;
    }
  }

  checked: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value === this.trueValue || value === true) {
      this.checked = true;
    } else if (value === this.falseValue || value === false) {
      this.checked = false;
    } else {
      this.checked = false;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onModelChange(val: boolean): void {
    this.checked = !!val;
    const emitted = this.valoresTrueOrFalse ? this.checked : (this.checked ? this.trueValue : this.falseValue);
    this.onChange(emitted);
    this.onTouched();
  }
}