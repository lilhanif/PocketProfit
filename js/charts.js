let cashflowChartInstance;
let expenseChartInstance;

const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);


document.addEventListener('DOMContentLoaded', () => {
    renderPage();

    const confirmationModal = document.getElementById('confirmationModal');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    const mainContent = document.getElementById('main-content');

    let transactionIdToDelete = null;

    const showConfirmationModal = (id) => {
        transactionIdToDelete = id;
        if (confirmationModal) confirmationModal.classList.remove('hidden');
    };

    const hideConfirmationModal = () => {
        transactionIdToDelete = null;
        if (confirmationModal) confirmationModal.classList.add('hidden');
    };

    if (mainContent) {
        mainContent.addEventListener('click', (e) => {
            const deleteButton = e.target.closest('.delete-btn');
            if (deleteButton) {
                const id = parseInt(deleteButton.dataset.id);
                showConfirmationModal(id);
            }
        });
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
            if (transactionIdToDelete !== null) {
                deleteTransaction(transactionIdToDelete);
                renderPage();
                hideConfirmationModal();
            }
        });
    }

    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', hideConfirmationModal);
    }
});


function renderPage() {
    const appData = getData();
    updateBudgetDisplay(appData.transactions, appData.budget);
    renderTransactionLists(appData.transactions);
    renderOrUpdateCashflowChart(appData.transactions);
    renderOrUpdateExpenseChart(appData.transactions);
}

function updateBudgetDisplay(transactions, totalBudget) {
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const remainingBudget = totalBudget - totalExpenses;
    const percentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
    
    const budgetDisplay = document.getElementById('budgetDisplay');
    const budgetProgressBar = document.getElementById('budgetProgressBar');

    if(budgetDisplay && budgetProgressBar) {
        budgetDisplay.innerHTML = `${formatCurrency(remainingBudget)} <span class="text-lg text-custom-text-secondary">/ ${formatCurrency(totalBudget)}</span>`;
        budgetProgressBar.style.width = `${percentage > 100 ? 100 : percentage}%`;
    }
}

function renderTransactionLists(transactions) {
    const expenses = transactions.filter(t => t.type === 'expense');
    const incomes = transactions.filter(t => t.type === 'income');
    populateList('expenseList', expenses);
    populateList('incomeList', incomes);
}

function populateList(listId, transactionData) {
    const listElement = document.getElementById(listId);
    if (!listElement) return;
    listElement.innerHTML = '';

    if (transactionData.length === 0) {
        const typeText = listId.includes('expense') ? 'pengeluaran' : 'pemasukan';
        listElement.innerHTML = `<p class="text-custom-text-secondary text-sm text-center py-4">Belum ada data ${typeText}.</p>`;
        return;
    }
    
    const sortedTransactions = transactionData.slice().sort((a, b) => b.id - a.id);
    sortedTransactions.forEach(t => {
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center p-3 bg-gray-800 rounded-lg';
        const isExpense = t.type === 'expense';
        const amountColor = isExpense ? 'text-red-400' : 'text-green-400';
        const prefix = isExpense ? '-' : '+';
        
        item.innerHTML = `
            <div class="flex items-center flex-grow">
                <div class="flex-shrink-0">
                     <button title="Hapus Transaksi" class="delete-btn p-1 rounded-full text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-colors" data-id="${t.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-custom-text-primary">${t.description}</p>
                    <p class="text-xs text-custom-text-secondary">${t.category ? t.category : new Date(t.id).toLocaleDateString('id-ID')}</p>
                </div>
            </div>
            <p class="text-sm font-semibold ${amountColor}">${prefix}${formatCurrency(t.amount)}</p>
        `;
        listElement.appendChild(item);
    });
}

function renderOrUpdateCashflowChart(transactions) {
    const incomeData = [0, 0, 0, 0];
    const expenseData = [0, 0, 0, 0];
    transactions.forEach(t => {
        const dayOfMonth = new Date(t.id).getDate();
        let week = Math.floor((dayOfMonth -1) / 7.1);
        week = Math.min(week, 3);
        if (t.type === 'income') {
            incomeData[week] += t.amount;
        } else {
            expenseData[week] += t.amount;
        }
    });
    const data = {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        datasets: [{
            label: 'Pemasukan',
            data: incomeData,
            borderColor: '#9AE19D',
            backgroundColor: 'rgba(154, 225, 157, 0.2)',
            tension: 0.4,
            fill: true,
        }, {
            label: 'Pengeluaran',
            data: expenseData,
            borderColor: '#F87171',
            backgroundColor: 'rgba(248, 113, 113, 0.2)',
            tension: 0.4,
            fill: true,
        }]
    };
    const canvasElement = document.getElementById('cashflowChart');
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    if (cashflowChartInstance) {
        cashflowChartInstance.data = data;
        cashflowChartInstance.update();
    } else {
        cashflowChartInstance = new Chart(ctx, { type: 'line', data: data, options: chartOptions.line });
    }
}

function renderOrUpdateExpenseChart(transactions) {
    const expenseByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        const category = t.category || 'Lainnya';
        if (!expenseByCategory[category]) {
            expenseByCategory[category] = 0;
        }
        expenseByCategory[category] += t.amount;
    });
    const data = {
        labels: Object.keys(expenseByCategory),
        datasets: [{
            label: 'Pengeluaran',
            data: Object.values(expenseByCategory),
            backgroundColor: ['#60A5FA', '#A78BFA', '#FBBF24', '#34D399', '#94A3B8', '#F87171'],
            borderColor: '#1F1F1F',
            borderWidth: 4,
            hoverOffset: 8
        }]
    };
    const canvasElement = document.getElementById('expenseChart');
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    if (expenseChartInstance) {
        expenseChartInstance.data = data;
        expenseChartInstance.update();
    } else {
        expenseChartInstance = new Chart(ctx, { type: 'doughnut', data: data, options: chartOptions.doughnut });
    }
}

const chartOptions = {
    line: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#e2e8f0' }},
            tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}` }}
        },
        scales: {
            y: { beginAtZero: true, ticks: { color: '#94a3b8', callback: (value) => formatCurrency(value).replace('Rp', '') }, grid: { color: 'rgba(255, 255, 255, 0.1)' }},
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        }
    },
    doughnut: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#e2e8f0', padding: 15 }},
            tooltip: { callbacks: { label: (context) => `${context.label}: ${formatCurrency(context.parsed)}` }}
        }
    }
};
