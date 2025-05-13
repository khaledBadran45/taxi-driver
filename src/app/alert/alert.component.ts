// alert.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message: string = '';
  @Input() dismissible: boolean = false;
  @Input() autoClose: number = 0;

  @Output() closed = new EventEmitter<void>();

  show: boolean = false; // Changed default to false
  private timeoutId: any;

  // Add public method to show alert with custom message and type
  showAlert(
    message: string,
    type: AlertType = 'info',
    dismissible: boolean = true,
    autoClose: number = 0
  ) {
    this.message = message;
    this.type = type;
    this.dismissible = dismissible;
    this.autoClose = autoClose;
    this.show = true;

    if (this.autoClose > 0) {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => this.dismiss(), this.autoClose);
    }
  }

  dismiss() {
    this.show = false;
    this.closed.emit();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
