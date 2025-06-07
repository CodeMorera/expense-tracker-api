//Notes as I refresh myself in JavaScript
function clearIncomeErrors(){
    document.getElementById("incomeCategoryError").textContent = "";
    document.getElementById("incomeDescriptionError").textContent = "";
    document.getElementById("incomeAmountError").textContent = "";

    document.getElementById("income-category").classList.remove("error");
    document.getElementById("income-description").classList.remove("error");
    document.getElementById("income-amount").classList.remove("error");
}

function addIncome(){
    clearIncomeErrors();

    const categoryField = document.getElementById("income-category");
    const descriptionField = document.getElementById("income-description");
    const amountField = document.getElementById("income-amount");

    const category = categoryField.value;
    const description =descriptionField.value;
    const amountInput =amountField.value;
    const amount = amountInput ? parseFloat(amountInput) : 0;
    const date = new Date().toISOString().slice(0,10);

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

    if (hasError) return;

    const income ={
        category,
        description,
        amount,
        date
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
            data.forEach(income =>{
                const row = `
                  <tr>
                    <td>${income.category}</td>
                    <td>${income.description}</td>
                    <td>${income.amount}</td>
                    <td>${income.date}</td>
                  </tr>`;
                table.innerHTML += row;
            });
        })
        .catch(error => console.log(error));
}

function clearExpenseErrors(){
    document.getElementById("expenseAmountError").innerText = "";
    document.getElementById("expenseCategoryError").innerText = "";
    document.getElementById("expenseDescriptionError").innerText = "";

    document.getElementById("category").classList.remove("error");
    document.getElementById("description").classList.remove("error");
    document.getElementById("amount").classList.remove("error");

}

function addExpense(){
    clearExpenseErrors();

    const categoryField = document.getElementById("category");
    const descriptionField = document.getElementById("description");
    const amountField = document.getElementById("amount")

    const category = categoryField.value;
    const description = descriptionField.value;
    const amountInput = amountField.value
    const amount = amountInput ? parseFloat(amountInput) : 0;
    const date = new Date().toISOString().slice(0,10);

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

    if (hasError) return;

    const expense = {
        category,
        description,
        amount,
        date
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

            data.forEach(expense =>{//looping through data array to fill table
                const row =`
                    <tr>
                        <td>${expense.category}</td>
                        <td>${expense.description}</td>
                        <td>${expense.amount}</td>
                        <td>${expense.date}</td>
                    
                    </tr>`;
                table.innerHTML += row;
            })
        })
        .catch(error => console.error(error));
}

window.onload = function () {
    loadExpenses();
    loadIncome()
}
