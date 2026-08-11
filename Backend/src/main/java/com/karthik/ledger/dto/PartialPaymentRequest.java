package com.karthik.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartialPaymentRequest {
	private Long loanId;

	private BigDecimal principalPayment;

	private BigDecimal interestPayment;

	private LocalDate paymentDate;

	private String notes;
}
