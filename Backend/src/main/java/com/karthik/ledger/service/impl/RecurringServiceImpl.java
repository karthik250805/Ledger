package com.karthik.ledger.service.impl;

import org.springframework.stereotype.Service;

import com.karthik.ledger.dto.TransactionRequest;
import com.karthik.ledger.entity.Transaction;
import com.karthik.ledger.service.RecurringService;

@Service
public class RecurringServiceImpl implements RecurringService {

	@Override
	public void createRecurringFromTransaction(Transaction transaction, TransactionRequest request) {
		// TODO Auto-generated method stub
		
	}

}
