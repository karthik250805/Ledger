			package com.karthik.ledger.dto;
			
			import java.math.BigDecimal;
			import java.time.LocalDate;
			
			import Enum.Frequency;
			import Enum.PaymentMode;
			import Enum.TransactionMode;
			import Enum.TransactionType;
			import lombok.Getter;
			import lombok.Setter;
			
			@Getter
			@Setter
			public class TransactionRequest {
			
			    private TransactionType transactionType;
			
			    private TransactionMode transactionMode;
			
			    private String category;
			
			    private BigDecimal amount;
			
			    private PaymentMode paymentMode;
			
			    private String description;
			
			    private LocalDate transactionDate;
			    
			    private Frequency frequency;
			
			    private Boolean approvalRequired;
			
			    private LocalDate endDate;
			}
