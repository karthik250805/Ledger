package com.karthik.ledger.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.karthik.ledger.entity.Transaction;
import com.karthik.ledger.entity.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	List<Transaction> findByUserOrderByTransactionDateDesc(User user);
	List<Transaction> findByUser(User user);
}
