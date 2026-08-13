package com.karthik.ledger.ai.serviceimpl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.karthik.ledger.ai.service.LedgerAiService;
import com.karthik.ledger.entity.Customer;
import com.karthik.ledger.entity.CustomerLoan;
import com.karthik.ledger.entity.CustomerTransaction;
import com.karthik.ledger.entity.LoanTransaction;
import com.karthik.ledger.entity.Transaction;
import com.karthik.ledger.entity.User;
import com.karthik.ledger.repository.CustomerRepository;
import com.karthik.ledger.repository.CustomerTransactionRepository;
import com.karthik.ledger.repository.LoanRepository;
import com.karthik.ledger.repository.LoanTransactionRepository;
import com.karthik.ledger.repository.TransactionRepository;
import com.karthik.ledger.repository.UserRepository;


@Service
public class LedgerAiServiceImpl implements LedgerAiService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final CustomerTransactionRepository customerTransactionRepository;
    private final LoanRepository loanRepository;
    private final LoanTransactionRepository loanTransactionRepository;
    private final TransactionRepository transactionRepository;


   
	public LedgerAiServiceImpl(UserRepository userRepository, CustomerRepository customerRepository,
			CustomerTransactionRepository customerTransactionRepository, LoanRepository loanRepository, LoanTransactionRepository loanTransactionRepository, TransactionRepository transactionRepository) {
		super();
		this.userRepository = userRepository;
		this.customerRepository = customerRepository;
		this.customerTransactionRepository = customerTransactionRepository;
		this.loanRepository = loanRepository;
		this.loanTransactionRepository = loanTransactionRepository;
		this.transactionRepository = transactionRepository;
	}

	@Override
    public BigDecimal getCurrentBalance() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();
        
        if (authentication == null ||
	            !authentication.isAuthenticated()) {

	        throw new RuntimeException(
	                "User is not authenticated"
	        );
	    }

        String email = authentication.getName();
        
        if (email == null || email.isBlank()) {

	        throw new RuntimeException(
	                "Authenticated user email not found"
	        );
	    }

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return user.getCashBalance();
    }
	
	@Override
	public List<Map<String, Object>> getCustomerData() {

	    Authentication authentication =
	            SecurityContextHolder
	                    .getContext()
	                    .getAuthentication();

	    if (authentication == null ||
	            !authentication.isAuthenticated()) {

	        throw new RuntimeException(
	                "User is not authenticated"
	        );
	    }

	    String email = authentication.getName();

	    if (email == null || email.isBlank()) {

	        throw new RuntimeException(
	                "Authenticated user email not found"
	        );
	    }

	    User user =
	            userRepository
	                    .findByEmail(email)
	                    .orElseThrow(() ->
	                            new RuntimeException(
	                                    "User not found"
	                            ));

	    List<Customer> customers =
	            customerRepository.findByUser(user);

	    List<Map<String, Object>> result =
	            new ArrayList<>();

	    for (Customer customer : customers) {

	        Map<String, Object> customerData =
	                new HashMap<>();

	        customerData.put(
	                "id",
	                customer.getId()
	        );

	        customerData.put(
	                "name",
	                customer.getName()
	        );

	        customerData.put(
	                "phone",
	                customer.getPhone()
	        );

	        customerData.put(
	                "email",
	                customer.getEmail()
	        );

	        customerData.put(
	                "address",
	                customer.getAddress()
	        );

	        customerData.put(
	                "notes",
	                customer.getNotes()
	        );

	        customerData.put(
	                "currentBalance",
	                customer.getCurrentBalance()
	        );

	        customerData.put(
	                "balanceStatus",
	                customer.getBalanceStatus().name()
	        );

	        customerData.put(
	                "createdAt",
	                customer.getCreatedAt()
	        );

	        customerData.put(
	                "updatedAt",
	                customer.getUpdatedAt()
	        );

	        result.add(customerData);
	    }

	    return result;
	}

	@Override
	public List<Map<String, Object>> getCustomerTransactionData() {
		Authentication authentication =
                SecurityContextHolder
                .getContext()
                .getAuthentication();
		
		if (authentication == null ||
	            !authentication.isAuthenticated()) {

	        throw new RuntimeException(
	                "User is not authenticated"
	        );
	    }
		
		String email=authentication.getName();
		
		 if (email == null || email.isBlank()) {

		        throw new RuntimeException(
		                "Authenticated user email not found"
		        );
		    }

		
		
		User user =
	            userRepository
	                    .findByEmail(email)
	                    .orElseThrow(() ->
	                            new RuntimeException(
	                                    "User not found"
	                            ));
		List<CustomerTransaction> transactions = customerTransactionRepository.findByUser(user);
		
		List<Map<String, Object>> result = new ArrayList<>();
		
		 for (CustomerTransaction transaction :
	            transactions) {

	        Map<String, Object> transactionData =
	                new HashMap<>();

	        transactionData.put(
	                "id",
	                transaction.getId()
	        );

	        transactionData.put(
	                "userId",
	                user.getId()
	        );

	        transactionData.put(
	                "customerId",
	                transaction.getCustomer().getId()
	        );

	        transactionData.put(
	                "customerName",
	                transaction.getCustomer().getName()
	        );

	        transactionData.put(
	                "loanId",
	                transaction.getLoan() != null
	                        ? transaction.getLoan().getId()
	                        : null
	        );

	        transactionData.put(
	                "transactionType",
	                transaction.getTransactionType().name()
	        );

	        transactionData.put(
	                "amount",
	                transaction.getAmount()
	        );

	        transactionData.put(
	                "description",
	                transaction.getDescription()
	        );

	        transactionData.put(
	                "transactionDate",
	                transaction.getTransactionDate()
	        );

	        transactionData.put(
	                "createdAt",
	                transaction.getCreatedAt()
	        );

	        transactionData.put(
	                "updatedAt",
	                transaction.getUpdatedAt()
	        );

	        transactionData.put(
	                "balanceAfterTransaction",
	                transaction.getBalanceAfterTransaction()
	        );

	        transactionData.put(
	                "balanceStatus",
	                transaction.getBalanceStatusAfterTransaction() != null
	                        ? transaction.getBalanceStatusAfterTransaction().name()
	                        : null
	        );

	        result.add(transactionData);
	    }

	    return result;
		
		
		
		}

	@Override
	@Transactional(readOnly = true)
	public List<Map<String, Object>> getLoanData() {
		// TODO Auto-generated method stub
		Authentication authentication =
                SecurityContextHolder
                .getContext()
                .getAuthentication();
		
		if (authentication == null ||
	            !authentication.isAuthenticated()) {

	        throw new RuntimeException(
	                "User is not authenticated"
	        );
	    }
		
		String email=authentication.getName();
		
		 if (email == null || email.isBlank()) {

		        throw new RuntimeException(
		                "Authenticated user email not found"
		        );
		    }
		 
		 User user =
		            userRepository
		                    .findByEmail(email)
		                    .orElseThrow(() ->
		                            new RuntimeException(
		                                    "User not found"
		                            ));
		 
		 List<CustomerLoan> transactions = loanRepository.findByUser(user);
		 List<Map<String,Object>> result=new ArrayList<>();
		 for(CustomerLoan loan:transactions)
		 {
			 Map<String,Object> loanData=new HashMap<>();
			 loanData.put("id",loan.getId());
		        loanData.put(
		                "customerId",
		                loan.getCustomer().getId()
		        );

		        loanData.put(
		                "customerName",
		                loan.getCustomer().getName()
		        );

		        loanData.put(
		                "loanDirection",
		                loan.getLoanDirection().name()
		        );

		        loanData.put(
		                "interestType",
		                loan.getInterestType().name()
		        );

		        loanData.put(
		                "interestRate",
		                loan.getInterestRate()
		        );

		        loanData.put(
		                "interestFrequency",
		                loan.getInterestFrequency().name()
		        );

		        loanData.put(
		                "principalAmount",
		                loan.getPrincipalAmount()
		        );

		        loanData.put(
		                "outstandingPrincipal",
		                loan.getOutstandingPrincipal()
		        );

		        loanData.put(
		                "interestDue",
		                loan.getInterestDue()
		        );

		        loanData.put(
		                "nextInterestDate",
		                loan.getNextInterestDate()
		        );

		        loanData.put(
		                "status",
		                loan.getStatus().name()
		        );

		        loanData.put(
		                "notes",
		                loan.getNotes()
		        );

		        loanData.put(
		                "createdAt",
		                loan.getCreatedAt()
		        );

		        loanData.put(
		                "updatedAt",
		                loan.getUpdatedAt()
		        );

		        loanData.put(
		                "lastInterestCalculatedDate",
		                loan.getLastInterestCalculatedDate()
		        );
		        result.add(loanData);
		        
		 }
		 
		 
		return result;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Map<String, Object>> getLoanTransactionData() {

	    Authentication authentication =
	            SecurityContextHolder
	                    .getContext()
	                    .getAuthentication();

	    if (authentication == null ||
	            !authentication.isAuthenticated()) {

	        throw new RuntimeException(
	                "User is not authenticated"
	        );
	    }

	    String email = authentication.getName();

	    if (email == null || email.isBlank()) {

	        throw new RuntimeException(
	                "Authenticated user email not found"
	        );
	    }

	    User user =
	            userRepository
	                    .findByEmail(email)
	                    .orElseThrow(() ->
	                            new RuntimeException(
	                                    "User not found"
	                            ));

	    List<LoanTransaction> transactions =
	            loanTransactionRepository
	                    .findByUser(user);

	    List<Map<String, Object>> result =
	            new ArrayList<>();

	    for (LoanTransaction transaction : transactions) {

	        Map<String, Object> transactionData =
	                new HashMap<>();

	        transactionData.put(
	                "id",
	                transaction.getId()
	        );

	        transactionData.put(
	                "loanId",
	                transaction.getLoan().getId()
	        );

	        transactionData.put(
	                "customerId",
	                transaction.getLoan()
	                        .getCustomer()
	                        .getId()
	        );

	        transactionData.put(
	                "customerName",
	                transaction.getLoan()
	                        .getCustomer()
	                        .getName()
	        );

	        transactionData.put(
	                "transactionType",
	                transaction
	                        .getTransactionType()
	                        .name()
	        );

	        transactionData.put(
	                "amount",
	                transaction.getAmount()
	        );

	        transactionData.put(
	                "outstandingAfterTransaction",
	                transaction
	                        .getOutstandingAfterTransaction()
	        );

	        transactionData.put(
	                "customerOutstandingAfterTransaction",
	                transaction
	                        .getCustomerOutstandingAfterTransaction()
	        );

	        transactionData.put(
	                "customerBalanceStatusAfterTransaction",
	                transaction
	                        .getCustomerBalanceStatusAfterTransaction() != null
	                        ? transaction
	                            .getCustomerBalanceStatusAfterTransaction()
	                            .name()
	                        : null
	        );

	        transactionData.put(
	                "description",
	                transaction.getDescription()
	        );

	        transactionData.put(
	                "transactionDate",
	                transaction.getTransactionDate()
	        );

	        transactionData.put(
	                "createdAt",
	                transaction.getCreatedAt()
	        );

	        transactionData.put(
	                "updatedAt",
	                transaction.getUpdatedAt()
	        );

	        result.add(transactionData);
	    }

	    return result;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Map<String, Object>> getNormalTransactionData() {

	    Authentication authentication =
	            SecurityContextHolder
	                    .getContext()
	                    .getAuthentication();

	    if (authentication == null ||
	            !authentication.isAuthenticated()) {

	        throw new RuntimeException(
	                "User is not authenticated"
	        );
	    }

	    String email = authentication.getName();

	    if (email == null || email.isBlank()) {

	        throw new RuntimeException(
	                "Authenticated user email not found"
	        );
	    }

	    User user =
	            userRepository
	                    .findByEmail(email)
	                    .orElseThrow(() ->
	                            new RuntimeException(
	                                    "User not found"
	                            ));

	    List<Transaction> transactions =
	            transactionRepository.findByUser(user);

	    List<Map<String, Object>> result =
	            new ArrayList<>();

	    for (Transaction transaction : transactions) {

	        Map<String, Object> transactionData =
	                new HashMap<>();

	        transactionData.put(
	                "id",
	                transaction.getId()
	        );

	        transactionData.put(
	                "transactionType",
	                transaction.getTransactionType().name()
	        );

	        transactionData.put(
	                "transactionMode",
	                transaction.getTransactionMode() != null
	                        ? transaction.getTransactionMode().name()
	                        : null
	        );
	        transactionData.put(
	                "category",
	                transaction.getCategory()
	        );

	        transactionData.put(
	                "amount",
	                transaction.getAmount()
	        );

	        transactionData.put(
	                "paymentMode",
	                transaction.getPaymentMode() != null
	                        ? transaction.getPaymentMode().name()
	                        : null
	        );

	        transactionData.put(
	                "description",
	                transaction.getDescription()
	        );

	        transactionData.put(
	                "transactionDate",
	                transaction.getTransactionDate()
	        );

	        transactionData.put(
	                "createdAt",
	                transaction.getCreatedAt()
	        );

	        transactionData.put(
	                "updatedAt",
	                transaction.getUpdatedAt()
	        );

	        result.add(transactionData);
	    }

	    return result;
	}
}