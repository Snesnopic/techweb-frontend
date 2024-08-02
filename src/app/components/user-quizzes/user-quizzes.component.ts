import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { marked } from 'marked';  // Import marked

@Component({
  selector: 'app-user-quizzes',
  templateUrl: './user-quizzes.component.html',
  styleUrls: ['./user-quizzes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class UserQuizzesComponent implements OnInit {
  quizzes: any[] = [];

  constructor(
    private quizService: QuizService,
    private router: Router,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  isQuestionMultiChoice(question: any): boolean {
    return question.answers.find((element: any) => element === '') !== undefined;
  }

  private loadQuizzes(): void {
    this.quizService.getUserQuizzes().then(data => {
      this.quizzes = data.map((quiz: any) => ({
        ...quiz,
        descriptionHtml: marked(quiz.description)  // Convert Markdown to HTML
      }));
      console.log("Quizzes:");
      console.table(data);
    }).catch(error => {
      console.error('Failed to load quizzes', error);
    });
  }
  
  confirmDeleteQuiz(quizId: number): void {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.deleteQuiz(quizId);
    }
  }

  deleteQuiz(quizId: number): void {
    this.quizService.deleteQuiz(quizId).then(() => {
      this.loadQuizzes();
    }).catch(error => {
      console.error('Failed to delete quiz', error);
    });
  }

  viewAnswers(quizId: number): void {
    this.router.navigate(['/view-answers', quizId]);
  }

  copyLink(quizId: number): void {
    const quizLink = `${window.location.origin}/quizzes/${quizId}/answer`;
    this.clipboard.copy(quizLink);
    alert('Link copied to clipboard');
  }
}
