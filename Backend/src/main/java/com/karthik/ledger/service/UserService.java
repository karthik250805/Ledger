package com.karthik.ledger.service;

import com.karthik.ledger.dto.ChangePasswordRequest;
import com.karthik.ledger.dto.Login;
import com.karthik.ledger.dto.LoginResponse;
import com.karthik.ledger.dto.ProfileResponse;
import com.karthik.ledger.dto.ProfileUpdateRequest;

//package com.karthik.ledger.service;

import com.karthik.ledger.dto.Signup;

public interface UserService {

    void registerUser(Signup request);
    LoginResponse login(Login request);
    
    ProfileResponse getProfile();

    ProfileResponse updateProfile(ProfileUpdateRequest request);

    void changePassword(ChangePasswordRequest request);
}
