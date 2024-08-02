import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { QuizService } from "../../services/quiz.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-quiz-details",
  templateUrl: "./quiz-details.component.html",
  styleUrls: ["./quiz-details.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class QuizDetailsComponent implements OnInit {
  quizId: number = 0;
  answers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
  ) {}

  async ngOnInit() {
    this.quizId = +this.route.snapshot.paramMap.get("quizId")!;
    this.answers = await this.quizService.getQuizAnswers(this.quizId);
  }
}
