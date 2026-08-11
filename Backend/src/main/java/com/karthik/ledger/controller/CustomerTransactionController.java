package com.karthik.ledger.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.karthik.ledger.dto.CustomerTransactionResponse;
import com.karthik.ledger.dto.GiveReceiveRequest;
import com.karthik.ledger.service.CustomerTransactionService;

@RestController
@RequestMapping("/api/customer-transactions")
public class CustomerTransactionController {

    private final CustomerTransactionService customerTransactionService;

    public CustomerTransactionController(
            CustomerTransactionService customerTransactionService) {

        this.customerTransactionService = customerTransactionService;
    }

    @PostMapping("/give")
    public ResponseEntity<CustomerTransactionResponse> giveMoney(
            @RequestBody GiveReceiveRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(customerTransactionService.giveMoney(request));
    }

    @PostMapping("/receive")
    public ResponseEntity<CustomerTransactionResponse> receiveMoney(
            @RequestBody GiveReceiveRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(customerTransactionService.receiveMoney(request));
    }

    @GetMapping("/history/{customerId}")
    public ResponseEntity<List<CustomerTransactionResponse>> history(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                customerTransactionService.getHistory(customerId));
    }

}