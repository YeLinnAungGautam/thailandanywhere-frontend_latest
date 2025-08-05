import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePdfStore = defineStore("pdf", () => {
  // State
  const isGenerating = ref(false);
  const currentJob = ref(null);
  const progress = ref(0);
  const status = ref("");
  const message = ref("");
  const downloadUrl = ref("");
  const filename = ref("");
  const error = ref("");
  const generatedPdfs = ref([]);

  // Computed
  const canGenerate = computed(() => !isGenerating.value);
  const isCompleted = computed(() => status.value === "completed");
  const isFailed = computed(() => status.value === "failed");
  const isProcessing = computed(() => status.value === "processing");

  // Actions
  const generatePdf = async (params) => {
    try {
      resetState();
      isGenerating.value = true;
      status.value = "starting";
      message.value = "PDF generation စတင်နေပါတယ်...";

      // Fixed: Use axios response structure correctly
      const response = await axios.get("/print/cash-image", {
        params: params,
      });

      // Access response.data instead of just response
      const result = response.data;

      if (result.success) {
        currentJob.value = {
          id: result.job_id,
          statusUrl: result.status_url,
          startedAt: new Date(),
          filters: params, // Store filters for retry
        };

        status.value = "queued";
        message.value = "PDF generation ကို queue မှာ ထည့်ပြီးပါပြီ...";

        // Start status checking
        startStatusChecking();

        return result;
      } else {
        throw new Error(result.message || "PDF generation စတင်လို့ မရပါ");
      }
    } catch (err) {
      console.error("PDF Generation Error:", err);
      error.value =
        err.response?.data?.message ||
        err.message ||
        "PDF generation မှာ အမှားဖြစ်ပါတယ်";
      status.value = "failed";
      isGenerating.value = false;
      throw err;
    }
  };

  const checkStatus = async (jobId) => {
    try {
      // Fixed: Add slash between endpoint and jobId
      const response = await axios.get(`/pdf-status/${jobId}`);
      const result = response.data;

      if (result.success) {
        status.value = result.status;
        progress.value = result.progress || 0;
        message.value = result.message || getStatusMessage(result.status);

        if (result.status === "completed") {
          downloadUrl.value = result.download_url;
          filename.value = result.filename;
          isGenerating.value = false;

          // Add to generated PDFs history
          generatedPdfs.value.unshift({
            id: jobId,
            filename: result.filename,
            downloadUrl: result.download_url,
            generatedAt: new Date(),
            fileSize: result.file_size,
            totalItems: result.total_items,
          });

          // Keep only last 10 PDFs
          if (generatedPdfs.value.length > 10) {
            generatedPdfs.value = generatedPdfs.value.slice(0, 10);
          }
        } else if (result.status === "failed") {
          error.value = result.error || "PDF generation မှာ အမှားဖြစ်ပါတယ်";
          isGenerating.value = false;
        }

        return result;
      } else {
        throw new Error(result.message || "Status check မှာ အမှားဖြစ်ပါတယ်");
      }
    } catch (err) {
      console.error("Status Check Error:", err);
      error.value = "Status check လုပ်လို့ မရပါ: " + err.message;
      throw err;
    }
  };

  let statusInterval = null;

  const startStatusChecking = () => {
    if (!currentJob.value?.id) return;

    statusInterval = setInterval(async () => {
      try {
        await checkStatus(currentJob.value.id);

        // Stop checking if completed or failed
        if (status.value === "completed" || status.value === "failed") {
          stopStatusChecking();
        }
      } catch (err) {
        console.error("Status checking error:", err);
        // Continue checking, might be temporary network issue
      }
    }, 2000); // Check every 2 seconds
  };

  const stopStatusChecking = () => {
    if (statusInterval) {
      clearInterval(statusInterval);
      statusInterval = null;
    }
  };

  const resetState = () => {
    stopStatusChecking();
    isGenerating.value = false;
    currentJob.value = null;
    progress.value = 0;
    status.value = "";
    message.value = "";
    downloadUrl.value = "";
    filename.value = "";
    error.value = "";
  };

  const downloadPdf = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "cash_images.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusMessage = (statusValue) => {
    const messages = {
      queued: "Queue မှာ စောင့်နေပါတယ်...",
      processing: "PDF ကို လုပ်နေပါတယ်...",
      completed: "PDF ပြီးပါပြီ! Download လုပ်လို့ရပါပြီ။",
      failed: "PDF generation မှာ အမှားဖြစ်ပါတယ်။",
    };
    return messages[statusValue] || statusValue;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const retryGeneration = async () => {
    if (currentJob.value?.filters) {
      await generatePdf(currentJob.value.filters);
    }
  };

  return {
    // State
    isGenerating,
    currentJob,
    progress,
    status,
    message,
    downloadUrl,
    filename,
    error,
    generatedPdfs,

    // Computed
    canGenerate,
    isCompleted,
    isFailed,
    isProcessing,

    // Actions
    generatePdf,
    checkStatus,
    resetState,
    downloadPdf,
    retryGeneration,
    formatFileSize,
    startStatusChecking,
    stopStatusChecking,
  };
});
