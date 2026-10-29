package com.questify.config;

import com.questify.entity.Achievement;
import com.questify.repository.AchievementRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final AchievementRepository achievementRepository;

    public DatabaseSeeder(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    @Override
    public void run(String... args) {
        seedAchievements();
    }

    private void seedAchievements() {
        List<Achievement> initialAchievements = List.of(
                new Achievement("FIRST_QUEST", "First Blood", "Completed your very first quest!", "Award", 100),
                new Achievement("STREAK_3", "Consistent Hero", "Maintained a 3-day study streak", "Flame", 150),
                new Achievement("STREAK_7", "Unstoppable Force", "Maintained an unbroken 7-day streak", "Zap", 300),
                new Achievement("FOCUS_MASTER", "Focus Master", "Completed a deep focus session of 25+ minutes", "Timer", 100)
        );

        for (Achievement achievement : initialAchievements) {
            if (achievementRepository.findByCode(achievement.getCode()).isEmpty()) {
                achievementRepository.save(achievement);
                logger.info("Seeded achievement: {}", achievement.getCode());
            }
        }
    }
}

