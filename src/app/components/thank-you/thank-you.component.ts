import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class ThankYouComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated(); // Check login status
  }

  goToAnsweredQuizzes(): void {
    this.router.navigate(['/answered-quizzes']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
