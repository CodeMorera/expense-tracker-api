//Notes as I refresh myself in JavaScript
function addIncome(){
    const category = document.getElementById("income-category").value;
    const description = document.getElementById("income-description").value;
    const amountInput = document.getElementById("income-amount").value;
    const amount = amountInput ? parseFloat(amountInput) : 0;
    const date = new Date().toISOString().slice(0,10);

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

function addExpense(){
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const amountInput = document.getElementById("amount").value;
    const amount = amountInput ? parseFloat(amountInput) : 0;
    const date = new Date().toISOString().slice(0,10);

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
