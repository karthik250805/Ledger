package com.karthik.ledger.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.karthik.ledger.dto.ApiResponse;
import com.karthik.ledger.dto.Login;
import com.karthik.ledger.dto.LoginResponse;
import com.karthik.ledger.dto.Signup;
import com.karthik.ledger.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {
	private UserService userservice;

	public AuthController(UserService userservice) {
		this.userservice = userservice;
	}
	@PostMapping("/signup")
	 public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody Signup request) {

        userservice.registerUser(request);

        ApiResponse response =
                new ApiResponse(true,"User Registered Successfully");

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(
			 @Valid @RequestBody Login request){

	    LoginResponse response = userservice.login(request);

	    return ResponseEntity.ok(response);

	}
	
}
