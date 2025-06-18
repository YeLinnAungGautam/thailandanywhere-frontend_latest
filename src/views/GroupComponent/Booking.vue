<template>
  <div class="grid grid-cols-6 gap-4">
    <!-- Left Panel - Booking Request Status -->
    <div
      class="pb-4 border col-span-2 h-[62vh] overflow-y-auto border-gray-200 p-3 rounded-lg"
    >
      <p class="pb-1 text-lg font-medium text-[#FF613c]">Is Sent:</p>
      <p
        class="text-[10px] text-white bg-[#FF613c] px-2 py-1 rounded-lg inline-block mb-3"
      >
        {{ is_booking_request ? "Email Sent" : "Not Sent" }}
      </p>

      <div class="flex justify-between items-center gap-x-2">
        <select
          v-model="is_booking_request"
          class="w-full border border-gray-200 px-4 py-2 text-xs rounded-lg"
        >
          <option :value="true">Email Sent</option>
          <option :value="false">Not Sent</option>
        </select>
      </div>

      <!-- File Upload Section -->
      <div class="grid grid-cols-1 gap-2">
        <div class="mb-2 space-y-1 col-span-2">
          <input
            multiple
            type="file"
            ref="imagesInput"
            @change="handlerImagesFileChange"
            class="hidden"
            accept="image/*"
          />

          <div class="pt-2 space-y-2" @click="openFileImagePicker">
            <label class="pb-2 text-xs">Proof of Booking</label>
            <div
              class="w-full h-[100px] border border-dashed border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg cursor-pointer"
            >
              <PlusCircleIcon class="w-6 h-6" />
            </div>
          </div>

          <!-- New Images Preview -->
          <div
            class="grid grid-cols-4 gap-2 pt-4"
            v-if="imagesPreview.length > 0"
          >
            <div
              class="relative"
              v-for="(image, index) in imagesPreview"
              :key="index"
            >
              <button
                @click="removeImageSelectImage(index)"
                class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
              >
                <XCircleIcon class="w-6 h-6 font-semibold" />
              </button>
              <img class="h-auto w-full rounded" :src="image" alt="" />
            </div>
          </div>

          <!-- Existing Images Preview -->
          <div
            class="grid grid-cols-4 gap-2 pt-4"
            v-if="
              formData.editImagesPreview.length > 0 &&
              imagesPreview.length === 0
            "
          >
            <div
              class="relative"
              v-for="(image, index) in formData.editImagesPreview"
              :key="index"
            >
              <button
                @click="removeImageUpdateImage(image.id)"
                class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
              >
                <XCircleIcon class="w-6 h-6 font-semibold" />
              </button>
              <img class="h-auto w-full rounded" :src="image.file" alt="" />
              <p class="text-xs">{{ image.meta.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex justify-center items-center pt-4">
        <button
          class="text-xs px-3 py-1.5 border rounded-lg shadow border-[#FF6300] bg-[#FF6300] text-white"
          @click="updateReservationAction"
        >
          Update Status
        </button>
      </div>
    </div>

    <!-- Right Panel - Email Composition -->
    <div
      class="col-span-4 border border-gray-200 p-3 h-[62vh] overflow-y-auto rounded-lg"
    >
      <div class="flex justify-between items-center">
        <p class="text-lg font-medium text-[#FF613c]">Send Booking Request:</p>
        <div class="space-x-2 flex justify-end items-center gap-x-1">
          <button
            class="text-[10px] text-[#FF613c] border border-[#FF613c] bg-white px-2 py-1 rounded-lg inline-block"
            @click="cancelEmailFunction"
          >
            Clear Email
          </button>
          <button
            class="text-[10px] text-white bg-[#FF613c] px-2 py-1 rounded-lg inline-block"
            @click="sendEmailFunction"
          >
            Send Email
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 py-4 overflow-hidden rounded-xl">
        <div class="text-center" v-if="emailLoading">
          Email sending, Please wait...
        </div>

        <div class="w-full mb-4 space-y-3 text-xs">
          <!-- Email Recipients -->
          <div
            class="flex justify-start p-2 rounded-xl relative border border-gray-200 items-center gap-2 overflow-x-scroll"
          >
            <div
              v-for="(email, index) in emailData.mail_to_array"
              :key="index"
              class="px-2 py-1 rounded-lg bg-[#FF613c] text-white focus:outline-none text-[11px] relative"
            >
              <XCircleIcon
                class="w-4 h-4 text-red-500 bg-white rounded-full absolute -top-2 -right-2 cursor-pointer"
                @click="removeMailAction(index)"
              />
              <p>{{ email }}</p>
            </div>
            <div class="relative">
              <input
                type="email"
                v-model="mail_name"
                class="px-4 py-1 rounded-lg focus:outline-none text-[11px] max-w-[200px]"
                placeholder="To:"
              />
            </div>
            <button
              class="bg-[#FF613c] px-1 py-1 text-white rounded-full text-xs"
              @click="addMailAction"
            >
              <PlusIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Email Subject -->
          <input
            type="text"
            v-model="emailData.mail_subject"
            class="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-xs w-full"
            placeholder="Email Subject"
          />

          <!-- Email Body -->
          <QuillEditor
            ref="textEditor"
            :options="editorOptions"
            theme="snow"
            class="!bg-white/50 !border-1 !border-gray-200 !rounded-bl-md !rounded-br-md !text-xs !text-gray-900 !h-[300px]"
            toolbar="essential"
            contentType="html"
            v-model:content="emailData.mail_body"
          />

          <!-- Attachments -->
          <div class="space-y-2">
            <p class="text-[10px] text-[#FF6300]">
              Attachment Files must be under 25mb.
            </p>
            <div
              @click="showModal = true"
              v-if="!previewFile || previewFile.length === 0"
              class="w-full h-[50px] border border-gray-200 border-dashed flex justify-center items-center rounded-lg text-[#FF613c] cursor-pointer"
            >
              <span class="ml-4 px-2 py-1 text-[10px] text-[#ff613c] rounded-lg"
                >+ add file</span
              >
            </div>
          </div>

          <!-- Attachment Preview -->
          <div class="grid grid-cols-6 gap-2">
            <div
              class="w-full h-auto relative"
              v-for="(file, index) in previewFile"
              :key="index"
            >
              <XCircleIcon
                @click="removeFeatureSelectImage(index)"
                class="w-5 h-5 absolute top-2 right-2 text-2xl text-red-500 bg-white rounded-2xl cursor-pointer"
              />
              <img
                @click="showModal = true"
                :src="file"
                class="rounded-lg w-full h-[130px] bg-gray-100 border border-dashed border-gray-200 object-cover cursor-pointer"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attachments Modal -->
    <Modal :isOpen="showModal" @closeModal="showModal = false">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Attachments: Passports</p>
          <XCircleIcon
            class="w-5 h-5 text-white cursor-pointer"
            @click="cancelAction"
          />
        </DialogTitle>

        <div class="p-4 space-y-2">
          <p class="pb-4 text-sm font-medium">Passports</p>

          <!-- Passport List -->
          <div class="grid grid-cols-4 gap-2">
            <div
              class="w-full h-auto relative"
              v-for="passport in passportList"
              :key="passport.id"
            >
              <p
                class="text-[10px] bg-gray-600 px-2 py-1 text-white rounded-lg"
              >
                {{ passport.meta.name }}
              </p>
              <img
                :src="passport.file"
                class="rounded-lg w-full h-[100px] bg-gray-100 border border-dashed border-gray-200 object-cover"
                alt=""
              />
              <div
                @click="imageAddToAttachment(passport.file)"
                class="w-full px-4 py-1 mt-2 text-center border-dashed bg-[#FF613c] text-white space-y-2 hover:shadow-none rounded-xl cursor-pointer"
              >
                <p class="text-xs">+ add</p>
              </div>
            </div>
          </div>

          <p class="py-4 text-sm font-medium">All Attachments</p>

          <!-- File Upload and Preview -->
          <div class="grid grid-cols-5 gap-2">
            <input
              type="file"
              ref="featureImageInput"
              class="hidden"
              multiple
              @change="handlerFeatureFileChange"
              accept="image/*"
            />

            <!-- Add File Button -->
            <div class="space-y-2" @click="openFileFeaturePicker">
              <div
                class="w-full h-[100px] border border-gray-200 text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed cursor-pointer"
              >
                +
              </div>
              <div
                class="w-full px-4 pb-1 border-dashed border border-gray-200 space-y-2 text-red-600 hover:shadow-none rounded-lg"
              >
                <p class="text-[10px] flex justify-start items-center py-4">
                  max size is 25 mb
                </p>
              </div>
            </div>

            <!-- Preview Files -->
            <div
              class="w-full h-auto relative"
              v-for="(file, index) in previewFile"
              :key="index"
            >
              <XCircleIcon
                @click="removeFeatureSelectImage(index)"
                class="w-5 h-5 absolute top-2 text-red-600 right-2 bg-white rounded-full text-2xl cursor-pointer"
              />
              <img
                :src="file"
                class="rounded-lg w-full h-[175px] bg-gray-100 border border-dashed border-gray-200 object-cover"
                alt=""
              />
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="text-center pt-5 space-x-2">
            <button
              @click="showModal = false"
              class="px-4 py-2 rounded-full text-xs inline-block bg-[#FF613c] text-white"
            >
              Save Attachment
            </button>
            <button
              @click="cancelAction"
              class="px-4 py-2 rounded-full text-xs inline-block bg-white border border-gray-200 text-[#FF613c]"
            >
              Cancel Attachment
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import { PlusIcon } from "@heroicons/vue/24/outline";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/vue/24/solid";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { format } from "date-fns";
import { useGroupStore } from "../../stores/group";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();
const groupStore = useGroupStore();

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

// Reactive data
const showModal = ref(false);
const is_booking_request = ref(false);
const imagesPreview = ref([]);
const imagesInput = ref(null);
const featureImageInput = ref(null);
const emailLoading = ref(false);
const passportList = ref([]);
const mail_name = ref("");
const previewFile = ref([]);

const formData = ref({
  images: [],
  editImagesPreview: [],
});

const emailData = ref({
  mail_to_array: [],
  mail_subject: "",
  mail_body: "",
  attachments: [],
});

const editorOptions = {
  placeholder: "Write an awesome mail here...",
};

// File handling methods
const openFileImagePicker = () => {
  imagesInput.value.click();
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerImagesFileChange = (e) => {
  const selectedFiles = e.target.files;
  if (selectedFiles) {
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.value.images.push(selectedFiles[i]);
      imagesPreview.value.push(URL.createObjectURL(selectedFiles[i]));
    }
  }
};

const handlerFeatureFileChange = (e) => {
  const selectedFiles = e.target.files;
  if (selectedFiles.length > 0) {
    for (let i = 0; i < selectedFiles.length; i++) {
      emailData.value.attachments.push(selectedFiles[i]);
      previewFile.value.push(URL.createObjectURL(selectedFiles[i]));
    }
  }
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const removeFeatureSelectImage = (index) => {
  emailData.value.attachments.splice(index, 1);
  previewFile.value.splice(index, 1);
};

const removeImageUpdateImage = async (imageID) => {
  try {
    const res = await groupStore.groupDocumentDeleteAction(
      route.query.id,
      imageID
    );
    if (res.status === "Request was successful.") {
      toast.success("Image successfully deleted");
      await getProofImage();
    }
  } catch (error) {
    console.error("Delete image error:", error);
  }
};

// Email handling methods
const addMailAction = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(mail_name.value)) {
    emailData.value.mail_to_array.push(mail_name.value);
    mail_name.value = "";
  } else {
    alert("Please enter a valid email address.");
  }
};

const removeMailAction = (index) => {
  emailData.value.mail_to_array.splice(index, 1);
};

const cancelEmailFunction = () => {
  emailData.value = {
    mail_subject: "",
    mail_to_array: [],
    mail_body: "",
    attachments: [],
  };
  previewFile.value = [];
};

const sendEmailFunction = async () => {
  Swal.fire({
    title: "Are you sure?",
    text: `Send email to ${emailData.value.mail_to_array.join(", ")}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FF6300",
    cancelButtonColor: "#C69B92",
    confirmButtonText: "Send",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        emailLoading.value = true;
        const frmData = new FormData();
        frmData.append("mail_tos", emailData.value.mail_to_array);
        frmData.append("mail_subject", emailData.value.mail_subject);
        frmData.append("mail_body", emailData.value.mail_body);
        frmData.append("email_type", "booking");

        if (emailData.value.attachments.length > 0) {
          for (let i = 0; i < emailData.value.attachments.length; i++) {
            frmData.append(`attachments[${i}]`, emailData.value.attachments[i]);
          }
        }

        const res = await reservationStore.emailSendReservation(
          route.query.id,
          frmData
        );

        if (res?.status === "Request was successful.") {
          emailLoading.value = false;
          cancelEmailFunction();
          toast.success(res.message);
          setTimeout(async () => {
            await props.getDetailAction(route.query.id, route.query.product_id);
          }, 1000);
        }
      } catch (error) {
        emailLoading.value = false;
        console.error("Email send error:", error);
      }
    }
  });
};

// Main actions
const updateReservationAction = async () => {
  const frmData = new FormData();
  frmData.append("sent_booking_request", is_booking_request.value ? 1 : 0);
  frmData.append("_method", "PUT");

  const res = await groupStore.groupUpdateAction(route.query.id, frmData);
  toast.success("Update status");

  const responses = [];
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      const secData = new FormData();
      secData.append("document_type", "booking_request_proof");
      secData.append(`documents[${i}][file]`, formData.value.images[i]);
      secData.append(`documents[${i}][meta][name]`, `proof-${i}`);

      const fileRes = await groupStore.groupDocumentCreateAction(
        secData,
        route.query.id
      );
      responses.push(fileRes);
    }
  }

  if (responses.length > 0) {
    toast.success("Update completed successfully");
  }

  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

const imageAddToAttachment = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);

    const blob = await response.blob();
    const file = new File([blob], "passport.png", { type: blob.type });

    emailData.value.attachments.push(file);
    previewFile.value.push(URL.createObjectURL(blob));
  } catch (error) {
    console.error("Error adding image to attachments:", error);
  }
};

const cancelAction = () => {
  emailData.value.attachments = [];
  previewFile.value = [];
  showModal.value = false;
};

// Data fetching methods
const getProofImage = async () => {
  const res = await groupStore.groupDocumentList(route.query.id, {
    document_type: "booking_request_proof",
  });
  formData.value.editImagesPreview = res.result;
};

const getPassportImage = async () => {
  const res = await groupStore.groupDocumentList(route.query.id, {
    document_type: "passport",
  });
  passportList.value = res.result;
};

// Utility methods
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

const mailBodyChange = () => {
  const isTicket =
    props?.detail?.items[0]?.product_type === "App\\Models\\EntranceTicket";
  const detail = props?.detail?.booking;

  emailData.value.mail_subject = `Booking for ${showFormat(
    props?.detail?.items[0].service_date
  )}: ${detail?.crm_id}`;
  is_booking_request.value = props?.detail?.sent_booking_request === 1;

  if (isTicket) {
    // Template for Entrance Tickets
    emailData.value.mail_body = `
      <p>Dear ${detail.items[0].product?.name},</p>
      <p><strong>Greetings from ThAnywhere Co., Ltd.</strong></p>
      <p>We would like to book the tickets as per the following description.</p>
      <p>
        ${detail?.items
          .map(
            (item) => `
          <p><strong>Ticket Type:</strong> ${item.variation?.name}</p>
          <p><strong>Service Date:</strong> ${item.service_date}</p>
          <p><strong>Ticket Qty:</strong> ${item.quantity} Adult, ${
              item.individual_pricing?.child?.quantity || 0
            } Child</p>
          <p><strong>Special request:</strong> ${item.special_request}</p>
        `
          )
          .join("<hr>")}
      </p>
      <p><strong>Booking Code:</strong> ${detail?.crm_id}</p>
      <p><strong>Guest Names:</strong></p>
      <p>
        ${
          passportList.value
            ?.map((passport) => `<p>${passport.meta.name}</p>`)
            .join("") || ""
        }
      </p>
      <p>Passports for the bookings are attached in the email.</p>
      <p><strong>Tax ID:</strong> 0105565081822<br>
      <strong>TH ANYWHERE CO.LTD.</strong><br>
      <strong>Invoice Date:</strong> ${format(new Date(), "dd/MM/yyyy")}</p>
      <p>Thank you,</p>
      <p><strong>Negyi @ Sunshine</strong> (Reservation Manager)</p>
    `;
  } else {
    // Template for Hotels
    emailData.value.mail_body = `
      <p>Dear ${detail.items[0].product?.name},</p>
      <p><strong>Greetings from ThAnywhere Co., Ltd.</strong></p>
      <p>We would like to book the accommodation as per the following description.</p>
      <p>
        ${detail?.items
          .map(
            (item) => `
          <p><strong>Room Type:</strong> ${item.room?.name}</p>
          <p><strong>Check In Date:</strong> ${item.checkin_date}</p>
          <p><strong>Check Out Date:</strong> ${item.checkout_date}</p>
          <p><strong>Room Count:</strong> ${item.quantity} Rooms, ${daysBetween(
              item.checkin_date,
              item.checkout_date
            )} Nights</p>
          <p><strong>Special request:</strong> ${item.special_request}</p>
        `
          )
          .join("<hr>")}
      </p>
      <p><strong>Booking Code:</strong> ${detail?.crm_id}</p>
      <p><strong>Guest Names:</strong></p>
      <p>
        ${
          passportList.value
            ?.map(
              (passport) =>
                `<p>${passport.meta.name}(${passport.meta.passport_number})</p>`
            )
            .join("") || ""
        }
      </p>
      <p>Passports for the bookings are attached in the email.</p>
      <p><strong>Tax ID:</strong> 0105565081822<br>
      <strong>TH ANYWHERE CO.LTD.</strong><br>
      <strong>Invoice Date:</strong> ${format(new Date(), "dd/MM/yyyy")}</p>
      <p>Thank you,</p>
      <p><strong>Negyi @ Sunshine</strong> (Reservation Manager)</p>
    `;
  }
};

onMounted(async () => {
  await getProofImage();
  await getPassportImage();
  mailBodyChange();

  if (props?.detail) {
    emailData.value.mail_to_array =
      props.detail?.items[0]?.product?.email || [];
  }
});
</script>

<style>
.ql-toolbar.ql-snow {
  border: 1px solid #edecec !important;
  box-sizing: border-box;
  font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  padding: 8px;
}

div:where(.swal2-container) .swal2-html-container {
  z-index: 1;
  justify-content: center;
  margin: 0;
  padding: 1em 1.6em 0.3em;
  overflow: auto;
  color: inherit;
  font-size: 1em !important;
  font-weight: normal;
  line-height: normal;
  text-align: center;
  word-wrap: break-word;
  word-break: break-word;
}
</style>
