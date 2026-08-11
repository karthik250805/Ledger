package com.karthik.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FullPaymentRequest {

    private Long loanId;
    
    private BigDecimal DiscountAmount;

    private LocalDate paymentDate;
    
    private String notes;

}