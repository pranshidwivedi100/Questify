package com.questify.controller;

import com.questify.dto.CreateQuestRequest;
import com.questify.dto.QuestCompletionResponse;
import com.questify.dto.QuestDTO;
import com.questify.dto.UpdateQuestRequest;
import com.questify.entity.QuestPriority;
import com.questify.entity.QuestStatus;
import com.questify.entity.User;
import com.questify.service.AuthService;
import com.questify.service.QuestService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService questService;
    private final AuthService authService;

    public QuestController(QuestService questService, AuthService authService) {
        this.questService = questService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<QuestDTO>> getQuests(
            @RequestParam(required = false) QuestStatus status,
            @RequestParam(required = false) QuestPriority priority,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String search) {
        User user = authService.getAuthenticatedUser();
        List<QuestDTO> quests = questService.getQuests(user, status, priority, subjectId, search);
        return ResponseEntity.ok(quests);
    }

    @PostMapping
    public ResponseEntity<QuestDTO> createQuest(@Valid @RequestBody CreateQuestRequest request) {
        User user = authService.getAuthenticatedUser();
        QuestDTO created = questService.createQuest(user, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestDTO> getQuestById(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        QuestDTO quest = questService.getQuestById(user, id);
        return ResponseEntity.ok(quest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestDTO> updateQuest(@PathVariable Long id, @Valid @RequestBody UpdateQuestRequest request) {
        User user = authService.getAuthenticatedUser();
        QuestDTO updated = questService.updateQuest(user, id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuest(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        questService.deleteQuest(user, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<QuestCompletionResponse> completeQuest(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        QuestCompletionResponse response = questService.completeQuest(user, id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/reopen")
    public ResponseEntity<QuestDTO> reopenQuest(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        QuestDTO reopened = questService.reopenQuest(user, id);
        return ResponseEntity.ok(reopened);
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<QuestDTO>> getCalendarQuests(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        User user = authService.getAuthenticatedUser();
        List<QuestDTO> quests = questService.getCalendarQuests(user, start, end);
        return ResponseEntity.ok(quests);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<QuestDTO>> getOverdueQuests() {
        User user = authService.getAuthenticatedUser();
        List<QuestDTO> quests = questService.getOverdueQuests(user);
        return ResponseEntity.ok(quests);
    }
}

