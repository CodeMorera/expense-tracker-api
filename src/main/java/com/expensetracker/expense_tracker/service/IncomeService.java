package com.expensetracker.expense_tracker.service;

import com.expensetracker.expense_tracker.entity.Expense;
import com.expensetracker.expense_tracker.entity.Income;
import com.expensetracker.expense_tracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository){
        this.incomeRepository = incomeRepository;
    }

    public Income addIncome(Income income){
        return incomeRepository.save(income);
    }

    public List<Income> getAllIncome(){
        return incomeRepository.findAll();
    }

    public double getTotalIncome() {
        return incomeRepository.findAll()
                .stream()
                .mapToDouble(Income::getAmount)
                .sum();
    }
}
