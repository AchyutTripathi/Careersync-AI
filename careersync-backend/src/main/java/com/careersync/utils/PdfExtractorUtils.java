package com.careersync.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;

@Component
@Slf4j
public class PdfExtractorUtils {

    public String extractText(Path filePath) {
        try (PDDocument document = PDDocument.load(filePath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            log.info("Extracted {} characters from PDF: {}", text.length(), filePath.getFileName());
            return text.trim();
        } catch (IOException e) {
            log.error("Failed to extract text from PDF {}: {}", filePath, e.getMessage());
            throw new RuntimeException("Failed to extract text from PDF: " + e.getMessage(), e);
        }
    }

    public String extractText(InputStream inputStream) {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document).trim();
        } catch (IOException e) {
            log.error("Failed to extract text from PDF stream: {}", e.getMessage());
            throw new RuntimeException("Failed to extract text from PDF: " + e.getMessage(), e);
        }
    }
}
