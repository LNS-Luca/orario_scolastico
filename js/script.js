document.addEventListener('DOMContentLoaded', () => {
    const timetableDisplay = document.getElementById('timetable-display');
    const searchInput = document.getElementById('search-input');
    const currentTimetableTitle = document.getElementById('current-timetable-title');

    const mainNavbar = document.getElementById('main-navbar');
    const navOrario3E = document.getElementById('nav-orario-3e');
    const navCreaOrario = document.getElementById('nav-crea-orario');
    const navMieiOrari = document.getElementById('nav-miei-orari');
    const allNavLinks = document.querySelectorAll('#main-navbar .nav-link');


    const sezioneVisualizzazione = document.getElementById('sezione-visualizzazione-orario');
    const sezioneCreaOrario = document.getElementById('sezione-crea-orario');
    const sezioneMieiOrari = document.getElementById('sezione-miei-orari');
    const allSections = [sezioneVisualizzazione, sezioneCreaOrario, sezioneMieiOrari];

    const createTimetableForm = document.getElementById('create-timetable-form');
    const newTimetableNameInput = document.getElementById('new-timetable-name');
    const timetableCreationGrid = document.getElementById('timetable-creation-grid');
    const cancelCreateBtn = document.getElementById('cancel-create-btn');

    const myTimetablesListDisplay = document.getElementById('my-timetables-list');

    // Elementi Schermata Benvenuto
    const welcomeScreen = document.getElementById('welcome-screen');
    const welcomeBtnOrario3E = document.getElementById('welcome-orario-3e');
    const welcomeBtnCreaOrario = document.getElementById('welcome-crea-orario');
    const welcomeBtnMieiOrari = document.getElementById('welcome-miei-orari');

    let currentDisplayedTimetableData = null;

    // --- Gestione Schermata Iniziale ---
    function hideWelcomeScreenAndShowApp() {
        welcomeScreen.style.display = 'none';
        mainNavbar.style.display = 'flex'; // Mostra la navbar principale
        document.body.style.paddingTop = '70px'; // Ripristina padding per navbar fissa
    }

    // Controlla sessionStorage per vedere se l'utente ha già superato la welcome screen
    if (sessionStorage.getItem('welcomeScreenDismissed')) {
        hideWelcomeScreenAndShowApp();
        // Carica l'ultimo stato o l'orario 3E di default
        // Per semplicità, carichiamo l'orario 3E se non c'è altra logica di stato
        displayTimetable(orario3E);
        setActiveSection(sezioneVisualizzazione);
        setActiveNavLink(navOrario3E);
    } else {
        document.body.style.paddingTop = '0'; // Rimuovi padding per la welcome screen
    }


    welcomeBtnOrario3E.addEventListener('click', () => {
        hideWelcomeScreenAndShowApp();
        sessionStorage.setItem('welcomeScreenDismissed', 'true');
        displayTimetable(orario3E);
        setActiveSection(sezioneVisualizzazione);
        setActiveNavLink(navOrario3E);
    });

    welcomeBtnCreaOrario.addEventListener('click', () => {
        hideWelcomeScreenAndShowApp();
        sessionStorage.setItem('welcomeScreenDismissed', 'true');
        prepareCreateTimetableForm();
        setActiveSection(sezioneCreaOrario);
        setActiveNavLink(navCreaOrario);
    });

    welcomeBtnMieiOrari.addEventListener('click', () => {
        hideWelcomeScreenAndShowApp();
        sessionStorage.setItem('welcomeScreenDismissed', 'true');
        loadAndDisplayMyTimetables();
        setActiveSection(sezioneMieiOrari);
        setActiveNavLink(navMieiOrari);
    });


    // --- Funzioni di Navigazione ---
    function setActiveNavLink(activeLink) {
        allNavLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    function setActiveSection(sectionToShow) {
        allSections.forEach(section => {
            section.style.display = (section.id === sectionToShow.id) ? 'block' : 'none';
            if (section.id === sectionToShow.id) {
                section.classList.add('active-section');
                section.classList.remove('hidden-section');
            } else {
                section.classList.add('hidden-section');
                section.classList.remove('active-section');
            }
        });
    }

    navOrario3E.addEventListener('click', (e) => {
        e.preventDefault();
        displayTimetable(orario3E);
        setActiveSection(sezioneVisualizzazione);
        setActiveNavLink(navOrario3E);
        searchInput.value = '';
    });

    navCreaOrario.addEventListener('click', (e) => {
        e.preventDefault();
        prepareCreateTimetableForm();
        setActiveSection(sezioneCreaOrario);
        setActiveNavLink(navCreaOrario);
    });
    
    cancelCreateBtn.addEventListener('click', () => {
        displayTimetable(orario3E);
        setActiveSection(sezioneVisualizzazione);
        setActiveNavLink(navOrario3E);
    });

    navMieiOrari.addEventListener('click', (e) => {
        e.preventDefault();
        loadAndDisplayMyTimetables();
        setActiveSection(sezioneMieiOrari);
        setActiveNavLink(navMieiOrari);
    });

    // --- Funzioni di Visualizzazione Orario ---
    function renderTimetable(timetableData) {
        currentDisplayedTimetableData = timetableData;
        currentTimetableTitle.textContent = timetableData.nome || "Orario";
        timetableDisplay.innerHTML = '';

        if (!timetableData || !timetableData.giorni) {
            timetableDisplay.innerHTML = '<p class="text-danger">Dati orario non validi o mancanti.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-bordered table-hover';

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

        const tbody = table.createTBody();
        giorniSettimana.forEach(giorno => {
            const row = tbody.insertRow();
            row.dataset.day = giorno;
            const cellGiorno = row.insertCell();
            cellGiorno.textContent = giorno;
            cellGiorno.scope = "row";
            cellGiorno.style.fontWeight = "bold";

            const lezioniDelGiorno = timetableData.giorni[giorno] || [];
            
            fasceOrarieDef.forEach(fascia => {
                const cell = row.insertCell();
                if (fascia.isInterval) {
                    cell.textContent = "Intervallo";
                    cell.classList.add('interval-cell');
                } else {
                    const lezioneCorrispondente = lezioniDelGiorno.find(l => l.ora === fascia.oraLabel);
                    if (lezioneCorrispondente) {
                        cell.textContent = lezioneCorrispondente.materia;
                        cell.dataset.subject = lezioneCorrispondente.materia;
                        cell.dataset.hour = fascia.oraLabel; // Es. "1ª"
                        cell.dataset.hourNumeric = fascia.oraLabel.replace('ª', ''); // Es. "1"
                        cell.dataset.time = `${fascia.inizio} - ${fascia.fine}`;
                        cell.classList.add('subject-cell');
                    } else {
                        cell.textContent = '-';
                        cell.dataset.hour = fascia.oraLabel;
                        cell.dataset.hourNumeric = fascia.oraLabel.replace('ª', '');
                        cell.dataset.time = `${fascia.inizio} - ${fascia.fine}`;
                    }
                }
            });
        });

        timetableDisplay.appendChild(table);
        applySearchFilter();
    }
    
    function displayTimetable(timetableData) {
        renderTimetable(timetableData);
        // Non chiamare setActiveSection e setActiveNavLink qui,
        // perché viene già fatto dai gestori di eventi della navbar o della welcome screen.
    }

    // --- Funzionalità di Ricerca/Filtro ---
    searchInput.addEventListener('input', applySearchFilter);

    function applySearchFilter() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const rows = timetableDisplay.querySelectorAll('tbody tr');

        // Modifica per la ricerca dell'ora: "1 ora" -> "1"
        let searchHourNumber = null;
        const hourSearchMatch = searchTerm.match(/^(\d+)\s*ora$/); // Es. "1 ora", "2ora"
        if (hourSearchMatch) {
            searchHourNumber = hourSearchMatch[1]; // Es. "1"
        }

        rows.forEach(row => {
            let rowVisible = false;
            if (!searchTerm) {
                rowVisible = true;
                row.querySelectorAll('td.subject-cell, td:not(.interval-cell):not([scope="row"])').forEach(cell => cell.classList.remove('highlight'));
            } else {
                const day = row.dataset.day.toLowerCase();
                if (day.includes(searchTerm)) {
                    rowVisible = true;
                }

                const cells = row.querySelectorAll('td.subject-cell, td:not(.interval-cell):not([scope="row"])'); // Includi celle vuote per ora/fascia
                cells.forEach(cell => {
                    cell.classList.remove('highlight');
                    const subject = cell.dataset.subject ? cell.dataset.subject.toLowerCase() : '';
                    const hourLabel = cell.dataset.hour ? cell.dataset.hour.toLowerCase() : ''; // "1ª"
                    const hourNumeric = cell.dataset.hourNumeric ? cell.dataset.hourNumeric.toLowerCase() : ''; // "1"
                    const time = cell.dataset.time ? cell.dataset.time.toLowerCase() : '';
                    
                    let cellMatches = false;
                    if (subject.includes(searchTerm) || hourLabel.includes(searchTerm) || time.includes(searchTerm)) {
                        cellMatches = true;
                    }
                    // Controllo aggiuntivo per "N ora"
                    if (searchHourNumber && hourNumeric === searchHourNumber) {
                         cellMatches = true;
                    }


                    if (cellMatches) {
                        rowVisible = true;
                        if(cell.classList.contains('subject-cell') || cell.textContent !== '-') { // Evidenzia solo se c'è contenuto o è una cella materia
                           cell.classList.add('highlight');
                        }
                    }
                });
            }
            row.style.display = rowVisible ? '' : 'none';
        });
    }

    // --- Funzionalità "Crea Nuovo Orario" ---
    function prepareCreateTimetableForm() {
        newTimetableNameInput.value = '';
        timetableCreationGrid.innerHTML = '';

        const table = document.createElement('table');
        table.className = 'table table-bordered';
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        const thDay = document.createElement('th');
        thDay.textContent = 'Giorno';
        headerRow.appendChild(thDay);

        fasceOrarieDef.filter(f => !f.isInterval).forEach(fascia => {
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

            fasceOrarieDef.filter(f => !f.isInterval).forEach((fascia) => {
                const cell = row.insertCell();
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control form-control-sm';
                input.dataset.day = giorno;
                input.dataset.oraLabel = fascia.oraLabel;
                input.dataset.fasciaOraria = `${fascia.inizio} - ${fascia.fine}`;
                input.placeholder = `Materia ${fascia.oraLabel}`; // Placeholder per tutte le ore, inclusa la 7ª
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
                if (materia) {
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
        // Dopo il salvataggio, visualizza l'orario appena creato
        displayTimetable(newTimetableData);
        setActiveSection(sezioneVisualizzazione); // Mostra la sezione di visualizzazione
        setActiveNavLink(null); // Nessun link specifico attivo o potresti attivare "I miei orari"
        // Per coerenza, potremmo reindirizzare a "I miei orari" per vederlo nella lista
        navMieiOrari.click();
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
        return timetables.sort((a,b) => a.nome.localeCompare(b.nome)); // Ordina per nome
    }

    function deleteTimetableFromLocalStorage(name) {
        localStorage.removeItem(TIMETABLE_STORAGE_KEY_PREFIX + name);
        loadAndDisplayMyTimetables(); 
        if (currentDisplayedTimetableData && currentDisplayedTimetableData.nome === name) {
             if (welcomeScreen.style.display === 'none') { // Solo se la app è già avviata
                displayTimetable(orario3E);
                setActiveSection(sezioneVisualizzazione);
                setActiveNavLink(navOrario3E);
            }
        }
    }

    function loadAndDisplayMyTimetables() {
        myTimetablesListDisplay.innerHTML = '';
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
            nameSpan.addEventListener('click', () => {
                displayTimetable(timetable);
                setActiveSection(sezioneVisualizzazione);
                setActiveNavLink(null); // L'orario visualizzato non è uno dei default della navbar
                searchInput.value = '';
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.innerHTML = '<i class="bi bi-trash"></i>'; // Solo icona per compattezza
            deleteButton.setAttribute('aria-label', `Elimina orario ${timetable.nome}`);
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
    // Non c'è un'inizializzazione esplicita qui perché la welcome screen gestisce il primo avvio.
    // Se la welcome screen è già stata scartata (sessionStorage), la logica all'inizio gestisce il caricamento.
});
