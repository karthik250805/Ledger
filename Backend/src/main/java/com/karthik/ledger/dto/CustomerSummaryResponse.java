package com.karthik.ledger.dto;

import java.math.BigDecimal;

import Enum.CustomerBalanceStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerSummaryResponse {

    private BigDecimal totalGiven;

    private BigDecimal totalReceived;

    private BigDecimal totalLendPrincipal;

    private BigDecimal totalLendOutstanding;

    private BigDecimal totalBorrowPrincipal;

    private BigDecimal totalBorrowOutstanding;

    private BigDecimal overallBalance;

    private CustomerBalanceStatus balanceStatus;
}