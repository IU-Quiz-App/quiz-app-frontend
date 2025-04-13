
export interface Question extends Item {
    course: string;
    text: string;
    public: "true" | "false";
    status: "created" | "waiting_for_approval" | "approved" | "rejected";
    created_at?: string;
    created_by?: string;
    answers: Answer[];
    timed_out_answers?: UserAnswer[];
}

export interface Answer extends Item {
    isTrue: boolean;
    text: string;
    explanation: string;
    user_answers?: UserAnswer[];
}

export interface Item {
    uuid?: string;
}

export interface GameSession {
    uuid: string;
    created_by: string;
    created_at: string;
    users: User[];
    questions?: Question[];
    started_at?: string;
    ended_at?: string;
    quiz_length?: number;
}

export interface UserAnswer {
    timed_out?: string;
    game_session_uuid: string;
    question_uuid: string;
    user_uuid: string;
    uuid: string;
    answered_at: string;
    answer: string;
    correct_answer: string;
}

export interface User {
    nickname: string;
    user_uuid: string;
}