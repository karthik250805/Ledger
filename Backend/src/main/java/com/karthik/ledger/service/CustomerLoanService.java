package com.karthik.ledger.service;

import java.util.List;

import com.karthik.ledger.dto.FullPaymentRequest;
import com.karthik.ledger.dto.FullPaymentResponse;
import com.karthik.ledger.dto.LoanDetailsResponse;
import com.karthik.ledger.dto.LoanRequest;
import com.karthik.ledger.dto.LoanResponse;
import com.karthik.ledger.dto.LoanTransactionResponse;
import com.karthik.ledger.dto.PartialPaymentRequest;
import com.karthik.ledger.dto.PartialPaymentResponse;
import com.karthik.ledger.dto.RefreshCustomerInterestRequest;
//import com.karthik.ledger.dto.PaymentValidationResponse;
import com.karthik.ledger.dto.RefreshInterestRequest;
import com.karthik.ledger.dto.RefreshInterestResponse;

public interface CustomerLoanService {

    LoanResponse createLoan(LoanRequest request);

    LoanDetailsResponse getLoan(Long loanId);

    List<LoanDetailsResponse> getAllLoans(Long customerId);

    List<LoanDetailsResponse> getLendLoans(Long customerId);

    List<LoanDetailsResponse> getBorrowLoans(Long customerId);
    
    RefreshInterestResponse refreshInterest(RefreshInterestRequest request);

    PartialPaymentResponse partialPayment(PartialPaymentRequest request);
    
    FullPaymentResponse fullPayment(FullPaymentRequest request);
    
    List<LoanTransactionResponse> getLoanTransactions(Long loanId);
    
    List<RefreshInterestResponse> refreshInterestForCustomer(RefreshCustomerInterestRequest request);
    
//    PaymentValidationResponse validatePayment(Long loanId,LocalDate paymentDate);
}