/// <reference types="vite/client" />

declare module '*.css';
declare module 'tippy.js';
declare module '*.svg' {
    const content: string;
    export default content;
}