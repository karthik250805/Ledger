package com.karthik.ledger.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.karthik.ledger.entity.Customer;
import com.karthik.ledger.entity.CustomerLoan;
//import com.karthik.ledger.entity.CustomerTransaction;
import com.karthik.ledger.entity.User;

import Enum.LoanDirection;
import Enum.LoanStatus;
 

public interface CustomerLoanRepository extends JpaRepository<CustomerLoan, Long> {
	  List<CustomerLoan> findByCustomerAndUser(Customer customer,User user);
	  Optional<CustomerLoan> findByIdAndUser(Long id, User user);

	  List<CustomerLoan> findByCustomerAndUserAndLoanDirection(
	          Customer customer, User user, LoanDirection loanDirection);
	  List<CustomerLoan> findByUser(User user);
	  
	  @Query("""
		        SELECT COUNT(l)
		        FROM CustomerLoan l
		        WHERE l.user = :user
		        AND l.status = :status
		    """)
		    Long countLoansByStatus(
		            @Param("user") User user,
		            @Param("status") LoanStatus status
		    );
	  
	  @Query("""
		        SELECT COALESCE(SUM(l.interestDue), 0)
		        FROM CustomerLoan l
		        WHERE l.user = :user
		        AND l.loanDirection = :direction
		        AND l.status = :status
		    """)
		    BigDecimal sumInterestDueByDirectionAndStatus(
		            @Param("user") User user,
		            @Param("direction") LoanDirection direction,
		            @Param("status") LoanStatus status
		    );
	  

	  
	  
}
