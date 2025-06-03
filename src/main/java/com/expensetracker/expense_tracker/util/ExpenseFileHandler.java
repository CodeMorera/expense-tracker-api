package com.expensetracker.expense_tracker.util;

import com.expensetracker.expense_tracker.entity.Expense;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class ExpenseFileHandler {
    public static void saveExpensesToFile(List<Expense> expenses, String filename){
        Path outputTxtFilePath = Paths.get(filename);
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputTxtFilePath.toFile()))){
            for(Expense expense : expenses){
                String line = String.format("%s|%s|%.2f|%s",
                        expense.getCategory(),
                        expense.getDescription(),
                        expense.getAmount(),
                        expense.getDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
                writer.write(line);
                writer.newLine();}

        }catch(IOException e){
            e.printStackTrace();
        }
    }

    public static List<Expense> loadExpenseFromFile(String filename) {
        BufferedReader reader;
        try {
            reader = new BufferedReader(new FileReader(filename));
            String line = reader.readLine();
            List<Expense> expenses = new ArrayList<>();
            while (line != null) {
                String[] s = line.split("\\|");
                String category = s[0];
                String description = s[1];
                double amount = Double.parseDouble(s[2]);
                LocalDate date = LocalDate.parse(s[3]);

                Expense expense = new Expense(category,description,amount,date);
                expenses.add(expense);
                ExpenseUtils.printExpenses(expenses);
                line = reader.readLine();
            }
            reader.close();
            return expenses;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }
}
