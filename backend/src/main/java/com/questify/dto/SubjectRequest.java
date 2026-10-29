package com.questify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class SubjectRequest {

    @NotBlank(message = "Subject name is required")
    @Size(min = 1, max = 100, message = "Subject name must be 1 to 100 characters")
    private String name;

    private String colorHex = "#8B5CF6";

    @Positive(message = "Target hours must be positive")
    private Double targetHours = 10.0;

    public SubjectRequest() {
    }

    public SubjectRequest(String name, String colorHex, Double targetHours) {
        this.name = name;
        this.colorHex = colorHex;
        this.targetHours = targetHours;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColorHex() {
        return colorHex;
    }

    public void setColorHex(String colorHex) {
        this.colorHex = colorHex;
    }

    public Double getTargetHours() {
        return targetHours;
    }

    public void setTargetHours(Double targetHours) {
        this.targetHours = targetHours;
    }
}

