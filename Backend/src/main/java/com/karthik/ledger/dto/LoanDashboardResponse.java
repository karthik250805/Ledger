package com.karthik.ledger.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoanDashboardResponse {

    private Long activeLoans;

    private Long closedLoans;

    private BigDecimal interestReceivable;

    private BigDecimal interestPayable;
}