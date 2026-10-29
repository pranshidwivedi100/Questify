package com.questify.controller;

import com.questify.dto.AchievementDTO;
import com.questify.dto.UserProgressDTO;
import com.questify.entity.User;
import com.questify.service.AuthService;
import com.questify.service.GamificationEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {

    private final GamificationEngineService gamificationEngineService;
    private final AuthService authService;

    public GamificationController(GamificationEngineService gamificationEngineService, AuthService authService) {
        this.gamificationEngineService = gamificationEngineService;
        this.authService = authService;
    }

    @GetMapping("/progress")
    public ResponseEntity<UserProgressDTO> getProgress() {
        User user = authService.getAuthenticatedUser();
        UserProgressDTO progress = gamificationEngineService.getUserProgressDTO(user);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/achievements")
    public ResponseEntity<List<AchievementDTO>> getAchievements() {
        User user = authService.getAuthenticatedUser();
        List<AchievementDTO> achievements = gamificationEngineService.getAllAchievementsWithUserStatus(user);
        return ResponseEntity.ok(achievements);
    }
}

