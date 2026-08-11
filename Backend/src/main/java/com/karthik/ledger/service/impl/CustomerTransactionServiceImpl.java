package com.karthik.ledger.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.karthik.ledger.dto.CustomerTransactionResponse;
import com.karthik.ledger.dto.GiveReceiveRequest;
import com.karthik.ledger.entity.Customer;
import com.karthik.ledger.entity.CustomerTransaction;
import com.karthik.ledger.entity.User;
import com.karthik.ledger.repository.CustomerRepository;
import com.karthik.ledger.repository.CustomerTransactionRepository;
import com.karthik.ledger.repository.UserRepository;
import com.karthik.ledger.service.CustomerTransactionService;

import Enum.CustomerBalanceStatus;
import Enum.CustomerTransactionType;

@Service
public class CustomerTransactionServiceImpl implements CustomerTransactionService{

	private final CustomerTransactionRepository customerTransactionRepository;
	private final CustomerRepository customerRepository;
	private final UserRepository userRepository;
	public CustomerTransactionServiceImpl(CustomerTransactionRepository customerTransactionRepository,
			CustomerRepository customerRepository, UserRepository userRepository) {
		super();
		this.customerTransactionRepository = customerTransactionRepository;
		this.customerRepository = customerRepository;
		this.userRepository = userRepository;
	}
		private void updateCustomerBalance(Customer customer,
		            CustomerTransactionType type,
		            BigDecimal amount) {
		
		BigDecimal currentBalance = customer.getCurrentBalance();
		
		switch (customer.getBalanceStatus()) {
		
		case SETTLED:
		
		if (type == CustomerTransactionType.GIVE) {
		
		customer.setCurrentBalance(amount);
		customer.setBalanceStatus(CustomerBalanceStatus.RECEIVABLE);
		
		} else {
		
		customer.setCurrentBalance(amount);
		customer.setBalanceStatus(CustomerBalanceStatus.PAYABLE);
		
		}
		
		break;
		
		case RECEIVABLE:
		
		if (type == CustomerTransactionType.GIVE) {
		
		customer.setCurrentBalance(currentBalance.add(amount));
		
		} else {
		
		BigDecimal balance = currentBalance.subtract(amount);
		
		if (balance.compareTo(BigDecimal.ZERO) > 0) {
		
		customer.setCurrentBalance(balance);
		
		} else if (balance.compareTo(BigDecimal.ZERO) == 0) {
		
		customer.setCurrentBalance(BigDecimal.ZERO);
		customer.setBalanceStatus(CustomerBalanceStatus.SETTLED);
		
		} else {
		
		customer.setCurrentBalance(balance.abs());
		customer.setBalanceStatus(CustomerBalanceStatus.PAYABLE);
		
		}
		
		}
		
		break;
		
		case PAYABLE:
		
		if (type == CustomerTransactionType.RECEIVE) {
		
		customer.setCurrentBalance(currentBalance.add(amount));
		
		} else {
		
		BigDecimal balance = currentBalance.subtract(amount);
		
		if (balance.compareTo(BigDecimal.ZERO) > 0) {
		
		customer.setCurrentBalance(balance);
		
		} else if (balance.compareTo(BigDecimal.ZERO) == 0) {
		
		customer.setCurrentBalance(BigDecimal.ZERO);
		customer.setBalanceStatus(CustomerBalanceStatus.SETTLED);
		
		} else {
		
		customer.setCurrentBalance(balance.abs());
		customer.setBalanceStatus(CustomerBalanceStatus.RECEIVABLE);
		
		}
		
		}
		
		break;
		}
		
		customerRepository.save(customer);
		}
	
	private User getLoggedInUser() {

	    Authentication authentication =
	            SecurityContextHolder.getContext().getAuthentication();

	    String email = authentication.getName();

	    return userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));
	}

	@Override
	@Transactional
	public CustomerTransactionResponse giveMoney(GiveReceiveRequest request) {

	    User loggedInUser = getLoggedInUser();
	    loggedInUser.setCashBalance(
	            loggedInUser.getCashBalance()
	                    .subtract(request.getAmount())
	    );

	    userRepository.save(loggedInUser);

	    Customer customer = customerRepository
	            .findByIdAndUser(request.getCustomerId(), loggedInUser)
	            .orElseThrow(() -> new RuntimeException("Customer not found"));

	    CustomerTransaction transaction = new CustomerTransaction();

	    transaction.setUser(loggedInUser);

	    transaction.setCustomer(customer);

	    transaction.setLoan(null);

	    transaction.setTransactionType(CustomerTransactionType.GIVE);

	    transaction.setAmount(request.getAmount());

	    transaction.setDescription(request.getDescription());

	    transaction.setTransactionDate(request.getTransactionDate());

	    updateCustomerBalance(
	            customer,
	            CustomerTransactionType.GIVE,
	            request.getAmount()
	    );

	    transaction.setBalanceAfterTransaction(
	            customer.getCurrentBalance()
	    );
	    CustomerTransaction saved =
	            customerTransactionRepository.save(transaction);

	    return new CustomerTransactionResponse(
	            saved.getId(),
	            customer.getName(),
	            saved.getTransactionType(),
	            saved.getAmount(),
	            saved.getBalanceAfterTransaction(),
	            "Money given successfully"
	    );
	}

	@Override
	@Transactional
	public CustomerTransactionResponse receiveMoney(GiveReceiveRequest request) {

	    User loggedInUser = getLoggedInUser();
	    loggedInUser.setCashBalance(
	            loggedInUser.getCashBalance()
	                    .add(request.getAmount())
	    );

	    userRepository.save(loggedInUser);

	    Customer customer = customerRepository
	            .findByIdAndUser(request.getCustomerId(), loggedInUser)
	            .orElseThrow(() -> new RuntimeException("Customer not found"));

	    CustomerTransaction transaction = new CustomerTransaction();

	    transaction.setUser(loggedInUser);

	    transaction.setCustomer(customer);

	    transaction.setLoan(null);

	    transaction.setTransactionType(CustomerTransactionType.RECEIVE);

	    transaction.setAmount(request.getAmount());

	    transaction.setDescription(request.getDescription());

	    transaction.setTransactionDate(request.getTransactionDate());
	    updateCustomerBalance(
	            customer,
	            CustomerTransactionType.RECEIVE,
	            request.getAmount()
	    );

	    transaction.setBalanceAfterTransaction(
	            customer.getCurrentBalance()
	    );

	    CustomerTransaction saved =
	            customerTransactionRepository.save(transaction);

	    return new CustomerTransactionResponse(
	            saved.getId(),
	            customer.getName(),
	            saved.getTransactionType(),
	            saved.getAmount(),
	            saved.getBalanceAfterTransaction(),
	            "Money received successfully"
	    );
	}
	@Override
	public List<CustomerTransactionResponse> getHistory(Long customerId) {

	    User loggedInUser = getLoggedInUser();

	    Customer customer = customerRepository
	            .findByIdAndUser(customerId, loggedInUser)
	            .orElseThrow(() -> new RuntimeException("Customer not found"));

	    return customerTransactionRepository
	            .findByCustomerAndUserOrderByTransactionDateDesc(
	                    customer,
	                    loggedInUser)
	            .stream()
	            .map(transaction -> new CustomerTransactionResponse(

	                    transaction.getId(),

	                    customer.getName(),

	                    transaction.getTransactionType(),

	                    transaction.getAmount(),
	                    
	                    transaction.getBalanceAfterTransaction(),

	                    "Success"

	            ))
	            .toList();
	}
	
}
