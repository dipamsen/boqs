export type BaseQuestion = {
  type: "MCQ" | "Numerical" | "Subjective";
  chapter: string;
  subject: string;
  grade: string;
  marks: number;
};

export interface MCQQuestion extends BaseQuestion {
  type: "MCQ";
  text: string;
  image: string | null;
  numOptions: number;
  options: string[] | null;
  answer: number; // index of the correct option
  solution: string | null;
  solutionImage: string | null;
}

export interface NumericalQuestion extends BaseQuestion {
  type: "Numerical";
  text: string;
  image: string | null;
  answer: number; // numerical answer
  solution: string | null;
  solutionImage: string | null;
}

export interface SubjectiveQuestion extends BaseQuestion {
  type: "Subjective";
  text: string;
  image: string | null;
  answer: string; // subjective answer
  solutionImage: string | null;
}

export type Question = MCQQuestion | NumericalQuestion | SubjectiveQuestion;

export type QuestionWithId = Question & { id: string };

export function validate(
  question: Question,
  qImage: File | null,
  sImage: File | null
): Question {
  if (!question.text && qImage === null) {
    throw new Error("Question text or image is required.");
  }
  if (!question.chapter) {
    throw new Error("Chapter is required.");
  }
  if (!question.subject) {
    throw new Error("Subject is required.");
  }
  if (!question.grade) {
    throw new Error("Grade is required.");
  }
  if (!question.marks) {
    throw new Error("Marks are required.");
  }
  if (question.type === "MCQ") {
    if (!question.numOptions) {
      throw new Error("Number of options is required for MCQ questions.");
    }
    if (
      Array.isArray(question.options) &&
      question.options.every((opt) => !opt) &&
      qImage !== null
    ) {
      question.options = null; // Assume: options are in the image
    }
    if (
      Array.isArray(question.options) &&
      question.options.length !== question.numOptions
    ) {
      throw new Error("All options are required for MCQ questions.");
    }
    if (
      Array.isArray(question.options) &&
      question.options.some((opt) => !opt)
    ) {
      throw new Error("All options must be filled for MCQ questions.");
    }
    if (question.answer < 0 || question.answer >= question.numOptions) {
      throw new Error("Answer must be a valid option index.");
    }
  } else if (question.type === "Numerical") {
    if (typeof question.answer !== "number") {
      throw new Error("Answer must be a number for Numerical questions.");
    }
  } else if (question.type === "Subjective") {
    if (!question.answer && !sImage) {
      throw new Error("Answer is required for Subjective questions.");
    }
  }
  return question;
}
