package com.expensetracker.expense_tracker.util;

import com.expensetracker.expense_tracker.entity.Expense;

import java.util.List;

public class ExpenseUtils {
    public static void printExpenses(List<Expense> expenses){
        for (Expense e : expenses){
            System.out.println(e);
        }
    }
}
