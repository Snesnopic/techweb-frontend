import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AnsweredQuizzesComponent } from "./answered-quizzes.component";

describe("AnsweredQuizzesComponent", () => {
  let component: AnsweredQuizzesComponent;
  let fixture: ComponentFixture<AnsweredQuizzesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnsweredQuizzesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnsweredQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
