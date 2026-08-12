package com.karthik.ledger.service.impl;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.karthik.ledger.entity.EmailOtp;
import com.karthik.ledger.repository.EmailOtpRepository;
import com.karthik.ledger.repository.UserRepository;
import com.karthik.ledger.service.EmailService;
import com.karthik.ledger.service.OtpService;

@Service
public class OtpServiceImpl implements OtpService {

    private static final int OTP_EXPIRY_MINUTES = 5;

    private static final int MAX_ATTEMPTS = 5;

    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final EmailOtpRepository emailOtpRepository;

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public OtpServiceImpl(
            EmailOtpRepository emailOtpRepository,
            UserRepository userRepository,
            EmailService emailService) {

        this.emailOtpRepository =
                emailOtpRepository;

        this.userRepository =
                userRepository;

        this.emailService =
                emailService;
    }

    @Override
    @Transactional
    public void sendOtp(String email) {

        email = normalizeEmail(email);

        // ==========================================
        // CHECK IF EMAIL IS ALREADY REGISTERED
        // ==========================================

        if (userRepository.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                    "Email is already registered"
            );
        }

        LocalDateTime now =
                LocalDateTime.now();

        // ==========================================
        // CHECK EXISTING OTP
        // ==========================================

        var existingOtp =
                emailOtpRepository.findByEmail(email);

        if (existingOtp.isPresent()) {

            EmailOtp otp =
                    existingOtp.get();

            long seconds =
                    java.time.Duration.between(
                            otp.getLastSentAt(),
                            now
                    ).getSeconds();

            if (seconds <
                    RESEND_COOLDOWN_SECONDS) {

                long remaining =
                        RESEND_COOLDOWN_SECONDS
                        - seconds;

                throw new RuntimeException(
                        "Please wait "
                        + remaining
                        + " seconds before requesting another OTP"
                );
            }

            emailOtpRepository.delete(otp);
        }

        // ==========================================
        // GENERATE 6 DIGIT OTP
        // ==========================================

        String otp =
                String.format(
                        "%06d",
                        secureRandom.nextInt(1_000_000)
                );

        // ==========================================
        // CREATE OTP ENTITY
        // ==========================================

        EmailOtp emailOtp =
                new EmailOtp();

        emailOtp.setEmail(email);

        emailOtp.setOtpHash(
                hashOtp(otp)
        );

        emailOtp.setCreatedAt(now);

        emailOtp.setLastSentAt(now);

        emailOtp.setExpiresAt(
                now.plusMinutes(
                        OTP_EXPIRY_MINUTES
                )
        );

        emailOtp.setAttempts(0);

        emailOtp.setVerifiedAt(null);

        emailOtpRepository.save(emailOtp);

        // ==========================================
        // SEND EMAIL
        // ==========================================

        emailService.sendOtpEmail(
                email,
                otp
        );
    }

    @Override
    @Transactional
    public void verifyOtp(
            String email,
            String otp) {

        email = normalizeEmail(email);

        EmailOtp emailOtp =
                emailOtpRepository
                        .findByEmail(email)
                        .orElseThrow(
                            () -> new RuntimeException(
                                "OTP not found. Please request a new OTP."
                            )
                        );

        // ==========================================
        // ALREADY VERIFIED
        // ==========================================

        if (emailOtp.getVerifiedAt() != null) {

            throw new RuntimeException(
                    "Email is already verified"
            );
        }

        // ==========================================
        // CHECK EXPIRY
        // ==========================================

        if (
            LocalDateTime.now()
                .isAfter(emailOtp.getExpiresAt())
        ) {

            emailOtpRepository.delete(emailOtp);

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        // ==========================================
        // CHECK ATTEMPTS
        // ==========================================

        if (
            emailOtp.getAttempts()
                >= MAX_ATTEMPTS
        ) {

            emailOtpRepository.delete(emailOtp);

            throw new RuntimeException(
                    "Too many incorrect attempts. Please request a new OTP."
            );
        }

        // ==========================================
        // COMPARE OTP
        // ==========================================

        String enteredHash =
                hashOtp(otp);

        if (
            !MessageDigest.isEqual(
                enteredHash.getBytes(
                    StandardCharsets.UTF_8
                ),
                emailOtp.getOtpHash()
                    .getBytes(
                        StandardCharsets.UTF_8
                    )
            )
        ) {

            emailOtp.setAttempts(
                    emailOtp.getAttempts() + 1
            );

            emailOtpRepository.save(
                    emailOtp
            );

            int remaining =
                    MAX_ATTEMPTS
                    - emailOtp.getAttempts();

            throw new RuntimeException(
                    "Invalid OTP. "
                    + remaining
                    + " attempts remaining."
            );
        }

        // ==========================================
        // OTP CORRECT
        // ==========================================

        emailOtp.setVerifiedAt(
                LocalDateTime.now()
        );

        emailOtpRepository.save(
                emailOtp
        );
    }

    @Override
    public boolean isEmailVerified(
            String email) {

        email = normalizeEmail(email);

        return emailOtpRepository
                .findByEmail(email)
                .filter(otp ->
                    otp.getVerifiedAt() != null
                )
                .filter(otp ->
                    LocalDateTime.now()
                        .isBefore(
                            otp.getExpiresAt()
                        )
                )
                .isPresent();
    }

    @Override
    @Transactional
    public void consumeVerification(
            String email) {

        email = normalizeEmail(email);

        emailOtpRepository.deleteByEmail(
                email
        );
    }

    // ==========================================
    // SHA-256 HASH
    // ==========================================

    private String hashOtp(String otp) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance(
                            "SHA-256"
                    );

            byte[] hash =
                    digest.digest(
                        otp.getBytes(
                            StandardCharsets.UTF_8
                        )
                    );

            StringBuilder hex =
                    new StringBuilder();

            for (byte b : hash) {

                hex.append(
                    String.format(
                        "%02x",
                        b
                    )
                );
            }

            return hex.toString();

        } catch (
            NoSuchAlgorithmException e
        ) {

            throw new IllegalStateException(
                    "SHA-256 algorithm not available",
                    e
            );
        }
    }

    private String normalizeEmail(
            String email) {

        return email
                .trim()
                .toLowerCase();
    }
}