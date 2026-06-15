package com.farmiq.user_service.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
import java.util.Base64;

@RestController
@RequestMapping("/api/pest")
public class PestDetectionController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${groq.api.key}")
    private String GROQ_KEY;

    @PostMapping("/detect")
    public ResponseEntity<Map<String, String>> detectPest(@RequestParam("image") MultipartFile image) {
        try {
            byte[] imageBytes = image.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String mimeType = image.getContentType() != null ? image.getContentType() : "image/jpeg";

            String url = "https://api.groq.com/openai/v1/chat/completions";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(GROQ_KEY);

            Map<String, Object> imageUrlMap = new HashMap<>();
            imageUrlMap.put("type", "image_url");
            imageUrlMap.put("image_url", Map.of("url", "data:" + mimeType + ";base64," + base64Image));

            Map<String, Object> textMap = new HashMap<>();
            textMap.put("type", "text");
            textMap.put("text", "You are FarmIQ, an expert agricultural AI for Ghana and Africa. Analyze this crop/plant image and identify: 1) What pest or disease is present (if any) 2) How severe is the infestation (mild/moderate/severe) 3) What crops in Ghana are commonly affected 4) Immediate treatment steps the farmer can take 5) Preventive measures for the future. Be specific, practical, and concise. If the image is not of a crop or plant, say so politely.");

            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", List.of(textMap, imageUrlMap));

            Map<String, Object> body = new HashMap<>();
            body.put("model", "meta-llama/llama-4-scout-17b-16e-instruct");
            body.put("messages", List.of(userMessage));
            body.put("max_tokens", 1024);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            Map responseBody = response.getBody();
            List choices = (List) responseBody.get("choices");
            Map choice = (Map) choices.get(0);
            Map message = (Map) choice.get("message");
            String text = (String) message.get("content");

            Map<String, String> result = new HashMap<>();
            result.put("analysis", text);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.out.println("PEST DETECTION ERROR: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("analysis", "Could not analyze image. Please try again with a clearer photo.");
            return ResponseEntity.ok(error);
        }
    }
}