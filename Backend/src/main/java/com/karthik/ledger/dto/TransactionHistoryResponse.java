package com.karthik.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import Enum.PaymentMode;
import Enum.TransactionMode;
import Enum.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryResponse {

	private Long transactionId;

	private TransactionType transactionType;

	private TransactionMode transactionMode;

	private String category;

	private BigDecimal amount;

	private PaymentMode paymentMode;

	private String description;

	private LocalDate transactionDate;
}
