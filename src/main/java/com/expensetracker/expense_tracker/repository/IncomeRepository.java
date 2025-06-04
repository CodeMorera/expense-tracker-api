package com.expensetracker.expense_tracker.repository;
import com.expensetracker.expense_tracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income, Long> {
}
