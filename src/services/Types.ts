
export type Question = {
    id?: number;
    course: string;
    text: string;
    answers: Answer[];
    correctAnswer: 1 | 2 | 3 | 4;
}

export type Answer = {
    text: string;
    explanation: string;
}