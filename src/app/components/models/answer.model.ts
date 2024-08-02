import { Question } from "./question.model";
import { User } from "./user.model";

export interface Answer {
    id: number;
    text: string;
    question: [Question];
    questionId: number;
    user?: User
    userId?: number;  // Optional because an answer might not be related to a user
  }
  