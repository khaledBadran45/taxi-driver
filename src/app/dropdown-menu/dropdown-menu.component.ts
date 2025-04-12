import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit, output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Dropdown } from './dropdown.model';

@Component({
  selector: 'app-dropdown-menu',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
})
export class DropdownMenuComponent {
  @Input() control: FormControl = new FormControl('', [Validators.required]);
  selected:any
  // when we assign the dropdown to dropdown model we have a problim .
  dropdown = input.required<Dropdown | any>();
  isSelected(option: string): boolean {
    return this.control.value === option;
  }
  selectOption(option: any): void {
    this.selected = option
    this.control.setValue(option.id);
    document.getElementById('select-' + this.dropdown().id)?.click(); // Close the dropdown after selection;
  }

  markAsTouched() {
    if (this.control) this.control.markAsTouched();
  }
}
