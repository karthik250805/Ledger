package com.karthik.ledger.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Login {

	@NotBlank(message ="email is required")
	@Email(message ="email  not valid")
	private String email;
	@NotBlank(message="password required")
	private String password;
	
}
