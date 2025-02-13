import axios from 'axios';
import config from './Config.ts';
import { Question } from "./Types.ts";
import TestQuestions from "../__tests__/questions.json";

const apiClient = axios.create({
    baseURL: config.ApiURL,
    withCredentials: true,
});

apiClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

//export async function getQuestion(uuid: string): Promise<Question> {
//    axios.get(`${config.ApiURL}/question`, { uuid: uuid } as never)
//        .then((response) => {
//            return response.data as Question;
//        });
//
//    return undefined as never;
//}

export async function getQuestion(uuid: string): Promise<Question> {
    try {
        const response = await apiClient.get<Question>(`/question/${uuid}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching question:", error);
        throw error; // Falls das UI mit dem Fehler umgehen soll
    }
}

export async function saveQuestion(question: Question): Promise<void> {
    axios.post(`${config.ApiURL}/question`, question)
        .then((response) => {
            console.log(response.data);
        });
}

export async function updateQuestion(question: Question): Promise<void> {
    console.log(question);
}

export async function deleteQuestion(question: Question): Promise<void> {
    console.log(question);
}

export async function getAllQuestions(): Promise<Question[]> {

    return TestQuestions as unknown as Question[];
}