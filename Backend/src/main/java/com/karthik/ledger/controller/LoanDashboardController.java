package com.karthik.ledger.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.karthik.ledger.dto.LoanDashboardResponse;
import com.karthik.ledger.service.LoanDashboardService;

@RestController
@RequestMapping("/api/loan-dashboard")
public class LoanDashboardController {

    private final LoanDashboardService loanDashboardService;


    public LoanDashboardController(
            LoanDashboardService loanDashboardService) {

        this.loanDashboardService =
                loanDashboardService;
    }


    @GetMapping
    public ResponseEntity<LoanDashboardResponse>
    getLoanDashboard() {

        return ResponseEntity.ok(
                loanDashboardService.getLoanDashboard()
        );
    }
}