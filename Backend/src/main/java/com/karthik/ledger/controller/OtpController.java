package com.karthik.ledger.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.karthik.ledger.dto.ApiResponse;
import com.karthik.ledger.dto.SendOtpRequest;
import com.karthik.ledger.dto.VerifyOtpRequest;
import com.karthik.ledger.service.OtpService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class OtpController {

    private final OtpService otpService;

    public OtpController(
            OtpService otpService) {

        this.otpService = otpService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        otpService.sendOtp(
                request.getEmail()
        );

        return ResponseEntity.ok(
                new ApiResponse(
                        true,
                        "OTP sent successfully to your email"
                )
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.ok(
                new ApiResponse(
                        true,
                        "Email verified successfully"
                )
        );
    }
}