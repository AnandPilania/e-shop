import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const Activation = () => {

    const { dateField, setDateField } = useContext(AppContext);

    return (
        <div>
            <div className="div-vert-align">
                <div className="div-label-inputTxt">
                    <h2>Activation</h2>
                    <div className='sub-div-horiz-align-m'>
                        <div className='sub-div-vert-align'>
                            <p>Date</p>
                            <Flatpickr
                                className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"
                                id="activationDate"
                                data-enable-time
                                placeholder={dateField}
                                position="auto center"
                                options={{
                                    minDate: 'today',
                                    altInput: false,
                                    disableMobile: "true",
                                    locale: {
                                        weekdays: {
                                            shorthand: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
                                        },
                                        months: {
                                            shorthand: ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Déc"],
                                            longhand: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"]
                                        },
                                        firstDayOfWeek: 0,
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
        </div>
    );
}

export default Activation;
