package com.karthik.ledger.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RefreshInterestResponse {

    private Long loanId;

    private Integer daysCalculated;

    private BigDecimal interestAdded;

    private BigDecimal totalInterestDue;

    private String message;

}