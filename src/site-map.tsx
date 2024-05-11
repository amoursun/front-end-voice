
export const ENTRY_MAIN = 'main';
export const SITE_MAP_SOCKET_GROUP = {
    label: () => 'socket群聊',
    key: 'socket-group',
    path: '/socket-group',
    entry: ENTRY_MAIN,
};
export const SITE_MAP_SPEECH_RECOGNITION = {
    entry: ENTRY_MAIN,
    key: 'speech-recognition',
    label: () => '语音识别',
    path: '/speech-recognition',
};

export const SITE_MAP_SPEECH_SYNTHESIS = {
    entry: ENTRY_MAIN,
    key: 'speech-synthesis',
    label: () => '语音合成',
    path: '/speech-synthesis',
};

export const SITE_MAP_MEDIA_DEVICE = {
    entry: ENTRY_MAIN,
    key: 'media-devices',
    label: () => '摄像头',
    path: '/media-devices',
};

export const SITE_MAP_AUDIO_CONTEXT = {
    entry: ENTRY_MAIN,
    key: 'audio-context',
    label: () => '网页 audio',
    path: '/audio-context',
};

export const SITE_MAP_IMG_VIDEO_PREVIEW = {
    entry: ENTRY_MAIN,
    key: 'audio-context',
    label: () => '图片视频上传预览',
    path: '/img-video-preview',
};

export const SITE_MAP_MEDIA_RECORDER = {
    entry: ENTRY_MAIN,
    key: 'media-recorder-api',
    label: () => 'MediaRecorder音频/视频录制',
    path: '/media-recorder-api',
};

// web worker
export const SITE_WEB_WORKER_SHARE = {
    entry: ENTRY_MAIN,
    key: 'web-worker-share',
    label: () => 'Web Worker - Share',
    path: '/web-worker/share',
};
export const SITE_MAP_WEB_WORKER = {
    entry: ENTRY_MAIN,
    key: 'web-worker',
    label: () => 'Web Worker',
    path: '/web-worker',
    children: [
        SITE_WEB_WORKER_SHARE,
    ],
};

export const SITE_MAP_MAIN = {
    label: () => '主菜单',
    entry: ENTRY_MAIN,
    path: '#',
    children: [
        SITE_MAP_SPEECH_RECOGNITION,
        SITE_MAP_SPEECH_SYNTHESIS,
        SITE_MAP_SOCKET_GROUP,
        SITE_MAP_MEDIA_DEVICE,
        SITE_MAP_AUDIO_CONTEXT,
        SITE_MAP_IMG_VIDEO_PREVIEW,
        SITE_MAP_MEDIA_RECORDER,
        SITE_MAP_WEB_WORKER,
    ],
};


