export default {
    ApiURL: import.meta.env.MODE === "development" ? "/api" : (import.meta.env.VITE_API_URL ?? "https://api.example.de"),
    BaseUrl: import.meta.env.BASE_URL,
};