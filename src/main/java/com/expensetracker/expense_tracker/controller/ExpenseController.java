package com.expensetracker.expense_tracker.controller;
import com.expensetracker.expense_tracker.entity.Expense;
import com.expensetracker.expense_tracker.service.ExpenseManager;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    private final ExpenseManager expenseManager;

    public ExpenseController(ExpenseManager expenseManager){
        this.expenseManager = expenseManager;
    }


    @GetMapping
    public List<Expense> getAllExpenses(){
        logger.debug("Fetching all expenses");
        return expenseManager.getAllExpenses();
    }

  @PostMapping
    public ResponseEntity<?> addExpense(@Valid @RequestBody Expense expense, BindingResult result){
        logger.info("Received request to add expense: {}", expense);
        if (result.hasErrors()){
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .toList();
            logger.error("Failed to save expense: {}", expense);
            return ResponseEntity.badRequest().body(errors);
        }
        Expense savedExpense = expenseManager.addExpense(expense);
        logger.info("Successfully saved expense with ID {}: {}", savedExpense.getId(), savedExpense);
        return ResponseEntity.ok(savedExpense);

    }

    @GetMapping("/export")
    public void exportExpensesToCSV(HttpServletResponse response) throws IOException{
        try{
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
        catch (IOException e){
            logger.error("Failed to export CSV file", e);
        }
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalError(Exception ex) {
        logger.error("Unexpected error occurred", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong.");
    }
}

