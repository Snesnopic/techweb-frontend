import { Question } from "./question.model";
import { User } from "./user.model";

export interface Quiz {
  id: number;
  title: string;
  description: string;
  user?: [User];
  userId: number;
  questions: [Question];
  createdAt: Date;
}
