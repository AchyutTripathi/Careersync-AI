package com.careersync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CareerSyncApplication {
    public static void main(String[] args) {
        SpringApplication.run(CareerSyncApplication.class, args);
    }
}
