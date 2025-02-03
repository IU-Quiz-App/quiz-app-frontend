
export type Question = {
    id?: number;
    course: string;
    text: string;
    answers: Answer[];
}

export type Answer = {
    uuid?: string;
    isTrue: boolean;
    text: string;
    explanation: string;
}