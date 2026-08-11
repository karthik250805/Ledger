package com.karthik.ledger.service.impl;

import java.math.BigDecimal;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.karthik.ledger.dto.TransactionHistoryResponse;
import com.karthik.ledger.dto.TransactionRequest;
import com.karthik.ledger.dto.TransactionResponse;
import com.karthik.ledger.dto.TransactionSummaryResponse;
import com.karthik.ledger.entity.Transaction;
import com.karthik.ledger.entity.User;
import com.karthik.ledger.repository.CustomerRepository;
import com.karthik.ledger.repository.TransactionRepository;
import com.karthik.ledger.repository.UserRepository;
import com.karthik.ledger.service.RecurringService;

import com.karthik.ledger.service.TransactionService;

import Enum.TransactionMode;
import Enum.TransactionType;

@Service
public class TransactionServiceImpl implements TransactionService {
	private CustomerRepository customerRepository;
	private UserRepository userRepository;
	private TransactionRepository transactionRepository;
//	private final RecurringService recurringService;
	
	
	
	public TransactionServiceImpl(CustomerRepository customerRepository, UserRepository userRepository,
			TransactionRepository transactionRepository, RecurringService recurringService) {
		super();
		this.customerRepository = customerRepository;
		this.userRepository = userRepository;
		this.transactionRepository = transactionRepository;
//		this.recurringService = recurringService;
	}
	private TransactionHistoryResponse mapToHistoryResponse(Transaction transaction) {

	    TransactionHistoryResponse response = new TransactionHistoryResponse();

	    response.setTransactionId(transaction.getId());
	    response.setTransactionType(transaction.getTransactionType());
	    response.setTransactionMode(transaction.getTransactionMode());
	    response.setCategory(transaction.getCategory());
	    response.setAmount(transaction.getAmount());
	    response.setPaymentMode(transaction.getPaymentMode());
	    response.setDescription(transaction.getDescription());
	    response.setTransactionDate(transaction.getTransactionDate());

	    return response;
	}
	private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

	@Override
	public TransactionResponse createTransaction(TransactionRequest request) {
		if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
		    throw new RuntimeException("Amount must be greater than zero");
		}
		User loggedInUser=getLoggedInUser();
		if(request.getTransactionType().equals(TransactionType.INCOME))
		{
			loggedInUser.setCashBalance(
		            loggedInUser.getCashBalance().add(request.getAmount())
		    );
		}
		else if(request.getTransactionType().equals(TransactionType.EXPENSE))
		{
			loggedInUser.setCashBalance(
		            loggedInUser.getCashBalance().subtract(request.getAmount())
		    );
		}
		userRepository.save(loggedInUser);
		Transaction transaction = new Transaction();

		transaction.setUser(loggedInUser);
		transaction.setTransactionType(request.getTransactionType());
		transaction.setTransactionMode(request.getTransactionMode());
		transaction.setCategory(request.getCategory());
		transaction.setAmount(request.getAmount());
		transaction.setPaymentMode(request.getPaymentMode());
		transaction.setDescription(request.getDescription());
		transaction.setTransactionDate(request.getTransactionDate());
		Transaction savedTransaction =
		        transactionRepository.save(transaction);
//		if (request.getTransactionMode() == TransactionMode.RECURRING) {
//
//			recurringService.createRecurringFromTransaction(
//		            savedTransaction,
//		            request
//		    );
//		}
		return new TransactionResponse(
		        savedTransaction.getId(),
		        savedTransaction.getTransactionType(),
		        savedTransaction.getAmount(),
		        "Transaction added successfully"
		);
	}
	@Override
	public List<TransactionHistoryResponse> getTransactions() {
		// TODO Auto-generated method stub
		User LoggedInUser=getLoggedInUser();
		List<Transaction> transactions =
		        transactionRepository.findByUserOrderByTransactionDateDesc(LoggedInUser);
		return transactions.stream()
		        .map(this::mapToHistoryResponse)
		        .toList();
	}
	@Override
	public TransactionSummaryResponse getTransactionSummary() {
		// TODO Auto-generated method stub
		User LoggedInUser=getLoggedInUser();
		List<Transaction> transactions =
		        transactionRepository.findByUserOrderByTransactionDateDesc(LoggedInUser);
		 BigDecimal totalIncome = BigDecimal.ZERO;
		    BigDecimal totalExpense = BigDecimal.ZERO;
		for(Transaction transaction:transactions)
		{
			 if (transaction.getTransactionType() == TransactionType.INCOME) {

		            totalIncome = totalIncome.add(transaction.getAmount());

		        } else if (transaction.getTransactionType() == TransactionType.EXPENSE) {

		            totalExpense = totalExpense.add(transaction.getAmount());
		        }
		}
		
		TransactionSummaryResponse response=new TransactionSummaryResponse();
		response.setCashBalance(LoggedInUser.getCashBalance());
		response.setTotalExpense(totalExpense);
		response.setTotalIncome(totalIncome);
		return response;
	}

}
