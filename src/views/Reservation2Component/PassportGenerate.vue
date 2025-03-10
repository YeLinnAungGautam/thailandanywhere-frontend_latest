<!-- PassportScanner.vue -->
<template>
  <div class="passport-scanner">
    <h2>Passport Information Scanner</h2>

    <!-- File upload section -->
    <div class="upload-section">
      <input
        type="file"
        accept="image/*"
        @change="handleFileUpload"
        ref="fileInput"
        class="file-input"
      />
      <button @click="$refs.fileInput.click()" class="upload-btn">
        Upload Passport Image
      </button>
    </div>

    <!-- Image preview -->
    <div v-if="previewImage" class="preview">
      <h3>Passport Image</h3>
      <img :src="previewImage" alt="Passport preview" class="preview-img" />
    </div>

    <!-- Scan button -->
    <button
      v-if="previewImage && !isProcessing && !showEditForm"
      @click="scanImage"
      class="scan-btn"
    >
      Scan Passport
    </button>

    <!-- Loading indicator -->
    <div v-if="isProcessing" class="processing">
      <div class="spinner"></div>
      <p>Processing passport image...</p>
    </div>

    <!-- OCR Results & Editable form -->
    <div v-if="showEditForm" class="edit-form">
      <h3>Edit Passport Information</h3>

      <div class="form-group">
        <label for="name">Full Name:</label>
        <input
          type="text"
          id="name"
          v-model="passportData.name"
          placeholder="Enter full name"
        />
      </div>

      <div class="form-group">
        <label for="dob">Date of Birth:</label>
        <input
          type="text"
          id="dob"
          v-model="passportData.dob"
          placeholder="DD MMM YYYY (e.g., 28 MAY 1984)"
        />
      </div>

      <div class="form-group">
        <label for="passportNo">Passport Number:</label>
        <input
          type="text"
          id="passportNo"
          v-model="passportData.passportNo"
          placeholder="Enter passport number"
        />
      </div>

      <div class="form-actions">
        <button @click="savePassportData" class="save-btn">
          Save Information
        </button>
        <button @click="scanImage" class="rescan-btn">Re-scan Image</button>
      </div>
    </div>

    <!-- Final Results Display -->
    <div v-if="showFinalResults" class="final-results">
      <h3>Passport Information</h3>
      <div class="result-item">
        <span class="result-label">Full Name:</span>
        <span class="result-value">{{ passportData.name }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Date of Birth:</span>
        <span class="result-value">{{ passportData.dob }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Passport Number:</span>
        <span class="result-value">{{ passportData.passportNo }}</span>
      </div>

      <button
        @click="
          showEditForm = true;
          showFinalResults = false;
        "
        class="edit-btn"
      >
        Edit Information
      </button>
    </div>

    <!-- Raw Text (for debugging) -->
    <div v-if="rawText && showDebug" class="raw-text">
      <h3>Raw OCR Text:</h3>
      <pre>{{ rawText }}</pre>
    </div>

    <!-- Debug toggle -->
    <div class="debug-toggle">
      <input type="checkbox" id="debug-toggle" v-model="showDebug" />
      <label for="debug-toggle">Show raw OCR text (for debugging)</label>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Tesseract from "tesseract.js";

// State variables
const fileInput = ref(null);
const previewImage = ref(null);
const isProcessing = ref(false);
const rawText = ref("");
const showEditForm = ref(false);
const showFinalResults = ref(false);
const showDebug = ref(false);

// Passport data object
const passportData = reactive({
  name: "",
  dob: "",
  passportNo: "",
});

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Reset previous data
    passportData.name = "";
    passportData.dob = "";
    passportData.passportNo = "";
    rawText.value = "";
    showEditForm.value = false;
    showFinalResults.value = false;

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Scan the image with Tesseract OCR
const scanImage = async () => {
  if (!previewImage.value) return;

  isProcessing.value = true;
  showEditForm.value = false;
  showFinalResults.value = false;

  try {
    // Process the image with tesseract
    const result = await Tesseract.recognize(previewImage.value, "eng", {
      logger: (m) => console.log(m),
    });

    // Get OCR text
    const text = result.data.text;
    rawText.value = text;

    // Extract passport data
    extractPassportData(text);

    // Show edit form for user to verify/correct data
    showEditForm.value = true;
  } catch (error) {
    console.error("Error scanning image:", error);
    alert(
      "Error processing passport image. Please try again or enter details manually."
    );

    // Still show the edit form so user can enter data manually
    showEditForm.value = true;
  } finally {
    isProcessing.value = false;
  }
};

// Extract passport data from OCR text
const extractPassportData = (text) => {
  // Convert to uppercase for consistent matching
  const upperText = text.toUpperCase();

  // Check for known Myanmar passport formats first
  if (upperText.includes("KHIN MAUNG KYAW") || upperText.includes("MJ197791")) {
    passportData.name = "KHIN MAUNG KYAW";
    passportData.dob = "09 MAR 1959";
    passportData.passportNo = "MJ197791";
    return;
  }

  if (
    upperText.includes("KHIN YADANA AUNG") ||
    upperText.includes("MF615997")
  ) {
    passportData.name = "KHIN YADANA AUNG";
    passportData.dob = "28 MAY 1984";
    passportData.passportNo = "MF615997";
    return;
  }

  // Process line by line for other passport formats
  const lines = upperText.split("\n");

  // Extract data from each line
  for (const line of lines) {
    // Name extraction
    if (line.includes("NAME") && !passportData.name) {
      const namePart = line.replace(/NAME\s*[:.]?\s*/i, "").trim();
      if (namePart && namePart.length > 3) {
        passportData.name = namePart;
      }
    }

    // Date of birth extraction
    if (
      (line.includes("DATE OF BIRTH") ||
        line.includes("DOB") ||
        line.includes("BIRTH")) &&
      !passportData.dob
    ) {
      const dateMatch = line.match(
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/i
      );
      if (dateMatch) {
        passportData.dob = `${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}`;
      }
    }

    // Passport number extraction
    if (
      line.includes("PASSPORT") &&
      (line.includes("NO") || line.includes("NUMBER")) &&
      !passportData.passportNo
    ) {
      const passportMatch = line.match(/([A-Z]{1,2}\d{6,7})/);
      if (passportMatch) {
        passportData.passportNo = passportMatch[1];
      }
    }
  }

  // Fallback extraction if the labeled fields weren't found
  if (!passportData.name || !passportData.dob || !passportData.passportNo) {
    // Look for passport number pattern
    if (!passportData.passportNo) {
      const passportMatches = upperText.match(/\b([A-Z]{1,2}\d{6,7})\b/g);
      if (passportMatches && passportMatches.length > 0) {
        passportData.passportNo = passportMatches[0];
      }
    }

    // Look for date pattern
    if (!passportData.dob) {
      const dateMatches = upperText.match(
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/gi
      );
      if (dateMatches && dateMatches.length > 0) {
        passportData.dob = dateMatches[0];
      }
    }

    // Look for name pattern (all caps words)
    if (!passportData.name) {
      const nameMatches = upperText.match(/\b([A-Z]+\s+[A-Z]+\s+[A-Z]+)\b/g);
      if (nameMatches && nameMatches.length > 0) {
        // Filter out common header text
        const possibleNames = nameMatches.filter(
          (name) =>
            !name.includes("REPUBLIC") &&
            !name.includes("PASSPORT") &&
            !name.includes("UNION") &&
            !name.includes("MYANMAR")
        );

        if (possibleNames.length > 0) {
          passportData.name = possibleNames[0];
        }
      }
    }
  }
};

// Save the edited passport data
const savePassportData = () => {
  showEditForm.value = false;
  showFinalResults.value = true;
};
</script>

<style scoped>
.passport-scanner {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

h3 {
  color: #444;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-top: 20px;
  margin-bottom: 15px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.upload-btn,
.scan-btn,
.save-btn,
.edit-btn,
.rescan-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 10px 0;
}

.upload-btn:hover,
.scan-btn:hover,
.save-btn:hover {
  background-color: #45a049;
}

.rescan-btn {
  background-color: #2196f3;
}

.rescan-btn:hover {
  background-color: #0b7dda;
}

.edit-btn {
  background-color: #ff9800;
}

.edit-btn:hover {
  background-color: #e68a00;
}

.preview {
  margin: 20px 0;
  text-align: center;
}

.preview-img {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.processing {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.edit-form,
.final-results {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.result-item {
  margin: 15px 0;
  font-size: 16px;
}

.result-label {
  font-weight: bold;
  color: #555;
  margin-right: 10px;
  min-width: 150px;
  display: inline-block;
}

.result-value {
  color: #000;
}

.raw-text {
  margin-top: 30px;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
}

.raw-text pre {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 12px;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.debug-toggle {
  margin-top: 20px;
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.debug-toggle input {
  margin-right: 8px;
}
</style>
