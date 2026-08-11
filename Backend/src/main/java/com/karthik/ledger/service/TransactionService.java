package com.karthik.ledger.service;

import java.util.List;

import com.karthik.ledger.dto.TransactionHistoryResponse;
import com.karthik.ledger.dto.TransactionRequest;
import com.karthik.ledger.dto.TransactionResponse;
import com.karthik.ledger.dto.TransactionSummaryResponse;

public interface TransactionService {
	TransactionResponse createTransaction(TransactionRequest request);
	List<TransactionHistoryResponse> getTransactions();
	TransactionSummaryResponse getTransactionSummary();
}
