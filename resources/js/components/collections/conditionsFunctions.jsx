
export function getParameter(parameter) {
    switch (parameter) {
        case '1':
            return 'Le nom';
        case '2':
            return 'Le type';
        case '3':
            return 'Le fournisseur';
        case '4':
            return 'Le prix';
        case '5':
            return 'La balise';
        case '6':
            return 'Le prix avant promo';
        case '7':
            return 'Le poids';
        case '8':
            return 'Le stock';
        case '9':
            return 'La date de création du produit';
        default:
            return '';
    }
}


export function getOperator(operator) {
    switch (operator) {
        case '1':
            return 'est égale à';
        case '2':
            return 'n\'est pas égale à';
        case '3':
            return 'est suppérieur à';
        case '4':
            return 'est infèrieur à';
        case '5':
            return 'commence par';
        case '6':
            return 'se termine par';
        case '7':
            return 'contient';
        case '8':
            return 'ne contient pas';
        case '9':
            return 'n\'est pas vide';
        case '10':
            return 'est vide';
        default:
            return '';
    }
}
