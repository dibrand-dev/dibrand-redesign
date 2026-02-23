import 'server-only'

const dictionaries = {
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
    es: () => import('@/dictionaries/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
    const dictionary = dictionaries[locale as keyof typeof dictionaries];
    return dictionary ? dictionary() : dictionaries['en']();
}
