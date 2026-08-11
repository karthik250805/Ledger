package com.karthik.ledger.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.karthik.ledger.entity.Customer;
import com.karthik.ledger.entity.CustomerLoan;
import com.karthik.ledger.entity.LoanTransaction;
import com.karthik.ledger.entity.User;

public interface LoanTransactionRepository
        extends JpaRepository<LoanTransaction, Long> {

    List<LoanTransaction> findByLoanOrderByTransactionDateAsc(
            CustomerLoan loan
    );

    List<LoanTransaction> findByLoanAndUserOrderByTransactionDateAsc(
            CustomerLoan loan,
            User user
    );
    
    List<LoanTransaction> findByLoanCustomerAndLoanUser(
            Customer customer,
            User user);

}