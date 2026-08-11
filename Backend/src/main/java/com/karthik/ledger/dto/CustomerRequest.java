package com.karthik.ledger.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter

public class CustomerRequest {

	@NotBlank (message="name is required")
	private String name;
	
	@NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Invalid phone number"
    )
	private String phone;

    @Email(message = "Invalid email")
	private String email;
	private String address;
	private String notes;
}

