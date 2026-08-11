package com.karthik.ledger.service.impl;

import java.math.BigDecimal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.karthik.ledger.dto.LoanDashboardResponse;
import com.karthik.ledger.entity.User;
import com.karthik.ledger.repository.CustomerLoanRepository;
import com.karthik.ledger.repository.UserRepository;
import com.karthik.ledger.service.LoanDashboardService;

import Enum.LoanDirection;
import Enum.LoanStatus;

@Service
public class LoanDashboardServiceImpl
        implements LoanDashboardService {

    private final CustomerLoanRepository loanRepository;

    private final UserRepository userRepository;


    public LoanDashboardServiceImpl(
            CustomerLoanRepository loanRepository,
            UserRepository userRepository) {

        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
    }


    // =====================================================
    // LOGGED IN USER
    // =====================================================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
    }


    // =====================================================
    // LOAN DASHBOARD
    // =====================================================

    @Override
    public LoanDashboardResponse getLoanDashboard() {

        User loggedInUser = getLoggedInUser();

        LoanDashboardResponse response =
                new LoanDashboardResponse();


        // =================================================
        // ACTIVE LOANS
        // =================================================

        Long activeLoans =
                loanRepository.countLoansByStatus(
                        loggedInUser,
                        LoanStatus.ACTIVE
                );


        // =================================================
        // CLOSED LOANS
        // =================================================

        Long closedLoans =
                loanRepository.countLoansByStatus(
                        loggedInUser,
                        LoanStatus.CLOSED
                );


        // =================================================
        // INTEREST RECEIVABLE
        // LEND = CUSTOMER OWES US
        // =================================================

        BigDecimal interestReceivable =
                loanRepository
                        .sumInterestDueByDirectionAndStatus(
                                loggedInUser,
                                LoanDirection.LEND,
                                LoanStatus.ACTIVE
                        );


        // =================================================
        // INTEREST PAYABLE
        // BORROW = WE OWE CUSTOMER
        // =================================================

        BigDecimal interestPayable =
                loanRepository
                        .sumInterestDueByDirectionAndStatus(
                                loggedInUser,
                                LoanDirection.BORROW,
                                LoanStatus.ACTIVE
                        );


        response.setActiveLoans(
                activeLoans
        );

        response.setClosedLoans(
                closedLoans
        );

        response.setInterestReceivable(
                interestReceivable
        );

        response.setInterestPayable(
                interestPayable
        );


        return response;
    }
}