import axios from 'axios';
import config from './Config.ts';
import {Question} from "./Types.ts";
import TestQuestions from "../__tests__/questions.json";

const apiClient = axios.create({
    baseURL: config.ApiURL,
    withCredentials: true,
    withXSRFToken: true,
});

apiClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export async function getQuestion(uuid: string): Promise<Question> {
    return TestQuestions[0] as Question;
}

export async function saveQuestion(question: Question): Promise<void> {
    console.log(question);
}

export async function updateQuestion(question: Question): Promise<void> {
    console.log(question);
}

export async function deleteQuestion(question: Question): Promise<void> {
    console.log(question);
}

export async function getAllQuestions(): Promise<Question[]> {

    return TestQuestions as Question[];
}