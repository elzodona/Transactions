 
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
