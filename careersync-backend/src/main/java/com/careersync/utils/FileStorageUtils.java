package com.careersync.utils;

import com.careersync.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Component
@Slf4j
public class FileStorageUtils {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private static final long MAX_SIZE_BYTES = 10 * 1024 * 1024L; // 10 MB
    private static final String[] ALLOWED_TYPES = {"application/pdf"};

    public String storeFile(MultipartFile file) {
        validateFile(file);
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String extension = FilenameUtils.getExtension(file.getOriginalFilename());
            String filename   = UUID.randomUUID() + "." + extension;
            Path   targetPath = uploadPath.resolve(filename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Stored file: {}", filename);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String filename) {
        if (filename == null || filename.isBlank()) return;
        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
            Files.deleteIfExists(filePath);
            log.info("Deleted file: {}", filename);
        } catch (IOException e) {
            log.warn("Could not delete file {}: {}", filename, e.getMessage());
        }
    }

    public Path getFilePath(String filename) {
        return Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file provided");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new BadRequestException("File size exceeds the 10 MB limit");
        }
        String contentType = file.getContentType();
        boolean allowed = false;
        for (String type : ALLOWED_TYPES) {
            if (type.equalsIgnoreCase(contentType)) { allowed = true; break; }
        }
        if (!allowed) {
            throw new BadRequestException("Only PDF files are accepted");
        }
    }
}
