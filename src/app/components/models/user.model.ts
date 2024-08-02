import { Answer } from "./answer.model";
import { Quiz } from "./quiz.model";

export interface User {
  id: number;
  username: string;
  password: string;
  quizzes: [Quiz];
  answers: [Answer];
}
