import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-view-answers',
  templateUrl: './view-answers.component.html',
  styleUrls: ['./view-answers.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTabsModule]
})
export class ViewAnswersComponent implements OnInit {
  quizId: number;
  questions: any[] = [];
  groupedAnswers: any[] = [];

  constructor(private quizService: QuizService, private route: ActivatedRoute) {
    this.quizId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadAnswers();
  }

  private loadAnswers(): void {
    this.quizService.getQuizAnswers(this.quizId).then((data: any[]) => {
      console.log("Data received from server:", data);

      const userAnswersMap = new Map<string, any>();

      data.forEach((question: any) => {
        // Add questions to the questions array
        this.questions.push({
          question: question.question,
          correctAnswer: question.correctAnswer,
          answers: question.answers.map((answer: any) => ({
            ...answer,
            sessionId: answer.sessionId || 'N/A', // Ensure sessionId is included
            createdAt: new Date() // Assuming the answer timestamp is added
          }))
        });

        // Group answers by user and sessionId
        question.answers.forEach((answer: any) => {
          const userKey = `${answer.user}-${answer.sessionId || 'N/A'}`;

          if (!userAnswersMap.has(userKey)) {
            userAnswersMap.set(userKey, {
              user: answer.user,
              sessionId: answer.sessionId || 'N/A',
              answers: [],
              correctAnswers: 0,
              totalQuestions: 0,
              passed: false
            });
          }

          const userAnswers = userAnswersMap.get(userKey);
          userAnswers.answers.push({
            question: question.question,
            correctAnswer: question.correctAnswer,
            givenAnswer: answer.givenAnswer,
            createdAt: answer.createdAt
          });

          if (answer.givenAnswer === question.correctAnswer) {
            userAnswers.correctAnswers += 1;
          }

          userAnswers.totalQuestions += 1;
        });
      });

      userAnswersMap.forEach((userAnswers: any) => {
        userAnswers.passed = userAnswers.correctAnswers >= (userAnswers.totalQuestions - 1); // Adjust as needed
        this.groupedAnswers.push(userAnswers);
      });

      console.log("Parsed answers by user:", this.groupedAnswers);
    }).catch((error: any) => {
      console.error('Failed to load answers', error);
    });
  }
}
