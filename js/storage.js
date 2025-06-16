const STORAGE_KEY = 'pocketProfitData';

function getData() {
    const dataString = localStorage.getItem(STORAGE_KEY);
    if (dataString) {
        return JSON.parse(dataString);
    }

    const defaultData = {
        transactions: [
            { id: 1, description: 'Gaji Bulan Juni', amount: 7500000, type: 'income', category: 'Gaji', date: '2025-06-05' },
            { id: 2, description: 'Beli Bahan Baku Kopi', amount: 1200000, type: 'expense', category: 'Bahan Baku', date: '2025-06-06' },
            { id: 3, description: 'Bayar Sewa Tempat', amount: 2500000, type: 'expense', category: 'Operasional', date: '2025-06-10' },
            { id: 4, description: 'Iklan Instagram', amount: 350000, type: 'expense', category: 'Pemasaran', date: '2025-06-14' },
            { id: 5, description: 'Penjualan Event Weekend', amount: 4250000, type: 'income', category: 'Penjualan', date: '2025-06-15' },
        ],
        budget: 20000000,
        initialCapital: 50000000,
        financialGoals: [
            { id: 1, name: 'Ekspansi Cabang', target: 50000000, current: 30000000 },
            { id: 2, name: 'Pembelian Mesin Baru', target: 25000000, current: 7500000 }
        ]
    };
    saveData(defaultData);
    return defaultData;
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function addTransaction(transaction) {
    const data = getData();
    data.transactions.push(transaction);
    saveData(data);
}

function deleteTransaction(transactionId) {
    const data = getData();
    data.transactions = data.transactions.filter(t => t.id !== transactionId);
    saveData(data);
}

function addFinancialGoal(goal) {
    const data = getData();
    goal.id = new Date().getTime();
    data.financialGoals.push(goal);
    saveData(data);
}

function deleteFinancialGoal(goalId) {
    const data = getData();
    data.financialGoals = data.financialGoals.filter(g => g.id !== goalId);
    saveData(data);
}
