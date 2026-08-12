package com.karthik.ledger.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import Enum.CustomerBalanceStatus;
import Enum.LoanTransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "loan_transactions")
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class LoanTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private CustomerLoan loan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanTransactionType transactionType;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "outstanding_after_transaction", nullable = false)
    private BigDecimal outstandingAfterTransaction;
    
    @Column(name = "customer_outstanding_after_transaction", nullable = false)
    private BigDecimal customerOutstandingAfterTransaction;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "customer_balance_status_after_transaction",nullable = true)
    private CustomerBalanceStatus customerBalanceStatusAfterTransaction;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

}