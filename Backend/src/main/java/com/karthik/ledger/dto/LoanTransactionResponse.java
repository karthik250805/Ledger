package com.karthik.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import Enum.LoanTransactionType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoanTransactionResponse {

    private Long transactionId;

    private LoanTransactionType transactionType;

    private BigDecimal amount;
    
    private BigDecimal outstandingAfterTransaction;
    
    private BigDecimal customerOutstandingAfterTransaction;

    private String description;

    private LocalDate transactionDate;
}