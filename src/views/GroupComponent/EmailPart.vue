<template>
  <div class="space-y-4">
    <!-- Email Preview Card -->
    <div class="border border-gray-200 rounded-lg p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-[#FF613c]">
          {{
            activeTag === "prove_booking" ? "Booking Email" : "Expense Email"
          }}
        </h3>
        <div class="flex justify-end items-center gap-x-2">
          <!-- Copy All Button (Alternative) -->
          <!-- <div class="flex justify-end">
            <button
              class="text-xs px-4 py-2 border bg-gray-200 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Send Email
            </button>
          </div> -->
        </div>
      </div>

      <!-- Email Recipients -->
      <div class="mb-3">
        <!-- <label class="text-xs font-medium text-gray-600 block mb-1">To:</label> -->
        <div class="flex justify-between items-center pb-3">
          <label class="text-xs font-medium text-gray-600 block">To:</label>
          <button
            @click="copyMails"
            class="text-xs px-3 py-1.5 border rounded-lg border-[#FF6300] bg-[#FF6300] text-white hover:bg-[#FF6300]/90 transition-colors"
          >
            {{ copiedMails ? "Copied!" : "Copy Mails" }}
          </button>
        </div>
        <div class="bg-gray-50 px-3 py-2 rounded border border-gray-200">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(email, index) in emailRecipients"
              :key="index"
              class="inline-flex items-center px-2 py-1 rounded-lg bg-[#FF613c] text-white text-xs"
            >
              {{ email }}
            </span>
            <span
              v-if="emailRecipients.length === 0"
              class="text-xs text-gray-400"
            >
              No email addresses found
            </span>
          </div>
        </div>
      </div>

      <!-- Email Subject -->
      <div class="mb-3">
        <!-- <label class="text-xs font-medium text-gray-600 block mb-1"
          >Subject:</label
        > -->
        <div class="flex justify-between items-center pb-3">
          <label class="text-xs font-medium text-gray-600 block"
            >Subject:</label
          >
          <button
            @click="copySubject"
            class="text-xs px-3 py-1.5 border rounded-lg border-[#FF6300] bg-[#FF6300] text-white hover:bg-[#FF6300]/90 transition-colors"
          >
            {{ copiedSubject ? "Copied!" : "Copy Subject" }}
          </button>
        </div>
        <div
          class="bg-gray-50 px-3 py-2 rounded border border-gray-200 text-sm"
        >
          {{ emailSubject }}
        </div>
      </div>

      <!-- Email Body Preview -->
      <div class="mb-3">
        <div class="flex justify-between items-center pb-3">
          <label class="text-xs font-medium text-gray-600 block">Body:</label>
          <button
            @click="copyEmailContent"
            class="text-xs px-3 py-1.5 border rounded-lg border-[#FF6300] bg-[#FF6300] text-white hover:bg-[#FF6300]/90 transition-colors"
          >
            {{ copied ? "Copied!" : "Copy Body" }}
          </button>
        </div>
        <div
          ref="emailBodyRef"
          class="bg-gray-50 px-4 py-3 rounded border border-gray-200 text-sm max-h-[400px] overflow-y-auto"
          v-html="emailBody"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { format } from "date-fns";

const props = defineProps({
  detail: Object,
  activeTag: String,
});

const emailBodyRef = ref(null);
const copied = ref(false);
const copiedMails = ref(false);
const copiedSubject = ref(false);

// Calculate days between dates
const daysBetween = (a, b) => {
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    return Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
  }
  return 0;
};

const showFormat = (dateStr) => {
  return format(new Date(dateStr), "dd MMMM, yyyy");
};

// Computed email recipients
const emailRecipients = computed(() => {
  if (!props.detail?.items?.[0]?.product?.email) return [];

  const emails = props.detail.items[0].product.email;

  // Handle if it's already an array
  if (Array.isArray(emails)) {
    return emails.filter((email) => email && email.trim() !== "");
  }

  // Handle if it's a string (comma-separated or single email)
  if (typeof emails === "string") {
    return emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");
  }

  return [];
});

// Computed email subject
const emailSubject = computed(() => {
  if (!props.detail?.items?.[0]) return "";

  const serviceDate =
    props.detail.items[0].service_date || props.detail.items[0].checkin_date;
  const crmId = props.detail.booking_crm_id || props.detail.crm_id;

  return `Booking for ${showFormat(serviceDate)}: ${crmId}`;
});

// Computed email body based on activeTag
const emailBody = computed(() => {
  if (!props.detail?.items?.[0]) return "";

  const detail = props.detail;
  const isTicket =
    detail.items[0].product_type === "App\\Models\\EntranceTicket";

  if (props.activeTag === "prove_booking") {
    // Booking Request Email
    if (isTicket) {
      return `
        <p>Dear ${detail.items[0].product?.name},</p>
        <p><strong>Greetings from ThAnywhere Co., Ltd.</strong></p>
        <p>We would like to book the accommodation as per the following description. Please note the booking is already checked and confirmed by phone.</p>
        <p>
          ${detail.items
            .map(
              (item) => `
            <p><strong>Ticket Type:</strong> ${item.variation?.name}</p>
            <p><strong>Service Date:</strong> ${item.service_date}</p>
            <p><strong>Ticket Qty:</strong> ${item.quantity} Adult, ${
                item.individual_pricing?.child?.quantity || 0
              } Child</p>
            <p><strong>Special request:</strong> ${
              item.special_request || "None"
            }</p>
          `
            )
            .join("<hr>")}
        </p>
        <p><strong>Booking Code:</strong> ${detail.booking_crm_id}</p>
        <p>Passports for the bookings are attached in the email. Please arrange for the customer accordingly.</p>
        <p>Payment transaction will be done soon. Once the payment is received, Please kindly issue receipt with tax ID and send to us by post or mail.</p>
        <p>If you need any questions and concerns please feel free to call me at 0637602448 all the time.</p>
        <p><strong>Tax ID:</strong> 0105565081822<br>
        <strong>TH ANYWHERE CO.LTD.</strong><br>
        <strong>Invoice Date:</strong> ${format(new Date(), "dd/MM/yyyy")}</p>
        <p>If you may have any questions or concerns, please feel free to call us at <strong>0950423254</strong> LINE ID <strong>0983498197</strong>.</p>
        <p>Thank you,</p>
        <p><strong>Negyi @ Sunshine</strong> (Reservation Manager)</p>
        <p>100/151 Huay Kaew Rd, Tambon Chang Phueak, Mueang Chiang Mai District, Chiang Mai 50300</p>
      `;
    } else {
      return `
        <p>Dear ${detail.items[0].product?.name},</p>
        <p><strong>Greetings from ThAnywhere Co., Ltd.</strong></p>
        <p>We would like to book the accommodation as per the following description. Please note the booking is already checked and confirmed by phone.</p>
        <p>
          ${detail.items
            .map(
              (item) => `
            <p><strong>Room Type:</strong> ${item.room?.name}</p>
            <p><strong>Check In Date:</strong> ${item.checkin_date}</p>
            <p><strong>Check Out Date:</strong> ${item.checkout_date}</p>
            <p><strong>Room Count:</strong> ${
              item.quantity
            } Rooms, ${daysBetween(
                item.checkin_date,
                item.checkout_date
              )} Nights</p>
            <p><strong>Special request:</strong> ${
              item.special_request || "None"
            }</p>
          `
            )
            .join("<hr>")}
        </p>
        <p><strong>Booking Code:</strong> ${detail.booking_crm_id}</p>
        <p>Passports for the bookings are attached in the email. Please arrange for the customer accordingly.</p>
        <p>Payment transaction will be done soon. Once the payment is received, Please kindly issue receipt with tax ID and send to us by post or mail.</p>
        <p>If you need any questions and concerns please feel free to call me at 0637602448 all the time.</p>
        <p><strong>Tax ID:</strong> 0105565081822<br>
        <strong>TH ANYWHERE CO.LTD.</strong><br>
        <strong>Invoice Date:</strong> ${format(new Date(), "dd/MM/yyyy")}</p>
        <p>Thank you,</p>
        <p><strong>Negyi @ Sunshine</strong> (Reservation Manager)</p>
        <p>100/151 Huay Kaew Rd, Tambon Chang Phueak, Mueang Chiang Mai District, Chiang Mai 50300</p>
      `;
    }
  } else if (props.activeTag === "expense") {
    // Expense Request Email
    return `
      <p>Dear ${detail.items[0].product?.name},</p>
      <p>Please see our payment slip in the attached file for ${detail.booking_crm_id}.</p>
      <p>We would like to kindly request a confirmation letter as soon as possible. Please kindly issue a receipt with Tax ID and send it to us by email.</p>
      <p>Phone: 0950423254, 0637602448.</p>
      <p>TAX ID : 0105565081822 TH Anywhere Co.,Ltd.</p>
      <p>For any requirement you may contact us at 0637602448, 0983498197, 0950423254.</p>
      <p>Regards<br>Negyi@Sunshine<br>Reservation Manager</p>
      <p>100/151 Huay Kaew Rd, Tambon Chang Phueak, Mueang Chiang Mai District, Chiang Mai 50300</p>
    `;
  }

  return "";
});

// Copy email content to clipboard (body only)
const copyEmailContent = async () => {
  try {
    // Create a temporary element to convert HTML to plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = emailBody.value;

    // Get text content
    // const textContent = `Subject: ${emailSubject.value}\n\n${tempDiv.innerText}`;
    const textContent = tempDiv.innerText;

    // Copy to clipboard
    await navigator.clipboard.writeText(textContent);

    // Show feedback
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    // Fallback for older browsers
    fallbackCopy(textContent);
  }
};

// Copy email subject
const copySubject = async () => {
  try {
    await navigator.clipboard.writeText(emailSubject.value);
    copiedSubject.value = true;
    setTimeout(() => {
      copiedSubject.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

// Copy mails
const copyMails = async () => {
  try {
    await navigator.clipboard.writeText(emailRecipients.value.join(", "));
    copiedMails.value = true;
    setTimeout(() => {
      copiedMails.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

// Copy full email including recipients
const copyFullEmail = async () => {
  try {
    // Create a temporary element to convert HTML to plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = emailBody.value;

    // Build full email content
    const recipients = emailRecipients.value.join(", ");
    const textContent = `To: ${recipients}\nSubject: ${emailSubject.value}\n\n${tempDiv.innerText}`;

    // Copy to clipboard
    await navigator.clipboard.writeText(textContent);

    // Show feedback
    copiedFull.value = true;
    setTimeout(() => {
      copiedFull.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    // Fallback for older browsers
    fallbackCopy(textContent);
  }
};

// Fallback copy method
const fallbackCopy = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand("copy");
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Fallback copy failed:", err);
  }

  document.body.removeChild(textArea);
};

// Watch for activeTag changes
watch(
  () => props.activeTag,
  () => {
    copied.value = false;
    copiedFull.value = false;
  }
);
</script>

<style scoped>
/* Style for email body preview */
:deep(.bg-gray-50 p) {
  margin-bottom: 0.5rem;
}

:deep(.bg-gray-50 hr) {
  margin: 1rem 0;
  border-color: #e5e7eb;
}

:deep(.bg-gray-50 strong) {
  font-weight: 600;
  color: #374151;
}
</style>
