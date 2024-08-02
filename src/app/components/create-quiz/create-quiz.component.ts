import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule, MatCheckboxModule]
})
export class CreateQuizComponent {
  quizForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      questions: this.fb.array([], this.questionsValidator()),
      maxErrors: [0, [Validators.required, Validators.min(0)]]
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
    this.updateAnswerValidators();
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    this.updateAnswerValidators();
  }

  getAnswersControls(questionIndex: number): FormArray {
    return (this.questions.at(questionIndex).get('answers') as FormArray);
  }

  addAnswer(questionIndex: number): void {
    const answers = this.getAnswersControls(questionIndex);
    if (answers.length < 4) {
      answers.push(this.createAnswerGroup());
      this.updateAnswerValidators();
    }
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswersControls(questionIndex);
    if (answers.length > 2) {
      answers.removeAt(answerIndex);
      this.updateAnswerValidators();
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

  async onSubmit(): Promise<void> {
    if (this.quizForm.valid) {
      try {
        const quizData = this.prepareQuizData();
        await this.quizService.createQuiz(quizData);
        this.router.navigate(['/my-quizzes']);
      } catch (error) {
        console.error('Quiz creation failed', error);
      }
    } else {
      console.warn('Form is not valid');
    }
  }

  private prepareQuizData(): any {
    const quizFormValue = this.quizForm.value;
    const questions = quizFormValue.questions.map((question: any) => {
      const correctAnswer = question.correctAnswer.trim() || question.answers.find((a: any) => a.isCorrect)?.answerText || '';
      return {
        questionText: question.questionText,
        correctAnswer: correctAnswer, // Ensure correctAnswer is correctly set
        answers: question.answers.map((a: any) => a.answerText)
      };
    });

    return {
      title: quizFormValue.title,
      description: quizFormValue.description,
      questions
    };
  }

  updateAnswerValidators(): void {
    this.questions.controls.forEach((questionGroup) => {
      const correctAnswerControl = questionGroup.get('correctAnswer');
      const answersArray = questionGroup.get('answers') as FormArray;

      if (correctAnswerControl!.value.trim()) {
        // Open answer is provided, disable answers array validators
        answersArray.controls.forEach((answerGroup) => {
          answerGroup.get('answerText')!.clearValidators();
          answerGroup.get('isCorrect')!.clearValidators();
          answerGroup.get('answerText')!.updateValueAndValidity();
          answerGroup.get('isCorrect')!.updateValueAndValidity();
        });
      } else {
        // No open answer, ensure validators are set
        answersArray.controls.forEach((answerGroup) => {
          answerGroup.get('answerText')!.setValidators(Validators.required);
          answerGroup.get('isCorrect')!.setValidators(Validators.required);
          answerGroup.get('answerText')!.updateValueAndValidity();
          answerGroup.get('isCorrect')!.updateValueAndValidity();
        });
      }
    });
  }

  questionsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const questions = control as FormArray;
  
      if (questions.length === 0) {
        return { 'noQuestions': true };
      }
  
      let valid = true;
      for (const question of questions.controls) {
        const correctAnswer = question.get('correctAnswer')!.value;
        const answers = question.get('answers') as FormArray;
  
        if (correctAnswer && correctAnswer.trim() !== '') {
          // Open answer case, skip answers validation
          continue;
        }
  
        // Validate answers
        const nonEmptyAnswers = answers.controls.filter(a => a.get('answerText')?.value.trim() !== '');
        const hasCorrectAnswer = nonEmptyAnswers.some(a => a.get('isCorrect')?.value);
        
        if (nonEmptyAnswers.length < 2 || !hasCorrectAnswer) {
          valid = false;
          break;
        }
      }
  
      return valid ? null : { 'invalidQuestions': true };
    };
  }
}
