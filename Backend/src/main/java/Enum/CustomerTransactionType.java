package Enum;

public enum CustomerTransactionType {

    // Normal customer transactions
    GIVE,
    RECEIVE,

    // Loan creation
    LEND,
    BORROW,

    // Interest added to loan
    INTEREST_ACCRUAL,

    // Future use: customer pays interest
    INTEREST_PAYMENT,

    // Future use: customer pays principal
    PRINCIPAL_PAYMENT
}