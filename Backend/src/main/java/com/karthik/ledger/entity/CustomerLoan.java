package com.karthik.ledger.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import Enum.Frequency;
import Enum.IntrestType;
import Enum.LoanDirection;
import Enum.LoanStatus;
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

@Getter
@Setter
@Entity
@Table(name = "loan")
@EntityListeners(AuditingEntityListener.class)
public class CustomerLoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Logged in user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // LEND or BORROW
    @Enumerated(EnumType.STRING)
    @Column(name = "loan_direction", nullable = false)
    private LoanDirection loanDirection;

    // SIMPLE or COMPOUND
    @Enumerated(EnumType.STRING)
    @Column(name = "interest_type", nullable = false)
    private IntrestType interestType;

    // Example: 3.00 (%)
    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    // MONTHLY, YEARLY etc.
    @Enumerated(EnumType.STRING)
    @Column(name = "interest_frequency", nullable = false)
    private Frequency interestFrequency;

    // Original loan amount
    @Column(name = "principal_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal principalAmount;

    // Remaining principal
    @Column(name = "outstanding_principal", nullable = false, precision = 15, scale = 2)
    private BigDecimal outstandingPrincipal;

    // Current accumulated interest
    @Column(name = "interest_due", precision = 15, scale = 2)
    private BigDecimal interestDue = BigDecimal.ZERO;
    
    

    // Next reminder date
    @Column(name = "next_interest_date", nullable = false)
    private LocalDate nextInterestDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanStatus status = LoanStatus.ACTIVE;

    @Column(length = 255)
    private String notes;

    @Column(name = "last_interest_calculated_date", nullable = false)
    private LocalDate lastInterestCalculatedDate;
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}