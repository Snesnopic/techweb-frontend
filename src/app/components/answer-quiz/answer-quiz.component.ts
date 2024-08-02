import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { AnswerService } from '../../services/answer.service';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { marked } from 'marked';  // Import marked

@Component({
  selector: 'app-answer-quiz',
  templateUrl: './answer-quiz.component.html',
  styleUrls: ['./answer-quiz.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    CommonModule,
    FormsModule
  ],
  standalone: true
})
export class AnswerQuizComponent implements OnInit {
  quizForm: FormGroup;
  quizId: number;
  quiz: any;
  isLoggedIn: boolean = false; // Track if user is logged in
  nickname: string = 'Anonymous'; // Default nickname
  descriptionHtml: any = ''; // HTML-formatted description

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private answerService: AnswerService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    this.quizForm = this.fb.group({
      answers: this.fb.array([]),
      nickname: ['Anonymous'] // Add nickname to the form
    });
    this.quizId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated(); // Check login status
    this.loadQuiz();
  }

  isMultipleChoice(i: number): boolean {
    let check = true;
    this.quiz.Questions[i].answers.forEach((element: any) => {
      if (element == '') {
        check = false;
      }
    });
    return check;
  }

  private loadQuiz(): void {
    this.quizService.getQuiz(this.quizId).then((quiz: any) => {
      this.quiz = quiz;
      this.descriptionHtml = marked(quiz.description); // Convert Markdown to HTML
      console.log("Loaded quiz:", quiz);
      const answerArray = this.quizForm.get('answers') as FormArray;
      quiz.Questions.forEach((q: any) => {
        const isMultipleChoice = q.answers && q.answers.length > 0 && q.answers[0] !== '';

        const answerGroup = this.fb.group({
          questionId: [q.id, Validators.required],
          selectedAnswer: [isMultipleChoice ? '' : null, isMultipleChoice ? Validators.required : null],
          answerText: [!isMultipleChoice ? '' : null, !isMultipleChoice ? Validators.required : null]
        });

        answerArray.push(answerGroup);
      });

      // Set the nickname if not logged in
      if (!this.isLoggedIn) {
        this.quizForm.get('nickname')?.setValue(this.nickname);
      }
    }).catch((error: any) => {
      console.error('Failed to load quiz', error);
    });
  }

  get answers(): FormArray {
    return this.quizForm.get('answers') as FormArray;
  }

  onSubmit(): void {
    if (this.quizForm.valid) {
      const answerData = this.quizForm.value;
      answerData.quizId = this.quizId;
      answerData.nickname = this.isLoggedIn ? '' : this.quizForm.get('nickname')?.value || 'Anonymous'; // Set nickname based on login status
      console.log("Answers:")
      console.table(answerData)
      this.answerService.submitAnswers(answerData).then(() => {
        this.router.navigate(['/thank-you']);
      }).catch((error: any) => {
        console.error('Failed to submit answers', error);
      });
    }
  }
}
