
export const getReplacedTemplate = (template, substitutions) => {

    if (!substitutions?.length) return template;

    let result = `${template}`;

    substitutions.forEach(s => {
        result = result.replaceAll(s.searchText, s.replaceWith);
    });

    return result;
}
