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
            alert("Veuillez remplir tous les champs correctement.");
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
                alert('Dépôt effectué avec succès.');
            }
            else {
                const responseData = yield response.json();
                alert('Erreur lors du dépôt : ' + responseData.error);
            }
        }
        catch (error) {
            alert('Une erreur s\'est produite lors du dépôt : ' + error.message);
        }
    });
}
function makeWithdrawal() {
    return __awaiter(this, void 0, void 0, function* () {
        const destinataireInput = document.getElementById('destinataire');
        const fournisseurSelect = document.getElementById('fournisseur');
        const montantInput = document.getElementById('montant');
        const destinataire = destinataireInput.value;
        const fournisseur = fournisseurSelect.value;
        const montant = parseInt(montantInput.value, 10);
        if (!destinataire || !fournisseur || isNaN(montant)) {
            alert("Veuillez remplir tous les champs correctement.");
            return;
        }
        try {
            const endpoint = 'http://127.0.0.1:8000/api/transactions/retrait';
            const data = { destinataire, fournisseur, montant };
            const response = yield fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const responseData = yield response.json();
                console.log('Retrait réussi:', responseData.message);
            }
            else {
                const errorData = yield response.json();
                console.error('Erreur de retrait:', errorData.message);
            }
        }
        catch (error) {
            console.error('Une erreur s\'est produite lors du retrait:', error);
        }
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
            yield makeWithdrawal();
        }
    });
});
