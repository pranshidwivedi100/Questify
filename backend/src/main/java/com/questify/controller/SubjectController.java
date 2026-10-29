package com.questify.controller;

import com.questify.dto.SubjectDTO;
import com.questify.dto.SubjectRequest;
import com.questify.entity.User;
import com.questify.service.AuthService;
import com.questify.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;
    private final AuthService authService;

    public SubjectController(SubjectService subjectService, AuthService authService) {
        this.subjectService = subjectService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<SubjectDTO>> getSubjects() {
        User user = authService.getAuthenticatedUser();
        List<SubjectDTO> subjects = subjectService.getUserSubjects(user);
        return ResponseEntity.ok(subjects);
    }

    @PostMapping
    public ResponseEntity<SubjectDTO> createSubject(@Valid @RequestBody SubjectRequest request) {
        User user = authService.getAuthenticatedUser();
        SubjectDTO created = subjectService.createSubject(user, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectDTO> getSubjectById(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        SubjectDTO subject = subjectService.getSubjectById(user, id);
        return ResponseEntity.ok(subject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectDTO> updateSubject(@PathVariable Long id, @Valid @RequestBody SubjectRequest request) {
        User user = authService.getAuthenticatedUser();
        SubjectDTO updated = subjectService.updateSubject(user, id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        subjectService.deleteSubject(user, id);
        return ResponseEntity.noContent().build();
    }
}

