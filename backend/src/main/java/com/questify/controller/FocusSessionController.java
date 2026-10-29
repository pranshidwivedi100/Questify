package com.questify.controller;

import com.questify.dto.FocusSessionDTO;
import com.questify.dto.LogFocusSessionRequest;
import com.questify.entity.User;
import com.questify.service.AuthService;
import com.questify.service.FocusSessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/focus-sessions")
public class FocusSessionController {

    private final FocusSessionService focusSessionService;
    private final AuthService authService;

    public FocusSessionController(FocusSessionService focusSessionService, AuthService authService) {
        this.focusSessionService = focusSessionService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<FocusSessionDTO>> getSessions() {
        User user = authService.getAuthenticatedUser();
        List<FocusSessionDTO> sessions = focusSessionService.getUserSessions(user);
        return ResponseEntity.ok(sessions);
    }

    @PostMapping
    public ResponseEntity<FocusSessionDTO> logSession(@Valid @RequestBody LogFocusSessionRequest request) {
        User user = authService.getAuthenticatedUser();
        FocusSessionDTO created = focusSessionService.logFocusSession(user, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        focusSessionService.deleteSession(user, id);
        return ResponseEntity.noContent().build();
    }
}

