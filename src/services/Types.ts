
export type Question = {
    uuid?: string;
    course: string;
    text: string;
    public: boolean;
    status: "created" | "waiting_for_approval" | "approved" | "rejected";
    created_at?: string;
    creator_by?: string;
    answers: Answer[];
}

export type Answer = {
    uuid?: string;
    isTrue: boolean;
    text: string;
    explanation: string;
}