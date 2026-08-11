package com.karthik.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GiveReceiveRequest {

    private Long customerId;

    private BigDecimal amount;

    private String description;

    private LocalDate transactionDate;

}