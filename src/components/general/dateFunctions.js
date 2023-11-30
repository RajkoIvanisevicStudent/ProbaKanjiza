// Funkcija prima datumski string i string formata datuma, od kojih kreira datumski objekat.

export function dateStringToObj(dateString, format) {

    console.log("Primio sam ovaj date string", dateString);
    let dateComponentValues = dateString.split('-'); // Na primer, "25-12-2023"
    let dateComponentNames = format.split('-'); // Na primer, "d-m-Y"
    let date = {};

    // Kreiramo objekat koji ima svojstva 'Y', 'm' i 'd'
    for (let i = 0; i <= 2; i++) {
        date[dateComponentNames[i]] = dateComponentValues[i];
    }
    if (
        !date.Y ||
        !date.m ||
        !date.d ||
        date.Y.length != 4 ||
        parseInt(date.m) < 1 ||
        parseInt(date.m) > 12 ||
        getDaysInMonth(date.Y, parseInt(date.m)) < parseInt(date.d) ||
        parseInt(date.d) < 1
    ) {
        return false;
    }

    // Kreiramo JS datumski objekat
    let dateObj = new Date(date.Y, date.m - 1, date.d);

    if (isValidDate(date.Y.toString() + '-' + date.m.toString() + '-' + date.d.toString())) {
        return dateObj;
    } else {
        return false;
    }
}

export function getDaysInMonth(year, month) {
    // Pošto redni broj meseca stiže u "ljudskom" formatu, potrebno je umanjiti ga za 1
    const date = new Date(year, month - 1, 0);
    return date.getDate();
}

export function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
}

export function getWeekNumber(date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Postavljanje vremena na početak dana
    targetDate.setDate(targetDate.getDate() + 4 - (targetDate.getDay() || 7)); // Pomeranje na prvi četvrtak
    const yearStart = new Date(targetDate.getFullYear(), 0, 1); // Prvi dan te godine
    const weekNumber = Math.ceil(((targetDate - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
}

export function getYearBasedOnWeek(date) {
    let year = null;
    const tempDate = new Date(date);
    const tempMonth = tempDate.getMonth() + 1;
    // Prvi dan nedelje može da bude i neki od poslednjih dana decembra. U tom slučaju, godinu koju ekstrahujemo iz datuma treba povećati za 1.
    if (tempMonth === 12 && getWeekNumber(tempDate) === 1) {
        year = tempDate.getFullYear() + 1;
    } else {
        year = tempDate.getFullYear();
    }
    return (year);
}

export function parseDate(dateString) {
    let year = dateString.substring(0, 4);
    let month = dateString.substring(5, 7);
    let day = dateString.substring(8, 10);
    let returnObj = {
        year: year,
        month: month,
        day: day,
    }
    return returnObj;
}


export function UTCSanitizedDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    const dateInUTCFormat = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

    console.log("Primio sam ovo", date);
    console.log("Vracam ovo", dateInUTCFormat.toISOString());

    return dateInUTCFormat.toISOString();
}