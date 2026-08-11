package com.karthik.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerHistoryResponse {

    private Long transactionId;
    
    private Long loanId;

    private String transactionType;

    private BigDecimal amount;

    private BigDecimal outstandingAfterTransaction;

    private String description;

    private LocalDate transactionDate;
    
    private LocalDateTime createdAt;
    
    
}