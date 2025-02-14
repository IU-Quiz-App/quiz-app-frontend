import axios from 'axios';
import config from './Config.ts';
import { Item, Question } from "./Types.ts";
import TestQuestions from "../__tests__/questions.json";

const apiClient = axios.create({
    baseURL: config.ApiURL,
    withCredentials: true,
});

apiClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export async function getQuestion(uuid: string): Promise<Question> {
    try {
        const response = await axios.get(`${config.ApiURL}/question/${uuid}`);
        console.log('Response data of one question:', response.data);
        return response.data as Question;
    } catch (error) {
        console.error('Failed to fetch question:', error);
        throw error;
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

export async function deleteQuestion(questionId: Item): Promise<void> {
    console.log(questionId);
}

export async function getAllQuestions(): Promise<Question[]> {
    try {
        const response = await axios.get(`${config.ApiURL}/questions?user_id=23479lsdfkjPhilipp`);
        return response.data as Question[];
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        return [];
    }
}