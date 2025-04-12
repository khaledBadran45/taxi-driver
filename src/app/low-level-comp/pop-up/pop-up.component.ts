import { Component, Input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { popUpContent } from './pop-up-model';

@Component({
  selector: 'app-pop-up',
  imports: [FormsModule],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss',
})
export class PopUPComponent {
  @Input({ required: true }) popUpContent!: popUpContent;
  closePopUp = output();

  close() {
    console.log('called');
    this.closePopUp.emit();
  }
}
