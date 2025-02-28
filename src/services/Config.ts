export default {
    ApiURL: import.meta.env.MODE === "development" ? "/api" : (import.meta.env.VITE_API_URL ?? "https://api.dev.iu-quiz.de"),
    WebsocketURL: import.meta.env.MODE === "development" ? "/wss" : (import.meta.env.VITE_API_URL ?? "wss://ws.dev.iu-quiz.de"),
    BaseUrl: import.meta.env.BASE_URL,
};