package com.expensetracker.expense_tracker.controller;

import com.expensetracker.expense_tracker.entity.Income;
import com.expensetracker.expense_tracker.service.IncomeService;
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
@RequestMapping("/api/income")
public class IncomeController {
    private final IncomeService incomeService;

    private static final Logger logger = LoggerFactory.getLogger(IncomeController.class);

    public IncomeController(IncomeService incomeService){
        this.incomeService = incomeService;
    }

    @GetMapping
    public List<Income> getALLIncome(){
        logger.debug("Fetching all incomes");
        return incomeService.getAllIncome();
    }

  @PostMapping
    public ResponseEntity<?> addIncome(@Valid @RequestBody Income income, BindingResult result){
        logger.info("Received request to add income: {}",income);
        if (result.hasErrors()){
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .toList();
            logger.error("Failed to save income: {}", income);
            return ResponseEntity.badRequest().body(errors);
        }
        Income savedIncome = incomeService.addIncome(income);
        logger.info("Successfully saved income with ID {}: {}", savedIncome.getId(), savedIncome);
        return ResponseEntity.ok(savedIncome);
    }

    @GetMapping("/export")
    public void exportExpensesToCSV(HttpServletResponse response) throws IOException {
        try{
            response.setContentType("text/csv");
            String headerValue = "attachment; filename=income.csv";
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
        }catch (IOException e){
            logger.error("Failed to export CSV file", e);
        }

    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalError(Exception ex) {
        logger.error("Unexpected error occurred", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong.");
    }
}

