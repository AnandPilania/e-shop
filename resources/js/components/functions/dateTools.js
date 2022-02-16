
    export function getOnlyDate(date) {
        if (date !== null) {
            var timsetamp = Date.parse(date);
            var toString = new Date(timsetamp);          
            var year = toString.getFullYear();
            var month = toString.getMonth() + 1;
            var day = toString.getDate();
            var onlyDate =
                (day < 10 ? "0" + day.toString() : day) + "-" +
                (month < 10 ? "0" + month.toString() : month) + "-" +
                year;
            return onlyDate;
        }
        return '';
    }


    // function getDateTime(date) {
    //     var now = new Date();
    //     var year = date.getFullYear();
    //     var month = date.getMonth() + 1;
    //     var day = date.getDate();
    //     var hour = date.getHours();
    //     let minute = date.getMinutes();
    //     let seconde = date.getSecondes();
    //     var onlyDate =
    //         (day < 10 ? "0" + day.toString() : day) + "-" +
    //         (month < 10 ? "0" + month.toString() : month) + "-" +
    //         year + ' ' +
    //         (hour < 10 ? "0" + hour.toString() : hour) + ":" +
    //         (minute.toString()) + ":" +
    //         (seconde.toString());
    //     return onlyDate;
    // }