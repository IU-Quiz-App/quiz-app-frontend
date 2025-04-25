import axios from 'axios';
import config from './Config.ts';
import {Course, GameSession, Question, User} from "./Types.ts";
import {InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { msalInstance} from "../auth/AuthConfig.ts";
import { jwtDecode, JwtPayload } from "jwt-decode";
import {Client} from "@microsoft/microsoft-graph-client";
import {
    AuthCodeMSALBrowserAuthenticationProvider
} from "@microsoft/microsoft-graph-client/lib/src/authentication/msal-browser";

const apiClient = axios.create({
    baseURL: config.ApiURL,
    withCredentials: true,
});

const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
    account: msalInstance.getActiveAccount(),
    interactionType: InteractionType.Popup,
    scopes: [
        "Group.Read.All",
        'User.Read',
        'openid',
        'profile',
        'User.ReadBasic.All',
        "Group.Read.All",
    ],
});

const graphClient = Client.initWithMiddleware({ authProvider: authProvider });


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
            return null;
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
                    scopes: [
                        "api://iu-quiz-be-dev/access_as_user",
                        "Group.Read.All",
                        'User.Read',
                        'openid',
                        'profile',
                        'User.ReadBasic.All',
                        "Group.Read.All",
                    ],
                });

                if (accessToken) {
                    return accessToken.accessToken;
                }
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    try {
                        await msalInstance.acquireTokenRedirect({
                            account: account,
                            scopes: [
                                "api://iu-quiz-be-dev/access_as_user",
                                "Group.Read.All",
                                'User.Read',
                                'openid',
                                'profile',
                                'User.ReadBasic.All',
                                "Group.Read.All",
                            ],
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

export async function getEphemeralToken(): Promise<string|undefined> {
    try {
        const response = await apiClient.get(`/authorization/token`);
        const token = response.data.token;
        return token;
    } catch (error) {
        console.error('Failed getting ephemeral token:', error);
        throw error;
    }
}


export async function getUser(): Promise<User> {
    const token = await getDecodedToken();

    if (!token) {
        return null;
    }

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
        const response = await apiClient.post(`/question`, {
            items: [question],
        });
        console.log('Response data of saved question:', response.data);
        return true;
    } catch (error) {
        console.error('Failed to save question:', error);
        return false;
    }
}

export async function updateQuestion(question: Question): Promise<boolean> {
    try {
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
        const response = await apiClient.delete(`/question/${uuid}`, {
            params: {
                course: course,
            },
        });

        console.log('Response data of one question:', response.data);
    } catch (error) {
        console.error('Failed to delete question:', error);
        throw error;
    }
}

export async function getAllQuestionsByUser(page: number, pageSize: number): Promise<{items: Question[], total: number}> {
    try {
        const response = await apiClient.get('/questions', {
            params: {
                page: page,
                page_size: pageSize,
            },
        });

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

export async function getAllGameSessionsByUser(page: number, pageSize: number): Promise<{ items: GameSession[], total: number }> {
    try {
        const response = await apiClient.get(`/game/game-sessions`, {
            params: {
                page: page,
                page_size: pageSize,
            },
        });

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

export async function getAllCourses(): Promise<Course[]> {
    const string = {
        securityEnabledOnly: true
    };

    const userGroupsResponse = await graphClient.api('/me/getMemberGroups')
        .post(string);

    const userGroupsIds = userGroupsResponse.value;
    const allGroupsResponse = await graphClient.api('/groups?$select=id,displayName,description').get();

    const allGroups = allGroupsResponse.value;

    const userGroups = allGroups.filter((group: any) => userGroupsIds.includes(group.id));

    return userGroups.map((group: any) => {
        return {
            uuid: group.id,
            name: group.displayName,
            description: group.description,
        } as Course;
    });
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

        return response.data as GameSession;
    } catch (error) {
        console.error('Failed to fetch session:', error);
        throw error;
    }
}

export async function joinGameSession(uuid: string): Promise<boolean> {
    try {
        const response = await apiClient.put(`/game/join-game-session`, {
            game_session_uuid: uuid,
        });

        console.log('Response data of joined game session:', response.data);

        return true;
    } catch (error) {
        if (error.response && error.response.status === 409) {
            console.error('Game session not found:', error);
            return true;
        }


        console.error('Failed to join game session:', error);
        throw error;
    }
}

