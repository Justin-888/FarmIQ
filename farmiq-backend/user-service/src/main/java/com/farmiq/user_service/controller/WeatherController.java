package com.farmiq.user_service.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentWeather(@RequestParam String city) {
        try {
            // Step 1: Get coordinates for the city
            String geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + city + "&count=1&language=en&format=json";
            ResponseEntity<Map> geoResponse = restTemplate.getForEntity(geoUrl, Map.class);
            Map geoBody = geoResponse.getBody();
            List results = (List) geoBody.get("results");

            if (results == null || results.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "City not found"));
            }

            Map location = (Map) results.get(0);
            double lat = ((Number) location.get("latitude")).doubleValue();
            double lon = ((Number) location.get("longitude")).doubleValue();
            String locationName = (String) location.get("name");

            // Step 2: Get weather for coordinates
            String weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
                "&longitude=" + lon +
                "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
                "&hourly=temperature_2m,weather_code&forecast_days=1";

            ResponseEntity<Map> weatherResponse = restTemplate.getForEntity(weatherUrl, Map.class);
            Map weatherBody = weatherResponse.getBody();

            Map<String, Object> result = new HashMap<>();
            result.put("city", locationName);
            result.put("latitude", lat);
            result.put("longitude", lon);
            result.put("current", weatherBody.get("current"));
            result.put("hourly", weatherBody.get("hourly"));

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}