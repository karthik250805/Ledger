package com.karthik.ledger.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanResponse {
	private long loanId;

	private String customerName;

	private BigDecimal principalAmount;

	private String message;
}
