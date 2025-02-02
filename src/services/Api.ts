import axios from 'axios';
import config from './Config.ts';
import {Question} from "./Types.ts";

const apiClient = axios.create({
    baseURL: config.ApiURL,
    withCredentials: true,
    withXSRFToken: true,
});

apiClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export async function saveQuestion(question: Question): Promise<void> {
    console.log(question);
}