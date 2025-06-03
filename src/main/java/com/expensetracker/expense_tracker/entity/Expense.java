package com.expensetracker.expense_tracker.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Expense {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String description;
    private double amount;
    private LocalDate date;

    public Expense(String category, String description, double amount, LocalDate date){
        this.category = category;
        this.description = description;
        this.amount = amount;
        this.date = date;
    }

    public Expense() {

    }

    public String getCategory() {return category;}
    public String getDescription() {return description;}
    public double getAmount() {return amount;}
    public LocalDate getDate() {return date;}

    public String toString(){
        return String.format("%s | %s | %.2f |%s",
                category,description,amount,date);
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
