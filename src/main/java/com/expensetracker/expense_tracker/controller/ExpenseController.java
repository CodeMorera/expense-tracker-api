package com.expensetracker.expense_tracker.controller;

import com.expensetracker.expense_tracker.entity.Expense;
import com.expensetracker.expense_tracker.repository.ExpenseRepository;
import com.expensetracker.expense_tracker.service.ExpenseManager;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {


    private final ExpenseManager expenseManager;

    public ExpenseController(ExpenseManager expenseManager){
        this.expenseManager = expenseManager;
    }


    @GetMapping
    public List<Expense> getAllExpenses(){
        return expenseManager.getAllExpenses();
    }

    @PostMapping
    public Expense addExpenses(@RequestBody Expense expense){
        return expenseManager.addExpense(expense);
    }

    @GetMapping("/export")
    public void exportExpensesToCSV(HttpServletResponse response) throws IOException{
        response.setContentType("text/csv");
        String headerValue = "attachment; filename=expenses.csv";
        response.setHeader("Content-Disposition", headerValue);
        List<Expense> expenses = expenseManager.getAllExpenses();
        PrintWriter writer = response.getWriter();
        writer.println("ID,Category,Description,Amount,Date");
        for(Expense expense : expenses){
            writer.println(String.format("%d,%s,%s,%.2f,%s",
                    expense.getId(),
                    expense.getCategory(),
                    expense.getDescription(),
                    expense.getAmount(),
                    expense.getDate()));
        }
        writer.flush();
        writer.close();
    }



}
