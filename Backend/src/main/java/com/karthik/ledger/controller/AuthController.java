package com.karthik.ledger.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.karthik.ledger.dto.ApiResponse;
import com.karthik.ledger.dto.ChangePasswordRequest;
import com.karthik.ledger.dto.Login;
import com.karthik.ledger.dto.LoginResponse;
import com.karthik.ledger.dto.ProfileResponse;
import com.karthik.ledger.dto.ProfileUpdateRequest;
import com.karthik.ledger.dto.Signup;
import com.karthik.ledger.service.OtpService;
import com.karthik.ledger.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {
	private UserService userservice;
	private final OtpService otpService;

	
	public AuthController(UserService userservice, OtpService otpService) {
		super();
		this.userservice = userservice;
		this.otpService = otpService;
	}
	@PostMapping("/signup")
	 public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody Signup request) {
		
		String email =
		        request.getEmail()
		                .trim()
		                .toLowerCase();

		if (!otpService.isEmailVerified(email)) {

		    throw new RuntimeException(
		            "Please verify your email before signing up"
		    );
		}

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
	
	@GetMapping("/profile")
	public ResponseEntity<ProfileResponse> getProfile() {

	    return ResponseEntity.ok(
	            userservice.getProfile()
	    );
	}
	
	@PutMapping("/profile")
	public ResponseEntity<ProfileResponse> updateProfile(
	        @Valid @RequestBody ProfileUpdateRequest request) {

	    return ResponseEntity.ok(
	            userservice.updateProfile(request)
	    );
	}
	
	@PutMapping("/change-password")
	public ResponseEntity<ApiResponse> changePassword(
	        @Valid @RequestBody ChangePasswordRequest request) {

	    userservice.changePassword(request);

	    return ResponseEntity.ok(
	            new ApiResponse(
	                    true,
	                    "Password changed successfully"
	            )
	    );
	}
	
}
