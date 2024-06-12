document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const expenseName = document.getElementById('expense-name');
    const expenseAmount = document.getElementById('expense-amount');
    const expenseCategory = document.getElementById('expense-category');
    const expensesList = document.getElementById('expenses');
    const expenseChartCanvas = document.getElementById('expense-chart');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function renderExpenses() {
        expensesList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${expense.name} ${expense.amount}-sum(${expense.category})
                <button onclick="deleteExpense(${index})">o'chirish</button>
            `;
            expensesList.appendChild(li);
        });

        updateChart();
    }

    function addExpense(event) {
        event.preventDefault();

        const name = expenseName.value;
        const amount = expenseAmount.value;
        const category = expenseCategory.value;

        const expense = { name, amount, category };

        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        expenseName.value = '';
        expenseAmount.value = '';
        expenseCategory.value = 'food';

        renderExpenses();
    }

    window.deleteExpense = function(index) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }

    function updateChart() {
        const ctx = expenseChartCanvas.getContext('2d');
        const categories = ['food', 'transport', 'entertainment', 'others'];
        const categoryTotals = categories.map(category => {
            return expenses
                .filter(expense => expense.category === category)
                .reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        });

        if (window.expenseChart) {
            window.expenseChart.destroy();
        }

        window.expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Expenses by Category',
                    data: categoryTotals,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    }

    expenseForm.addEventListener('submit', addExpense);
    renderExpenses();
});
