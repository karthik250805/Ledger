package com.karthik.ledger.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshInterestRequest {

    private Long loanId;

    private LocalDate refreshDate;

}