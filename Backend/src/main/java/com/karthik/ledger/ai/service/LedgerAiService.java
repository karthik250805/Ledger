package com.karthik.ledger.ai.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface LedgerAiService {

    BigDecimal getCurrentBalance();

    List<Map<String, Object>> getCustomerData();
    
    List<Map<String, Object>> getCustomerTransactionData();
    
    List<Map<String, Object>> getLoanData();
    
    List<Map<String, Object>> getLoanTransactionData();
    
    List<Map<String, Object>> getNormalTransactionData();
}