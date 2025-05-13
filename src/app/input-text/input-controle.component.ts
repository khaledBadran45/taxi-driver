import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { field } from './field.model';
@Component({
  selector: 'app-input-control',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-controle.component.html',
  styleUrl: './input-controle.component.scss',
})
export class InputControleComponent {
  @Input() inp!: field;
}
