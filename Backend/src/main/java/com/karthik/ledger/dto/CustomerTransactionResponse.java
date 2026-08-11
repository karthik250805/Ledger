package com.karthik.ledger.dto;

import java.math.BigDecimal;

import Enum.CustomerTransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CustomerTransactionResponse {

    private Long id;

    private String customerName;

    private CustomerTransactionType transactionType;

    private BigDecimal amount;
    
    private BigDecimal afteramount;

    private String message;
    

}