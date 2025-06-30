//Notes as I refresh myself in JavaScript
let totalExpense = 0;
let totalIncome = 0;

function clearIncomeErrors(){
    document.getElementById("incomeCategoryError").textContent = "";
    document.getElementById("incomeDescriptionError").textContent = "";
    document.getElementById("incomeAmountError").textContent = "";
    document.getElementById("incomeDateError").textContent="";

    document.getElementById("income-category").classList.remove("error");
    document.getElementById("income-description").classList.remove("error");
    document.getElementById("income-amount").classList.remove("error");
    document.getElementById("income-date").classList.remove("error");
}

function addIncome(){
    clearIncomeErrors();

    const categoryField = document.getElementById("income-category");
    const descriptionField = document.getElementById("income-description");
    const amountField = document.getElementById("income-amount");
    const dateField = document.getElementById("income-date");

    const category = categoryField.value;
    const description =descriptionField.value;
    const amountInput =amountField.value;
    const amount = amountInput ? parseFloat(amountInput) : 0;
    const dateValue = dateField.value || new Date().toISOString().slice(0,10);
    const today = new Date().toISOString().slice(0,10);

    let hasError = false;

    if(category === "blank"){
        document.getElementById("incomeCategoryError").textContent = "Must select a category."
        categoryField.classList.add("error");
        hasError = true;
    }

    if(isNaN(amount) || amount <= 0){
        document.getElementById("incomeAmountError").textContent = "Amount must be a positive number"
        amountField.classList.add("error");
        hasError = true;
    }

    if(!description){
        document.getElementById("incomeDescriptionError").textContent = "Must write a description."
        descriptionField.classList.add("error");
        hasError = true;
    }

    if(!dateValue || dateValue > today){
        document.getElementById("incomeDateError").textContent = "Must select a date"
        dateField.classList.add("error");
        hasError = true;
    }

    if (hasError) return;

    const income ={
        category,
        description,
        amount,
        date: dateValue
    };
    fetch('/api/income',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(income)
    })
        .then(response =>{
            if (!response.ok){
                throw new Error("Failed to add income");
            }
            return response.json();
        })
        .then(data => {
        console.log("Income data added:", data);
        loadIncome().then(refreshSummary);
    })
        .catch(error =>{
        console.log("Error adding income:", error)
    })

}

function downloadIncomeCSV(){
    window.location.href = '/api/income/export'
}

function loadIncome(){
    return fetch('/api/income')
        .then(response => response.json())
        .then(data => {
            console.log("Income data loaded:",data);
            const table = document.getElementById('incomeTable').getElementsByTagName("tbody")[0];
            if (!table) return data;

            totalIncome = 0;
            table.innerHTML = "";

            data.forEach(income =>{
                totalIncome += income.amount
                const row = table.insertRow();
                row.insertCell().textContent = income.category;
                row.insertCell().textContent = income.description;
                row.insertCell().textContent = `$${income.amount}`;
                row.insertCell().textContent = income.date;
            });

            const summary = document.getElementById("incomeSummary");
            if (summary) {
                summary.textContent = `Total Income: $${totalIncome.toFixed(2)}`;
            }
            return data;
            // return Promise.resolve();
        })
        .catch(error =>{
            console.log("Failed to load income", error);
            return [];
        });
}

function clearExpenseErrors(){
    document.getElementById("expenseAmountError").innerText = "";
    document.getElementById("expenseCategoryError").innerText = "";
    document.getElementById("expenseDescriptionError").innerText = "";
    document.getElementById("expenseDateError").innerText = "";

    document.getElementById("category").classList.remove("error");
    document.getElementById("description").classList.remove("error");
    document.getElementById("amount").classList.remove("error");
    document.getElementById("expense-date").classList.remove("error");

}

function addExpense(){
    clearExpenseErrors();

    const categoryField = document.getElementById("category");
    const descriptionField = document.getElementById("description");
    const amountField = document.getElementById("amount");
    const dateField = document.getElementById("expense-date");

    const category = categoryField.value;
    const description = descriptionField.value;
    const amountInput = amountField.value
    const amount = amountInput ? parseFloat(amountInput) : 0;
    const dateValue = dateField.value || new Date().toISOString().slice(0,10);
    const today = new Date().toISOString().slice(0,10);

    let hasError = false;

    if(category === "blank"){
        document.getElementById("expenseCategoryError").textContent = "Must select a category."
        categoryField.classList.add("error");
        hasError = true;
    }

    if(isNaN(amount) || amount <= 0){
        document.getElementById("expenseAmountError").textContent = "Amount must be a positive number"
        amountField.classList.add("error");
        hasError = true;
    }

    if(!description){
        document.getElementById("expenseDescriptionError").textContent = "Must write a description."
        descriptionField.classList.add("error");
        hasError = true;
    }

    if(!dateValue || dateValue > today){
        document.getElementById("expenseDateError").textContent = "Must select a date"
        dateField.classList.add("error");
        hasError = true;
    }

    if (hasError) return;

    const expense = {
        category,
        description,
        amount,
        date: dateValue
    };
    fetch('/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Failed to add expense");
        }
        return response.json();
    })
    .then(data => {
        console.log("Expense added:", data);
        loadExpenses().then(refreshSummary);
    })
        .catch(error =>{
            console.log("Error adding expense:", error)
        })
}

function downloadCSV(){
    window.location.href = '/api/expenses/export'
}

function loadExpenses(){
    return fetch('/api/expenses')//making the GET request with JavaScript built in method
        .then(response => response.json())//Once request is successful, turn it to json
        .then(data =>{ //when json is ready, holds the array of objects
            console.log(data);
            // ToDO: render to the table later
            const table = document.getElementById('expensesTable').getElementsByTagName("tbody")[0];
            if (!table) return data;

            totalExpense = 0;
            table.innerHTML = "";

            data.forEach(expense =>{//looping through data array to fill table
                totalExpense += expense.amount;
                const row = table.insertRow();
                row.insertCell().textContent = expense.category;
                row.insertCell().textContent = expense.description;
                row.insertCell().textContent = `$${expense.amount}`;
                row.insertCell().textContent = expense.date;
            });

            const summary = document.getElementById("expenseSummary");
            if (summary) {
                summary.textContent = `Total Expense: $${totalExpense.toFixed(2)}`;
            }
            return data;
            // return Promise.resolve();
        })
        .catch(error => {
            console.log("Failed to load expenses:", error);
            return [];
        });
}
function updateNetSavings(){
    console.log("Updating net savings...");

    const summaryEl = document.getElementById("netSummary");
    const timeEl = document.getElementById("netTimestamp");

    if (!summaryEl || !timeEl) {
        console.error("Missing summary/timestamp element");
        return;
    }
    const incomeRows = document.querySelectorAll("#incomeTable tr:not(:first-child)");
    const expenseRows = document.querySelectorAll("#expensesTable tr:not(:first-child)");
    const filterValue = document.getElementById("netFilter").value;

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let filteredIncome = 0;
    incomeRows.forEach(row => {
        const date = new Date(row.cells[3].textContent);

        if (filterValue === "this-month") {
            if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
                filteredIncome += parseFloat(row.cells[2].textContent.replace('$','').trim());
            }
        } else if (filterValue === "last-month") {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            if (date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()) {
                filteredIncome += parseFloat(row.cells[2].textContent.replace('$','').trim());
            }
        } else {
            // default to all-time
            filteredIncome += parseFloat(row.cells[2].textContent.replace('$','').trim());
        }
    });
    let filteredExpense = 0;
    expenseRows.forEach(row => {
        const date = new Date(row.cells[3].textContent);

        if (filterValue === "this-month") {
            if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
                filteredExpense += parseFloat(row.cells[2].textContent.replace('$','').trim());
            }
        } else if (filterValue === "last-month") {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            if (date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()) {
                filteredExpense += parseFloat(row.cells[2].textContent.replace('$','').trim());
            }
        } else {
            filteredExpense += parseFloat(row.cells[2].textContent.replace('$','').trim());
        }
    });


    const net = filteredIncome - filteredExpense;
    summaryEl.textContent = `Net Savings: $${net.toFixed(2)}`;

    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeEl.textContent = `Last updated: ${formattedTime}`;

    console.log("Income rows found:", incomeRows.length);
    console.log("Expense rows found:", expenseRows.length);
}

function generateReport(){
    const period = document.getElementById("report-period").value;

    Promise.all([
        fetch('/api/income').then(res => res.json()),
        fetch('/api/expenses').then(res => res.json())
    ])
    .then(([incomes, expenses])=>{
        const filteredIncomes = filteredByDateRange(incomes, period);
        const filteredExpenses = filteredByDateRange(expenses,period);

        if (document.getElementById("incomeChart")) {
            renderIncomeChart(filteredIncomes);
        } else {
            console.warn("incomeChart canvas not found.");
        }

        if (document.getElementById("expenseChart")) {
            renderExpenseChart(filteredExpenses);
        } else {
            console.warn("expenseChart canvas not found.");
        }

        // renderIncomeChart(filteredIncomes);
        // renderExpenseChart(filteredExpenses);

        const incomeTotal = sumAmounts(filteredIncomes);
        const expenseTotal = sumAmounts(filteredExpenses);
        const net = incomeTotal - expenseTotal;

        const reportHtml = `
        <h3>Summary for: ${formatReportLabel(period)}</h3>
        <p><strong>Total Income:</strong>$${incomeTotal.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong>$${expenseTotal.toFixed(2)}</p>
        <p><strong>Net Savings:</strong>$${net.toFixed(2)}</p>
        <br>
        <h4>Income Breakdown</h4>
        ${buildTableHTML(filteredIncomes)}
        
        <h4>Expense Breakdown</h4>
        ${buildTableHTML(filteredExpenses)}
    `;
        document.getElementById("report-content").innerHTML = reportHtml;
    })
    .catch(error => console.error("Error generating report:", error));
}

function formatReportLabel(value){
    switch(value){
        case "this-month" : return "This Month";
        case "last-month" : return "Last Month";
        case "year-to-date":return "Year to Date";
        case "last-year" : return "Last Year";
        default: return "All Time"
    }
}

function buildTableHTML(data) {
    if (data.length === 0) return "<p>No records found for this period.</p>";

    let rows = data.map(item => `
        <tr>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>$${item.amount.toFixed(2)}</td>
            <td>${item.date}</td>
        </tr>
    `).join("");

    return `
        <table>
            <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
            </tr>
            ${rows}
        </table>
    `;
}

function downloadCombineCSV(){
    const period = document.getElementById("report-period").value;

    Promise.all([
        fetch('/api/income').then(res => res.json()),
        fetch('/api/expenses').then(res => res.json())
    ])
        .then(([incomes, expenses]) => {
            const allIncomes = incomes.map(item => ({
                type: "Income",
                ...item
            }));
            const allExpenses = expenses.map(item => ({
                type: "Expense",
                ...item
            }));

            const filteredData = filteredByDateRange([...allIncomes, ...allExpenses], period);

            let csv = "Type,Category,Description,Amount,Date\n";
            filteredData.forEach(item => {
                csv += `${item.type},${item.category},${item.description},${item.amount},${item.date}\n`;
            });

            const blob = new Blob([csv], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `MoneyClip_Report_${period}.csv`;
            link.click();
        })
        .catch(error => console.error("Error exporting CSV:", error));

}

function filteredByDateRange(data,range){
    const now = new Date();
    return data.filter(item =>{
        const [year, month, day] = item.date.split("-");
        const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
        switch(range.toLowerCase()){
            case 'all':
            case 'all time':
                return true;
            case 'this-month':
                return itemDate.getMonth() ===now.getMonth() &&
                        itemDate.getFullYear() === now.getFullYear();
            case 'last-month':
                const lastMonth = new Date(now);
                lastMonth.setMonth(now.getMonth()-1);
                return itemDate.getMonth() === lastMonth.getMonth() &&
                       itemDate.getFullYear() === lastMonth.getFullYear();
            case 'year-to-date':
                return itemDate.getFullYear() === now.getFullYear();
            case 'last-year':
                return itemDate.getFullYear() === now.getFullYear()-1;
            default:
                return false;
        }
    })
}

function sumAmounts(data){
    return data.reduce((total, item) => total + item.amount, 0);
}
window.onload = function () {
    const today = new Date().toISOString().split("T")[0];
    const expenseDate = document.getElementById("expense-date");
    const incomeDate = document.getElementById("income-date");
    if (expenseDate) expenseDate.max = today;
    if (incomeDate) incomeDate.max = today;

    // Load data for index page
    const onHome = document.getElementById("incomeTable") && document.getElementById("expensesTable");
    if (onHome) {
        Promise.all([loadExpenses(), loadIncome()])
            .then(()=>{
                console.log(" Both income and expenses loaded. Refreshing summary...")
                updateNetSavings();
            });

        const netFilter = document.getElementById("netFilter");
        if (netFilter) {
            netFilter.addEventListener("change", () => {
                console.log("Dropdown changed!");
                refreshSummary();
            });

        }
    }

    // For report page
    const reportPeriod = document.getElementById("report-period");
    if (reportPeriod) {
        reportPeriod.addEventListener("change", generateReport);
        generateReport(); // ✅ trigger once on load
    }
};


function renderExpenseChart(expenses){
    const canvas =document.getElementById('expenseChart');
    if (!canvas){
        console.error("expenseChart canvas not found");
        return;
    }

    const categoryTotals = {};
    expenses.forEach(item =>{
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if(window.expenseChartInstance){
        window.expenseChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    window.expenseChartInstance = new Chart(ctx,{
        type: 'bar',
        data:{
            labels: labels,
            datasets: [{
                label: 'Expense by Category',
                data: data,
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: 'rgba(76,175,80,1)'
            }]
        },
        options:{
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title:{
                    display: true,
                    text: 'Expense Breakdown by Category'
                }
            },
            scales:{
                y:{
                    beginAtZero: true,
                    ticks: {
                        callback: function(value){
                            return '$' + value;
                        }
                    }
                }
            }
        }
    })
}

function renderIncomeChart(incomes){
    const canvas = document.getElementById('incomeChart');
    if(!canvas){
        console.error("incomeChart canvas not found");
        return;
    }

    const categoryTotals = {};
    incomes.forEach(item =>{
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    // Prepare data for chart
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    //If chart already exists, lets destroy it to prevent duplicates
    if (window.incomeChartInstance){
        window.incomeChartInstance.destroy();
    }
    const ctx = canvas.getContext('2d');
    window.incomeChartInstance = new Chart(ctx,{
        type: 'bar',
        data:{
            labels: labels,
            datasets:[{
                label: 'Income by Category',
                data: data,
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 1
            }]
        },
        options:{
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title:{
                    display: true,
                    text: 'Income Breakdown by Category'
                }
            },
            scales:{
                y:{
                    beginAtZero: true,
                    ticks: {
                        callback: function(value){
                            return '$' + value;
                        }
                    }
                }
            }
        }
    })
}

function refreshSummary(){
    console.log("Calling refreshSummary...");
    Promise.all([loadExpenses(), loadIncome()])
        .then(() => {
            console.log("Data reloaded. Now updating net savings...");
            updateNetSavings();
        })
        .catch(error => {
            console.error("Failed to refresh data before summary:", error);
        });
}

function showCharts(){
    document.getElementById("charts-container").style.display = "block";
}

function hideCharts(){
    document.getElementById("charts-container").style.display = "none";
}