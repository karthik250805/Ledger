package com.karthik.ledger.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.karthik.ledger.entity.CustomerLoan;
import com.karthik.ledger.entity.User;

public interface LoanRepository
        extends JpaRepository<CustomerLoan, Long> {

    List<CustomerLoan> findByUser(User user);

}