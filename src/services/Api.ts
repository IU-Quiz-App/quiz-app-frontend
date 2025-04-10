import axios from 'axios';
import config from './Config.ts';
import { GameSession, Question, User } from "./Types.ts";
import { InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../auth/AuthConfig.ts";
import { jwtDecode, JwtPayload } from "jwt-decode";

const msalInstance = new PublicClientApplication(msalConfig);

const apiClient = axios.create({
    baseURL: config.ApiURL,
    withCredentials: true,
});


msalInstance.initialize().then(() => {
    apiClient.interceptors.request.use(
        async (config) => {
            const token = await getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
});

export async function getDecodedToken(): Promise<any> {
    try {
        const token = await getToken();
        if (!token) {
            throw new Error("No token found");
        }

        const decodedToken = jwtDecode<JwtPayload>(token);
        return decodedToken;
    } catch (error) {
        console.error('Failed to decode token:', error);
        throw error;
    }
}

export async function getToken(): Promise<string> {
    try {
        const account = msalInstance.getActiveAccount();

        if (account) {
            try {
                const accessToken = await msalInstance.acquireTokenSilent({
                    account: account,
                    scopes: ["api://iu-quiz-be-dev/access_as_user"],
                });

                if (accessToken) {
                    return accessToken.accessToken;
                }
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    try {
                        await msalInstance.acquireTokenRedirect({
                            account: account,
                            scopes: ["api://iu-quiz-be-dev/access_as_user"],
                        });
                    } catch (redirectError) {
                        console.error('Failed to acquire token via redirect:', redirectError);
                        throw redirectError;
                    }
                } else {
                    console.error('Failed to acquire token silently:', error);
                    throw error;
                }
            }
        }
    } catch (error) {
        console.error('Failed to acquire token:', error);
        throw error;
    }

    return '';
}


export async function getUser(): Promise<User> {
    const token = await getDecodedToken();

    console.log(token);

    const firstName = token.name.split(' ')[0];

    return {
        'nickname': firstName as string,
        'user_uuid': token.oid as string,
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

export async function deleteQuestion(uuid: string | null | undefined, course: string | null | undefined): Promise<void> {
    console.log("Delete question with uuid", uuid, " and course", course);

    if (!uuid) {
        console.error('Cannot delete question without uuid');
        return;
    }
    if (!course) {
        console.error('Cannot delete question without course');
        return;
    }

    try {
        const response = await apiClient.delete(`/question/${uuid}?course=${course}`);
        console.log('Response data of one question:', response.data);
    } catch (error) {
        console.error('Failed to delete question:', error);
        throw error;
    }
}

export async function getAllQuestionsByUser(user: User, page: number, pageSize: number): Promise<{items: Question[], total: number}> {
    const userId = '23479lsdfkjPhilipp';

    console.log(`Getting all questions by user:${userId}`);

    try {
        const response = await apiClient.get(`/questions?user_id=${userId}&page=${page}&page_size=${pageSize}`);
        console.log('Response data of questions:', response.data);
        return {
            items: response.data.items as Question[],
            total: response.data.total_items as number,
        };
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        return {
            items: [],
            total: 0,
        }
    }
}

export async function getAllGameSessionsByUser(user: User, page: number, pageSize: number): Promise<{ items: GameSession[], total: number }> {
    const userId = 'Philipp';

    console.log(`Getting all game sessions by user:${userId}`);

    try {
        const response = await apiClient.get(`/game/game-sessions?user_id=${userId}&page=${page}&page_size=${pageSize}`);
        console.log('Response data of session:', response.data);

        return {
            items: response.data.items as GameSession[],
            total: response.data.total_items as number,
        }
    } catch (error) {
        console.error('Failed to fetch session:', error);
        return {
            items: [],
            total: 0,
        }
    }
}

export async function getAllCourses(): Promise<string[]> {
    return ['TestKurs', 'Mathematik', 'Informatik', 'Physik', 'Chemie', 'Biologie', 'Geschichte', 'Geographie', 'Sport', 'Kunst', 'Musik'];
}

export async function createSession(): Promise<GameSession | null> {
    try {
        const response = await apiClient.post(`/game/create-game-session`);

        const session = response.data.session;
        return session as GameSession;
    } catch (error) {
        console.error('Failed to create game session:', error);
        return null;
    }
}

export async function getGameSession(uuid: string): Promise<GameSession> {
    try {
        const response = await apiClient.get(`/game/game-session/${uuid}`);

        console.log('Response data of game session:', response.data);

        return response.data as GameSession;
    } catch (error) {
        console.error('Failed to fetch session:', error);
        throw error;
    }
}

