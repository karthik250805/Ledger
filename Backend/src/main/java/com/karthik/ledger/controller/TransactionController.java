package com.karthik.ledger.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.karthik.ledger.dto.ApiResponse;
import com.karthik.ledger.dto.TransactionHistoryResponse;
import com.karthik.ledger.dto.TransactionRequest;
import com.karthik.ledger.dto.TransactionResponse;
import com.karthik.ledger.dto.TransactionSummaryResponse;
import com.karthik.ledger.service.TransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {
	private final TransactionService transactionService;

	public TransactionController(TransactionService transactionService) {
		super();
		this.transactionService = transactionService;
	}

	@PostMapping
    public ResponseEntity<ApiResponse> createTransaction(
            @Valid @RequestBody TransactionRequest request) {

        TransactionResponse response =
                transactionService.createTransaction(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(
                        true,
                        "Transaction created successfully"
                ));
    }
	@GetMapping
	public ResponseEntity<List<TransactionHistoryResponse>> getTransactions() {

	    List<TransactionHistoryResponse> response =
	            transactionService.getTransactions();

	    return ResponseEntity.ok(response);
	}
	@GetMapping("/summary")
	public ResponseEntity<TransactionSummaryResponse> getTransactionSummary() {

	    TransactionSummaryResponse response =
	            transactionService.getTransactionSummary();

	    return ResponseEntity.ok(response);
	}
	

}
