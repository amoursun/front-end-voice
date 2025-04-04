/**
 * @todo [sack] 待完善与整理提炼
 */
import {API_CONTEXT, WEB_CONTEXT, IS_DEV} from 'src/constants';
import { StringIndexedObject } from 'src/types';


type Href = string;

interface UrlUtilsConfig {
    base?: string;
    pagePath?: string;
    webContext?: string;
    apiContext?: string;
}

function getBaseFromUrl(url: string) {
    const execResult = /https?:\/\/[^/]+/.exec(url);
    return execResult && execResult[0] || '';
}

function ensureSlashSyntax(path: string) {
    if (path) {
        if (path.substr(0, 1) !== '/') {
            path = '/' + path;
        }
        if (path.substr(-1) === '/') {
            path = path.substring(0, -1);
        }
        return path;
    }
    return '';
}

function ensureLeadingSlash(path: string) {
    if (path) {
        if (path.substr(0, 1) !== '/') {
            path = '/' + path;
        }
        return path;
    }
    return '';
}

function getQueryString(query: StringIndexedObject) {
    if (!query) {
        return '';
    }

    const queryParts: string[] = [];
    for (const key in query) {
        // 如果 query[key] 为 undefined, 则使用 &key& 的形式生成 query string
        if (typeof query[key] === 'undefined') {
            queryParts.push(encodeURIComponent(key));
        } else {
            queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
        }
    }
    return queryParts.length ? '?' + queryParts.join('&') : '';
}

function resolveQueryString(queryString: string) {
    if (!queryString || typeof queryString !== 'string') {
        return {};
    }

    const queryParts = queryString.split('&');
    const query: StringIndexedObject = {};
    queryParts.forEach(
        part => {
            const [rawKey, rawValue] = part.split('=');
            if (typeof rawValue === 'string') {
                query[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue);
            }
        }
    );
    return query;
}

export function parsePageUrl(url = window.location.href) {
    const urlRgx = new RegExp(
        [
            // 保证匹配到常用协议，但是忽略将其单独分组
            // base #1
            '((?:file|https?):\\/\\/\\/?[^/]+)',

            // fullPath #2
            '(.*?)',

            // module (entry) #3
            '\\/([^/.]+)\\.html',

            // queryString #4
            '(?:\\?([^#]+))?',

            '(?:#',
            [
                // hashPath #4
                '([^?]+)',

                // hashQueryString #6
                '(?:\\?(.+))?',
            ].join(''),
            ')?',
        ].join('')
    );

    const urlMatch = urlRgx.exec(url);

    let fullMatchString = '';
    let base = '';
    let fullPath = '';
    let queryString = '';
    let entry = '';
    let hashPath = '';
    let hashQueryString = '';


    if (urlMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [fullMatchString, base, fullPath, entry, queryString, hashPath, hashQueryString] = urlMatch;

        return {
            base,
            fullPath,
            query: resolveQueryString(queryString),
            entry,
            hashPath,
            hashQuery: resolveQueryString(hashQueryString),
        };
    } else if (IS_DEV) {
        console.warn(`UrlUtils: ${url} cannot be resolved against`, urlRgx);
    }

    return null;
}

interface PageLinkOption {
    entry?: string;
    query?: StringIndexedObject;
    shouldReturnFullPath?: boolean;
}

interface UrlUtils {
    getApiLink: (path: string, query: StringIndexedObject) => Href;
    getPageLink: (
        hashPath: string,
        hashQuery?: StringIndexedObject,
        pageLinkOption?: PageLinkOption,
    ) => Href;
    jump: (
        hashPath: string,
        hashQuery?: StringIndexedObject,
        pageLinkOption?: PageLinkOption,
    ) => void;
    open: (
        hashPath: string,
        hashQuery?: StringIndexedObject,
        pageLinkOption?: PageLinkOption,
    ) => void;
}

// @todo [sack] 待完善与整理提炼
export const createUrlUtils = (
    {
        base,
        pagePath = '',
        webContext = '',
        apiContext = '',
    }: UrlUtilsConfig = {}
): UrlUtils => {
    apiContext = ensureSlashSyntax(apiContext);
    webContext = ensureSlashSyntax(webContext);

    if (!base) {
        base = location.origin || getBaseFromUrl(location.href);
    }

    if (pagePath) {
        pagePath = ensureSlashSyntax(pagePath);
    } else {
        const pagePathRgx = new RegExp(
            'https?:\\/\\/[^/]+'
            + webContext
            + '(\\/.*)?'
            + '\\/[^/]+\\.html'
        );
        const pagePathMatch = pagePathRgx.exec(location.href);
        if (pagePathMatch) {
            pagePath = pagePathMatch[1] || '';
        } else if (IS_DEV) {
            console.warn('无法抽取默认的 page path ! 所用的 reg exp 为', pagePathRgx);
        }
    }

    const getApiLink: UrlUtils['getApiLink'] = (path, query) => {
        const queryString = getQueryString(query);

        if (/^https?:\/\/[^/]/.test(`${path}`)) {
            return path;
        }

        path = ensureLeadingSlash(path);
        return `${base!}${apiContext}${path}${queryString}`;
    };

    const getPageLink: UrlUtils['getPageLink'] = (
        hashPath: string,
        hashQuery = {},
        {
            entry,
            query = {},
            shouldReturnFullPath = false,
        } = {}
    ) => {
        hashPath = ensureLeadingSlash(hashPath);
        const hashQueryString = getQueryString(hashQuery);
        const queryString = getQueryString(query);

        if (!entry && !queryString && !shouldReturnFullPath) {
            return `#${hashPath}${hashQueryString}`;
        }

        const urlInfo = parsePageUrl();
        const entryName = entry || (urlInfo && urlInfo.entry) || '';
        return `${base!}${webContext}${pagePath}/${entryName}.html${queryString}#${hashPath}${hashQueryString}`;
    };

    // hash 路由跳转
    const jump = (hashPath: string, hashQuery = {}, pageLinkOption = {}) => {
        window.location.href = getPageLink(hashPath, hashQuery, pageLinkOption);
    };

    const open = (hashPath: string, hashQuery = {}, pageLinkOption = {}) => {
        window.open(getPageLink(hashPath, hashQuery, pageLinkOption));
    };

    return {
        getApiLink,
        getPageLink,
        jump,
        open,
    };
};

export const urlUtils = createUrlUtils({
    webContext: WEB_CONTEXT,
    apiContext: API_CONTEXT,
});
