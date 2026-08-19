package com.karthik.ledger.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshCustomerInterestRequest {

    private Long customerId;

    private LocalDate refreshDate;

    // getters and setters
}
