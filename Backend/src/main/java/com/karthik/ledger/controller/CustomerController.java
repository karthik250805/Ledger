package com.karthik.ledger.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.karthik.ledger.dto.ApiResponse;
import com.karthik.ledger.dto.CustomerDetailsResponse;
import com.karthik.ledger.dto.CustomerHistoryResponse;
import com.karthik.ledger.dto.CustomerRequest;
import com.karthik.ledger.dto.CustomerResponse;
import com.karthik.ledger.dto.CustomerSummaryResponse;
import com.karthik.ledger.service.CustomerService;
//import com.sun.net.httpserver.HttpExchange;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
	private final CustomerService customerService;

	public CustomerController(CustomerService customerService) {
		this.customerService = customerService;
	}
	@PostMapping
	public ResponseEntity<ApiResponse> addCustomer(@Valid @RequestBody CustomerRequest request){
		CustomerResponse customer = customerService.addCustomer(request);

        ApiResponse response =
                new ApiResponse(true, "Customer Added Successfully");
		return new ResponseEntity<>(response,HttpStatus.CREATED);
	}
	@GetMapping
	public ResponseEntity<List<CustomerResponse>> getAllCustomers() {

	    return ResponseEntity.ok(customerService.getAllCustomers());

	}
	@GetMapping("/{customerId}")
	public ResponseEntity<CustomerDetailsResponse> getCustomer(
	        @PathVariable Long customerId){

	    return ResponseEntity.ok(
	            customerService.getCustomer(customerId));
	}
	@PutMapping("/{id}")
	public ResponseEntity<CustomerResponse> updateCustomer(
	        @PathVariable Long id,
	        @Valid @RequestBody CustomerRequest request) {

	    CustomerResponse response = customerService.updateCustomer(id, request);

	    return ResponseEntity.ok(response);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable Long id) {

	    customerService.deleteCustomer(id);

	    return ResponseEntity.ok(
	            new ApiResponse(true, "Customer deleted successfully"));
	}
	@GetMapping("/{customerId}/summary")
	public ResponseEntity<CustomerSummaryResponse>
	getCustomerSummary(
	        @PathVariable Long customerId){

	    return ResponseEntity.ok(
	            customerService.getCustomerSummary(customerId));
	}
	
	@GetMapping("/{customerId}/history")
	public ResponseEntity<List<CustomerHistoryResponse>>
	getCustomerHistory(@PathVariable Long customerId){

	    return ResponseEntity.ok(
	            customerService.getCustomerHistory(customerId)
	    );
	}
}
