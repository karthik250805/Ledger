package com.karthik.ledger.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.karthik.ledger.dto.FullPaymentRequest;
import com.karthik.ledger.dto.FullPaymentResponse;
import com.karthik.ledger.dto.LoanDetailsResponse;
import com.karthik.ledger.dto.LoanRequest;
import com.karthik.ledger.dto.LoanResponse;
import com.karthik.ledger.dto.LoanTransactionResponse;
import com.karthik.ledger.dto.PartialPaymentRequest;
import com.karthik.ledger.dto.PartialPaymentResponse;
import com.karthik.ledger.dto.RefreshCustomerInterestRequest;
import com.karthik.ledger.dto.RefreshInterestRequest;
import com.karthik.ledger.dto.RefreshInterestResponse;
import com.karthik.ledger.service.CustomerLoanService;

@RestController
@RequestMapping("/api/customer-loans")
public class CustomerLoanController {

    private final CustomerLoanService customerLoanService;

    public CustomerLoanController(CustomerLoanService customerLoanService) {
        this.customerLoanService = customerLoanService;
    }

    // Create Loan (LEND / BORROW)
    @PostMapping
    public ResponseEntity<LoanResponse> createLoan(
            @RequestBody LoanRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(customerLoanService.createLoan(request));
    }

    // Get single loan by loan id
    @GetMapping("/{loanId}")
    public ResponseEntity<LoanDetailsResponse> getLoan(
            @PathVariable Long loanId) {

        return ResponseEntity.ok(
                customerLoanService.getLoan(loanId));
    }

    // Get all loans of a customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<LoanDetailsResponse>> getAllLoans(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                customerLoanService.getAllLoans(customerId));
    }

    // Get all LEND loans
    @GetMapping("/customer/{customerId}/lend")
    public ResponseEntity<List<LoanDetailsResponse>> getLendLoans(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                customerLoanService.getLendLoans(customerId));
    }

    // Get all BORROW loans
    @GetMapping("/customer/{customerId}/borrow")
    public ResponseEntity<List<LoanDetailsResponse>> getBorrowLoans(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                customerLoanService.getBorrowLoans(customerId));
    }
    @PostMapping("/refresh-interest")
    public ResponseEntity<RefreshInterestResponse> refreshInterest(
            @RequestBody RefreshInterestRequest request){

        return ResponseEntity.ok(
                customerLoanService.refreshInterest(request));
    }
    @PostMapping("/partial-payment")
    public ResponseEntity<PartialPaymentResponse> partialPayment(
            @RequestBody PartialPaymentRequest request) {

        return ResponseEntity.ok(
                customerLoanService.partialPayment(request));
    }
    @PostMapping("/full-payment")
    public ResponseEntity<FullPaymentResponse> fullPayment(
            @RequestBody FullPaymentRequest request){

        return ResponseEntity.ok(
                customerLoanService.fullPayment(request));
    }
    
    @GetMapping("/{loanId}/transactions")
    public ResponseEntity<List<LoanTransactionResponse>>
    getLoanTransactions(
            @PathVariable Long loanId){

        return ResponseEntity.ok(
                customerLoanService.getLoanTransactions(loanId));
    }
    @PostMapping("/refresh-interest/customer")
    public ResponseEntity<List<RefreshInterestResponse>>
            refreshInterestForCustomer(
                    @RequestBody RefreshCustomerInterestRequest request) {

        return ResponseEntity.ok(
                customerLoanService
                        .refreshInterestForCustomer(request)
        );
    }

}	