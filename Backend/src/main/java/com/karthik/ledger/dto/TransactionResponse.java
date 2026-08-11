package com.karthik.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import Enum.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Long transactionId;

    private TransactionType transactionType;

    private BigDecimal amount;

//    private LocalDate transactionDate;
    private String message;
    
}
