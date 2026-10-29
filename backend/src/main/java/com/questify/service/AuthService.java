package com.questify.service;

import com.questify.config.JwtTokenProvider;
import com.questify.config.UserPrincipal;
import com.questify.dto.AuthResponse;
import com.questify.dto.LoginRequest;
import com.questify.dto.RegisterRequest;
import com.questify.dto.UserProfileDTO;
import com.questify.dto.UserProgressDTO;
import com.questify.entity.User;
import com.questify.entity.UserProgress;
import com.questify.exception.BadRequestException;
import com.questify.exception.ResourceNotFoundException;
import com.questify.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final GamificationEngineService gamificationEngineService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       GamificationEngineService gamificationEngineService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.gamificationEngineService = gamificationEngineService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User(
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getTimezone(),
                request.getDailyGoalMins()
        );

        User savedUser = userRepository.save(user);

        // Initialize progress
        UserProgress progress = gamificationEngineService.getOrCreateProgress(savedUser);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String token = tokenProvider.generateToken(principal);

        UserProfileDTO profile = new UserProfileDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getTimezone(),
                savedUser.getDailyGoalMins(),
                UserProgressDTO.fromEntity(progress)
        );

        return new AuthResponse(token, profile);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(principal);

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProgress progress = gamificationEngineService.getOrCreateProgress(user);

        UserProfileDTO profile = new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTimezone(),
                user.getDailyGoalMins(),
                UserProgressDTO.fromEntity(progress)
        );

        return new AuthResponse(token, profile);
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getCurrentUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserProgress progress = gamificationEngineService.getOrCreateProgress(user);

        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTimezone(),
                user.getDailyGoalMins(),
                UserProgressDTO.fromEntity(progress)
        );
    }

    @Transactional(readOnly = true)
    public User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new BadRequestException("No authenticated user in context");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}

