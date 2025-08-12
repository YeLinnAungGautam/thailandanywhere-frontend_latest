import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useParchasePDFStore = defineStore("parchasePDF", () => {
  // Batch state only
  const isBatchGenerating = ref(false);
  const batchJobId = ref("");
  const batchStatus = ref({
    status: "idle",
    progress: 0,
    total_batches: 0,
    completed_batches: 0,
    batch_files: [],
    message: "",
    total_records: 0,
  });
  const error = ref("");
  const generatedPdfs = ref([]);

  let batchInterval = null;

  // Batch computed properties
  const canGenerate = computed(() => !isBatchGenerating.value);
  const isBatchCompleted = computed(
    () => batchStatus.value.status === "completed"
  );
  const isBatchFailed = computed(() => batchStatus.value.status === "failed");
  const isBatchProcessing = computed(
    () => batchStatus.value.status === "processing"
  );

  // Start PDF batch generation
  const generatePdf = async (params) => {
    try {
      resetBatchState();
      isBatchGenerating.value = true;
      batchStatus.value.status = "starting";
      batchStatus.value.message = "PDF generation စတင်နေပါတယ်...";

      const response = await axios.get("/print/cash-parchase-image", {
        params: params,
      });
      const result = response.data;

      if (result.success) {
        return await startBatchGeneration(result);
      } else {
        throw new Error(result.message || "PDF generation စတင်လို့ မရပါ");
      }
    } catch (err) {
      console.error("PDF Generation Error:", err);
      error.value =
        err.response?.data?.message ||
        err.message ||
        "PDF generation မှာ အမှားဖြစ်ပါတယ်";
      batchStatus.value.status = "failed";
      batchStatus.value.message = error.value;
      isBatchGenerating.value = false;
      throw err;
    }
  };

  // Start batch generation process
  const startBatchGeneration = async (result) => {
    try {
      batchJobId.value = result.job_id;
      batchStatus.value = {
        status: "processing",
        progress: 0,
        total_batches: result.total_batches || 0,
        completed_batches: 0,
        batch_files: [],
        message: "Starting batch generation...",
        total_records: result.total_records || 0,
      };

      startBatchStatusChecking();
      return result;
    } catch (err) {
      console.error("Batch Generation Error:", err);
      batchStatus.value.status = "failed";
      batchStatus.value.message =
        err.message || "Batch generation မှာ အမှားဖြစ်ပါတယ်";
      isBatchGenerating.value = false;
      throw err;
    }
  };

  // Check batch status
  const checkBatchStatus = async (jobId) => {
    try {
      const response = await axios.get(`/pdf-batch-status/${jobId}`);
      const result = response.data;

      if (result.success) {
        batchStatus.value = {
          status: result.status,
          progress: Math.round(result.progress || 0),
          total_batches: result.total_batches || 0,
          completed_batches: result.completed_batches || 0,
          batch_files: result.batch_files || [],
          message: result.message || "Processing...",
          total_records: result.total_records || 0,
        };

        if (result.status === "completed") {
          isBatchGenerating.value = false;
          stopBatchStatusChecking();

          // Add to generated PDFs history
          result.batch_files?.forEach((file) => {
            generatedPdfs.value.unshift({
              id: `${jobId}_batch_${file.batch_number}`,
              filename: file.filename,
              downloadUrl: file.download_url,
              generatedAt: new Date(file.generated_at),
              fileSize: file.size,
              totalItems: file.item_count,
              isBatch: true,
              batchNumber: file.batch_number,
            });
          });

          // Keep only last 10 PDFs
          if (generatedPdfs.value.length > 10) {
            generatedPdfs.value = generatedPdfs.value.slice(0, 10);
          }
        } else if (result.status === "failed") {
          isBatchGenerating.value = false;
          stopBatchStatusChecking();
        }

        return result;
      } else {
        throw new Error(
          result.message || "Batch status check မှာ အမှားဖြစ်ပါတယ်"
        );
      }
    } catch (err) {
      console.error("Batch Status Check Error:", err);

      // More detailed error logging
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }

      throw err;
    }
  };

  // Start polling batch status
  const startBatchStatusChecking = () => {
    if (!batchJobId.value) return;

    batchInterval = setInterval(async () => {
      try {
        await checkBatchStatus(batchJobId.value);

        if (
          batchStatus.value.status === "completed" ||
          batchStatus.value.status === "failed"
        ) {
          stopBatchStatusChecking();
        }
      } catch (err) {
        console.error("Batch status checking error:", err);
        // Don't stop checking on single errors, continue polling
      }
    }, 3000); // Check every 3 seconds
  };

  // Stop polling batch status
  const stopBatchStatusChecking = () => {
    if (batchInterval) {
      clearInterval(batchInterval);
      batchInterval = null;
    }
  };

  // Download batch file
  const downloadBatchFile = (file) => {
    if (file.download_url) {
      const link = document.createElement("a");
      link.href = file.download_url;
      link.download = file.filename || `batch_${file.batch_number}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Reset batch state
  const resetBatchState = () => {
    stopBatchStatusChecking();
    isBatchGenerating.value = false;
    batchJobId.value = "";
    batchStatus.value = {
      status: "idle",
      progress: 0,
      total_batches: 0,
      completed_batches: 0,
      batch_files: [],
      message: "",
      total_records: 0,
    };
    error.value = "";
  };

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  // Get status message in Myanmar
  const getStatusMessage = (statusValue) => {
    const messages = {
      idle: "အဆင်သင့်ဖြစ်နေပါတယ်",
      starting: "စတင်နေပါတယ်...",
      processing: "PDF များကို လုပ်နေပါတယ်...",
      completed: "PDF များ ပြီးပါပြီ! Download လုပ်လို့ရပါပြီ။",
      failed: "PDF generation မှာ အမှားဖြစ်ပါတယ်။",
    };
    return messages[statusValue] || statusValue;
  };

  return {
    // State
    isBatchGenerating,
    batchJobId,
    batchStatus,
    error,
    generatedPdfs,

    // Computed
    canGenerate,
    isBatchCompleted,
    isBatchFailed,
    isBatchProcessing,

    // Actions
    generatePdf,
    checkBatchStatus,
    downloadBatchFile,
    resetBatchState,
    formatFileSize,
    getStatusMessage,
    startBatchStatusChecking,
    stopBatchStatusChecking,
  };
});
