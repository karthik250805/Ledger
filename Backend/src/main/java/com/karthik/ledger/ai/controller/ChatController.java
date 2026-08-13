package com.karthik.ledger.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.karthik.ledger.ai.dto.ChatRequest;
import com.karthik.ledger.ai.dto.ChatResponse;
import com.karthik.ledger.ai.service.GeminiService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request) {

        String response =
                geminiService.askGemini(
                        request.getMessage()
                );

        return ResponseEntity.ok(
                new ChatResponse(response)
        );
    }
}