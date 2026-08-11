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
public class TransactionSummaryResponse {

	private BigDecimal totalIncome;

	private BigDecimal totalExpense;

	private BigDecimal cashBalance;
}
