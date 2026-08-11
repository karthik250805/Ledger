package com.karthik.ledger.service.impl;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.karthik.ledger.dto.CustomerSummaryResponse;
import com.karthik.ledger.dto.DashboardResponse;
import com.karthik.ledger.entity.Customer;
import com.karthik.ledger.entity.Transaction;
import com.karthik.ledger.entity.User;
import com.karthik.ledger.repository.CustomerRepository;
import com.karthik.ledger.repository.TransactionRepository;
import com.karthik.ledger.repository.UserRepository;
import com.karthik.ledger.service.CustomerService;
import com.karthik.ledger.service.DashboardService;

import Enum.CustomerBalanceStatus;
import Enum.TransactionType;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final CustomerService customerService;
    private final TransactionRepository transactionRepository;

    public DashboardServiceImpl(UserRepository userRepository,
                                CustomerRepository customerRepository,
                                CustomerService customerService,
                                TransactionRepository transactionRepository) {

        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.customerService = customerService;
        this.transactionRepository = transactionRepository;
    }

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public DashboardResponse getDashboard() {

        User loggedInUser = getLoggedInUser();

        DashboardResponse response = new DashboardResponse();

        // Cash Balance
        response.setCashBalance(loggedInUser.getCashBalance());

        // ===========================================
        // Customer Summary Calculations
        // ===========================================

        List<Customer> customers =
                customerRepository.findByUser(loggedInUser);

        BigDecimal moneyToReceive = BigDecimal.ZERO;
        BigDecimal moneyToPay = BigDecimal.ZERO;

        for (Customer customer : customers) {

            CustomerSummaryResponse summary =
                    customerService.getCustomerSummary(customer.getId());

            if (summary.getBalanceStatus()
                    == CustomerBalanceStatus.RECEIVABLE) {

                moneyToReceive =
                        moneyToReceive.add(
                                summary.getOverallBalance());

            } else if (summary.getBalanceStatus()
                    == CustomerBalanceStatus.PAYABLE) {

                moneyToPay =
                        moneyToPay.add(
                                summary.getOverallBalance());
            }
        }

        response.setMoneyToReceive(moneyToReceive);
        response.setMoneyToPay(moneyToPay);

        response.setNetPosition(
                loggedInUser.getCashBalance()
                        .add(moneyToReceive)
                        .subtract(moneyToPay));

        // ===========================================
        // Income & Expense
        // ===========================================

        List<Transaction> transactions =
                transactionRepository.findByUserOrderByTransactionDateDesc(loggedInUser);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Transaction transaction : transactions) {

            if (transaction.getTransactionType()
                    == TransactionType.INCOME) {

                totalIncome =
                        totalIncome.add(transaction.getAmount());

            } else if (transaction.getTransactionType()
                    == TransactionType.EXPENSE) {

                totalExpense =
                        totalExpense.add(transaction.getAmount());
            }
        }

        response.setTotalIncome(totalIncome);

        response.setTotalExpense(totalExpense);

        response.setTotalSavings(
                totalIncome.subtract(totalExpense));

        return response;
    }
}