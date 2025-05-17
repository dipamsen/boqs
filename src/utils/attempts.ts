export interface Attempt {
  quizId: string;
  userId: string;
  answers: AttemptAnswer[];
  inProgress: boolean;
}

export type AttemptWithId = Attempt & { id: string };

interface BaseAttemptAnswer {
  questionType: "MCQ" | "Numerical" | "Subjective";
  submitted: boolean;
  timeTaken: number | null; // in seconds
}

interface MCQAttemptAnswer extends BaseAttemptAnswer {
  questionType: "MCQ";
  input: number | null; // index of the selected option
}

interface NumericalAttemptAnswer extends BaseAttemptAnswer {
  questionType: "Numerical";
  input: number | null; // numerical answer
}

interface SubjectiveAttemptAnswer extends BaseAttemptAnswer {
  questionType: "Subjective";
}

type AttemptAnswer =
  | MCQAttemptAnswer
  | NumericalAttemptAnswer
  | SubjectiveAttemptAnswer;
