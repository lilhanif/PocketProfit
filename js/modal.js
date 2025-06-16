

document.addEventListener('DOMContentLoaded', () => {
    const addTransactionButton = document.getElementById('addTransactionButton');
    const transactionFormContainer = document.getElementById('transactionForm');
    const addTransactionForm = document.getElementById('addTransactionForm');
    const cancelButton = document.getElementById('cancelButton');
    
    if (addTransactionButton && transactionFormContainer && cancelButton) {
        addTransactionButton.addEventListener('click', () => {
            transactionFormContainer.classList.remove('hidden');
        });

        cancelButton.addEventListener('click', () => {
            transactionFormContainer.classList.add('hidden');
            addTransactionForm.reset(); 
        });
    }

    if (addTransactionForm) {
        addTransactionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const description = document.getElementById('description').value;
            const amount = document.getElementById('amount').value;
            if (!description.trim() || !amount) {
                alert('Deskripsi dan Jumlah tidak boleh kosong.');
                return;
            }

            const newTransaction = {
                description: description,
                amount: parseInt(amount),
                type: document.getElementById('type').value,
                category: document.getElementById('category').value,
                date: new Date().toISOString().split('T')[0],
                id: new Date().getTime() 
            };
            
            addTransaction(newTransaction);
            renderPage(); 

            transactionFormContainer.classList.add('hidden');
            addTransactionForm.reset();
        });
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));

            button.classList.add('active');
            const tabId = button.dataset.tab;
            const activeContent = document.getElementById(`tab-content-${tabId}`);
            if (activeContent) {
                activeContent.classList.remove('hidden');
            }
        });
    });
});
