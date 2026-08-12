//package com.karthik.ledger.service.impl;

package com.karthik.ledger.service.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.karthik.ledger.dto.ChangePasswordRequest;
import com.karthik.ledger.dto.Login;
import com.karthik.ledger.dto.LoginResponse;
import com.karthik.ledger.dto.ProfileResponse;
import com.karthik.ledger.dto.ProfileUpdateRequest;
import com.karthik.ledger.dto.Signup;
import com.karthik.ledger.entity.User;
import com.karthik.ledger.exception.UserAllReadyExistException;
import com.karthik.ledger.repository.UserRepository;
import com.karthik.ledger.security.JwtService;
import com.karthik.ledger.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	private final PasswordEncoder passwordEncoder;
	private final UserRepository userRepository;
	private final JwtService jwtService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,JwtService jwtService) {
        this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
    }
    
    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
    @Override
    public LoginResponse login(Login request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email or Password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Email or Password");
        }
        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(true, "Login Successful",token);
    }
    @Override
    public void registerUser(Signup request) {
    	 if (userRepository.existsByEmail(request.getEmail())) {
             throw new UserAllReadyExistException("Email Already Exist");
         }

         // Check if phone number already exists
         if (userRepository.existsByPhone(request.getPhone())) {
             throw new UserAllReadyExistException("Phone number already exist");
         }

         // Create User Entity
         User user = new User();

         user.setName(request.getName());
         user.setEmail(request.getEmail());
         user.setPhone(request.getPhone());

         // Later we'll encrypt using BCrypt
         user.setPassword(passwordEncoder.encode(request.getPassword()));

         user.setIsActive(true);
         userRepository.save(user);
    }
    
    @Override
    public ProfileResponse getProfile() {

        User user = getLoggedInUser();

        return new ProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getCashBalance()
        );
    }
    
    @Override
    public ProfileResponse updateProfile(
            ProfileUpdateRequest request) {

        User user = getLoggedInUser();

        if (!user.getPhone().equals(request.getPhone())
                && userRepository.existsByPhone(request.getPhone())) {

            throw new RuntimeException(
                    "Phone number already exists"
            );
        }

        user.setName(request.getName().trim());
        user.setPhone(request.getPhone().trim());

        User savedUser =
                userRepository.save(user);

        return new ProfileResponse(
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getCashBalance()
        );
    }
    
    @Override
    public void changePassword(
            ChangePasswordRequest request) {

        User user = getLoggedInUser();

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "New password must be different from current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

}