package com.karthik.ledger.ai.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.FunctionDeclaration;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.google.genai.types.Schema;
import com.google.genai.types.Tool;

@Service
public class GeminiService {

    private final Client client;
    private final LedgerAiService ledgerAiService;

    public GeminiService(LedgerAiService ledgerAiService) {

        this.client = new Client();

        this.ledgerAiService = ledgerAiService;
    }

    public String askGemini(String message) {

        FunctionDeclaration currentBalanceFunction =
                FunctionDeclaration.builder()
                        .name("getCurrentBalance")
                        .description(
                                "Gets the current cash balance of the authenticated Ledger user."
                        )
                        .parameters(
                                Schema.builder()
                                        .type("object")
                                        .properties(Map.of())
                                        .build()
                        )
                        .build();
        
        FunctionDeclaration customerDataFunction =
                FunctionDeclaration.builder()
                        .name("getCustomerData")
                        .description(
                                "Gets all customer information belonging to the authenticated Ledger user, including customer name, phone, email, address, notes, balance, balance status, and dates."
                        )
                        .parameters(
                                Schema.builder()
                                        .type("object")
                                        .properties(Map.of())
                                        .build()
                        )
                        .build();
        
        FunctionDeclaration customerTransactionFunction =
                FunctionDeclaration.builder()
                        .name("getCustomerTransactionData")
                        .description(
                                "Gets all customer transaction records belonging to the authenticated Ledger user. Use this data to answer questions about customer transactions,like send and receive  amounts, dates, descriptions, transaction types, balances, and customer-wise transaction history. send and receive means giving money to customer for normla likr no interest while lend and borrow means for interest for appriopriate interest date"
                        )
                        .parameters(
                                Schema.builder()
                                        .type("object")
                                        .properties(Map.of())
                                        .build()
                        )
                        .build();
        
        FunctionDeclaration loanDataFunction =
                FunctionDeclaration.builder()
                        .name("getLoanData")
                        .description(
                                "Gets all loan records belonging to the authenticated Ledger user. Use this when the user asks about loans, principal amounts, outstanding amounts, interest, loan status, loan dates, customers associated with loans, or loan-related statistics."
                        )
                        .parameters(
                                Schema.builder()
                                        .type("object")
                                        .properties(Map.of())
                                        .build()
                        )
                        .build();
        
        FunctionDeclaration loanTransactionFunction =
                FunctionDeclaration.builder()
                        .name("getLoanTransactionData")
                        .description(
                                "Gets all loan transaction records belonging to the authenticated Ledger user. "
                                + "Use this when the user asks about loan repayments, loan payments, "
                                + "loan transaction amounts, transaction dates, outstanding amounts, "
                                + "customer-wise loan transactions, or loan transaction history."
                        )
                        .parameters(
                                Schema.builder()
                                        .type("object")
                                        .properties(Map.of())
                                        .build()
                        )
                        .build();

        FunctionDeclaration normalTransactionFunction =
                FunctionDeclaration.builder()
                        .name("getNormalTransactionData")
                        .description(
                                "Gets all income and expense transaction records "
                                + "belonging to the authenticated Ledger user. "
                                + "Use this data to answer questions about income, "
                                + "expenses, categories, descriptions, amounts, "
                                + "payment methods, transaction dates, and "
                                + "normal or recurring transaction patterns. "
                                + "The transactionType identifies INCOME or EXPENSE, "
                                + "and transactionMode identifies NORMAL or RECURRING."
                        )
                        .parameters(
                                Schema.builder()
                                        .type("object")
                                        .properties(Map.of())
                                        .build()
                        )
                        .build();
        Tool ledgerTool =
                Tool.builder()
                        .functionDeclarations(
                                List.of(currentBalanceFunction,
                                		customerDataFunction,
                                		customerTransactionFunction,
                                		loanDataFunction,
                                		loanTransactionFunction,
                                		normalTransactionFunction)
                        )
                        .build();

        GenerateContentConfig config =
                GenerateContentConfig.builder()
                        .tools(ledgerTool)
                        .build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        message,
                        config
                );

        if (response.candidates().isEmpty()) {
            return "I could not generate a response.";
        }

        Content content =
                response.candidates()
		                .orElseThrow(() ->
		                new RuntimeException(
		                        "Gemini returned no candidates"
		                ))
                        .get(0)
                        .content()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gemini returned no content"
                                )
                        );

        if (content.parts().isEmpty()) {
            return response.text();
        }

        for (Part part : content.parts().get()) {

            if (part.functionCall().isPresent()) {

                String functionName =
                        part.functionCall()
                                .get()
                                .name()
                                .orElse("");

                if ("getCurrentBalance".equals(functionName)) {

                    BigDecimal balance =
                            ledgerAiService.getCurrentBalance();

                    Part functionResponse =
                            Part.fromFunctionResponse(
                                    "getCurrentBalance",
                                    Map.of(
                                            "output",
                                            balance
                                    )
                            );

                    Content toolResult =
                            Content.builder()
                                    .role("user")
                                    .parts(functionResponse)
                                    .build();

                    GenerateContentResponse finalResponse =
                            client.models.generateContent(
                                    "gemini-3.6-flash",
                                    List.of(
                                            Content.fromParts(
                                                    Part.fromText(message)
                                            ),
                                            content,
                                            toolResult
                                    ),
                                    config
                            );

                    return finalResponse.text();
                }
                if ("getCustomerData".equals(functionName)) {

                    List<Map<String, Object>> customerData =
                            ledgerAiService.getCustomerData();

                    Part functionResponse =
                            Part.fromFunctionResponse(
                                    "getCustomerData",
                                    Map.of(
                                            "customers",
                                            customerData
                                    )
                            );

                    Content toolResult =
                            Content.builder()
                                    .role("user")
                                    .parts(functionResponse)
                                    .build();

                    GenerateContentResponse finalResponse =
                            client.models.generateContent(
                                    "gemini-3.6-flash",
                                    List.of(
                                            Content.fromParts(
                                                    Part.fromText(message)
                                            ),
                                            content,
                                            toolResult
                                    ),
                                    config
                            );

                    return finalResponse.text();
                }
                if ("getCustomerTransactionData".equals(functionName)) {

                    List<Map<String, Object>> transactionData =
                            ledgerAiService.getCustomerTransactionData();

                    Part functionResponse =
                            Part.fromFunctionResponse(
                                    "getCustomerTransactionData",
                                    Map.of(
                                            "transactions",
                                            transactionData
                                    )
                            );

                    Content toolResult =
                            Content.builder()
                                    .role("user")
                                    .parts(functionResponse)
                                    .build();

                    GenerateContentResponse finalResponse =
                            client.models.generateContent(
                                    "gemini-3.6-flash",
                                    List.of(
                                            Content.fromParts(
                                                    Part.fromText(message)
                                            ),
                                            content,
                                            toolResult
                                    ),
                                    config
                            );

                    return finalResponse.text();
                }
                
                if ("getLoanData".equals(functionName)) {

                    List<Map<String, Object>> loanData =
                            ledgerAiService.getLoanData();

                    Part functionResponse =
                            Part.fromFunctionResponse(
                                    "getLoanData",
                                    Map.of(
                                            "loans",
                                            loanData
                                    )
                            );

                    Content toolResult =
                            Content.builder()
                                    .role("user")
                                    .parts(functionResponse)
                                    .build();

                    GenerateContentResponse finalResponse =
                            client.models.generateContent(
                                    "gemini-3.6-flash",
                                    List.of(
                                            Content.fromParts(
                                                    Part.fromText(message)
                                            ),
                                            content,
                                            toolResult
                                    ),
                                    config
                            );

                    return finalResponse.text();
                }
                
                if ("getLoanTransactionData".equals(functionName)) {

                    List<Map<String, Object>> transactionData =
                            ledgerAiService
                                    .getLoanTransactionData();

                    Part functionResponse =
                            Part.fromFunctionResponse(
                                    "getLoanTransactionData",
                                    Map.of(
                                            "loanTransactions",
                                            transactionData
                                    )
                            );

                    Content toolResult =
                            Content.builder()
                                    .role("user")
                                    .parts(functionResponse)
                                    .build();

                    GenerateContentResponse finalResponse =
                            client.models.generateContent(
                                    "gemini-3.6-flash",
                                    List.of(
                                            Content.fromParts(
                                                    Part.fromText(message)
                                            ),
                                            content,
                                            toolResult
                                    ),
                                    config
                            );

                    return finalResponse.text();
                }
                if ("getNormalTransactionData".equals(functionName)) {

                    List<Map<String, Object>> transactionData =
                            ledgerAiService.getNormalTransactionData();

                    Part functionResponse =
                            Part.fromFunctionResponse(
                                    "getNormalTransactionData",
                                    Map.of(
                                            "transactions",
                                            transactionData
                                    )
                            );

                    Content toolResult =
                            Content.builder()
                                    .role("user")
                                    .parts(functionResponse)
                                    .build();

                    GenerateContentResponse finalResponse =
                            client.models.generateContent(
                                    "gemini-3.6-flash",
                                    List.of(
                                            Content.fromParts(
                                                    Part.fromText(message)
                                            ),
                                            content,
                                            toolResult
                                    ),
                                    config
                            );

                    return finalResponse.text();
                }
            }
        }

        return response.text();
    }
}