//package com.karthik.ledger.service.impl;

package com.karthik.ledger.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.karthik.ledger.dto.Login;
import com.karthik.ledger.dto.LoginResponse;
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

}