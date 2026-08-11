package com.karthik.ledger.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.karthik.ledger.entity.RecurringTransaction;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {

}
