package com.questify.controller;

import com.questify.dto.AnalyticsDashboardDTO;
import com.questify.entity.User;
import com.questify.service.AnalyticsService;
import com.questify.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AuthService authService;

    public AnalyticsController(AnalyticsService analyticsService, AuthService authService) {
        this.analyticsService = analyticsService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsDashboardDTO> getDashboardAnalytics() {
        User user = authService.getAuthenticatedUser();
        AnalyticsDashboardDTO analytics = analyticsService.getDashboardAnalytics(user);
        return ResponseEntity.ok(analytics);
    }
}

