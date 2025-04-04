import {I18n, LocaleDict} from '@befe/lib-i18n';

export const i18n = new I18n();

type DictModule = Record<string, LocaleDict> & { default: LocaleDict };

export interface DictLoader {
    [locale: string]: () => Promise<DictModule>;
}

export async function loadI18nAssentsAsync(entryDict?: DictLoader) {
    if (!entryDict) {
        return;
    }

    const locale = i18n.locale;
    const result = await entryDict[locale]();

    i18n.extendLocaleDict(result.default);
}

export const t = i18n.t;
export const setLocale = (locale: string) => {
    i18n.setLocale(locale);
    window.location.reload();
};
