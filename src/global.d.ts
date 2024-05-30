declare global {
    interface Window {
        webkitSpeechRecognition?: any;
        SpeechRecognition?: any;
    }
}

declare namespace NodeJS {
    type Timeout = any;
}