package com.karthik.ledger.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardResponse {

    private BigDecimal cashBalance;

    private BigDecimal moneyToReceive;

    private BigDecimal moneyToPay;

    private BigDecimal netPosition;

    private BigDecimal totalIncome;

    private BigDecimal totalExpense;

    private BigDecimal totalSavings;

    private BigDecimal totalInterestReceivable;

    private BigDecimal totalInterestPayable;

    private Long activeLoans;

    private Long closedLoans;

}