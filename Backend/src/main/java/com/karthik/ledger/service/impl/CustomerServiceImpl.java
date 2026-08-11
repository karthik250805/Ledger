package com.karthik.ledger.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.karthik.ledger.dto.CustomerDetailsResponse;
import com.karthik.ledger.dto.CustomerHistoryResponse;
import com.karthik.ledger.dto.CustomerRequest;
import com.karthik.ledger.dto.CustomerResponse;
import com.karthik.ledger.dto.CustomerSummaryResponse;
import com.karthik.ledger.entity.Customer;
import com.karthik.ledger.entity.CustomerLoan;
import com.karthik.ledger.entity.CustomerTransaction;
import com.karthik.ledger.entity.User;
import com.karthik.ledger.repository.CustomerLoanRepository;
import com.karthik.ledger.repository.CustomerRepository;
import com.karthik.ledger.repository.CustomerTransactionRepository;
import com.karthik.ledger.repository.LoanTransactionRepository;
import com.karthik.ledger.repository.UserRepository;
import com.karthik.ledger.service.CustomerService;

import Enum.CustomerBalanceStatus;
import Enum.CustomerTransactionType;
import Enum.LoanDirection;

@Service
public class CustomerServiceImpl implements CustomerService{
	private final CustomerRepository customerRepository;
	 private final UserRepository userRepository;

	 private final CustomerLoanRepository customerLoanRepository;
	 private final CustomerTransactionRepository customerTransactionRepository;
	 

	 private final LoanTransactionRepository loanTransactionRepository;
	    

	   

		public CustomerServiceImpl(CustomerRepository customerRepository, UserRepository userRepository,
			CustomerLoanRepository customerLoanRepository, CustomerTransactionRepository customerTransactionRepository,
			LoanTransactionRepository loanTransactionRepository) {
		super();
		this.customerRepository = customerRepository;
		this.userRepository = userRepository;
		this.customerLoanRepository = customerLoanRepository;
		this.customerTransactionRepository = customerTransactionRepository;
		this.loanTransactionRepository = loanTransactionRepository;
	}

		private User getLoggedInUser() {

	        Authentication authentication =
	                SecurityContextHolder.getContext().getAuthentication();

	        String email = authentication.getName();

	        return userRepository.findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("User not found"));
	    }

	    @Override
	    public CustomerResponse addCustomer(CustomerRequest request) {

	        User loggedInUser = getLoggedInUser();

	        // Check duplicate phone number for this user
	        if (customerRepository.existsByPhoneAndUser(request.getPhone(), loggedInUser)) {
	            throw new RuntimeException("Customer with this phone number already exists.");
	        }

	        // Check duplicate email if provided
	        if (request.getEmail() != null &&
	                !request.getEmail().isBlank() &&
	                customerRepository.existsByEmailAndUser(request.getEmail(), loggedInUser)) {

	            throw new RuntimeException("Customer with this email already exists.");
	        }

	        Customer customer = new Customer();

	        customer.setName(request.getName());
	        customer.setPhone(request.getPhone());
	        customer.setEmail(request.getEmail());
	        customer.setAddress(request.getAddress());
	        customer.setNotes(request.getNotes());

	        customer.setUser(loggedInUser);
	        customer.setCurrentBalance(BigDecimal.ZERO);
	        customer.setBalanceStatus(CustomerBalanceStatus.SETTLED);
	        Customer savedCustomer = customerRepository.save(customer);

	        return new CustomerResponse(
	                savedCustomer.getId(),
	                savedCustomer.getName(),
	                savedCustomer.getPhone(),
	                savedCustomer.getEmail(),
	                savedCustomer.getAddress(),
	                savedCustomer.getNotes(),
	                savedCustomer.getCurrentBalance(),
	                savedCustomer.getBalanceStatus()
	        );
	    }
	    private CustomerResponse mapToResponse(Customer customer) {

	        CustomerResponse response = new CustomerResponse();

	        response.setId(customer.getId());
	        response.setName(customer.getName());
	        response.setPhone(customer.getPhone());
	        response.setEmail(customer.getEmail());
	        response.setAddress(customer.getAddress());
	        response.setNotes(customer.getNotes());
	        response.setBalanceStatus(customer.getBalanceStatus());
	        response.setCurrentBalance(customer.getCurrentBalance());

	        return response;
	    }
	    @Override
	    public List<CustomerResponse> getAllCustomers() {

	        User user = getLoggedInUser();

	        List<Customer> customers = customerRepository.findByUser(user);

	        return customers.stream()
	                .map(this::mapToResponse)
	                .toList();
	    }
	    

	    @Override
	    public List<CustomerHistoryResponse> getCustomerHistory(Long customerId) {

	        User loggedInUser = getLoggedInUser();

	        Customer customer = customerRepository
	                .findByIdAndUser(customerId, loggedInUser)
	                .orElseThrow(() ->
	                        new RuntimeException("Customer not found"));

	        List<CustomerHistoryResponse> history =
	                new ArrayList<>();

	        // Normal Transactions
	        customerTransactionRepository
	                .findByCustomerAndUser(customer, loggedInUser)
	                .forEach(transaction -> {

	                    history.add(

	                            new CustomerHistoryResponse(

	                                    transaction.getId(),
	                                    
	                                    null,

	                                    transaction.getTransactionType().name(),

	                                    transaction.getAmount(),

	                                    transaction.getBalanceAfterTransaction(),

	                                    transaction.getDescription(),

	                                    transaction.getTransactionDate(),
	                                    
	                                    transaction.getCreatedAt()
	           

	                            )

	                    );

	                });

	        // Loan Transactions
	        loanTransactionRepository
	                .findByLoanCustomerAndLoanUser(
	                        customer,
	                        loggedInUser
	                )
	                .forEach(transaction -> {

	                    history.add(

	                            new CustomerHistoryResponse(

	                                    transaction.getId(),
	                                    
	                                    transaction.getLoan().getId(),

	                                    transaction.getTransactionType().name(),

	                                    transaction.getAmount(),

	                                    transaction.getCustomerOutstandingAfterTransaction(),

	                                    transaction.getDescription(),

	                                    transaction.getTransactionDate(),
	                                    
	                                    transaction.getCreatedAt()

	                            )

	                    );

	                });

	        
	        history.sort(
	        	    Comparator.comparing(CustomerHistoryResponse::getTransactionDate)
	        	              .thenComparing(CustomerHistoryResponse::getCreatedAt)
	        	             
	        	);

	        return history;
	    }
	    @Override
	    public CustomerDetailsResponse getCustomer(Long customerId) {

	        User loggedInUser = getLoggedInUser();

	        Customer customer = customerRepository
	                .findByIdAndUser(customerId, loggedInUser)
	                .orElseThrow(() ->
	                        new RuntimeException("Customer not found"));

	        CustomerDetailsResponse response =
	                new CustomerDetailsResponse();

	        response.setCustomerId(customer.getId());
	        response.setName(customer.getName());
	        response.setPhone(customer.getPhone());
	        response.setEmail(customer.getEmail());
	        response.setAddress(customer.getAddress());
	        response.setNotes(customer.getNotes());
	       

	        return response;
	    }

	    @Override
	    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {

	        User user = getLoggedInUser();

	        Customer customer = customerRepository
	                .findByIdAndUser(id, user)
	                .orElseThrow(() ->
	                        new RuntimeException("Customer not found"));

	        customer.setName(request.getName());
	        customer.setPhone(request.getPhone());
	        customer.setEmail(request.getEmail());
	        customer.setAddress(request.getAddress());
	        customer.setNotes(request.getNotes());

	        Customer updatedCustomer = customerRepository.save(customer);

	        return mapToResponse(updatedCustomer);
	    }

	    @Override
	    public void deleteCustomer(Long id) {

	        User user = getLoggedInUser();

	        Customer customer = customerRepository
	                .findByIdAndUser(id, user)
	                .orElseThrow(() ->
	                        new RuntimeException("Customer not found"));

	        customerRepository.delete(customer);
	    }
		@Override
		public CustomerResponse getCustomerById(Long id) {

		    User user = getLoggedInUser();

		    Customer customer = customerRepository
		            .findByIdAndUser(id, user)
		            .orElseThrow(() ->
		                    new RuntimeException("Customer not found"));

		    return mapToResponse(customer);
		}
		
		@Override
		public CustomerSummaryResponse getCustomerSummary(Long customerId) {

		    User loggedInUser = getLoggedInUser();

		    Customer customer = customerRepository
		            .findByIdAndUser(customerId, loggedInUser)
		            .orElseThrow(() ->
		                    new RuntimeException("Customer not found"));

		    List<CustomerTransaction> transactions =
		            customerTransactionRepository.findByCustomerAndUser(
		                    customer,
		                    loggedInUser);

		    List<CustomerLoan> loans =
		            customerLoanRepository.findByCustomerAndUser(
		                    customer,
		                    loggedInUser);

		    BigDecimal totalGiven = BigDecimal.ZERO;
		    BigDecimal totalReceived = BigDecimal.ZERO;

		    BigDecimal totalLendPrincipal = BigDecimal.ZERO;
		    BigDecimal totalLendOutstanding = BigDecimal.ZERO;

		    BigDecimal totalBorrowPrincipal = BigDecimal.ZERO;
		    BigDecimal totalBorrowOutstanding = BigDecimal.ZERO;

		    // Normal Transactions
		    for (CustomerTransaction transaction : transactions) {

		        if (transaction.getTransactionType() ==
		                CustomerTransactionType.GIVE) {

		            totalGiven =
		                    totalGiven.add(transaction.getAmount());
		        }

		        if (transaction.getTransactionType() ==
		                CustomerTransactionType.RECEIVE) {

		            totalReceived =
		                    totalReceived.add(transaction.getAmount());
		        }
		    }

		    // Loans
		    for (CustomerLoan loan : loans) {

		        if (loan.getLoanDirection() ==
		                LoanDirection.LEND) {

		            totalLendPrincipal =
		                    totalLendPrincipal.add(
		                            loan.getPrincipalAmount());

		            totalLendOutstanding =
		            	    totalLendOutstanding.add(
		            	        loan.getOutstandingPrincipal()
		            	            .add(loan.getInterestDue()));
		        }

		        if (loan.getLoanDirection() ==
		                LoanDirection.BORROW) {

		            totalBorrowPrincipal =
		                    totalBorrowPrincipal.add(
		                            loan.getPrincipalAmount());

		            totalBorrowOutstanding =
		            	    totalBorrowOutstanding.add(
		            	        loan.getOutstandingPrincipal()
		            	            .add(loan.getInterestDue()));
		        }
		    }

		    BigDecimal overallBalance =
		            totalGiven
		            .add(totalLendOutstanding)
		            .subtract(totalReceived)
		            .subtract(totalBorrowOutstanding);

		    CustomerSummaryResponse response =
		            new CustomerSummaryResponse();

		    response.setTotalGiven(totalGiven);
		    response.setTotalReceived(totalReceived);

		    response.setTotalLendPrincipal(totalLendPrincipal);
		    response.setTotalLendOutstanding(totalLendOutstanding);

		    response.setTotalBorrowPrincipal(totalBorrowPrincipal);
		    response.setTotalBorrowOutstanding(totalBorrowOutstanding);

		    response.setOverallBalance(overallBalance.abs());

		    if (overallBalance.compareTo(BigDecimal.ZERO) > 0) {

		        response.setBalanceStatus(
		                CustomerBalanceStatus.RECEIVABLE);

		    }else if(overallBalance.compareTo(BigDecimal.ZERO)<0) {
		    	response.setBalanceStatus(CustomerBalanceStatus.PAYABLE);
		    }
		    else {

		        response.setBalanceStatus(
		                CustomerBalanceStatus.SETTLED);
		    }

		    return response;
		}
	
}
