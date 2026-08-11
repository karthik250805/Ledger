package com.karthik.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

//import com.karthik.ledger.entity.Customer;

import Enum.Frequency;
import Enum.IntrestType;
import Enum.LoanDirection;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor@AllArgsConstructor
public class LoanRequest {
	private Long customerId;

	private LoanDirection loanDirection;

	private BigDecimal principalAmount;

	private IntrestType interestType;

	private BigDecimal interestRate;

	private Frequency interestFrequency;

	private LocalDate nextInterestDate;
	
	private LocalDate loanDate;

	private String notes;
}
