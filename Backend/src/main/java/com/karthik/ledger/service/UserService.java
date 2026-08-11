package com.karthik.ledger.service;

import com.karthik.ledger.dto.Login;
import com.karthik.ledger.dto.LoginResponse;

//package com.karthik.ledger.service;

import com.karthik.ledger.dto.Signup;

public interface UserService {

    void registerUser(Signup request);
    LoginResponse login(Login request);
}
