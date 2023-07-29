var _a;
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
