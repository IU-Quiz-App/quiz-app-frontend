import axios from 'axios';
import config from './Config.ts';
import {Answer, GameSession, Question, User} from "./Types.ts";

const apiClient = axios.create({
    baseURL: config.ApiURL,
    withCredentials: true,
});

export async function getUser(): Promise<User> {
    return {
        'name': 'Philipp'
    } as User;
}

export async function getQuestion(uuid: string): Promise<Question> {
    try {
        const response = await apiClient.get(`/question/${uuid}`);
        console.log('Response data of one question:', response.data);
        return response.data as Question;
    } catch (error) {
        console.error('Failed to fetch question:', error);
        throw error;
    }
}

export async function saveQuestion(question: Question): Promise<boolean> {
    try {
        const user = await getUser();
        question.created_by = user.name;
        const response = await apiClient.post(`/question`, question);
        console.log('Response data of saved question:', response.data);
        return true;
    } catch (error) {
        console.error('Failed to save question:', error);
        return false;
    }
}

export async function updateQuestion(question: Question): Promise<boolean> {
    try {
        question.created_by = '23479lsdfkjPhilipp';
        const response = await apiClient.put(`/question/${question.uuid}`, question);
        console.log('Response data of updated question:', response.data);
        return true;
    } catch (error) {
        console.error('Failed to update question:', error);
        return false;
    }
}

export async function deleteQuestion(uuid: string|null|undefined): Promise<void> {
    console.log("Delete question with uuid", uuid);

    if (!uuid) {
        console.error('Cannot delete question without uuid');
        return;
    }

    try {
        const response = await apiClient.delete(`/question/${uuid}`);
        console.log('Response data of one question:', response.data);
    } catch (error) {
        console.error('Failed to delete question:', error);
        throw error;
    }
}

export async function getAllQuestionsByUser(userId: string, page: number, pageSize: number): Promise<Question[]> {
    try {
        const response = await apiClient.get(`/questions?user_id=${userId}&page=${page}&page_size=${pageSize}`);
        console.log('Response data of questions:', response.data);
        return response.data.items as Question[];
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        return [];
    }
}

export async function getAllCourses(): Promise<string[]> {
    return ['TestKurs', 'Mathematik', 'Informatik', 'Physik', 'Chemie', 'Biologie', 'Geschichte', 'Geographie', 'Sport', 'Kunst', 'Musik'];
}

export async function createSession(): Promise<GameSession|null> {
    try {
        const user = await getUser();
        const created_by = user.name;
        const response = await apiClient.post(`/game/create-game-session`, {created_by});

        const session = response.data.session;
        return session as GameSession;
    } catch (error) {
        console.error('Failed to create game session:', error);
        return null;
    }
}

export async function getGameSession(uuid: string): Promise<GameSession> {
    return {
        uuid: uuid,
        created_by: 'Philipp',
        created_at: '2021-09-01T12:00:00Z',
        users: [
            {
                name: 'Philipp'
            },
            {
                name: 'Janna'
            },
            {
                name: 'Jannis'
            },
        ]
    }
}

export async function startGameSession(gameSession: GameSession, quizLength: number, course: string): Promise<boolean> {

    const uuid = gameSession.uuid;

    try {
        const response = await apiClient.post(`/game/start-game-session`, {
            uuid: uuid,
            quiz_length: quizLength,
            course_name: course
        });

        if (response.status === 200) {
            console.log('Game session started');
            return true;
        } else {
            console.error('Failed to start game session:', response);
            return false;
        }
    } catch (error) {
        console.error('Failed to start game session:', error);
        return false;
    }
}

export async function getNextQuestion(gameSession: GameSession): Promise<Question|'End of game'|null> {
    try {
        const response = await apiClient.get(`/game/next-question/${gameSession.uuid}`);
        console.log('Response data of next question:', response.data);

        if (response?.data?.info == 'End of game') {
            return 'End of game';
        }

        return response.data as Question;
    } catch (error) {
        console.error('Failed to fetch next question:', error);
        return null;
    }
}
export async function answerQuestion(gameSession: GameSession, question: Question, answer: Answer): Promise<Answer|null> {
    try {
        const user = await getUser();
        console.log('Answer question', answer);

        const response = await apiClient.post(`/game/answer-question`, {
            session_uuid: gameSession.uuid,
            question_uuid: question.uuid,
            user_uuid: user.name,
            answer: answer.uuid
        });

        if (response.status === 200) {
            console.log('Answered question');
            return question.answers.find((a) => a.isTrue) as Answer;
        } else {
            console.error('Failed to answer question:', response);
            return null;
        }
    } catch (error) {
        console.error('Failed to answer question:', error);
        return null;
    }
}

