package com.karthik.ledger.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.karthik.ledger.entity.Customer;
import com.karthik.ledger.entity.CustomerLoan;
import com.karthik.ledger.entity.CustomerTransaction;
import com.karthik.ledger.entity.Transaction;
import com.karthik.ledger.entity.User;

public interface CustomerTransactionRepository
        extends JpaRepository<CustomerTransaction, Long> {

    List<CustomerTransaction> findByCustomerAndUserOrderByTransactionDateDesc(
            Customer customer,
            User user
    );
    
    List<CustomerTransaction> findByLoanOrderByTransactionDateAsc(CustomerLoan loan);
    
    List<CustomerTransaction> findByCustomerAndUser(Customer customer,User user);
    
    List<Transaction> findByUserOrderByTransactionDateDesc(User user);
}