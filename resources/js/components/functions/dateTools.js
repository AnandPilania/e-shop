
export function getOnlyDate(date) {
    if (date !== null) {
        let timsetamp = Date.parse(date);
        let toString = new Date(timsetamp);
        let year = toString.getFullYear();
        let month = toString.getMonth() + 1;
        let day = toString.getDate();
        let onlyDate =
            (day < 10 ? "0" + day.toString() : day) + "-" +
            (month < 10 ? "0" + month.toString() : month) + "-" +
            year;
        return onlyDate;
    }
    return '';
}


// récupère et formatte la date et l'heure de maintenant
export function getNow() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = '00';
    let seconde = '00';
    let localDatetime =
        (day < 10 ? "0" + day.toString() : day) + "-" +
        (month < 10 ? "0" + month.toString() : month) + "-" +
        year + ' ' +
        (hour < 10 ? "0" + hour.toString() : hour) + ":" +
        (minute.toString()) + ":" +
        (seconde.toString());
    return localDatetime;
}

// récupère et formatte la date et l'heure de maintenant
export function getNowUs() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = '00';
    let seconde = '00';
    let localDatetime =
        year + '-' +
        (month < 10 ? "0" + month.toString() : month) + "-" +
        (day < 10 ? "0" + day.toString() : day) + " " +
        (hour < 10 ? "0" + hour.toString() : hour) + ":" +
        (minute.toString()) + ":" +
        (seconde.toString());
    return localDatetime;
}

export function getDateTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = '00';
    let seconde = '00';
    let localDatetime =
        (day < 10 ? "0" + day.toString() : day) + "-" +
        (month < 10 ? "0" + month.toString() : month) + "-" +
        year + ' ' +
        (hour < 10 ? "0" + hour.toString() : hour) + ":" +
        (minute.toString()) + ":" +
        (seconde.toString());
    return localDatetime;
}