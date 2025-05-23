document.addEventListener('DOMContentLoaded', () => {
    const timetableDisplay = document.getElementById('timetable-display');
    const searchInput = document.getElementById('search-input');
    const currentTimetableTitle = document.getElementById('current-timetable-title');

    const navOrario3E = document.getElementById('nav-orario-3e');
    const navCreaOrario = document.getElementById('nav-crea-orario');
    const navMieiOrari = document.getElementById('nav-miei-orari');

    const sezioneVisualizzazione = document.getElementById('sezione-visualizzazione-orario');
    const sezioneCreaOrario = document.getElementById('sezione-crea-orario');
    const sezioneMieiOrari = document.getElementById('sezione-miei-orari');
    const allSections = [sezioneVisualizzazione, sezioneCreaOrario, sezioneMieiOrari];

    const createTimetableForm = document.getElementById('create-timetable-form');
    const newTimetableNameInput = document.getElementById('new-timetable-name');
    const timetableCreationGrid = document.getElementById('timetable-creation-grid');
    const cancelCreateBtn = document.getElementById('cancel-create-btn');

    const myTimetablesListDisplay = document.getElementById('my-timetables-list');

    let currentDisplayedTimetableData = null; // Per la ricerca

    // --- Funzioni di Navigazione ---
    function setActiveSection(sectionToShow) {
        allSections.forEach(section => {
            if (section.id === sectionToShow.id) {
                section.classList.add('active-section');
                section.classList.remove('hidden-section');
            } else {
                section.classList.add('hidden-section');
                section.classList.remove('active-section');
            }
        });
        // Aggiorna link attivi navbar
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        if (sectionToShow === sezioneVisualizzazione) {
            if (currentDisplayedTimetableData && currentDisplayedTimetableData.nome === orario3E.nome) {
                navOrario3E.classList.add('active');
            }
        } else if (sectionToShow === sezioneCreaOrario) {
            navCreaOrario.classList.add('active');
        } else if (sectionToShow === sezioneMieiOrari) {
            navMieiOrari.classList.add('active');
        }
    }

    navOrario3E.addEventListener('click', (e) => {
        e.preventDefault();
        displayTimetable(orario3E);
        setActiveSection(sezioneVisualizzazione);
        navOrario3E.classList.add('active');
        searchInput.value = ''; // Resetta la ricerca
    });

    navCreaOrario.addEventListener('click', (e) => {
        e.preventDefault();
        prepareCreateTimetableForm();
        setActiveSection(sezioneCreaOrario);
    });
    
    cancelCreateBtn.addEventListener('click', () => {
        displayTimetable(orario3E); // Torna all'orario 3E
        setActiveSection(sezioneVisualizzazione);
        navOrario3E.classList.add('active');
    });

    navMieiOrari.addEventListener('click', (e) => {
        e.preventDefault();
        loadAndDisplayMyTimetables();
        setActiveSection(sezioneMieiOrari);
    });

    // --- Funzioni di Visualizzazione Orario ---
    function renderTimetable(timetableData) {
        currentDisplayedTimetableData = timetableData; // Salva per la ricerca
        currentTimetableTitle.textContent = timetableData.nome || "Orario";
        timetableDisplay.innerHTML = ''; // Pulisce la visualizzazione precedente

        if (!timetableData || !timetableData.giorni) {
            timetableDisplay.innerHTML = '<p class="text-danger">Dati orario non validi o mancanti.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-bordered table-hover';

        // Header: Fasce orarie
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        const thDay = document.createElement('th');
        thDay.textContent = 'Giorno';
        thDay.scope = "col";
        headerRow.appendChild(thDay);

        fasceOrarieDef.forEach(fascia => {
            const th = document.createElement('th');
            th.scope = "col";
            if (fascia.isInterval) {
                th.innerHTML = `${fascia.nome}<br><small class="fascia-oraria">${fascia.inizio} - ${fascia.fine}</small>`;
                th.classList.add('interval-cell-header');
            } else {
                th.innerHTML = `${fascia.oraLabel}<br><small class="fascia-oraria">${fascia.inizio} - ${fascia.fine}</small>`;
            }
            headerRow.appendChild(th);
        });

        // Body: Giorni e Materie
        const tbody = table.createTBody();
        giorniSettimana.forEach(giorno => {
            const row = tbody.insertRow();
            row.dataset.day = giorno; // Per la ricerca
            const cellGiorno = row.insertCell();
            cellGiorno.textContent = giorno;
            cellGiorno.scope = "row";
            cellGiorno.style.fontWeight = "bold";

            const lezioniDelGiorno = timetableData.giorni[giorno] || [];
            let lezioneIdx = 0;

            fasceOrarieDef.forEach(fascia => {
                const cell = row.insertCell();
                if (fascia.isInterval) {
                    cell.textContent = "Intervallo";
                    cell.classList.add('interval-cell');
                    cell.colSpan = 1; // Assicurati che l'intervallo occupi una colonna
                } else {
                    // Trova la lezione per questa fascia oraria specifica
                    const lezioneCorrispondente = lezioniDelGiorno.find(l => l.ora === fascia.oraLabel);
                    if (lezioneCorrispondente) {
                        cell.textContent = lezioneCorrispondente.materia;
                        cell.dataset.subject = lezioneCorrispondente.materia;
                        cell.dataset.hour = fascia.oraLabel;
                        cell.dataset.time = fascia.inizio + " - " + fascia.fine;
                        cell.classList.add('subject-cell');
                    } else {
                        // Cella vuota se non c'è lezione (es. 7a ora non per tutti i giorni)
                        cell.textContent = '-';
                        cell.dataset.hour = fascia.oraLabel;
                         cell.dataset.time = fascia.inizio + " - " + fascia.fine;
                    }
                }
            });
        });

        timetableDisplay.appendChild(table);
        applySearchFilter(); // Applica filtro se c'è già del testo nella search bar
    }
    
    function displayTimetable(timetableData) {
        renderTimetable(timetableData);
        setActiveSection(sezioneVisualizzazione);
        // Aggiorna il link attivo della navbar
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        if (timetableData.nome === orario3E.nome) {
            navOrario3E.classList.add('active');
        }
    }

    // --- Funzionalità di Ricerca/Filtro ---
    searchInput.addEventListener('input', applySearchFilter);

    function applySearchFilter() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const rows = timetableDisplay.querySelectorAll('tbody tr');

        rows.forEach(row => {
            let rowVisible = false;
            if (!searchTerm) {
                rowVisible = true; // Mostra tutte le righe se la ricerca è vuota
                row.querySelectorAll('td.subject-cell').forEach(cell => cell.classList.remove('highlight'));
            } else {
                const day = row.dataset.day.toLowerCase();
                if (day.includes(searchTerm)) {
                    rowVisible = true;
                }

                const cells = row.querySelectorAll('td.subject-cell');
                cells.forEach(cell => {
                    cell.classList.remove('highlight'); // Rimuovi evidenziazione precedente
                    const subject = cell.dataset.subject ? cell.dataset.subject.toLowerCase() : '';
                    const hour = cell.dataset.hour ? cell.dataset.hour.toLowerCase() : '';
                    const time = cell.dataset.time ? cell.dataset.time.toLowerCase() : '';
                    
                    let cellMatches = false;
                    if (subject.includes(searchTerm) || hour.includes(searchTerm) || time.includes(searchTerm)) {
                        cellMatches = true;
                        rowVisible = true; // Se una cella matcha, la riga è visibile
                    }

                    if (cellMatches && searchTerm) { // Evidenzia solo se c'è un termine di ricerca
                        cell.classList.add('highlight');
                    }
                });
            }
            row.style.display = rowVisible ? '' : 'none';
        });
    }

    // --- Funzionalità "Crea Nuovo Orario" ---
    function prepareCreateTimetableForm() {
        newTimetableNameInput.value = ''; // Pulisci nome
        timetableCreationGrid.innerHTML = ''; // Pulisci griglia precedente

        const table = document.createElement('table');
        table.className = 'table table-bordered';
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        const thDay = document.createElement('th');
        thDay.textContent = 'Giorno';
        headerRow.appendChild(thDay);

        fasceOrarieDef.filter(f => !f.isInterval).forEach(fascia => { // Solo ore di lezione, no intervallo
            const th = document.createElement('th');
            th.innerHTML = `${fascia.oraLabel}<br><small>${fascia.inizio} - ${fascia.fine}</small>`;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        giorniSettimana.forEach(giorno => {
            const row = tbody.insertRow();
            const cellGiorno = row.insertCell();
            cellGiorno.textContent = giorno;
            cellGiorno.style.fontWeight = "bold";

            fasceOrarieDef.filter(f => !f.isInterval).forEach((fascia, index) => {
                const cell = row.insertCell();
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control form-control-sm';
                input.dataset.day = giorno;
                input.dataset.hourIndex = index; // Usa l'indice della fascia oraria (senza intervallo)
                input.dataset.oraLabel = fascia.oraLabel;
                input.dataset.fasciaOraria = `${fascia.inizio} - ${fascia.fine}`;
                // La 7a ora è speciale (indice 6 dopo aver filtrato l'intervallo)
                if (giorno !== "Giovedì" && fascia.oraLabel === "7ª") {
                     input.placeholder = "-"; // Opzionale
                     // input.disabled = true; // Potresti disabilitarla se non è Giovedì
                } else {
                    input.placeholder = `Materia ${fascia.oraLabel}`;
                }
                cell.appendChild(input);
            });
        });
        timetableCreationGrid.appendChild(table);
    }

    createTimetableForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const timetableName = newTimetableNameInput.value.trim();
        if (!timetableName) {
            alert("Per favore, inserisci un nome per l'orario.");
            return;
        }

        const newTimetableData = {
            nome: timetableName,
            giorni: {}
        };

        giorniSettimana.forEach(giorno => {
            newTimetableData.giorni[giorno] = [];
            const inputsForDay = timetableCreationGrid.querySelectorAll(`input[data-day="${giorno}"]`);
            inputsForDay.forEach(input => {
                const materia = input.value.trim();
                if (materia) { // Salva solo se c'è una materia inserita
                    newTimetableData.giorni[giorno].push({
                        ora: input.dataset.oraLabel,
                        fasciaOraria: input.dataset.fasciaOraria,
                        materia: materia
                    });
                }
            });
        });

        saveTimetableToLocalStorage(timetableName, newTimetableData);
        alert(`Orario "${timetableName}" salvato con successo!`);
        displayTimetable(newTimetableData); // Mostra il nuovo orario
        navMieiOrari.click(); // Vai alla lista per vederlo aggiunto
    });


    // --- Funzionalità "I Miei Orari" e LocalStorage ---
    const TIMETABLE_STORAGE_KEY_PREFIX = 'timetable_';

    function saveTimetableToLocalStorage(name, data) {
        localStorage.setItem(TIMETABLE_STORAGE_KEY_PREFIX + name, JSON.stringify(data));
    }

    function loadTimetablesFromLocalStorage() {
        const timetables = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(TIMETABLE_STORAGE_KEY_PREFIX)) {
                try {
                    timetables.push(JSON.parse(localStorage.getItem(key)));
                } catch (e) {
                    console.error("Errore nel parsing dell'orario da localStorage:", key, e);
                }
            }
        }
        return timetables;
    }

    function deleteTimetableFromLocalStorage(name) {
        localStorage.removeItem(TIMETABLE_STORAGE_KEY_PREFIX + name);
        loadAndDisplayMyTimetables(); // Ricarica la lista
        // Se l'orario cancellato era quello visualizzato, torna a 3E
        if (currentDisplayedTimetableData && currentDisplayedTimetableData.nome === name) {
            displayTimetable(orario3E);
             navOrario3E.classList.add('active');
        }
    }

    function loadAndDisplayMyTimetables() {
        myTimetablesListDisplay.innerHTML = ''; // Pulisci lista
        const savedTimetables = loadTimetablesFromLocalStorage();

        if (savedTimetables.length === 0) {
            myTimetablesListDisplay.innerHTML = '<p class="text-muted">Nessun orario personalizzato salvato.</p>';
            return;
        }

        savedTimetables.forEach(timetable => {
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

            const nameSpan = document.createElement('strong');
            nameSpan.textContent = timetable.nome;
            nameSpan.style.cursor = 'pointer';
            nameSpan.style.color = '#0d6efd';
            nameSpan.addEventListener('click', () => {
                displayTimetable(timetable);
                searchInput.value = ''; // Resetta ricerca
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.innerHTML = '<i class="bi bi-trash"></i> Elimina';
            deleteButton.addEventListener('click', () => {
                if (confirm(`Sei sicuro di voler eliminare l'orario "${timetable.nome}"?`)) {
                    deleteTimetableFromLocalStorage(timetable.nome);
                }
            });

            listItem.appendChild(nameSpan);
            listItem.appendChild(deleteButton);
            myTimetablesListDisplay.appendChild(listItem);
        });
    }

    // --- Inizializzazione ---
    displayTimetable(orario3E); // Mostra orario 3E all'avvio
    setActiveSection(sezioneVisualizzazione); // Imposta sezione visualizzazione come attiva
    navOrario3E.classList.add('active'); // Imposta link navbar attivo
});
