import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserQuizzesComponent } from './components/user-quizzes/user-quizzes.component';
import { AnsweredQuizzesComponent } from './components/answered-quizzes/answered-quizzes.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { AppComponent } from './app.component';
import { EditQuizComponent } from './components/edit-quiz/edit-quiz.component';
import { ViewAnswersComponent } from './components/view-answers/view-answers.component';
import { AnswerQuizComponent } from './components/answer-quiz/answer-quiz.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
export const routes: Routes = [
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'my-quizzes', component: UserQuizzesComponent },
  { path: 'answered-quizzes', component: AnsweredQuizzesComponent },
  { path: 'create-quiz', component: CreateQuizComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'view-answers/:id', component: ViewAnswersComponent },
  { path: 'edit-quiz/:id', component: EditQuizComponent },
  { path: 'quizzes/:id/answer', component: AnswerQuizComponent },
  { path: '*', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
