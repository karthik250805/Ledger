package com.karthik.ledger.repository;

import java.util.List;
import java.util.Optional;

//import org.hibernate.internal.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.karthik.ledger.entity.Customer;
import com.karthik.ledger.entity.User;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
	List<Customer> findByUser(User user);
	Boolean existsByPhoneAndUser(String Phone,User user);

	Boolean existsByEmailAndUser(String Email,User user);
//	boolean existByPhoneAndUser(String phone, User loggedInUser);
	Optional<Customer> findByIdAndUser(Long id, User user);
	
}
