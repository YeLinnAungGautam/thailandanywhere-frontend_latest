// stores/cashImage.js
import { defineStore } from "pinia";
import axios from "axios";

export const useCashImageEditStore = defineStore("cashImageEdit", {
  state: () => ({
    cashImages: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Create a new cash image
    async createCashImage(imageData) {
      this.loading = true;
      this.error = null;

      try {
        const formData = new FormData();

        // Append image file
        if (imageData.image) {
          formData.append("image", imageData.image);
        }

        // Append other fields
        formData.append("sender", imageData.sender || "");
        formData.append("reciever", imageData.receiver || "");
        formData.append("amount", imageData.amount || 0);
        formData.append("currency", imageData.currency || "THB");
        formData.append("interact_bank", imageData.interact_bank || "");

        // Format date properly
        if (imageData.date) {
          const formattedDate = this.formatDateTimeForServer(imageData.date);
          formData.append("date", formattedDate);
        }

        // Relatable fields for polymorphic relationship
        formData.append(
          "relatable_type",
          imageData.relatable_type || "App\\Models\\CashBook"
        );
        formData.append("relatable_id", imageData.relatable_id);

        const response = await axios.post("/cash-images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to create cash image";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update an existing cash image
    async updateCashImage(id, imageData) {
      this.loading = true;
      this.error = null;

      try {
        const formData = new FormData();

        // Add method override for PUT request
        formData.append("_method", "PUT");

        // Append image file only if a new one is selected
        if (imageData.image) {
          formData.append("image", imageData.image);
        }

        // Append other fields
        formData.append("sender", imageData.sender || "");
        formData.append("reciever", imageData.receiver || "");
        formData.append("amount", imageData.amount || 0);
        formData.append("currency", imageData.currency || "THB");
        formData.append("interact_bank", imageData.interact_bank || "");

        // Format date properly
        if (imageData.date) {
          const formattedDate = this.formatDateTimeForServer(imageData.date);
          formData.append("date", formattedDate);
        }

        const response = await axios.post(`/cash-images/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to update cash image";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete a cash image
    async deleteCashImage(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.delete(`/cash-images/${id}`);
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to delete cash image";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete a cash book image (simple image)
    async deleteCashBookImage(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.delete(`/cash-books/${id}/delete-image`);
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to delete cash book image";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get cash images for a specific cash book
    async getCashImagesByCashBook(cashBookId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/cash-books/${cashBookId}/delete-image`
        );
        this.cashImages = response.data.data || [];
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch cash images";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Utility function to format datetime for server
    formatDateTimeForServer(dateTimeString) {
      if (!dateTimeString) return "";

      // If it's already in the correct format, return as is
      if (dateTimeString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        return dateTimeString;
      }

      // Convert datetime-local format (YYYY-MM-DDTHH:mm) to Y-m-d H:i:s
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return "";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // Clear error state
    clearError() {
      this.error = null;
    },
  },
});
