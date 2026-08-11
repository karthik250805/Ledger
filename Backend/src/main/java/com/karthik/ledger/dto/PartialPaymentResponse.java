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
public class PartialPaymentResponse {

	private Long loanId;

	private BigDecimal remainingPrincipal;

	private BigDecimal remainingInterest;

	private String message;
}
