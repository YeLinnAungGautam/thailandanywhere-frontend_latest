<template>
  <div>
    <div class="grid grid-cols-6 gap-4">
      <div
        class="pb-4 border col-span-2 h-[62vh] overflow-y-auto border-gray-200 p-3 rounded-lg"
      >
        <p class="pb-1 text-lg font-medium text-[#FF613c]">
          Is Expense Email Sent:
        </p>
        <p
          class="text-[10px] text-white bg-[#FF613c] px-2 py-1 rounded-lg inline-block mb-3"
        >
          {{ is_expense_email_sent ? "Email Sent" : "Not Sent" }}
        </p>
        <div class="flex justify-between items-center gap-x-2">
          <select
            name=""
            id=""
            v-model="is_expense_email_sent"
            class="w-full border border-gray-200 px-4 py-2 text-xs rounded-lg"
          >
            <option :value="true">Email Sent</option>
            <option :value="false">Not Sent</option>
          </select>
          <!-- <button
            class="text-xs px-3 py-1.5 border rounded-lg shadow border-[#FF6300] bg-[#FF6300] text-white"
            @click="updateAction"
          >
            Update
          </button> -->
        </div>
        <div class="grid grid-cols-1 gap-2">
          <!-- <div class="pt-2 space-y-2">
            <label for="mail_to" class="pb-2 text-xs">Proof of Booking</label>
            <div
              class="w-full h-[100px] border border-dashed border-gray-300 text-gray-300 text-lg flex justify-center items-center rounded-lg"
            >
              <PlusCircleIcon class="w-6 h-6" />
            </div>
          </div> -->
          <div class="mb-2 space-y-1 col-span-2">
            <!-- <label for="description" class="text-sm text-gray-800">Images</label> -->
            <input
              multiple
              type="file"
              name=""
              ref="imagesInput"
              id=""
              @change="handlerImagesFileChange"
              class="hidden w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              accept="image/*"
            />
            <div class="pt-2 space-y-2" @click.prevent="openFileImagePicker">
              <label for="mail_to" class="pb-2 text-xs">Proof of Expense</label>
              <div
                class="w-full h-[100px] border border-dashed border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg"
              >
                <PlusCircleIcon class="w-6 h-6" />
              </div>
            </div>
            <div
              class="grid grid-cols-4 gap-2 pt-4"
              v-if="imagesPreview.length != 0"
            >
              <div
                class="relative"
                v-for="(image, index) in imagesPreview"
                :key="index"
              >
                <button
                  @click.prevent="removeImageSelectImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-6 h-6 font-semibold" />
                </button>

                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
            </div>
            <div
              class="grid grid-cols-4 gap-2 pt-4"
              v-if="
                formData.editImagesPreview.length != 0 &&
                imagesPreview.length == 0
              "
            >
              <div
                class="relative"
                v-for="(image, index) in formData.editImagesPreview"
                :key="index"
              >
                <button
                  @click.prevent="removeImageUpdateImage(formData.id, image.id)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-6 h-6 font-semibold" />
                </button>
                <img class="h-auto w-full rounded" :src="image.file" alt="" />
                <!-- <p>{{ image.file }}</p> -->
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-center items-center pt-4">
          <button
            class="text-xs px-3 py-1.5 border rounded-lg shadow border-[#FF6300] bg-[#FF6300] text-white"
            @click="updateAction"
          >
            Update Status
          </button>
        </div>
      </div>

      <div
        class="col-span-4 border h-[62vh] overflow-y-auto border-gray-200 p-3 rounded-lg"
      >
        <div class="flex justify-between items-center pb-4">
          <p class="text-lg font-medium text-[#FF613c]">Send Expense Email:</p>
          <div class="space-x-2 flex justify-end items-center gap-x-2">
            <button
              class="text-xs px-3 py-1.5 border rounded-lg border-gray-300 bg-transfer text-black"
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
        <div class="text-center" v-if="emailLoading">
          Email sending , Please wait loading .....
        </div>
        <div class="w-full mb-4 space-y-3 text-xs">
          <div class="space-y-4">
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
                class="bg-[#FF613c] px-1 py-1 text-white rounded-full text-xs"
                @click="addMailAction"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>

            <div>
              <input
                type="text"
                v-model="emailData.mail_subject"
                class="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-xs w-full"
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
                class="w-full h-[50px] border border-gray-200 border-dashed flex justify-center items-center rounded-lg text-[#FF613c] cursor-pointer"
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
                  class="rounded-lg w-full h-[130px] bg-gray-100 border border-dashed border-gray-200 object-cover"
                  alt=""
                />
              </div>
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
                class="rounded-lg w-full h-[100px] bg-gray-100 border border-dashed border-gray-200 object-cover"
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
                class="w-full h-[100px] border border-gray-200 text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed"
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
                class="rounded-lg w-full h-[175px] bg-gray-100 border border-dashed border-gray-200 object-cover"
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
              class="px-4 py-2 rounded-full text-xs inline-block bg-white border border-gray-200 text-[#FF613c]"
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
import { PlusCircleIcon, XCircleIcon } from "@heroicons/vue/24/solid";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { format } from "date-fns";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const showModal = ref(false);

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
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

const imagesPreview = ref([]);
const imagesInput = ref(null);
const openFileImagePicker = () => {
  imagesInput.value.click();
};

const formData = ref({
  images: [],
  editImagesPreview: [],
});

const handlerImagesFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
  console.log(imagesPreview.value);
};

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

const is_expense_email_sent = ref(false);

const reservation_ids = ref([]);

const updateAction = async () => {
  // Create form data for reservation update
  const frmData = new FormData();
  frmData.append("is_expense_email_sent", is_expense_email_sent.value ? 1 : 0);
  frmData.append("_method", "PUT");

  // Create separate form data for file uploads
  const secData = new FormData();
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      secData.append("files[]", file); // Fixed: Use files[] instead of files[i]
    }
  }

  // Store for responses
  let responses = [];

  // Loop through each reservation ID
  for (let a = 0; a < reservation_ids.value.length; a++) {
    try {
      // Update main reservation data
      const updateRes = await reservationStore.updateAction(
        frmData,
        reservation_ids.value[a]
      );
      responses.push(updateRes);

      // Only proceed with file upload if there are files
      if (formData.value.images.length > 0) {
        try {
          // Upload files for this reservation
          const uploadRes = await reservationStore.ReservationExpenseMailAction(
            reservation_ids.value[a],
            secData
          );
          responses.push(uploadRes);
        } catch (error) {
          console.error("File upload error:", error);
        }
      }
    } catch (error) {
      console.error("Reservation update error:", error);
    }
  }

  // Show success message if any operation was successful
  if (responses.length > 0) {
    toast.success("Update completed successfully");
  }

  // Refresh data after a short delay
  setTimeout(async () => {
    await props.getDetailAction(route.query.id, route.query.product_id);
  }, 1000);
};

const removeImageUpdateImage = async (id, imageID) => {
  try {
    const res = reservationStore.ReservationExpenseMailDeleteAction(
      id,
      imageID
    );
    console.log(res, "delete image res");
    toast.success("deleted image");
  } catch (error) {
    log.error(error, "delete image error");
  }
  setTimeout(async () => {
    await props.getDetailAction(route.query.id, route.query.product_id);
  }, 1000);
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
        frmData.append("email_type", "expense");
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
        if (res?.status) {
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

  is_expense_email_sent.value =
    props?.detail?.booking?.items[0].is_expense_email_sent == 1 ? true : false;

  for (let i = 0; i < props?.detail?.booking?.items.length; i++) {
    reservation_ids.value.push(props?.detail?.booking?.items[i].id);
  }
  console.log("====================================");
  console.log(reservation_ids.value);
  console.log("====================================");

  let detail = props?.detail?.booking;

  emailData.value.mail_body = `<p class="p1">Dear ${detail.items[0].product?.name},</p>
    <p class="p1">Please see our payment slip in the attached file for ${detail.crm_id}. </p><p class="p1">We would like to kindly request a confirmation letter as soon as possible. Please kindly issue a receipt with Tax ID and send it to us by email.</p>
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

    formData.value.editImagesPreview =
      props?.detail?.booking?.items[0]?.expense_mail ?? [];

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
