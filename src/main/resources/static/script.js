//Notes as I refresh myself in JavaScript
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
                throw new Erro("Failed to add income");
            }
            return response.json();
        })
        .then(data => {
            console.log("Income data added:", data);
            loadIncome();
            document.querySelectorAll('form')[0].reset();
        }).catch(error =>{
        console.log("Error adding income:", error)
    })

}

function downloadIncomeCSV(){
    window.location.href = '/api/income/export'
}

function loadIncome(){
    fetch('/api/income')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('incomeTable');
            table.innerHTML =`
            <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
            </tr>`;
            let total = 0;
            data.forEach(income =>{
                total += income.amount
                const row = `
                  <tr>
                    <td>${income.category}</td>
                    <td>${income.description}</td>
                    <td>${income.amount}</td>
                    <td>${income.date}</td>
                  </tr>`;
                table.innerHTML += row;
            });
            document.getElementById("incomeSummary")
                .textContent = `Total Income: $${total.toFixed(2)}`;
            updateNetSavings();
        })
        .catch(error => console.log(error));
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
        loadExpenses();
    }).catch(error =>{
            console.log("Error adding expense:", error)
        })
}

function downloadCSV(){
    window.location.href = '/api/expenses/export'
}

function loadExpenses(){
    fetch('/api/expenses')//making the GET request with JavaScript built in method
        .then(response => response.json())//Once request is successful, turn it to json
        .then(data =>{ //when json is ready, holds the array of objects
            console.log(data);
            // ToDO: render to the table later
            const table = document.getElementById('expensesTable');
            table.innerHTML = '';//prevent duplicates by clearing
            const headerRow = `
                <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
            `;
            table.innerHTML += headerRow
            let total = 0
            data.forEach(expense =>{//looping through data array to fill table
                total += expense.amount;
                const row =`
                    <tr>
                        <td>${expense.category}</td>
                        <td>${expense.description}</td>
                        <td>${expense.amount}</td>
                        <td>${expense.date}</td>
                    
                    </tr>`;
                table.innerHTML += row;
            });
            document.getElementById("expenseSummary")
                .textContent = `Total Expenses: $${total.toFixed(2)}`;
            updateNetSavings();
        })
        .catch(error => console.error(error));
}

function updateNetSavings(){
    const incomeText = document.getElementById("incomeSummary").textContent;
    const expenseText = document.getElementById("expenseSummary").textContent;

    const income = parseFloat(incomeText.replace(/[^\d.]/g,""));
    const expense = parseFloat(expenseText.replace(/[^\d.]/g,""));

    const net = income - expense;
    document.getElementById("netSummary").textContent = `Net Savings: $${net.toFixed(2)}`;

}

window.onload = function () {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("expense-date").max = today;
    document.getElementById("income-date").max = today;
    loadExpenses();
    loadIncome()
}
