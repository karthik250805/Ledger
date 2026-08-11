package com.karthik.ledger.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerDetailsResponse {

    private Long customerId;

    private String name;

    private String phone;

    private String email;

    private String address;

    private String notes;
}