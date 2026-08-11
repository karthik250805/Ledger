package com.karthik.ledger.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.karthik.ledger.dto.ApiResponse;
import com.karthik.ledger.exception.UserAllReadyExistException;

@RestControllerAdvice
public class GlobalException  {

    @ExceptionHandler(UserAllReadyExistException.class)
    public ResponseEntity<ApiResponse> handleUserAlreadyExists(UserAllReadyExistException ex){

        ApiResponse response =
                new ApiResponse(false, ex.getMessage());

        return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);

    }
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException ex) {

        ApiResponse response = new ApiResponse(false, ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
