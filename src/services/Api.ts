import axios from 'axios';
import config from './Config.ts';
import { Item, Question } from "./Types.ts";

const apiClient = axios.create({
    baseURL: config.ApiURL,
    withCredentials: true,
});

apiClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

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
        question.created_by = '23479lsdfkjPhilipp';
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

export async function deleteQuestion(questionId: Item): Promise<void> {
    console.log(questionId);
}

export async function getAllQuestionsByUser(): Promise<Question[]> {
    try {
        const userId = '23479lsdfkjPhilipp';
        const response = await apiClient.get(`/questions?user_id=${userId}`);
        return response.data as Question[];
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        return [];
    }
}