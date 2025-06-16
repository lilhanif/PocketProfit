document.addEventListener('DOMContentLoaded', () => {

    if (typeof getData !== 'function') {
        console.error("Fungsi dari storage.js tidak ditemukan. Pastikan file dimuat dengan benar.");
        return;
    }

    const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

    const notificationModal = document.getElementById('notificationModal');
    const closeNotificationButton = document.getElementById('closeNotification');
    const notificationButtons = document.querySelectorAll('.dev-notification-button');
    const goalModal = document.getElementById('goalModal');
    const showGoalModalButton = document.getElementById('manageGoalsButton');
    const closeGoalModalButton = document.getElementById('closeGoalModal');
    const addGoalForm = document.getElementById('addGoalForm');
    const deleteGoalModal = document.getElementById('deleteGoalModal');
    const confirmDeleteGoalButton = document.getElementById('confirmDeleteGoal');
    const cancelDeleteGoalButton = document.getElementById('cancelDeleteGoal');
    const financialGoalsListContainer = document.getElementById('financialGoalsList');
    
    let goalIdToDelete = null;

    function updateInfoCards(appData) {
        const { transactions, budget, initialCapital } = appData;
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const netProfit = totalIncome - totalExpense;

        document.getElementById('netWorth').textContent = formatCurrency(initialCapital + netProfit);
        document.getElementById('netWorthDetail').textContent = `Aset: ${formatCurrency(initialCapital + totalIncome)} - Liabilitas: ${formatCurrency(totalExpense)}`;

        document.getElementById('labaRugi-totalPendapatan').textContent = formatCurrency(totalIncome);
        document.getElementById('labaRugi-hpp').textContent = formatCurrency(totalExpense * 0.4);
        document.getElementById('labaRugi-biayaOperasional').textContent = formatCurrency(totalExpense * 0.6);
        document.getElementById('labaRugi-labaBersih').textContent = formatCurrency(netProfit);

        const remainingBudget = budget - totalExpense;
        const budgetPercentage = budget > 0 ? (totalExpense / budget) * 100 : 0;
        document.getElementById('sisaBudget').textContent = formatCurrency(remainingBudget);
        document.getElementById('sisaBudgetDetail').textContent = `dari ${formatCurrency(budget)} (bulan ini)`;
        document.getElementById('sisaBudgetProgress').style.width = `${Math.min(budgetPercentage, 100)}%`;

        const modalSaatIni = initialCapital + netProfit;
        const pertumbuhanPersen = initialCapital > 0 ? ((modalSaatIni - initialCapital) / initialCapital) * 100 : 0;
        document.getElementById('modalAwal').textContent = formatCurrency(initialCapital);
        document.getElementById('modalSaatIni').textContent = formatCurrency(modalSaatIni);
        document.getElementById('pertumbuhanModal').textContent = `+${pertumbuhanPersen.toFixed(1)}%`;
    }

    function updateFinancialGoals(goals) {
        if (!financialGoalsListContainer) return;
        financialGoalsListContainer.innerHTML = '';

        if (!goals || goals.length === 0) {
            financialGoalsListContainer.innerHTML = `<p class="text-sm text-custom-text-secondary text-center">Belum ada tujuan keuangan.</p>`;
            return;
        }
        
        goals.forEach(goal => {
            const percentage = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            const goalElement = document.createElement('div');
            goalElement.className = 'space-y-1';
            goalElement.innerHTML = `
                <div class="flex justify-between items-center text-sm text-custom-text-secondary">
                    <span>${goal.name}</span>
                    <div class="flex items-center">
                        <span class="mr-2">${Math.round(percentage)}%</span>
                        <button title="Hapus Tujuan" class="delete-goal-btn p-1 text-gray-500 hover:text-red-400" data-id="${goal.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2.5">
                    <div class="bg-custom-green h-2.5 rounded-full" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
            `;
            financialGoalsListContainer.appendChild(goalElement);
        });
    }

    function updateRecentExpenses(transactions) {
        const recentExpensesList = document.getElementById('recentExpensesList');
        if (!recentExpensesList) return;
        recentExpensesList.innerHTML = '';
        const recentExpenses = transactions.filter(t => t.type === 'expense').sort((a, b) => b.id - a.id).slice(0, 3);

        if (recentExpenses.length === 0) {
            recentExpensesList.innerHTML = `<li class="text-center text-custom-text-secondary text-sm p-4">Belum ada pengeluaran.</li>`;
        } else {
            recentExpenses.forEach(expense => {
                const listItem = document.createElement('li');
                listItem.className = 'flex justify-between items-center p-2 hover:bg-gray-700 rounded-md';
                listItem.innerHTML = `
                    <div>
                        <span class="font-medium text-custom-text-primary">${expense.description}</span>
                        <span class="block text-xs text-custom-text-secondary">${expense.category || 'Tanpa Kategori'}</span>
                    </div>
                    <span class="font-semibold text-red-400">-${formatCurrency(expense.amount)}</span>
                `;
                recentExpensesList.appendChild(listItem);
            });
        }
    }

    function renderDashboardPage() {
        const appData = getData();
        updateInfoCards(appData);
        updateFinancialGoals(appData.financialGoals);
        updateRecentExpenses(appData.transactions);
    }

    const showNotification = () => notificationModal.classList.remove('hidden');
    const hideNotification = () => notificationModal.classList.add('hidden');
    const showGoalModal = () => goalModal.classList.remove('hidden');
    const hideGoalModal = () => goalModal.classList.add('hidden');
    const showDeleteGoalModal = (id) => {
        goalIdToDelete = id;
        deleteGoalModal.classList.remove('hidden');
    };
    const hideDeleteGoalModal = () => {
        goalIdToDelete = null;
        deleteGoalModal.classList.add('hidden');
    };

    notificationButtons.forEach(button => button.addEventListener('click', showNotification));
    if (closeNotificationButton) closeNotificationButton.addEventListener('click', hideNotification);
    if (notificationModal) notificationModal.addEventListener('click', (e) => { if (e.target === notificationModal) hideNotification(); });

    if (showGoalModalButton) showGoalModalButton.addEventListener('click', showGoalModal);
    if (closeGoalModalButton) closeGoalModalButton.addEventListener('click', hideGoalModal);
    if (goalModal) goalModal.addEventListener('click', (e) => { if (e.target === goalModal) hideGoalModal(); });

    if (addGoalForm) {
        addGoalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const goalName = document.getElementById('goalName').value;
            const goalTarget = document.getElementById('goalTarget').value;
            if (goalName.trim() && goalTarget) {
                addFinancialGoal({ name: goalName, target: parseInt(goalTarget), current: 0 });
                renderDashboardPage();
                addGoalForm.reset();
                hideGoalModal();
            }
        });
    }
    
    if (financialGoalsListContainer) {
        financialGoalsListContainer.addEventListener('click', (e) => {
            const deleteButton = e.target.closest('.delete-goal-btn');
            if (deleteButton) {
                showDeleteGoalModal(parseInt(deleteButton.dataset.id));
            }
        });
    }

    if (confirmDeleteGoalButton) confirmDeleteGoalButton.addEventListener('click', () => {
        if (goalIdToDelete !== null) {
            deleteFinancialGoal(goalIdToDelete);
            renderDashboardPage();
            hideDeleteGoalModal();
        }
    });

    if (cancelDeleteGoalButton) cancelDeleteGoalButton.addEventListener('click', hideDeleteGoalModal);
    if (deleteGoalModal) deleteGoalModal.addEventListener('click', (e) => { if (e.target === deleteGoalModal) hideDeleteGoalModal(); });

    renderDashboardPage();
});
