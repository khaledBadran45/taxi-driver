import { Component } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
// import { fadeAnimation } from '../../../animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "../Login/login.component";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  animations: [CommonModule, FormsModule],
  imports: [LoginComponent],
})
export class AuthComponent {
  currentComponent: string = 'login';
  nextComponent: string = '';
  userMail: string = '';
  ngOnInit(): void {}
  // Trigger navigation to Forget Password
  showForgetPassword() {
    this.nextComponent = 'forget'; // Set the next component ;
    this.currentComponent = ''; // Trigger fade out ;
    console.log('trdefdkll');
  }
  // Trigger navigation to confirmation
  showConfirmation() {
    this.nextComponent = 'confirmation'; // Set the next component ;
    this.currentComponent = ''; // Trigger fade out ;
  }
  // Handle animation done event
  onAnimationDone(event: AnimationEvent) {
    if (event.phaseName === 'done' && event.toState === 'void') {
      // Once fade-out is done, display the next component ;
      this.currentComponent = this.nextComponent;
    }
  }
}
