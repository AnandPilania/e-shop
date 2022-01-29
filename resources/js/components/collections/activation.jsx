import React, { useContext } from 'react';
import CollectionContext from '../contexts/CollectionContext';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const Activation = () => {

    const {
        dateField, setDateField
    } = useContext(CollectionContext);

    return (
        <div>
            <div className="div-vert-align">
                <div className="div-label-inputTxt">
                    <h2>Activation</h2>
                    <div className='sub-div-horiz-align'>
                        <div className='sub-div-vert-align'>
                            <p>Date</p>
                            <Flatpickr
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
                                    dateFormat: "d-m-Y H:00",
                                    time_24hr: true,
                                    minuteIncrement: 60
                                }}
                                value={""}
                                onChange={(selectedDates, dateStr, instance) => {
                                    let day = selectedDates[0].getDate();
                                    let month = selectedDates[0].getMonth() + 1;
                                    let year = selectedDates[0].getFullYear();
                                    let hour = selectedDates[0].getHours();
                                    let dateActivation =
                                        (day < 10 ? "0" + day.toString() : day) + "-" +
                                        (month < 10 ? "0" + month.toString() : month) + "-" + year + " " +
                                        (hour < 10 ? "0" + hour.toString() : hour) + ':00:00';
                                    setDateField(new Date(dateActivation).toISOString());
                                    localStorage.setItem("dateActivation", new Date(dateActivation).toISOString());
                                }}
                            />
                        </div>
                    </div>
                    <p> <a href='#'>Plus d'informations sur l'activation des collections.</a></p>
                </div>
            </div>
        </div>
    );
}

export default Activation;
