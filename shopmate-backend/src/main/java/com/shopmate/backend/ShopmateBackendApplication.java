package com.shopmate.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class ShopmateBackendApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(ShopmateBackendApplication.class, args);
    }

    private static void loadDotEnv() {
        String userDir = System.getProperty("user.dir", ".");
        String[] candidatePaths = {
                userDir + "/.env",
                userDir + "/shopmate-backend/.env",
                userDir + "/../.env",
                userDir + "/../shopmate-backend/.env",
                "/home/punya/BACKUP/SHOPMATE/shopmate-backend/.env",
                "/home/punya/BACKUP/SHOPMATE/.env"
        };

        boolean loaded = false;
        for (String candidate : candidatePaths) {
            Path path = Paths.get(candidate).toAbsolutePath().normalize();
            if (Files.exists(path) && !Files.isDirectory(path)) {
                try {
                    List<String> lines = Files.readAllLines(path);
                    for (String line : lines) {
                        String trimmed = line.trim();
                        if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
                            continue;
                        }
                        int eqIdx = trimmed.indexOf('=');
                        String key = trimmed.substring(0, eqIdx).trim();
                        String value = trimmed.substring(eqIdx + 1).trim();

                        if ((value.startsWith("\"") && value.endsWith("\"")) ||
                            (value.startsWith("'") && value.endsWith("'"))) {
                            if (value.length() >= 2) {
                                value = value.substring(1, value.length() - 1);
                            }
                        }

                        if (!key.isEmpty() && !value.isEmpty()) {
                            System.setProperty(key, value);
                            if ("NVIDIA_API_KEY".equalsIgnoreCase(key)) {
                                System.setProperty("spring.ai.openai.api-key", value);
                            } else if ("NVIDIA_BASE_URL".equalsIgnoreCase(key)) {
                                String cleanUrl = value;
                                if (cleanUrl.endsWith("/v1")) {
                                    cleanUrl = cleanUrl.substring(0, cleanUrl.length() - 3);
                                } else if (cleanUrl.endsWith("/v1/")) {
                                    cleanUrl = cleanUrl.substring(0, cleanUrl.length() - 4);
                                }
                                System.setProperty("spring.ai.openai.base-url", cleanUrl);
                            } else if ("NVIDIA_MODEL".equalsIgnoreCase(key)) {
                                System.setProperty("spring.ai.openai.chat.options.model", value);
                            }
                        }
                    }
                    System.out.println(">>> [ShopMate] Successfully loaded environment configurations from: " + path);
                    loaded = true;
                    break;
                } catch (IOException e) {
                    System.err.println(">>> [ShopMate] Could not read .env file at " + path + ": " + e.getMessage());
                }
            }
        }

        if (!loaded) {
            System.out.println(">>> [ShopMate] No .env file located; relying on OS environment variables.");
        }
    }
}

