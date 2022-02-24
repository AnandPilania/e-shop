
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

    
    // récupère et formatte la date et l'heure de maintenant
    export function getNow() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        let minute = '00';
        let seconde = '00';
        var localDatetime =
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
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        let minute = '00';
        let seconde = '00';
        var localDatetime =
            year + '-' + 
            (month < 10 ? "0" + month.toString() : month) + "-" +
            (day < 10 ? "0" + day.toString() : day) + " " +
            (hour < 10 ? "0" + hour.toString() : hour) + ":" +
            (minute.toString()) + ":" +
            (seconde.toString());
        return localDatetime;
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