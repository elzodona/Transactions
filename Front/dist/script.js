var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
(_a = document.getElementById('fournisseur')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', function () {
    const selectElement = document.getElementById('fournisseur');
    const transactionTitles = document.querySelectorAll('.transaction-title');
    const selectedFournisseur = selectElement.value;
    transactionTitles.forEach(transactionTitle => {
        transactionTitle.classList.remove('om', 'wv', 'wr', 'cb');
        if (selectedFournisseur === 'om') {
            transactionTitle.classList.add('om');
        }
        else if (selectedFournisseur === 'wv') {
            transactionTitle.classList.add('wv');
        }
        else if (selectedFournisseur === 'wr') {
            transactionTitle.classList.add('wr');
        }
        else if (selectedFournisseur === 'cb') {
            transactionTitle.classList.add('cb');
        }
    });
});
function showNotification(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        notificationMessage.textContent = message;
        notification.style.display = 'block';
        yield new Promise((resolve) => setTimeout(resolve, 3000));
        notification.style.display = 'none';
    });
}
(_b = document.getElementById('validerBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const trans_type = document.getElementById('type_transaction');
        const selectedValue = trans_type.value;
        if (selectedValue === 'depot') {
            yield makeDeposit();
        }
        else if (selectedValue === 'retrait') {
            yield makeRetrait();
        }
        else {
            yield makeTransfert();
        }
    });
});
function makeTransfert() {
    return __awaiter(this, void 0, void 0, function* () {
        const destinataireInput = document.getElementById('destinataire');
        const expediteurInput = document.getElementById('expediteur');
        const fournisseurInput = document.getElementById('fournisseur');
        const montantInput = document.getElementById('montant');
        const data = {
            destinataire: destinataireInput.value,
            expediteur: expediteurInput.value,
            fournisseur: fournisseurInput.value,
            montant: parseInt(montantInput.value, 10)
        };
        try {
            const response = yield fetch('http://127.0.0.1:8000/api/transactions/transfert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('La requête a échoué.');
            }
            const responseData = yield response.json();
            console.log('Réponse de l\'API:', responseData);
        }
        catch (error) {
            console.error('Erreur lors de la requête API:', error);
        }
    });
}
function makeDeposit() {
    return __awaiter(this, void 0, void 0, function* () {
        const destinataireInput = document.getElementById('destinataire');
        const expediteurInput = document.getElementById('expediteur');
        const fournisseurSelect = document.getElementById('fournisseur');
        const montantInput = document.getElementById('montant');
        const destinataire = destinataireInput.value;
        const expediteur = expediteurInput.value;
        const fournisseur = fournisseurSelect.value;
        const montant = parseInt(montantInput.value, 10);
        if (!destinataire || !expediteur || !fournisseur || isNaN(montant)) {
            showNotification("Veuillez remplir tous les champs correctement.");
            return;
        }
        try {
            const endpoint = 'http://127.0.0.1:8000/api/transactions/depot';
            const data = { destinataire, expediteur, fournisseur, montant };
            const response = yield fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                showNotification("Dépôt effectué avec succès.");
            }
            else {
                const responseData = yield response.json();
                showNotification("Erreur lors du dépôt : " + responseData.error);
            }
        }
        catch (error) {
            showNotification("Une erreur s'est produite lors du dépôt : " + error.message);
        }
    });
}
function makeRetrait() {
    return __awaiter(this, void 0, void 0, function* () {
        const expediteurInput = document.getElementById('expediteur');
        const fournisseurSelect = document.getElementById('fournisseur');
        const montantInput = document.getElementById('montant');
        const expediteur = expediteurInput.value;
        const fournisseur = fournisseurSelect.value;
        const montant = parseInt(montantInput.value, 10);
        if (!expediteur || !fournisseur || isNaN(montant)) {
            showNotification("Veuillez remplir tous les champs correctement.");
            return;
        }
        try {
            const endpoint = 'http://127.0.0.1:8000/api/transactions/retrait';
            const data = { expediteur, fournisseur, montant };
            const response = yield fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const responseData = yield response.json();
                showNotification("Retrait réussi : " + responseData.message);
            }
            else {
                const errorData = yield response.json();
                showNotification("Erreur de retrait : " + errorData.message);
            }
        }
        catch (error) {
            showNotification("Une erreur s'est produite lors du retrait : " + error.message);
        }
    });
}
const trans_type = document.getElementById('type_transaction');
const destinataireSection = document.querySelector('.transaction-section.destinataire');
trans_type.addEventListener('change', function () {
    const selectedValue = trans_type.value;
    if (selectedValue === 'retrait') {
        destinataireSection.classList.add('hidden');
    }
    else {
        destinataireSection.classList.remove('hidden');
    }
});
const destinataireInput = document.getElementById('destinataire');
destinataireInput.addEventListener('input', function () {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const numeroDestinataire = destinataireInput.value;
        if (numeroDestinataire) {
            const nomDestinataire = yield getNomDestinataire(numeroDestinataire);
            (_a = document.getElementById('destinataire_nom')) === null || _a === void 0 ? void 0 : _a.setAttribute('value', nomDestinataire);
        }
    });
});
const expediteurInput = document.getElementById('expediteur');
expediteurInput.addEventListener('input', function () {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const numeroExpediteur = expediteurInput.value;
        if (numeroExpediteur) {
            const nomExpediteur = yield getNomExpediteur(numeroExpediteur);
            (_a = document.getElementById('expediteur_nom')) === null || _a === void 0 ? void 0 : _a.setAttribute('value', nomExpediteur);
        }
    });
});
function getNomDestinataire(numeroDestinataire) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/api/numClient/${numeroDestinataire}`);
            if (response.ok) {
                const client = yield response.json();
                if (client.nom) {
                    return client.prenom + ' ' + client.nom;
                }
                else {
                    throw new Error("Le nom du destinataire n'a pas été trouvé.");
                }
            }
            else {
                throw new Error('Erreur lors de la récupération du nom du destinataire.');
            }
        }
        catch (error) {
            console.error(error.message);
            return '';
        }
    });
}
function getNomExpediteur(numeroDestinataire) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/api/numClient/${numeroDestinataire}`);
            if (response.ok) {
                const client = yield response.json();
                if (client.nom) {
                    return client.prenom + ' ' + client.nom;
                }
                else {
                    throw new Error("Le nom du destinataire n'a pas été trouvé.");
                }
            }
            else {
                throw new Error('Erreur lors de la récupération du nom du destinataire.');
            }
        }
        catch (error) {
            console.error(error.message);
            return '';
        }
    });
}
const infoIcon = document.getElementById('info-icon');
infoIcon === null || infoIcon === void 0 ? void 0 : infoIcon.addEventListener('click', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const expediteurInput = document.getElementById('expediteur');
        const numero = expediteurInput.value;
        console.log(numero);
        const transactions = yield recupererHistoriqueTransactions(numero);
        if (transactions) {
            mettreAJourContenuModal(transactions);
            afficherModal();
        }
    });
});
function afficherModal() {
    const transactionHistoryModal = document.getElementById('transactionHistoryModal');
    if (transactionHistoryModal) {
        transactionHistoryModal.show();
    }
}
function recupererHistoriqueTransactions(numero) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/api/transClient/${numero}`);
            if (response.ok) {
                return yield response.json();
            }
            else {
                throw new Error("Impossible de récupérer l'historique des transactions.");
            }
        }
        catch (error) {
            console.error(error);
            return null;
        }
    });
}
function mettreAJourContenuModal(transactions) {
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.innerHTML = '';
        for (const fournisseur in transactions) {
            if (transactions.hasOwnProperty(fournisseur)) {
                const transactionsFournisseur = transactions[fournisseur];
                if (transactionsFournisseur.length > 0) {
                    const sectionFournisseur = document.createElement('div');
                    sectionFournisseur.classList.add('transaction-provider');
                    const titreFournisseur = document.createElement('h5');
                    titreFournisseur.textContent = fournisseur;
                    sectionFournisseur.appendChild(titreFournisseur);
                    const table = document.createElement('table');
                    table.classList.add('table', 'table-striped');
                    const tableHeader = document.createElement('thead');
                    tableHeader.innerHTML = `
            <tr>
              <th>Montant</th>
              <th>Type</th>
              <th>Code</th>
              <th>Date</th>
            </tr>
          `;
                    table.appendChild(tableHeader);
                    const tableBody = document.createElement('tbody');
                    for (const transaction of transactionsFournisseur) {
                        const row = document.createElement('tr');
                        const montantCell = document.createElement('td');
                        montantCell.textContent = transaction.montant;
                        row.appendChild(montantCell);
                        const typeCell = document.createElement('td');
                        typeCell.textContent = transaction.type_trans;
                        row.appendChild(typeCell);
                        const codeCell = document.createElement('td');
                        codeCell.textContent = transaction.code;
                        row.appendChild(codeCell);
                        const dateCell = document.createElement('td');
                        dateCell.textContent = transaction.date_transaction;
                        row.appendChild(dateCell);
                        tableBody.appendChild(row);
                    }
                    table.appendChild(tableBody);
                    sectionFournisseur.appendChild(table);
                    modalBody.appendChild(sectionFournisseur);
                }
            }
        }
    }
}
