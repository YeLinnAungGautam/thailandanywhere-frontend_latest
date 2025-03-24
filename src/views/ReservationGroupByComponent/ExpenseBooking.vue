<template>
  <div>
    <div>
      <div class="flex justify-start items-center gap-x-2">
        <!-- <p class="font-medium pb-2">Booking Request</p> -->
        <CheckCircleIcon
          class="w-4 h-4"
          :class="
            detail?.payment_status == 'fully_paid'
              ? 'text-green-500'
              : 'text-red-500'
          "
        />
        <p
          class="text-xs"
          :class="
            detail?.payment_status == 'fully_paid'
              ? 'text-green-500'
              : 'text-red-500'
          "
        >
          Is Expense Status Finish ?
        </p>
      </div>
      <div class="grid grid-cols-1 gap-4 py-4 overflow-hidden rounded-xl">
        <div class="text-center" v-if="emailLoading">
          Email sending , Please wait loading .....
        </div>
        <div class="w-full mb-4 space-y-3 text-xs">
          <div class="space-y-4">
            <!-- <div>
              <input
                type="email"
                v-model="emailData.mail_to"
                class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
                placeholder="Send to Email"
              />
            </div> -->
            <div
              class="flex justify-start p-2 rounded-xl relative border border-gray-200 items-center gap-2 overflow-x-scroll no-sidebar-container"
            >
              <div
                v-for="(i, index) in emailData.mail_to_array"
                :key="index"
                class="px-2 py-1 rounded-lg bg-[#FF613c] text-white focus:outline-none text-[11px] relative"
              >
                <XCircleIcon
                  class="w-4 h-4 text-red-500 bg-white rounded-full absolute -top-2 -right-2 cursor-pointer"
                  @click="removeMailAction(index)"
                />
                <p>{{ i }}</p>
              </div>
              <div class="relative">
                <input
                  type="email"
                  v-model="mail_name"
                  class="px-4 py-1 rounded-lg focus:outline-none text-[11px] max-w-[200px]"
                  placeholder="Send to Email"
                />
              </div>
              <button
                class="absolute top-2 right-2 bg-[#FF613c] px-1 py-1 text-white rounded-full text-xs"
                @click="addMailAction"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>

            <div>
              <input
                type="text"
                v-model="emailData.mail_subject"
                class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
                placeholder="Booking for"
              />
            </div>
            <div class="">
              <QuillEditor
                ref="textEditor"
                :options="editorOptions"
                theme="snow"
                class="!bg-white/50 !border-1 !border-gray-200 !rounded-bl-md !rounded-br-md !text-xs !text-gray-900 !h-[200px]"
                toolbar="essential"
                contentType="html"
                v-model:content="emailData.mail_body"
              />
            </div>
            <div class="space-y-2">
              <p class="text-[10px] text-[#FF6300]">
                Attachment Files must be under 25mb .
              </p>
              <div
                @click="showModal = true"
                v-if="!previewFile || previewFile.length === 0"
                class="w-full h-[50px] border border-[#FF613c] border-dashed flex justify-center items-center rounded-lg text-[#FF613c] cursor-pointer"
              >
                <span
                  class="ml-4 px-2 py-1 text-[10px] text-[#ff613c] rounded-lg"
                  >+ add file</span
                >
              </div>
            </div>
            <div class="grid grid-cols-6 gap-2">
              <div
                class="w-full h-auto relative"
                v-for="(i, index) in previewFile ?? []"
                :key="i"
              >
                <XCircleIcon
                  @click="removeFeatureSelectImage(index)"
                  class="w-5 h-5 absolute top-2 right-2 text-2xl text-red-500 bg-white rounded-2xl cursor-pointer"
                />
                <img
                  @click="showModal = true"
                  :src="i"
                  class="rounded-lg w-full h-[130px] bg-gray-100 border border-dashed border-[#FF613c] object-cover"
                  alt=""
                />
              </div>
            </div>
            <div class="space-x-2 flex justify-end items-center gap-x-2">
              <button
                class="text-xs px-3 py-1.5 border rounded-lg shadow border-gray-100/50 bg-transfer text-[#FF613c]"
                @click="cancelEmailFunction"
              >
                Clear Email
              </button>
              <button
                class="text-xs px-3 py-1.5 border rounded-lg shadow border-[#FF6300] bg-[#FF6300] text-white"
                @click="sendEmailFunction"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="showModal" @closeModal="showModal = false">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Attachments: Passports</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="cancelAction" />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <p class="pb-4 text-sm font-medium">Expense</p>
          <!-- <div class="grid grid-cols-5 gap-2">
            <div
              class="w-full h-auto relative"
              v-for="i in detail?.receipt_images ?? []"
              :key="i"
            >
              <img
                :src="i.file"
                class="rounded-lg w-full h-[130px] bg-gray-100 border border-dashed border-[#FF613c] object-cover"
                alt=""
              />
              <div
                @click="imageAddToAttachment(i.file)"
                class="w-full px-4 py-1 mt-2 text-center border-dashed bg-[#FF613c] text-white space-y-2 hover:shadow-none rounded-xl"
              >
                <p class="text-xs">+ add</p>
              </div>
            </div>
          </div> -->
          <div
            class="grid grid-cols-5 gap-2"
            v-for="a in editData.reservation_ids ?? []"
            :key="a"
          >
            <div
              class="w-full h-auto relative"
              v-for="i in editData.attachments ?? []"
              :key="i"
              :class="{ hidden: i.crm_id !== a.crm_id }"
            >
              <p
                class="text-[10px] bg-gray-600 px-2 py-1 text-white rounded-lg"
              >
                {{ i.crm_id }}
              </p>
              <img
                :src="i.file"
                class="rounded-lg w-full h-[100px] bg-gray-100 border border-dashed border-[#FF613c] object-cover"
                alt=""
              />
              <div
                @click="imageAddToAttachment(i.file)"
                class="w-full px-4 py-1 mt-2 text-center border-dashed bg-[#FF613c] text-white space-y-2 hover:shadow-none rounded-xl"
              >
                <p class="text-xs">+ add</p>
              </div>
            </div>
          </div>
          <p class="py-4 text-sm font-medium">All Attachments</p>
          <div class="grid grid-cols-5 gap-2">
            <input
              type="file"
              ref="featureImageInput"
              class="hidden"
              multiple
              @change="handlerFeatureFileChange"
              accept="image/*"
            />
            <div class="space-y-2" @click="openFileFeaturePicker">
              <div
                class="w-full h-[100px] border border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed"
              >
                +
              </div>
              <div
                class="w-full px-4 pb-1 border-dashed border border-[#FF613c] space-y-2 text-red-600 hover:shadow-none rounded-lg"
              >
                <p class="text-[10px] flex justify-start items-center py-4">
                  max size is 25 mb
                </p>
              </div>
            </div>
            <div
              class="w-full h-auto relative"
              v-for="(i, index) in previewFile ?? []"
              :key="i"
            >
              <XCircleIcon
                @click="removeFeatureSelectImage(index)"
                class="w-5 h-5 absolute top-2 text-red-600 right-2 bg-white rounded-full text-2xl cursor-pointer"
              />
              <img
                :src="i"
                class="rounded-lg w-full h-[175px] bg-gray-100 border border-dashed border-[#FF613c] object-cover"
                alt=""
              />
            </div>
          </div>
          <div class="text-center pt-5 space-x-2">
            <p
              @click="showModal = false"
              class="px-4 py-2 rounded-full text-xs inline-block bg-[#FF613c] text-white"
            >
              Save Attachment
            </p>
            <p
              @click="cancelAction"
              class="px-4 py-2 rounded-full text-xs inline-block bg-white border border-[#FF613c] text-[#FF613c]"
            >
              Cancel Attachment
            </p>
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
import { CheckCircleIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { format } from "date-fns";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const showModal = ref(false);

const props = defineProps({
  detail: Object,
});

const featureImageInput = ref(null);
const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const emailData = ref({
  mail_to_array: [],
  mail_subject: "",
  mail_to: "",
  send_to_default: false,
  attachments: [],
});

const mail_name = ref("");

const addMailAction = () => {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if mail_name.value is a valid email
  if (emailRegex.test(mail_name.value)) {
    emailData.value.mail_to_array.push(mail_name.value);
    mail_name.value = ""; // Clear the input after adding
  } else {
    alert("Please enter a valid email address.");
    // Alternatively, you can handle the error in a more user-friendly way
  }
};

const removeMailAction = (index) => {
  emailData.value.mail_to_array.splice(index, 1);
};

const previewFile = ref([]);

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile.length > 0) {
    for (let i = 0; i < selectedFile.length; i++) {
      emailData.value.attachments.push(selectedFile[i]);
      previewFile.value.push(URL.createObjectURL(selectedFile[i]));
    }
  }
};

const cancelEmailFunction = () => {
  emailData.value = {
    mail_subject: "",
    mail_to_array: [],
    mail_to: "",
    send_to_default: false,
    attachments: [],
  };
};

const emailLoading = ref(false);
const sendEmailFunction = async () => {
  Swal.fire({
    title: "Are you sure ?",
    text: `Send email to ${emailData.value.mail_to_array} `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FF6300",
    cancelButtonColor: "#C69B92",
    confirmButtonText: "Send",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        emailLoading.value = true;
        console.log(emailData.value);
        const frmData = new FormData();
        frmData.append("mail_tos", emailData.value.mail_to_array);
        frmData.append("mail_subject", emailData.value.mail_subject);
        frmData.append("mail_body", emailData.value.mail_body);
        frmData.append("send_to_default", emailData.value.send_to_default);
        // frmData.append("attachments", emailData.value.attachments);
        if (emailData.value.attachments.length > 0) {
          for (let i = 0; i < emailData.value.attachments.length; i++) {
            let file = emailData.value.attachments[i];
            frmData.append("attachments[" + i + "]", file);
          }
        }
        const res = await reservationStore.emailSendReservation(
          route.query.id,
          frmData
        );
        if (res.data.status) {
          emailLoading.value = false;
          emailData.value = {
            mail_subject: "",
            mail_to: "",
            mail_to_array: [],
            send_to_default: false,
            attachments: [],
          };
          previewFile.value = [];
          mailBodyChange();
          toast.success(res.message);
          setTimeout(async () => {
            await props.getDetailAction(route.query.id, route.query.product_id);
          }, 1000);
        }
      } catch (error) {
        emailLoading.value = false;
        // toast.error(error.response.data.message);
        console.log(error);
      }
    }
  });
};

// const addAttracted = (e) => {
//   for (let i = 0; i <br e.target.files.length; i++) {
//     emailData.value.attachments.push(e.target.files[i]);
//     console.log(e.target.files[i], "this is att");
//   }
// };

const editorOptions = {
  placeholder: "Write an awesome mail here ...",
};

const mailBodyChange = () => {
  emailData.value.mail_subject = `Booking for ${showFormat(
    props?.detail?.booking?.items[0].service_date
  )}: ${props?.detail?.booking.crm_id}`;

  let detail = props?.detail?.booking;

  emailData.value.mail_body = `<p class="p1">Dear ${detail.items[0].product?.name},</p>
    <p class="p1">Please see our payment slip in the attached file. We would like to kindly request a confirmation letter as soon as possible. Please kindly issue a receipt with Tax ID and send it to us by email.</p>
    <p class="p1">Phone: 0950423254, 0637602448.</p>
    <p class="p1">TAX ID : 0105565081822 TH Anywhere Co.,Ltd.</p>
    <p class="p1">For any requirement you may contact us at 0637602448, 0983498197, 0950423254.</p>
    <p class="p1">Regards<br /> Negyi@Sunshine<br /> Reservation Manager</p>
<p class="p1">143/50, Thepprasit Rd, Pattaya City, Bang Lamung District, Chon Buri 20150</p>`;
};

const imageAddToAttachment = async (fileUrl) => {
  try {
    // Fetch the image from the URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Convert the response to a Blob
    const blob = await response.blob();

    // Create a File object from the Blob (optional, if you need a File object)
    const file = new File([blob], "image.png", { type: blob.type });

    // Push the File or Blob to your attachments array
    emailData.value.attachments.push(file); // or push(blob) if you don't need a File object

    // Generate a preview URL and push it to the previewFile array
    const previewUrl = URL.createObjectURL(blob);
    previewFile.value.push(previewUrl);

    console.log("====================================");
    console.log("File added:", file);
    console.log("Preview URL:", previewUrl);
    console.log("====================================");
  } catch (error) {
    console.error("Error adding image to attachments:", error);
  }
};

const removeFeatureSelectImage = (index) => {
  emailData.value.attachments.splice(index, 1);
  previewFile.value.splice(index, 1);
  // console.log(editData.value.customer_passport, "this is remove");
};

const daysBetween = (a, b) => {
  console.log(a, b);
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    // console.log(formData.value.checkin_date, result, "this is result");
    return result;
  }
};

const showFormat = (dateStr) => {
  return format(new Date(dateStr), "dd MMMM, YYY");
};

const cancelAction = () => {
  emailData.value.attachments = [];
  previewFile.value = [];
  showModal.value = false;
};

const editData = ref({
  reservation_ids: [],
  attachments: [],
});

onMounted(() => {
  mailBodyChange();
  if (props?.detail) {
    emailData.value.mail_to_array =
      props.detail?.booking?.items[0]?.product?.email || [];

    for (let i = 0; i < props.detail?.booking?.items.length; i++) {
      editData.value.reservation_ids.push({
        id: props.detail?.booking?.items[i].id,
        crm_id: props.detail?.booking?.items[i].crm_id,
        name: props.detail?.booking?.items[i].room?.name,
        selected: false,
      });
      if (props.detail?.booking?.items[i].receipt_images.length > 0) {
        for (
          let a = 0;
          a < props.detail?.booking?.items[i].receipt_images.length;
          a++
        ) {
          editData.value.attachments.push({
            id: props.detail?.booking?.items[i].receipt_images[a].id,
            reservation_id: props.detail?.booking?.items[i].id,
            crm_id: props.detail?.booking?.items[i].crm_id,

            file: props.detail?.booking?.items[i].receipt_images[a].file,
          });
        }
      }
    }

    console.log("====================================");
    console.log(editData.value.attachments);
    console.log("====================================");
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

/* Hide the default checkbox appearance */
.custom-checkbox-input {
  appearance: none; /* Removes the default browser styling */
  -webkit-appearance: none; /* For Safari */
  -moz-appearance: none; /* For Firefox */
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  outline: none;
}

/* Style the checkbox when checked */
.custom-checkbox-input:checked {
  background-color: #ff613c;
  border-color: #ff613c;
}

/* Add a checkmark using a pseudo-element */
.custom-checkbox-input:checked::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid rgb(255, 255, 255);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
