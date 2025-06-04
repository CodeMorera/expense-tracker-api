package com.expensetracker.expense_tracker.controller;

import com.expensetracker.expense_tracker.entity.Expense;
import com.expensetracker.expense_tracker.entity.Income;
import com.expensetracker.expense_tracker.service.IncomeService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {
    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService){
        this.incomeService = incomeService;
    }

    @GetMapping
    public List<Income> getALLIncome(){
        return incomeService.getAllIncome();
    }

    @PostMapping
    public Income addIncome(@RequestBody Income income){
        return incomeService.addIncome(income);
    }

    @GetMapping("/export")
    public void exportExpensesToCSV(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        String headerValue = "attachment; filename=expenses.csv";
        response.setHeader("Content-Disposition", headerValue);
        List<Income> incomes = incomeService.getAllIncome();
        PrintWriter writer = response.getWriter();
        writer.println("ID,Category,Description,Amount,Date");
        for(Income income : incomes){
            writer.println(String.format("%d,%s,%s,%.2f,%s",
                    income.getId(),
                    income.getCategory(),
                    income.getDescription(),
                    income.getAmount(),
                    income.getDate()));
        }
        writer.flush();
        writer.close();
    }
}
