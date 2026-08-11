package com.karthik.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import Enum.Frequency;
import Enum.IntrestType;
import Enum.LoanDirection;
import Enum.LoanStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoanDetailsResponse {

    private Long loanId;

    private String customerName;

    private LoanDirection loanDirection;

    private BigDecimal principalAmount;

    private BigDecimal outstandingPrincipal;

    private BigDecimal interestDue;

    private BigDecimal totalDue;

    private BigDecimal interestRate;

    private IntrestType interestType;

    private Frequency interestFrequency;

    private LocalDate lastInterestCalculatedDate;

    private LocalDate nextInterestDate;

    private LoanStatus status;
    
    private LocalDate loanDate;

    private String notes;
}