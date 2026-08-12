package com.karthik.ledger.service;

public interface OtpService {

    void sendOtp(String email);

    void verifyOtp(String email, String otp);

    boolean isEmailVerified(String email);

    void consumeVerification(String email);
}