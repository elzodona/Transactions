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
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const responseData = yield response.json();
                showNotification(responseData.message);
            }
            else {
                const errorData = yield response.json();
                showNotification(errorData.message);
            }
        }
        catch (error) {
            console.error('Erreur lors de la requête API:', error);
            showNotification('Une erreur s\'est produite lors du transfert : ' + error.message);
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
                const responseData = yield response.json();
                showNotification(responseData.message);
            }
            else {
                const errorData = yield response.json();
                showNotification(errorData.message);
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
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const responseData = yield response.json();
                showNotification(responseData.message);
            }
            else {
                const errorData = yield response.json();
                showNotification(errorData.message);
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
const addClient = document.getElementById('addClient');
addClient.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    const nomInput = document.getElementById('nom');
    const prenomInput = document.getElementById('prenom');
    const telephoneInput = document.getElementById('telephone');
    const nom = nomInput.value;
    const prenom = prenomInput.value;
    const telephone = telephoneInput.value;
    try {
        const response = yield fetch('http://127.0.0.1:8000/api/addClient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nom: nom,
                prenom: prenom,
                telephone: telephone,
            }),
        });
        if (response.ok) {
            showNotification('Le client a été ajouté avec succès');
        }
        else {
            showNotification('Erreur lors de l\'ajout du client');
        }
    }
    catch (error) {
        console.error('Erreur lors de l\'ajout du client :', error);
    }
}));
const addCompte = document.getElementById('addCompte');
addCompte.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    const fournisseurInput = document.getElementById('four');
    const telephoneInput = document.getElementById('phone');
    const fournisseur = fournisseurInput.value;
    const telephone = telephoneInput.value;
    try {
        const response = yield fetch('http://127.0.0.1:8000/api/addCompte', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fournisseur: fournisseur,
                telephone: telephone,
            }),
        });
        if (response.ok) {
            const responseData = yield response.json();
            showNotification(responseData.message);
        }
    }
    catch (error) {
        console.error('Erreur lors de l\'ajout du client :', error);
    }
}));
const listerComptesBtn = document.querySelector('#listerCompte');
const tableBody = document.getElementById('comptesTableBody');
listerComptesBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield fetch('http://127.0.0.1:8000/api/listerCompte');
        if (response.ok) {
            const comptes = yield response.json();
            afficherComptesDansTableau(comptes);
        }
        else {
            console.error('Erreur lors de la récupération des comptes');
        }
    }
    catch (error) {
        console.error('Erreur lors de la récupération des comptes :', error);
    }
}));
const tabs = document.querySelector('.tabs');
function afficherComptesDansTableau(comptes) {
    tableBody.innerHTML = '';
    tabs.style.display = 'block';
    comptes.forEach((compte) => {
        const row = tableBody.insertRow();
        const num_compte = row.insertCell();
        num_compte.textContent = compte.num_compte;
        const solde = row.insertCell();
        solde.textContent = compte.solde;
        const prenomCell = row.insertCell();
        prenomCell.textContent = compte.fournisseur;
        const telephoneCell = row.insertCell();
        telephoneCell.textContent = compte.client_id;
        const etat = row.insertCell();
        etat.textContent = compte.etat;
        const actionCell = row.insertCell();
        const boutonBloquer = document.createElement('button');
        boutonBloquer.textContent = 'Bloquer';
        boutonBloquer.addEventListener('click', () => {
            bloquerCompte(compte.num_compte);
        });
        const boutonDeBloquer = document.createElement('button');
        boutonDeBloquer.textContent = 'Débloquer';
        boutonDeBloquer.addEventListener('click', () => {
            debloquerCompte(compte.num_compte);
        });
        const boutonFermer = document.createElement('button');
        boutonFermer.textContent = 'Fermer';
        boutonFermer.addEventListener('click', () => {
            fermerCompte(compte.num_compte);
        });
        actionCell.appendChild(boutonBloquer);
        actionCell.appendChild(boutonDeBloquer);
        actionCell.appendChild(boutonFermer);
    });
}
function fermerCompte(numCompte) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/api/deleteCompte/${numCompte}`, {
                method: 'GET',
            });
            if (response.ok) {
                showNotification('Compte fermé avec succès');
            }
            else {
                showNotification('Erreur lors de la fermeture du compte');
            }
        }
        catch (error) {
            console.error('Erreur lors de la fermeture:', error);
        }
    });
}
function bloquerCompte(numCompte) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/api/bloquerCompte/${numCompte}`, {
                method: 'GET',
            });
            if (response.ok) {
                showNotification('Compte bloqué avec succès');
            }
            else {
                showNotification('Erreur lors du blocage du compte');
            }
        }
        catch (error) {
            console.error('Erreur lors du blocage du compte:', error);
        }
    });
}
function debloquerCompte(numCompte) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/api/debloquerCompte/${numCompte}`, {
                method: 'GET',
            });
            if (response.ok) {
                showNotification('Compte débloqué avec succès');
            }
            else {
                showNotification('Erreur lors du déblocage du compte');
            }
        }
        catch (error) {
            console.error('Erreur lors du déblocage du compte:', error);
        }
    });
}
function annulerTransaction(codeTransaction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/api/annulerTransaction/${codeTransaction}`, {
                method: 'GET',
            });
            if (response.ok) {
                const responseData = yield response.json();
                console.log(responseData);
                showNotification(responseData.message);
            }
            else {
                const errorData = yield response.json();
                console.log(errorData);
                showNotification(errorData.message);
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'annulation de la transaction:', error);
        }
    });
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
const infoIcon = document.getElementById('info-icon');
infoIcon === null || infoIcon === void 0 ? void 0 : infoIcon.addEventListener('click', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const expediteurInput = document.getElementById('expediteur');
        const numero = expediteurInput.value;
        const transactions = yield recupererHistoriqueTransactions(numero);
        if (transactions) {
            afficherTransactions(transactions.transactions);
        }
    });
});
function afficherTransactions(transactions) {
    const tableBody = document.querySelector('#histoTrans');
    console.log(tableBody);
    if (tableBody) {
        tableBody.innerHTML = '';
        for (const transaction of transactions) {
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
            const deleteTrans = document.createElement('button');
            deleteTrans.textContent = "Annuler";
            row.appendChild(deleteTrans);
            deleteTrans.addEventListener('click', () => {
                annulerTransaction(transaction.code);
            });
            tableBody.appendChild(row);
        }
    }
}
const a = document.getElementById('ordreDate');
const b = document.getElementById('ordreMontant');
a.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
    const expediteurInput = document.getElementById('expediteur');
    const numero = expediteurInput.value;
    const transactions = yield recupererHistoriqueTransactions(numero);
    if (transactions) {
        appliquerFiltresDate(transactions);
    }
}));
b.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
    const expediteurInput = document.getElementById('expediteur');
    const numero = expediteurInput.value;
    const transactions = yield recupererHistoriqueTransactions(numero);
    if (transactions) {
        appliquerFiltresMontant(transactions);
    }
}));
function appliquerFiltresDate(transactions) {
    return __awaiter(this, void 0, void 0, function* () {
        const byDate = a.value;
        let transactionsFiltrees = [...transactions.transactions];
        if (byDate === 'recent') {
            transactionsFiltrees.sort((a, b) => new Date(b.date_transaction).getTime() - new Date(a.date_transaction).getTime());
        }
        else if (byDate === 'ancien') {
            transactionsFiltrees.sort((a, b) => new Date(a.date_transaction).getTime() - new Date(b.date_transaction).getTime());
        }
        afficherTransactions(transactionsFiltrees);
    });
}
function appliquerFiltresMontant(transactions) {
    return __awaiter(this, void 0, void 0, function* () {
        const byMontant = b.value;
        let transactionsFiltrees = [...transactions.transactions];
        if (byMontant === 'croissant') {
            transactionsFiltrees.sort((a, b) => a.montant - b.montant);
        }
        else if (byMontant === 'decroissant') {
            transactionsFiltrees.sort((a, b) => b.montant - a.montant);
        }
        afficherTransactions(transactionsFiltrees);
    });
}
