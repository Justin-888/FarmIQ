package com.farmiq.user_service.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final RestTemplate restTemplate = new RestTemplate();
@Value("${groq.api.key}")
private String GROQ_KEY;
    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
        try {
            String url = "https://api.groq.com/openai/v1/chat/completions";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(GROQ_KEY);
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> sys = new HashMap<>();
            sys.put("role", "system");
            sys.put("content", "You are FarmIQ, an AI farming assistant for Ghana and Africa. Give practical advice about crops, soil, weather, pests, irrigation, and market prices.");
            messages.add(sys);
            List<Map<String, Object>> contents = (List<Map<String, Object>>) request.get("contents");
            for (Map<String, Object> content : contents) {
                Map<String, String> msg = new HashMap<>();
                String role = (String) content.get("role");
                msg.put("role", role.equals("model") ? "assistant" : role);
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                msg.put("content", parts.get(0).get("text"));
                messages.add(msg);
            }
            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.3-70b-versatile");
            body.put("messages", messages);
            body.put("max_tokens", 1024);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map responseBody = response.getBody();
            List choices = (List) responseBody.get("choices");
            Map choice = (Map) choices.get(0);
            Map message = (Map) choice.get("message");
            String text = (String) message.get("content");
            Map<String, String> result = new HashMap<>();
            result.put("reply", text);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("CHAT ERROR: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("reply", "Sorry, I could not process your request.");
            return ResponseEntity.ok(error);
        }
    }
}