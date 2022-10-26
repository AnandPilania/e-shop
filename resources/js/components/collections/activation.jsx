import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flatpickr from "react-flatpickr";
import Label from '../form/label';
// import "flatpickr/dist/themes/material_blue.css";


const Activation = () => {

    const { dateField, setDateField } = useContext(AppContext);

    return (
        <div>
            <div className="w-full h-auto flex flex-col justify-start items-start mb-2.5 p-5 shadow-sm bg-white rounded-md">
                <div className="w-full h-auto flex flex-col justify-start items-start">
                    <div className='w-full h-auto flex flex-col justify-start items-start'>
                        <Label label="Date d'activation" css="mb-2"/>
                        <Flatpickr
                            className="w-full h-10 pl-5 m-0 flex justify-start items-center border border-gray-300 rounded-md cursor-pointer bg-white hover:border-gray-400  bg-no-repeat bg-right-center bg-chevron-expand caret-transparent"
                            id="activationDate"
                            data-enable-time
                            placeholder={dateField}
                            position="auto center"
                            options={{
                                minDate: 'today',
                                altInput: false,
                                disableMobile: "true",
                                locale: {
                                    firstDayOfWeek: 1,
                                    weekdays: {
                                        shorthand: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
                                        longhand: [
                                            "dimanche",
                                            "lundi",
                                            "mardi",
                                            "mercredi",
                                            "jeudi",
                                            "vendredi",
                                            "samedi",
                                        ],
                                    },
                                    months: {
                                        shorthand: ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Déc"],
                                        longhand: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"]
                                    },
                                },
                                dateFormat: "d-m-Y H:i:s",
                                time_24hr: true,
                                minuteIncrement: 60
                            }}
                            value={""}
                            onChange={(selectedDates, dateStr, instance) => {
                                let day = selectedDates[0].getDate();
                                let month = selectedDates[0].getMonth() + 1;
                                let year = selectedDates[0].getFullYear();
                                let hour = selectedDates[0].getHours();
                                let minute = '00';
                                let seconde = '00';
                                let dateActivation =
                                    (day < 10 ? "0" + day.toString() : day) + "-" +
                                    (month < 10 ? "0" + month.toString() : month) + "-" + year + " " +
                                    (hour < 10 ? "0" + hour.toString() : hour) + ":" +
                                    (minute.toString()) + ":" +
                                    (seconde.toString());

                                setDateField(dateActivation);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Activation;
