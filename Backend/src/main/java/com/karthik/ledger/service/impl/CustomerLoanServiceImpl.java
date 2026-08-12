package com.karthik.ledger.service.impl;

import java.math.BigDecimal;

import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.karthik.ledger.dto.FullPaymentRequest;
import com.karthik.ledger.dto.FullPaymentResponse;
import com.karthik.ledger.dto.LoanDetailsResponse;
import com.karthik.ledger.dto.LoanRequest;
import com.karthik.ledger.dto.LoanResponse;
import com.karthik.ledger.dto.LoanTransactionResponse;
import com.karthik.ledger.dto.PartialPaymentRequest;
import com.karthik.ledger.dto.PartialPaymentResponse;
import com.karthik.ledger.dto.RefreshInterestRequest;
import com.karthik.ledger.dto.RefreshInterestResponse;
import com.karthik.ledger.entity.Customer;
import com.karthik.ledger.entity.CustomerLoan;
import com.karthik.ledger.entity.LoanTransaction;
import com.karthik.ledger.entity.User;
import com.karthik.ledger.repository.CustomerLoanRepository;
import com.karthik.ledger.repository.CustomerRepository;
import com.karthik.ledger.repository.CustomerTransactionRepository;
import com.karthik.ledger.repository.LoanTransactionRepository;
import com.karthik.ledger.repository.UserRepository;
import com.karthik.ledger.service.CustomerLoanService;

import Enum.CustomerBalanceStatus;
import Enum.LoanDirection;
import Enum.LoanStatus;
import Enum.LoanTransactionType;

@Service
public class CustomerLoanServiceImpl implements CustomerLoanService {

	private final CustomerLoanRepository loanRepository;

	private final CustomerRepository customerRepository;

	private final CustomerTransactionRepository transactionRepository;

	private final UserRepository userRepository;
	
	private final LoanTransactionRepository loanTransactionRepository;
	
	
public CustomerLoanServiceImpl(CustomerLoanRepository loanRepository, CustomerRepository customerRepository,
			CustomerTransactionRepository transactionRepository, UserRepository userRepository,
			LoanTransactionRepository loanTransactionRepository) {
		super();
		this.loanRepository = loanRepository;
		this.customerRepository = customerRepository;
		this.transactionRepository = transactionRepository;
		this.userRepository = userRepository;
		this.loanTransactionRepository = loanTransactionRepository;
	}
//	private LoanDetailsResponse mapToLoanDetailsResponse(CustomerLoan loan) {
//
//	    LoanDetailsResponse response = new LoanDetailsResponse();
//
//	    response.setLoanId(loan.getId());
//	    response.setCustomerName(loan.getCustomer().getName());
//	    response.setLoanDirection(loan.getLoanDirection());
//	    response.setPrincipalAmount(loan.getPrincipalAmount());
//	    response.setOutstandingPrincipal(loan.getOutstandingPrincipal());
//	    response.setInterestDue(loan.getInterestDue());
//	    response.setInterestType(loan.getInterestType());
//	    response.setInterestRate(loan.getInterestRate());
//	    response.setInterestFrequency(loan.getInterestFrequency());
//	    response.setNextInterestDate(loan.getNextInterestDate());
//	    response.setStatus(loan.getStatus());
//	    response.setNotes(loan.getNotes());
//
//	    return response;
//	}


	private LoanDetailsResponse mapToLoanDetailsResponse(CustomerLoan loan) {

	    LoanDetailsResponse response = new LoanDetailsResponse();

	    response.setLoanId(loan.getId());
	    response.setCustomerName(loan.getCustomer().getName());
	    response.setLoanDirection(loan.getLoanDirection());
	    response.setPrincipalAmount(loan.getPrincipalAmount());
	    response.setOutstandingPrincipal(loan.getOutstandingPrincipal());
	    response.setInterestDue(loan.getInterestDue());

	    response.setTotalDue(
	            loan.getOutstandingPrincipal()
	                .add(loan.getInterestDue()));

	    response.setInterestRate(loan.getInterestRate());
	    response.setInterestType(loan.getInterestType());
	    response.setInterestFrequency(loan.getInterestFrequency());

	    response.setLastInterestCalculatedDate(
	            loan.getLastInterestCalculatedDate());

	    response.setNextInterestDate(
	            loan.getNextInterestDate());

	    response.setStatus(loan.getStatus());
	    response.setNotes(loan.getNotes());
	    if (loan.getCreatedAt() != null) {

	        response.setLoanDate(
	                loan.getCreatedAt().toLocalDate()
	        );

	    }

	    return response;
	}
	private LoanTransactionResponse mapToLoanTransactionResponse(
	        LoanTransaction transaction) {

	    LoanTransactionResponse response =
	            new LoanTransactionResponse();

	    response.setTransactionId(transaction.getId());
	    response.setTransactionType(transaction.getTransactionType());
	    response.setAmount(transaction.getAmount());
	    response.setDescription(transaction.getDescription());
	    response.setTransactionDate(transaction.getTransactionDate());
	    response.setOutstandingAfterTransaction(
	            transaction.getOutstandingAfterTransaction()
	    );
	    response.setCustomerOutstandingAfterTransaction(
	            transaction.getCustomerOutstandingAfterTransaction()
	    );
	    

	    return response;
	}
	
	private User getLoggedInUser() {

	    Authentication authentication =
	            SecurityContextHolder.getContext().getAuthentication();

	    String email = authentication.getName();

	    return userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));
	}
	private BigDecimal getSignedCustomerBalance(Customer customer) {

	    if (customer.getBalanceStatus() == CustomerBalanceStatus.PAYABLE) {
	        return customer.getCurrentBalance().negate();
	    }

	    return customer.getCurrentBalance();
	}

	@Transactional
	@Override
	public LoanResponse createLoan(LoanRequest request) {
		// TODO Auto-generated method stub
		User LoggedUser=getLoggedInUser();
		if (request.getLoanDirection() == LoanDirection.LEND) {

		    LoggedUser.setCashBalance(
		            LoggedUser.getCashBalance()
		                    .subtract(request.getPrincipalAmount())
		    );

		} else {

		    LoggedUser.setCashBalance(
		            LoggedUser.getCashBalance()
		                    .add(request.getPrincipalAmount())
		    );

		}

		userRepository.save(LoggedUser);
		Customer customer = customerRepository
	            .findByIdAndUser(request.getCustomerId(), LoggedUser)
	            .orElseThrow(() -> new RuntimeException("Customer not found"));

		CustomerLoan loan = new CustomerLoan();
		if (request.getLoanDirection() == LoanDirection.LEND) {

		    if (customer.getBalanceStatus() == CustomerBalanceStatus.RECEIVABLE) {

		        customer.setCurrentBalance(
		                customer.getCurrentBalance()
		                        .add(request.getPrincipalAmount())
		        );	

		    } else if (customer.getBalanceStatus() == CustomerBalanceStatus.PAYABLE) {

		        BigDecimal balance = customer.getCurrentBalance()
		                .subtract(request.getPrincipalAmount());

		        if (balance.compareTo(BigDecimal.ZERO) > 0) {

		            customer.setCurrentBalance(balance);

		        } else if (balance.compareTo(BigDecimal.ZERO) == 0) {

		            customer.setCurrentBalance(BigDecimal.ZERO);
		            customer.setBalanceStatus(CustomerBalanceStatus.SETTLED);

		        } else {

		            customer.setCurrentBalance(balance.abs());
		            customer.setBalanceStatus(CustomerBalanceStatus.RECEIVABLE);

		        }

		    } else {

		        customer.setCurrentBalance(request.getPrincipalAmount());
		        customer.setBalanceStatus(CustomerBalanceStatus.RECEIVABLE);

		    }

		} else {

		    // BORROW

		    if (customer.getBalanceStatus() == CustomerBalanceStatus.PAYABLE) {

		        customer.setCurrentBalance(
		                customer.getCurrentBalance()
		                        .add(request.getPrincipalAmount())
		        );

		    } else if (customer.getBalanceStatus() == CustomerBalanceStatus.RECEIVABLE) {

		        BigDecimal balance = customer.getCurrentBalance()
		                .subtract(request.getPrincipalAmount());

		        if (balance.compareTo(BigDecimal.ZERO) > 0) {

		            customer.setCurrentBalance(balance);

		        } else if (balance.compareTo(BigDecimal.ZERO) == 0) {

		            customer.setCurrentBalance(BigDecimal.ZERO);
		            customer.setBalanceStatus(CustomerBalanceStatus.SETTLED);

		        } else {

		            customer.setCurrentBalance(balance.abs());
		            customer.setBalanceStatus(CustomerBalanceStatus.PAYABLE);

		        }

		    } else {

		        customer.setCurrentBalance(request.getPrincipalAmount());
		        customer.setBalanceStatus(CustomerBalanceStatus.PAYABLE);

		    }
		}
		

		customerRepository.save(customer);

		loan.setUser(LoggedUser);

		loan.setCustomer(customer);

		loan.setLoanDirection(request.getLoanDirection());

		loan.setInterestType(request.getInterestType());

		loan.setInterestRate(request.getInterestRate());

		loan.setInterestFrequency(request.getInterestFrequency());

		loan.setPrincipalAmount(request.getPrincipalAmount());

		loan.setOutstandingPrincipal(request.getPrincipalAmount());

		loan.setInterestDue(BigDecimal.ZERO);

		loan.setNextInterestDate(request.getNextInterestDate());

		loan.setStatus(LoanStatus.ACTIVE);

		loan.setNotes(request.getNotes());
		
		loan.setLastInterestCalculatedDate(request.getLoanDate());
		loan.setNextInterestDate(request.getLoanDate().plusMonths(1));
		CustomerLoan savedLoan = loanRepository.save(loan);
		
		LoanTransaction loanTransaction = new LoanTransaction();

		loanTransaction.setUser(LoggedUser);

		loanTransaction.setLoan(savedLoan);

		loanTransaction.setAmount(request.getPrincipalAmount());

		loanTransaction.setDescription(request.getNotes());

		loanTransaction.setTransactionDate(request.getLoanDate());

		loanTransaction.setOutstandingAfterTransaction(
		        savedLoan.getOutstandingPrincipal()
		                .add(savedLoan.getInterestDue())
		);
		
		loanTransaction.setCustomerOutstandingAfterTransaction(
		        getSignedCustomerBalance(customer)
		);
		loanTransaction.setCustomerBalanceStatusAfterTransaction(
		        customer.getBalanceStatus()
		);

		if (request.getLoanDirection() == LoanDirection.LEND) {

		    loanTransaction.setTransactionType(
		            LoanTransactionType.LEND
		    );

		} else {

		    loanTransaction.setTransactionType(
		            LoanTransactionType.BORROW
		    );

		}

		loanTransactionRepository.save(loanTransaction);
		
		
		return new LoanResponse(
		        savedLoan.getId(),
		        customer.getName(),
		        savedLoan.getPrincipalAmount(),
		        "Loan created successfully"
		);
	}	

	@Override
//	@Override
	public LoanDetailsResponse getLoan(Long loanId) {

	    User loggedInUser = getLoggedInUser();

	    CustomerLoan loan = loanRepository
	            .findByIdAndUser(loanId, loggedInUser)
	            .orElseThrow(() ->
	                    new RuntimeException("Loan not found"));

	    return mapToLoanDetailsResponse(loan);
	}

	@Override
	public List<LoanDetailsResponse> getAllLoans(Long customerId) {

	    User loggedInUser = getLoggedInUser();

	    Customer customer = customerRepository
	            .findByIdAndUser(customerId, loggedInUser)
	            .orElseThrow(() ->
	                    new RuntimeException("Customer not found"));

	    return loanRepository
	            .findByCustomerAndUser(customer, loggedInUser)
	            .stream()
	            .map(this::mapToLoanDetailsResponse)
	            .toList();
	}

	@Override
	public List<LoanDetailsResponse> getLendLoans(Long customerId) {

	    User loggedInUser = getLoggedInUser();

	    Customer customer = customerRepository
	            .findByIdAndUser(customerId, loggedInUser)
	            .orElseThrow(() ->
	                    new RuntimeException("Customer not found"));

	    return loanRepository
	            .findByCustomerAndUserAndLoanDirection(
	                    customer,
	                    loggedInUser,
	                    LoanDirection.LEND)
	            .stream()
	            .map(this::mapToLoanDetailsResponse)
	            .toList();
	}

	@Override
	public List<LoanDetailsResponse> getBorrowLoans(Long customerId) {

	    User loggedInUser = getLoggedInUser();

	    Customer customer = customerRepository
	            .findByIdAndUser(customerId, loggedInUser)
	            .orElseThrow(() ->
	                    new RuntimeException("Customer not found"));

	    return loanRepository
	            .findByCustomerAndUserAndLoanDirection(
	                    customer,
	                    loggedInUser,
	                    LoanDirection.BORROW)
	            .stream()
	            .map(this::mapToLoanDetailsResponse)
	            .toList();
	}
	@Override
	@Transactional
	public RefreshInterestResponse refreshInterest(
	        RefreshInterestRequest request) {

	    User loggedInUser = getLoggedInUser();

	    CustomerLoan loan = loanRepository
	            .findByIdAndUser(
	                    request.getLoanId(),
	                    loggedInUser
	            )
	            .orElseThrow(
	                    () -> new RuntimeException(
	                            "Loan not found"
	                    )
	            );

	    Customer customer = loan.getCustomer();

	    LocalDate lastCalculatedDate =
	            loan.getLastInterestCalculatedDate();

	    LocalDate refreshDate =
	            request.getRefreshDate();


	    // --------------------------------------------------
	    // Validate date
	    // --------------------------------------------------

	    if (refreshDate.isBefore(lastCalculatedDate)) {

	        throw new RuntimeException(
	                "Refresh date cannot be before last calculated date."
	        );
	    }


	    long days =
	            ChronoUnit.DAYS.between(
	                    lastCalculatedDate,
	                    refreshDate
	            );


	    if (days == 0) {

	        throw new RuntimeException(
	                "Interest already refreshed for this date"
	        );
	    }


	    // --------------------------------------------------
	    // Principal
	    // --------------------------------------------------

	    BigDecimal principal =
	            loan.getOutstandingPrincipal();


	    // --------------------------------------------------
	    // Interest Rate
	    // --------------------------------------------------

	    BigDecimal rate =
	            loan.getInterestRate();


	    /*
	     * Example:
	     *
	     * Principal = 10,000
	     * Rate      = 8%
	     *
	     * Rate amount = 10,000 × 8 / 100
	     *             = 800
	     */

	    BigDecimal interestForOnePeriod =
	            principal
	                    .multiply(rate)
	                    .divide(
	                            BigDecimal.valueOf(100),
	                            2,
	                            RoundingMode.HALF_UP
	                    );


	    // --------------------------------------------------
	    // Calculate interest according to frequency
	    // --------------------------------------------------

	    BigDecimal interest;


	    switch (loan.getInterestFrequency()) {

	        case DAILY:

	            /*
	             * 8% is the daily interest rate.
	             */

	            interest =
	                    interestForOnePeriod
	                            .multiply(
	                                    BigDecimal.valueOf(days)
	                            );

	            break;


	        case WEEKLY:

	            /*
	             * 8% is the weekly interest rate.
	             *
	             * Convert elapsed days into weeks.
	             */

	            BigDecimal weeks =
	                    BigDecimal.valueOf(days)
	                            .divide(
	                                    BigDecimal.valueOf(7),
	                                    10,
	                                    RoundingMode.HALF_UP
	                            );

	            interest =
	                    interestForOnePeriod
	                            .multiply(weeks);

	            break;


	        case MONTHLY:

	            /*
	             * 8% is the monthly interest rate.
	             *
	             * Using 30 days as one month.
	             */

	            BigDecimal months =
	                    BigDecimal.valueOf(days)
	                            .divide(
	                                    BigDecimal.valueOf(30),
	                                    10,
	                                    RoundingMode.HALF_UP
	                            );

	            interest =
	                    interestForOnePeriod
	                            .multiply(months);

	            break;


	        case YEARLY:

	            /*
	             * 8% is the yearly interest rate.
	             *
	             * Using 365 days as one year.
	             */

	            BigDecimal years =
	                    BigDecimal.valueOf(days)
	                            .divide(
	                                    BigDecimal.valueOf(365),
	                                    10,
	                                    RoundingMode.HALF_UP
	                            );

	            interest =
	                    interestForOnePeriod
	                            .multiply(years);

	            break;


	        default:

	            throw new RuntimeException(
	                    "Unsupported interest frequency"
	            );
	    }


	    // --------------------------------------------------
	    // Round final interest
	    // --------------------------------------------------

	    interest =
	            interest.setScale(
	                    2,
	                    RoundingMode.HALF_UP
	            );


	    // --------------------------------------------------
	    // Update loan interest
	    // --------------------------------------------------

	    loan.setInterestDue(
	            loan.getInterestDue()
	                    .add(interest)
	    );


	    // --------------------------------------------------
	    // Update customer outstanding
	    // --------------------------------------------------

	    customer.setCurrentBalance(
	            customer.getCurrentBalance()
	                    .add(interest)
	    );

	    customerRepository.save(customer);


	    // --------------------------------------------------
	    // Update last calculated date
	    // --------------------------------------------------

	    loan.setLastInterestCalculatedDate(
	            refreshDate
	    );

	    loanRepository.save(loan);


	    // --------------------------------------------------
	    // Save transaction history
	    // --------------------------------------------------

	    LoanTransaction transaction =
	            new LoanTransaction();

	    transaction.setUser(
	            loggedInUser
	    );

	    transaction.setLoan(
	            loan
	    );

	    transaction.setTransactionType(
	            LoanTransactionType.INTEREST_ACCRUAL
	    );

	    transaction.setAmount(
	            interest
	    );

	    transaction.setDescription(
	            "Interest refreshed"
	    );

	    transaction.setTransactionDate(
	            refreshDate
	    );

	    transaction.setOutstandingAfterTransaction(
	            loan.getOutstandingPrincipal()
	                    .add(loan.getInterestDue())
	    );

	    transaction.setCustomerOutstandingAfterTransaction(
	            getSignedCustomerBalance(customer)
	    );

	    transaction.setCustomerBalanceStatusAfterTransaction(
	            customer.getBalanceStatus()
	    );

	    loanTransactionRepository.save(transaction);


	    // --------------------------------------------------
	    // Response
	    // --------------------------------------------------

	    return new RefreshInterestResponse(
	            loan.getId(),
	            (int) days,
	            interest,
	            loan.getInterestDue(),
	            "Interest refreshed successfully"
	    );
	}
	@Override
	@Transactional
	public PartialPaymentResponse partialPayment(PartialPaymentRequest request) {

	    User loggedInUser = getLoggedInUser();

	    CustomerLoan loan = loanRepository
	            .findByIdAndUser(request.getLoanId(), loggedInUser)
	            .orElseThrow(() -> new RuntimeException("Loan not found"));
	    
	    Customer customer = loan.getCustomer();

	    if (loan.getLastInterestCalculatedDate().isBefore(request.getPaymentDate())) {

	        throw new RuntimeException(
	                "Please refresh interest before making payment.");
	    }
	    // Validation
	    if (request.getPrincipalPayment().compareTo(BigDecimal.ZERO) < 0) {
	        throw new RuntimeException("Principal payment cannot be negative");
	    }

	    if (request.getInterestPayment().compareTo(BigDecimal.ZERO) < 0) {
	        throw new RuntimeException("Interest payment cannot be negative");
	    }

	    if (request.getPrincipalPayment()
	            .compareTo(loan.getOutstandingPrincipal()) > 0) {
	        throw new RuntimeException("Principal payment exceeds outstanding principal");
	    }

	    if (request.getInterestPayment()
	            .compareTo(loan.getInterestDue()) > 0) {
	        throw new RuntimeException("Interest payment exceeds interest due");
	    }

	    // Update loan
	    loan.setOutstandingPrincipal(
	            loan.getOutstandingPrincipal()
	                    .subtract(request.getPrincipalPayment()));
	    
	    loan.setInterestDue(
	            loan.getInterestDue()
	                    .subtract(request.getInterestPayment()));
	    BigDecimal totalPayment =
	            request.getPrincipalPayment()
	                   .add(request.getInterestPayment());

	    BigDecimal balance =
	            customer.getCurrentBalance().subtract(totalPayment);

	    if (balance.compareTo(BigDecimal.ZERO) > 0) {

	        customer.setCurrentBalance(balance);

	    }
	    else if (balance.compareTo(BigDecimal.ZERO) == 0) {

	        customer.setCurrentBalance(BigDecimal.ZERO);
	        customer.setBalanceStatus(CustomerBalanceStatus.SETTLED);

	    }
	    else {

	        customer.setCurrentBalance(balance.abs());

	        if (customer.getBalanceStatus() == CustomerBalanceStatus.RECEIVABLE) {

	            customer.setBalanceStatus(CustomerBalanceStatus.PAYABLE);

	        } else {

	            customer.setBalanceStatus(CustomerBalanceStatus.RECEIVABLE);

	        }

	    }

	    customerRepository.save(customer);

	    if (loan.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) == 0
	            && loan.getInterestDue().compareTo(BigDecimal.ZERO) == 0) {

	        loan.setStatus(LoanStatus.CLOSED);
	    }

	    // Update user's available cash
	    BigDecimal totalReceived = request.getPrincipalPayment()
	            .add(request.getInterestPayment());

	    if (loan.getLoanDirection() == LoanDirection.LEND) {

	        loggedInUser.setCashBalance(
	                loggedInUser.getCashBalance().add(totalReceived)
	        );

	    } else {

	        loggedInUser.setCashBalance(
	                loggedInUser.getCashBalance().subtract(totalReceived)
	        );

	    }

	    userRepository.save(loggedInUser);

	    customerRepository.save(customer);

	    loanRepository.save(loan);

	    // Principal payment history
	    if (request.getPrincipalPayment().compareTo(BigDecimal.ZERO) > 0) {

	    	LoanTransaction principalTransaction = new LoanTransaction();

	    	principalTransaction.setUser(loggedInUser);

	    	principalTransaction.setLoan(loan);

	    	principalTransaction.setTransactionType(
	    	        LoanTransactionType.PRINCIPAL_PAYMENT
	    	);

	    	principalTransaction.setAmount(
	    	        request.getPrincipalPayment()
	    	);

	    	principalTransaction.setDescription("Principal payment");

	    	principalTransaction.setTransactionDate(
	    	        request.getPaymentDate()
	    	);

	    	principalTransaction.setOutstandingAfterTransaction(
	    	        loan.getOutstandingPrincipal()
	    	                .add(loan.getInterestDue())
	    	);
	    	
	    	principalTransaction.setCustomerOutstandingAfterTransaction(
	    	        getSignedCustomerBalance(customer)
	    	);

	    	principalTransaction.setCustomerBalanceStatusAfterTransaction(
	    	        customer.getBalanceStatus()
	    	);

	    	loanTransactionRepository.save(principalTransaction);
	    }

	    // Interest payment history
	    if (request.getInterestPayment().compareTo(BigDecimal.ZERO) > 0) {

	    	LoanTransaction interestTransaction = new LoanTransaction();

	    	interestTransaction.setUser(loggedInUser);

	    	interestTransaction.setLoan(loan);

	    	interestTransaction.setTransactionType(
	    	        LoanTransactionType.INTEREST_PAYMENT
	    	);

	    	interestTransaction.setAmount(
	    	        request.getInterestPayment()
	    	);

	    	interestTransaction.setDescription("Interest payment");

	    	interestTransaction.setTransactionDate(
	    	        request.getPaymentDate()
	    	);

	    	interestTransaction.setOutstandingAfterTransaction(
	    	        loan.getOutstandingPrincipal()
	    	                .add(loan.getInterestDue())
	    	);
	    	
	    	interestTransaction.setCustomerOutstandingAfterTransaction(
	    	        getSignedCustomerBalance(customer)
	    	);

	    	interestTransaction.setCustomerBalanceStatusAfterTransaction(
	    	        customer.getBalanceStatus()
	    	);
	    	

	    	loanTransactionRepository.save(interestTransaction);
	    }

	    return new PartialPaymentResponse(
	            loan.getId(),
	            loan.getOutstandingPrincipal(),
	            loan.getInterestDue(),
	            "Partial payment successful"
	    );
	}
	
	@Override
	@Transactional
	public FullPaymentResponse fullPayment(FullPaymentRequest request) {

	    User loggedInUser = getLoggedInUser();

	    CustomerLoan loan = loanRepository
	            .findByIdAndUser(request.getLoanId(), loggedInUser)
	            .orElseThrow(() -> new RuntimeException("Loan not found"));


	    // --------------------------------------------------
	    // 1. Check interest is refreshed
	    // --------------------------------------------------

	    if (loan.getLastInterestCalculatedDate()
	            .isBefore(request.getPaymentDate())) {

	        throw new RuntimeException(
	                "Please refresh interest before making payment."
	        );
	    }


	    // --------------------------------------------------
	    // 2. Get outstanding amounts
	    // --------------------------------------------------

	    BigDecimal principalPayment =
	            loan.getOutstandingPrincipal();

	    BigDecimal interestPayment =
	            loan.getInterestDue();

	    BigDecimal totalOutstanding =
	            principalPayment.add(interestPayment);


	    // --------------------------------------------------
	    // 3. Get discount
	    // --------------------------------------------------

	    BigDecimal discountAmount =
	            request.getDiscountAmount() == null
	                    ? BigDecimal.ZERO
	                    : request.getDiscountAmount();


	    // Discount cannot be negative

	    if (discountAmount.compareTo(BigDecimal.ZERO) < 0) {

	        throw new RuntimeException(
	                "Discount amount cannot be negative."
	        );
	    }


	    // Discount cannot be greater than outstanding

	    if (discountAmount.compareTo(totalOutstanding) > 0) {

	        throw new RuntimeException(
	                "Discount cannot be greater than outstanding amount."
	        );
	    }


	    // --------------------------------------------------
	    // 4. Calculate actual cash received/paid
	    // --------------------------------------------------

	    BigDecimal totalPaid =
	            totalOutstanding.subtract(discountAmount);


	    // --------------------------------------------------
	    // 5. Update available cash
	    // --------------------------------------------------

	    if (loan.getLoanDirection() == LoanDirection.LEND) {

	        // Customer pays us
	        // Only actual cash received is added

	        loggedInUser.setCashBalance(
	                loggedInUser.getCashBalance()
	                        .add(totalPaid)
	        );

	    } else {

	        // We pay customer
	        // Only actual cash paid is subtracted

	        loggedInUser.setCashBalance(
	                loggedInUser.getCashBalance()
	                        .subtract(totalPaid)
	        );
	    }

	    userRepository.save(loggedInUser);


	    // --------------------------------------------------
	    // 6. Update customer balance
	    // --------------------------------------------------

	    Customer customer = loan.getCustomer();

	    /*
	     * Customer's entire loan outstanding is settled.
	     *
	     * Even though discount is not cash received,
	     * the customer no longer owes that discounted amount.
	     */

	    BigDecimal balance =
	            customer.getCurrentBalance()
	                    .subtract(totalOutstanding);


	    if (balance.compareTo(BigDecimal.ZERO) > 0) {

	        customer.setCurrentBalance(balance);

	    }

	    else if (balance.compareTo(BigDecimal.ZERO) == 0) {

	        customer.setCurrentBalance(
	                BigDecimal.ZERO
	        );

	        customer.setBalanceStatus(
	                CustomerBalanceStatus.SETTLED
	        );

	    }

	    else {

	        customer.setCurrentBalance(
	                balance.abs()
	        );

	        if (customer.getBalanceStatus()
	                == CustomerBalanceStatus.RECEIVABLE) {

	            customer.setBalanceStatus(
	                    CustomerBalanceStatus.PAYABLE
	            );

	        } else {

	            customer.setBalanceStatus(
	                    CustomerBalanceStatus.RECEIVABLE
	            );
	        }
	    }

	    customerRepository.save(customer);


	    // --------------------------------------------------
	    // 7. Close loan
	    // --------------------------------------------------

	    loan.setOutstandingPrincipal(
	            BigDecimal.ZERO
	    );

	    loan.setInterestDue(
	            BigDecimal.ZERO
	    );

	    loan.setStatus(
	            LoanStatus.CLOSED
	    );

	    loanRepository.save(loan);


	    // --------------------------------------------------
	    // 8. Principal payment history
	    // --------------------------------------------------

	    if (principalPayment.compareTo(BigDecimal.ZERO) > 0) {

	        LoanTransaction principalTransaction =
	                new LoanTransaction();

	        principalTransaction.setUser(
	                loggedInUser
	        );

	        principalTransaction.setLoan(
	                loan
	        );

	        principalTransaction.setTransactionType(
	                LoanTransactionType.PRINCIPAL_PAYMENT
	        );

	        principalTransaction.setAmount(
	                principalPayment
	        );

	        principalTransaction.setDescription(
	                "Full principal payment"
	        );

	        principalTransaction.setTransactionDate(
	                request.getPaymentDate()
	        );

	        principalTransaction.setOutstandingAfterTransaction(
	                BigDecimal.ZERO
	        );

	        principalTransaction.setCustomerOutstandingAfterTransaction(
	                getSignedCustomerBalance(customer)
	        );

	        principalTransaction.setCustomerBalanceStatusAfterTransaction(
	                customer.getBalanceStatus()
	        );

	        loanTransactionRepository.save(
	                principalTransaction
	        );
	    }


	    // --------------------------------------------------
	    // 9. Interest payment history
	    // --------------------------------------------------

	    if (interestPayment.compareTo(BigDecimal.ZERO) > 0) {

	        LoanTransaction interestTransaction =
	                new LoanTransaction();

	        interestTransaction.setUser(
	                loggedInUser
	        );

	        interestTransaction.setLoan(
	                loan
	        );

	        interestTransaction.setTransactionType(
	                LoanTransactionType.INTEREST_PAYMENT
	        );

	        interestTransaction.setAmount(
	                interestPayment
	        );

	        interestTransaction.setDescription(
	                "Full interest payment"
	        );

	        interestTransaction.setTransactionDate(
	                request.getPaymentDate()
	        );

	        interestTransaction.setOutstandingAfterTransaction(
	                BigDecimal.ZERO
	        );

	        interestTransaction.setCustomerOutstandingAfterTransaction(
	                getSignedCustomerBalance(customer)
	        );

	        interestTransaction.setCustomerBalanceStatusAfterTransaction(
	                customer.getBalanceStatus()
	        );

	        loanTransactionRepository.save(interestTransaction);
	    }


	    // --------------------------------------------------
	    // 10. Discount history
	    // --------------------------------------------------

	    if (discountAmount.compareTo(BigDecimal.ZERO) > 0) {

	        LoanTransaction discountTransaction =
	                new LoanTransaction();

	        discountTransaction.setUser(
	                loggedInUser
	        );

	        discountTransaction.setLoan(
	                loan
	        );

	        discountTransaction.setTransactionType(
	                LoanTransactionType.DISCOUNT
	        );

	        discountTransaction.setAmount(
	                discountAmount
	        );

	        discountTransaction.setDescription(
	                "Discount offered during full payment"
	        );

	        discountTransaction.setTransactionDate(
	                request.getPaymentDate()
	        );

	        discountTransaction.setOutstandingAfterTransaction(
	                BigDecimal.ZERO
	        );

	        discountTransaction.setCustomerOutstandingAfterTransaction(
	                getSignedCustomerBalance(customer)
	        );

	        discountTransaction.setCustomerBalanceStatusAfterTransaction(
	                customer.getBalanceStatus()
	        );

	        loanTransactionRepository.save(
	                discountTransaction
	        );
	    }


	    // --------------------------------------------------
	    // 11. Response
	    // --------------------------------------------------

	    return new FullPaymentResponse(
	            loan.getId(),
	            totalPaid,
	            "Loan closed successfully"
	    );
	}
//	@Override
	@Override
	public List<LoanTransactionResponse> getLoanTransactions(Long loanId) {

	    User loggedInUser = getLoggedInUser();

	    CustomerLoan loan = loanRepository
	            .findByIdAndUser(loanId, loggedInUser)
	            .orElseThrow(() ->
	                    new RuntimeException("Loan not found"));

	    return loanTransactionRepository
	            .findByLoanOrderByTransactionDateAsc(loan)
	            .stream()
	            .map(this::mapToLoanTransactionResponse)
	            .toList();
	}
	
		

}
