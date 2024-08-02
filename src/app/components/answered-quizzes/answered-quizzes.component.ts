import { Component, OnInit } from "@angular/core";
import { QuizService } from "../../services/quiz.service";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { CommonModule } from "@angular/common";
import { marked } from "marked";

@Component({
  selector: "app-answered-quizzes",
  templateUrl: "./answered-quizzes.component.html",
  styleUrls: ["./answered-quizzes.component.scss"],
  standalone: true,
  imports: [MatCardModule, MatListModule, CommonModule],
})
export class AnsweredQuizzesComponent implements OnInit {
  answeredQuizzes: any[] = [];
  groupedAnsweredQuizzes: any[] = [];

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadAnsweredQuizzes();
  }

  private async loadAnsweredQuizzes() {
    try {
      this.answeredQuizzes = await this.quizService.getQuizzesWithUserAnswers();
      this.groupAnsweredQuizzes();
    } catch (error) {
      console.error("Error loading answered quizzes", error);
    }
  }

  private groupAnsweredQuizzes() {
    const quizMap = new Map();

    this.answeredQuizzes.forEach((answer) => {
      const quizId = answer.Question.Quiz.id;
      if (!quizMap.has(quizId)) {
        quizMap.set(quizId, {
          quiz: {
            ...answer.Question.Quiz,
            descriptionHtml: marked(answer.Question.Quiz.description), // Convert Markdown to HTML
          },
          answers: [],
        });
      }
      quizMap.get(quizId).answers.push(answer);
    });

    this.groupedAnsweredQuizzes = Array.from(quizMap.values());
  }
}
