package com.karthik.ledger.service;

import java.util.List;

import com.karthik.ledger.dto.CustomerTransactionResponse;
import com.karthik.ledger.dto.GiveReceiveRequest;

public interface CustomerTransactionService {

    CustomerTransactionResponse giveMoney(
            GiveReceiveRequest request);

    CustomerTransactionResponse receiveMoney(
            GiveReceiveRequest request);

    List<CustomerTransactionResponse> getHistory(
            Long customerId);

}