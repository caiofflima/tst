import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Option } from 'sidsc-components/dsc-select';

@Component({
  selector: 'asc-select',
  templateUrl: './asc-select.component.html',
  styleUrls: ['./asc-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AscSelectComponent),
      multi: true
    }
  ]
})
export class AscSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Selecione uma opção';
  @Input() options: Option[] = [];
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() multiple: boolean = false;
  @Input() showFilter: boolean = true;

  value: any;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
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

  onSelectionChange(event: any): void {
    this.value = event;
    this.onChange(event);
    this.onTouched();
  }
}
