import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AnswerQuizComponent } from "./answer-quiz.component";

describe("AnswerQuizComponent", () => {
  let component: AnswerQuizComponent;
  let fixture: ComponentFixture<AnswerQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerQuizComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
