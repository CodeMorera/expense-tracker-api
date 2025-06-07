# 💰 Money Clip – Expense & Income Tracker

Money Clip is a simple web-based financial tracking app built with Java, Spring Boot, HTML/CSS/JS. It allows users to log expenses and income, export CSV reports, and view their financial history locally.
## Features
- Add income and expense entries
- View them in live tables (stored in memory or in database)
- Export income or expenses to CSV
- Clean and responsive UI
- Data validation
- Backend: Spring Boot + MySQL
- Frontend: HTML, CSS, JavaScript

## 🛠️ Technologies Used
### Backend:
- Java 23
- Spring Boot 3.5
- Spring Web
- JPA (with optional H2 or MySQL)

### Frontend:
- HTML
- CSS (custom)
- JavaScript (Vanilla)

## Live Demo
🚀 COMING SOON

## How to Run Locally
1. Clone the repo <br>
   ```git clone https://github.com/CodeMorera/expense-tracker-api.git```<br>
   ``` cd expense-tracker-api``` 
2. Install Java 17+ and Maven
3. Run:
   ```bash
   mvn spring-boot:run
4. Then visit:
   ```bash
   http://localhost:8080

## Endpoints
|Endpoint|Method|Description|
| --- | - | ---|
|/api/expenses|GET|Get all expenses|
|/api/expenses|POST|Add a new expense|
|/api/expenses/export|GET|Export expenses to CSV|
|/api/income|GET|Get all income entries|
|/api/income|POST|Add a new income entry|
|/api/income/export|GET|Export income to CSV|

## 🙌 Credits
Created by @CodeMorera