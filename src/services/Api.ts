import axios from 'axios';
import config from './Config.ts';
import { Question } from "./Types.ts";
//import TestQuestions from "../__tests__/questions.json";

const apiClient = axios.create({
    baseURL: config.ApiURL,
    withCredentials: true,
});

apiClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export async function getQuestion(uuid: string): Promise<Question> {
    axios.get(`${config.ApiURL}/question/${uuid}`, { uuid: uuid } as never)
        .then((response) => {
            return response.data as Question;
        });

    return undefined as never;
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

    //    axios.get(`${config.ApiURL}/questions?user_id=23479lsdfkjPhilipp`)
    //        .then((response) => {
    //            console.log('Received response:', response);
    //            console.log('Received response.data:', response.data);
    //            return response.data as Question;
    //        });
    //
    //    return undefined as never;
    try {
        const response = await axios.get(`${config.ApiURL}/questions?user_id=23479lsdfkjPhilipp`);
        console.log('Received response:', response);
        console.log('Received response.data:', response.data);
        return response.data as Question[];
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        return [];
    }
}