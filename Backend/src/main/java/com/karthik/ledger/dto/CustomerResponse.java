package com.karthik.ledger.dto;

import java.math.BigDecimal;

import Enum.CustomerBalanceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponse {

	private long id;
	private String name;
	private String phone;
	private String email;
	private String Address;
	private String notes;
    private BigDecimal currentBalance;

    private CustomerBalanceStatus balanceStatus;
}
