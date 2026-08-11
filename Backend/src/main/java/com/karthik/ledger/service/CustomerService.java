package com.karthik.ledger.service;	

import java.util.List;

import com.karthik.ledger.dto.CustomerDetailsResponse;
import com.karthik.ledger.dto.CustomerHistoryResponse;
import com.karthik.ledger.dto.CustomerRequest;
import com.karthik.ledger.dto.CustomerResponse;
import com.karthik.ledger.dto.CustomerSummaryResponse;

public interface CustomerService {
	CustomerResponse addCustomer(CustomerRequest request);
	List<CustomerResponse> getAllCustomers();
	CustomerDetailsResponse getCustomer(Long id);

    CustomerResponse updateCustomer(Long id,
                                    CustomerRequest request);

    void deleteCustomer(Long id);
    CustomerResponse getCustomerById(Long id);
    
    CustomerSummaryResponse getCustomerSummary(Long customerId);
    
    List<CustomerHistoryResponse> getCustomerHistory(Long customerId);
    
    
}
