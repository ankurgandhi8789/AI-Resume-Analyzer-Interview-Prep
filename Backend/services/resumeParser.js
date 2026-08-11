import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extracts raw text from an uploaded resume buffer (PDF or DOCX).
 */
export const extractResumeText = async (file) => {
  if (file.mimetype === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text.trim();
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({ buffer: file.buffer });
    return value.trim();
  }

  throw new Error("Unsupported file type");
};
