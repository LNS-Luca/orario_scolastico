const orario3E = {
    nome: "Orario 3E",
    giorni: {
        "Lunedì": [
            { ora: "1ª", fasciaOraria: "8:00 - 8:50", materia: "SCIENZE" },
            { ora: "2ª", fasciaOraria: "8:50 - 9:40", materia: "INGLESE" },
            { ora: "3ª", fasciaOraria: "9:40 - 10:30", materia: "MAT-FIS" },
            { ora: "4ª", fasciaOraria: "10:30 - 11:20", materia: "MAT-FIS" },
            // Intervallo 11:20 - 11:30
            { ora: "5ª", fasciaOraria: "11:30 - 12:20", materia: "STORIA" },
            { ora: "6ª", fasciaOraria: "12:20 - 13:10", materia: "ITA-LAT" }
        ],
        "Martedì": [
            { ora: "1ª", fasciaOraria: "8:00 - 8:50", materia: "DIS&ARTE" },
            { ora: "2ª", fasciaOraria: "8:50 - 9:40", materia: "FIL+COD" },
            { ora: "3ª", fasciaOraria: "9:40 - 10:30", materia: "ITA-LAT" },
            { ora: "4ª", fasciaOraria: "10:30 - 11:20", materia: "FILOS" },
            // Intervallo 11:20 - 11:30
            { ora: "5ª", fasciaOraria: "11:30 - 12:20", materia: "MAT-FIS" },
            { ora: "6ª", fasciaOraria: "12:20 - 13:10", materia: "STORIA" }
        ],
        "Mercoledì": [
            { ora: "1ª", fasciaOraria: "8:00 - 8:50", materia: "ITA-LAT" },
            { ora: "2ª", fasciaOraria: "8:50 - 9:40", materia: "ARTE+COD" },
            { ora: "3ª", fasciaOraria: "9:40 - 10:30", materia: "ITA-LAT" },
            { ora: "4ª", fasciaOraria: "10:30 - 11:20", materia: "SCIENZE" },
            // Intervallo 11:20 - 11:30
            { ora: "5ª", fasciaOraria: "11:30 - 12:20", materia: "FISICA +LAB" },
            { ora: "6ª", fasciaOraria: "12:20 - 13:10", materia: "INGLESE" }
        ],
        "Giovedì": [
            { ora: "1ª", fasciaOraria: "8:00 - 8:50", materia: "SC. MOT" },
            { ora: "2ª", fasciaOraria: "8:50 - 9:40", materia: "MAT-FIS" },
            { ora: "3ª", fasciaOraria: "9:40 - 10:30", materia: "MAT-FIS" },
            { ora: "4ª", fasciaOraria: "10:30 - 11:20", materia: "ITA-LAT" },
            // Intervallo 11:20 - 11:30
            { ora: "5ª", fasciaOraria: "11:30 - 12:20", materia: "SC LAB" },
            { ora: "6ª", fasciaOraria: "12:20 - 13:10", materia: "CODING" },
            { ora: "7ª", fasciaOraria: "13:10 - 14:00", materia: "FILOS" }
        ],
        "Venerdì": [
            { ora: "1ª", fasciaOraria: "8:00 - 8:50", materia: "ITA-LAT" },
            { ora: "2ª", fasciaOraria: "8:50 - 9:40", materia: "ITA-LAT" },
            { ora: "3ª", fasciaOraria: "9:40 - 10:30", materia: "INGLESE" },
            { ora: "4ª", fasciaOraria: "10:30 - 11:20", materia: "SC. MOT" },
            // Intervallo 11:20 - 11:30
            { ora: "5ª", fasciaOraria: "11:30 - 12:20", materia: "IRC+VUOLO" },
            { ora: "6ª", fasciaOraria: "12:20 - 13:10", materia: "MAT-FIS" }
        ]
    }
};

// Definizioni globali usate in script.js
const fasceOrarieDef = [
    { oraLabel: "1ª", nome: "Prima Ora", inizio: "8:00", fine: "8:50" },
    { oraLabel: "2ª", nome: "Seconda Ora", inizio: "8:50", fine: "9:40" },
    { oraLabel: "3ª", nome: "Terza Ora", inizio: "9:40", fine: "10:30" },
    { oraLabel: "4ª", nome: "Quarta Ora", inizio: "10:30", fine: "11:20" },
    { nome: "Intervallo", inizio: "11:20", fine: "11:30", isInterval: true },
    { oraLabel: "5ª", nome: "Quinta Ora", inizio: "11:30", fine: "12:20" },
    { oraLabel: "6ª", nome: "Sesta Ora", inizio: "12:20", fine: "13:10" },
    { oraLabel: "7ª", nome: "Settima Ora", inizio: "13:10", fine: "14:00" } // Presente solo il giovedì nell'orario 3E
];

const giorniSettimana = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];
