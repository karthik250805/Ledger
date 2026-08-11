package com.karthik.ledger.service;


import com.karthik.ledger.dto.TransactionRequest;
import com.karthik.ledger.entity.Transaction;

public interface RecurringService {

//	createRecurringFromTransaction()
//	✅ createRecurringFromCustomerTransaction()
//	✅ getRecurringTransactions()
//	✅ approveRecurring()
//	✅ remindMeLater()
//	✅ skipRecurring()
//	✅ stopRecurring()
    void createRecurringFromTransaction(
            Transaction transaction,
            TransactionRequest request
    );

//   void createRecurringFromCustomerTransaction(
//            CustomerTransaction customerTransaction,
//            NormalDebitRequest request
//    );

}
