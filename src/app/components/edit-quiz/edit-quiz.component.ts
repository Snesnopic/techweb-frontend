import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss'],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, CommonModule],
  standalone: true
})
export class EditQuizComponent implements OnInit {
  quizForm: FormGroup;
  quizId: number;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      questions: this.fb.array([]),
    });
    this.quizId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadQuiz();
  }

  private loadQuiz(): void {
   
    this.quizService.getQuiz(this.quizId).then((quiz: any) => {
      this.quizForm.patchValue({
        title: quiz.title,
        description: quiz.description
      });
      const questionArray = this.quizForm.get('questions') as FormArray;
      quiz.Questions.forEach((q: any) => {
        const questionGroup = this.fb.group({
          questionText: [q.questionText, Validators.required],
          correctAnswer: [q.correctAnswer],
          answers: this.fb.array(q.answers.map((a: any) => this.fb.group({
            answerText: [a, Validators.required],
            isCorrect: [a === q.correctAnswer]
          })))
        });
        questionArray.push(questionGroup);
      });
    }).catch((error: any) => {
      console.error('Failed to load quiz', error);
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    const questionGroup = this.fb.group({
      questionText: ['', Validators.required],
      correctAnswer: [''],
      answers: this.fb.array([
        this.createAnswerGroup(),
        this.createAnswerGroup()
      ])
    });
    this.questions.push(questionGroup);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  getAnswersControls(questionIndex: number): FormArray {
    return (this.questions.at(questionIndex).get('answers') as FormArray);
  }

  addAnswer(questionIndex: number): void {
    const answers = this.getAnswersControls(questionIndex);
    if (answers.length < 4) {
      answers.push(this.createAnswerGroup());
    }
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswersControls(questionIndex);
    if (answers.length > 2) {
      answers.removeAt(answerIndex);
    }
  }

  createAnswerGroup(): FormGroup {
    return this.fb.group({
      answerText: ['', Validators.required],
      isCorrect: [false]
    });
  }

  onCorrectAnswerChange(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswersControls(questionIndex);
    answers.controls.forEach((control, i) => {
      if (i !== answerIndex) {
        control.get('isCorrect')!.setValue(false);
      }
    });
  }

  onSubmit(): void {
    if (this.quizForm.valid) {
      const quizData = this.quizForm.value;
      this.quizService.updateQuiz(this.quizId, quizData).then(() => {
        this.router.navigate(['/my-quizzes']);
      }).catch((error: any) => {
        console.error('Failed to update quiz', error);
      });
    }
  }
}
