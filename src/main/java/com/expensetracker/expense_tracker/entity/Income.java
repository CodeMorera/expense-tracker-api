package com.expensetracker.expense_tracker.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

@Entity
public class Income {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "A brief description is required")
    private String description;
    
    @DecimalMin(value = "0.01", message = "Input must be more than zero" )
    private Double amount;

    private LocalDate date;

    public Income(String category,Double amount, LocalDate date){
        this.category = category;
        this.amount = amount;
        this.date = date;
    }

    public Income() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
