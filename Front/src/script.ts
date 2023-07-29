 
 document.getElementById('fournisseur')?.addEventListener('change', function () {
    const selectElement = document.getElementById('fournisseur') as HTMLSelectElement;
    const transactionTitles = document.querySelectorAll('.transaction-title') as NodeListOf<HTMLHeadingElement>;
    const selectedFournisseur = selectElement.value;

    transactionTitles.forEach(transactionTitle => {

        transactionTitle.classList.remove('om', 'wv', 'wr', 'cb');

        if (selectedFournisseur === 'om') {
            transactionTitle.classList.add('om');
        } else if (selectedFournisseur === 'wv') {
            transactionTitle.classList.add('wv');
        } else if (selectedFournisseur === 'wr') {
            transactionTitle.classList.add('wr');
        } else if (selectedFournisseur === 'cb') {
            transactionTitle.classList.add('cb');
        }
    })
});


async function makeDeposit() {
    const destinataireInput = document.getElementById('destinataire') as HTMLInputElement;
    const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;
    const fournisseurSelect = document.getElementById('fournisseur') as HTMLSelectElement;
    const montantInput = document.getElementById('montant') as HTMLInputElement;

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
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Dépôt effectué avec succès.');
        } else {
            const responseData = await response.json();
            alert('Erreur lors du dépôt : ' + responseData.error);
        }
    } catch (error) {
        alert('Une erreur s\'est produite lors du dépôt : ' + error.message);
    }
}

async function makeWithdrawal() {
    const destinataireInput = document.getElementById('destinataire') as HTMLInputElement;
    const fournisseurSelect = document.getElementById('fournisseur') as HTMLSelectElement;
    const montantInput = document.getElementById('montant') as HTMLInputElement;

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
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Retrait réussi:', responseData.message);
        } else {
            const errorData = await response.json();
            console.error('Erreur de retrait:', errorData.message);
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors du retrait:', error);
    }
}

document.getElementById('validerBtn')?.addEventListener('click', async function () {
    const trans_type = document.getElementById('type_transaction') as HTMLSelectElement;
    const selectedValue = trans_type.value;

    if (selectedValue === 'depot') {
        await makeDeposit();
    } else if (selectedValue === 'retrait') {
        await makeWithdrawal();
    }
});


const destinataireInput = document.getElementById('destinataire') as HTMLInputElement;

destinataireInput.addEventListener('input', async function () {
    const numeroDestinataire = destinataireInput.value;
    if (numeroDestinataire) {
        const nomDestinataire = await getNomDestinataire(numeroDestinataire);
        document.getElementById('destinataire_nom')?.setAttribute('value', nomDestinataire);
    }
});

const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;

expediteurInput.addEventListener('input', async function () {
    const numeroExpediteur = expediteurInput.value;
    if (numeroExpediteur) {
        const nomExpediteur = await getNomExpediteur(numeroExpediteur);
        document.getElementById('expediteur_nom')?.setAttribute('value', nomExpediteur);
    }
});

async function getNomDestinataire(numeroDestinataire: string): Promise<string> {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/numClient/${numeroDestinataire}`);
        if (response.ok) {
            const client = await response.json();

            if (client.nom) {
                return client.prenom + ' ' + client.nom;
            } else {
                throw new Error("Le nom du destinataire n'a pas été trouvé.");
            }
        } else {
            throw new Error('Erreur lors de la récupération du nom du destinataire.');
        }
    } catch (error) {
        console.error(error.message);
        return '';
    }
}


async function getNomExpediteur(numeroDestinataire: string): Promise<string> {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/numClient/${numeroDestinataire}`);
        if (response.ok) {
            const client = await response.json();

            if (client.nom) {
                return client.prenom + ' ' + client.nom;
            } else {
                throw new Error("Le nom du destinataire n'a pas été trouvé.");
            }
        } else {
            throw new Error('Erreur lors de la récupération du nom du destinataire.');
        }
    } catch (error) {
        console.error(error.message);
        return '';
    }
}
