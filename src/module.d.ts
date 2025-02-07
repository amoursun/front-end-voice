
interface Style {
    use: ({target: HTMLDivElement}) => void;
    unuse: ({target: HTMLDivElement}) => void;
}

declare module '*.css' {
    const classes: string;
    export default classes;
}

declare module '*.lazy.less' {
    const classes: string;
    export default classes;
}

declare module '*.mod.less' {
    const classes: {[className: string]: string};
    export default classes;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.json' {
    const content: Record<string, any>;
    export default content;
}

declare module 'local-ip' {
    const getLocalIP: (
        iface: string | null,
        callback: (error: null | Error, ip: string) => void
    ) => void;
    export default getLocalIP;
}
