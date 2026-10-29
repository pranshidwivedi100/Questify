package com.questify.service;

import com.questify.dto.SubjectDTO;
import com.questify.dto.SubjectRequest;
import com.questify.entity.QuestStatus;
import com.questify.entity.Subject;
import com.questify.entity.User;
import com.questify.exception.BadRequestException;
import com.questify.exception.ResourceNotFoundException;
import com.questify.repository.FocusSessionRepository;
import com.questify.repository.QuestRepository;
import com.questify.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final QuestRepository questRepository;
    private final FocusSessionRepository focusSessionRepository;

    public SubjectService(SubjectRepository subjectRepository,
                          QuestRepository questRepository,
                          FocusSessionRepository focusSessionRepository) {
        this.subjectRepository = subjectRepository;
        this.questRepository = questRepository;
        this.focusSessionRepository = focusSessionRepository;
    }

    @Transactional
    public SubjectDTO createSubject(User user, SubjectRequest request) {
        if (subjectRepository.existsByUserIdAndNameIgnoreCase(user.getId(), request.getName().trim())) {
            throw new BadRequestException("Subject with name '" + request.getName() + "' already exists");
        }

        Subject subject = new Subject(
                user,
                request.getName().trim(),
                request.getColorHex(),
                request.getTargetHours()
        );

        Subject saved = subjectRepository.save(subject);
        return populateSubjectStats(saved, user.getId());
    }

    @Transactional(readOnly = true)
    public List<SubjectDTO> getUserSubjects(User user) {
        List<Subject> subjects = subjectRepository.findByUserIdOrderByNameAsc(user.getId());
        return subjects.stream()
                .map(s -> populateSubjectStats(s, user.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubjectDTO getSubjectById(User user, Long id) {
        Subject subject = subjectRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return populateSubjectStats(subject, user.getId());
    }

    @Transactional
    public SubjectDTO updateSubject(User user, Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            subject.setName(request.getName().trim());
        }
        if (request.getColorHex() != null && !request.getColorHex().isBlank()) {
            subject.setColorHex(request.getColorHex());
        }
        if (request.getTargetHours() != null && request.getTargetHours() > 0) {
            subject.setTargetHours(request.getTargetHours());
        }

        Subject saved = subjectRepository.save(subject);
        return populateSubjectStats(saved, user.getId());
    }

    @Transactional
    public void deleteSubject(User user, Long id) {
        Subject subject = subjectRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        subjectRepository.delete(subject);
    }

    private SubjectDTO populateSubjectStats(Subject subject, Long userId) {
        SubjectDTO dto = SubjectDTO.fromEntity(subject);
        List<com.questify.entity.Quest> subjectQuests = questRepository.findWithFilters(userId, null, null, subject.getId(), null);
        dto.setTotalQuests(subjectQuests.size());
        dto.setCompletedQuests(subjectQuests.stream().filter(q -> q.getStatus() == QuestStatus.COMPLETED).count());
        dto.setTotalMinutesStudied(focusSessionRepository.sumMinutesBySubject(userId, subject.getId()));
        return dto;
    }
}

