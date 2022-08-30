export function upperFirstLetter(str) {

    const capitalized = str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);

    return capitalized;
}