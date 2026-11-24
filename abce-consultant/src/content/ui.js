/**
 * Interface strings, in both locales.
 *
 * Everything the interface says — as opposed to page copy, which lives with
 * the page — is defined here so a new control cannot be added in one
 * language only. `t(locale)` returns a flat lookup for the build.
 */
export const UI = {
  en: {
    'skip.main': 'Skip to main content',
    'nav.main': 'Main',
    'nav.mobile': 'Mobile',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',
    'nav.home': 'home',
    'cta.quote': 'Request a quotation',
    'footer.site': 'Site',
    'footer.capability': 'Capability',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    'footer.credits': 'Photography credits',
    'toTop': 'Back to top',
    'breadcrumb': 'Breadcrumb',

    'theme.label': 'Colour theme',
    'theme.toLight': 'Switch to light theme',
    'theme.toDark': 'Switch to dark theme',

    'lang.label': 'Language',
    'lang.en': 'English',
    'lang.pt': 'Português',
    'lang.switchTo': 'Ver em português',

    'cat.searchLabel': 'Search the catalogue',
    'cat.searchPlaceholder': 'Try “flanges”, “shackles” or “bitumen”',
    'cat.all': 'All products',
    'cat.none': 'Nothing matches that search.',
    'cat.noneHint': 'Try a shorter word, or browse a stream above. If we have not listed it, ask anyway — the catalogue is not exhaustive.',
    'cat.clear': 'Clear search',
    'cat.resultsOne': 'item matches',
    'cat.resultsMany': 'items match',
    'cat.showing': 'Showing',
    'cat.of': 'of',

    'req.add': 'Add',
    'req.added': 'Added',
    'req.remove': 'Remove',
    'req.openList': 'Your request',
    'req.title': 'Your quotation request',
    'req.empty': 'Nothing added yet.',
    'req.emptyHint': 'Add items from the catalogue and they will be listed here, ready to send with your enquiry.',
    'req.clearAll': 'Clear list',
    'req.send': 'Continue to the form',
    'req.sentTo': 'These items will be written into the message on the contact form.',
    'req.addedToForm': 'Your request list has been written into the message below. Add quantities and anything else we should know.',
    'req.close': 'Close',
    'req.itemAdded': 'added to your request',
    'req.itemRemoved': 'removed from your request',
  },

  pt: {
    'skip.main': 'Saltar para o conteúdo principal',
    'nav.main': 'Principal',
    'nav.mobile': 'Telemóvel',
    'nav.open': 'Abrir menu',
    'nav.close': 'Fechar menu',
    'nav.home': 'início',
    'cta.quote': 'Pedir cotação',
    'footer.site': 'Site',
    'footer.capability': 'Capacidades',
    'footer.contact': 'Contacto',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.credits': 'Créditos fotográficos',
    'toTop': 'Voltar ao topo',
    'breadcrumb': 'Percurso',

    'theme.label': 'Tema de cor',
    'theme.toLight': 'Mudar para tema claro',
    'theme.toDark': 'Mudar para tema escuro',

    'lang.label': 'Idioma',
    'lang.en': 'English',
    'lang.pt': 'Português',
    'lang.switchTo': 'View in English',

    'cat.searchLabel': 'Pesquisar no catálogo',
    'cat.searchPlaceholder': 'Experimente “flanges”, “manilhas” ou “betume”',
    'cat.all': 'Todos os produtos',
    'cat.none': 'Nada corresponde a essa pesquisa.',
    'cat.noneHint': 'Experimente uma palavra mais curta, ou percorra uma linha acima. Se não estiver listado, pergunte na mesma — o catálogo não é exaustivo.',
    'cat.clear': 'Limpar pesquisa',
    'cat.resultsOne': 'artigo corresponde',
    'cat.resultsMany': 'artigos correspondem',
    'cat.showing': 'A mostrar',
    'cat.of': 'de',

    'req.add': 'Adicionar',
    'req.added': 'Adicionado',
    'req.remove': 'Remover',
    'req.openList': 'O seu pedido',
    'req.title': 'O seu pedido de cotação',
    'req.empty': 'Ainda não adicionou nada.',
    'req.emptyHint': 'Adicione artigos a partir do catálogo e aparecerão aqui, prontos a enviar com o seu pedido.',
    'req.clearAll': 'Limpar lista',
    'req.send': 'Continuar para o formulário',
    'req.sentTo': 'Estes artigos serão escritos na mensagem do formulário de contacto.',
    'req.addedToForm': 'A sua lista de pedido foi escrita na mensagem abaixo. Acrescente quantidades e tudo o mais que devamos saber.',
    'req.close': 'Fechar',
    'req.itemAdded': 'adicionado ao seu pedido',
    'req.itemRemoved': 'removido do seu pedido',
  },
};

export const LOCALES = ['en', 'pt'];
export const DEFAULT_LOCALE = 'en';

/** Lookup for one locale. Throws on a missing key so a gap cannot ship. */
export function t(locale) {
  const dict = UI[locale];
  if (!dict) throw new Error(`[i18n] unknown locale "${locale}"`);
  return (key) => {
    if (!(key in dict)) throw new Error(`[i18n] missing "${key}" for locale "${locale}"`);
    return dict[key];
  };
}
