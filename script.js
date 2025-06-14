let total = 0; //Переменная для хранения общей суммы

function toggleTheme() {
    document.body.classList.toggle("dark-theme")
}

function addExpense(){
    let name = document.getElementById("expenseName").value;
    let amount = Number(document.getElementById("expenseAmount").value);
    let category = document.getElementById("expenseCategory").value;

    if (name === "" || amount <= 0) {
        alert("Введите корректные данные!");
        return;
    }

    //Обновляем общую сумму
    total += amount;
    document.getElementById("totalAmount").textContent = total;

    let table = document.getElementById("expenseTable");
    let row = table.insertRow(); // создаем новую строку в таблице

    //добавляем ячейки
    let rowIndex = table.rows.length;
    row.insertCell(0).textContent = table.rows.length; //номер
    row.insertCell(1).textContent = name; //название
    row.insertCell(2).textContent = `${amount} ₽`; //сумма
    row.insertCell(3).textContent = category; //категория

    //кнопку удаления
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.classList.add("delete-btn")
    deleteButton.onclick = function() {
        total -= amount;
        document.getElementById("totalAmount").textContent = total;
        row.remove() //удаляем строку из таблицы
        updateNumbers(); //обновляем нумерацию
        saveExpense(); //сохраняем изменения в localStorage
    };

    //добавляем кнопку в последнюю ячейку
    let actionCell = row.insertCell(4);
    actionCell.appendChild(deleteButton)

    //Очищаем поля ввода
    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";

    updateNumbers();
    saveExpense(); //сохраняем изменения
}

//функция обновления номеров после удаления
function updateNumbers() {
    let rows = document.querySelectorAll("#expenseTable tr");
    rows.forEach((row, index) => {
        if (row.cells.length > 0) {
            row.cells[0].textContent = index + 1; //перенумеровываем
        }
    })
}

//кнопка очистить
function deleteExpense(){
    document.getElementById("expenseTable").innerHTML = "";
    document.getElementById("totalAmount").textContent = "0";
    total = 0;
}

//функция сохранения в localStorage
function saveExpense() {
    let expenses = [];
    document.querySelectorAll("#expenseTable tr").forEach(row => {
        if (row.cells.length > 3) {
            let name = row.cells[1].textContent;
            let amount = parseFloat(row.cells[2].textContent);
            let category = row.cells[3].textContent;
            expenses.push({name, amount, category});
        }
    })
    
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("total", total);
}

//функция выгрузки из localStorage
function loadExpense() {
    let savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    total = Number(localStorage.getItem("total")) || 0;
    document.getElementById("totalAmount").textContent = total;

    let table = document.getElementById("expenseTable");

    savedExpenses.forEach((expense, index) => {
        let row = table.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = expense.name;
        row.insertCell(2).textContent = `${expense.amount} ₽`;
        row.insertCell(3).textContent = expense.name;

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.classList.add("delete-btn")
        deleteButton.onclick = function() {
            total -= expense.amount;
            document.getElementById("totalAmount").textContent = total;
            row.remove() //удаляем строку из таблицы
            updateNumbers(); //обновляем нумерацию
            saveExpense();
        }

        let actionCell = row.insertCell(3);
        actionCell.appendChild(deleteButton);   
    })

    updateNumbers();
}

// Загружаем данные при загрузке страницы
window.onload = loadExpense;