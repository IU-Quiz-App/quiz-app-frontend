
export interface Question extends Item {
    course: string;
    text: string;
    public: "true" | "false";
    status: "created" | "waiting_for_approval" | "approved" | "rejected";
    created_at?: string;
    creator_by?: string;
    answers: Answer[];
}

export interface Answer extends Item {
    isTrue: boolean;
    text: string;
    explanation: string;
}

export interface Item {
    uuid?: string;
}