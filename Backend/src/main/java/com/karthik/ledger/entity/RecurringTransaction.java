package com.karthik.ledger.entity;

import java.time.LocalDate;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import Enum.Frequency;
import Enum.ReferenceType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "recurring_transaction")
public class RecurringTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Owner of recurring transaction
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // PERSONAL or CUSTOMER
//    @Enumerated(EnumType.STRING)
//    @Column(name = "module_type", nullable = false)
//    private ModuleType moduleType;

    /*
     * Stores the ID of the source record.
     *
     * PERSONAL  -> Transaction.id
     * CUSTOMER  -> CustomerTransaction.id
     */
    @Column(name = "reference_id", nullable = false)
    private Long referenceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Frequency frequency;

    // Original recurring schedule (never changes because of postpone)
    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    // Current reminder date (changes if user clicks "Remind Me Later")
    @Column(name = "reminder_date", nullable = false)
    private LocalDate reminderDate;

    // Number of times reminder was postponed
    @Column(name = "reminder_count")
    private Integer reminderCount = 0;

    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "approval_required", nullable = false)
    private Boolean approvalRequired = true;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "reference_type", nullable = false)
    private ReferenceType referenceType;
}