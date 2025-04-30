<template>
  <div>
    <div class="">
      <div class="text-2xl font-bold">
        Amend Mail
        {{
          detail?.booking_item?.payment_status == "not_paid"
            ? "no need to sent mail"
            : "need to sent mail"
        }}
      </div>
      <div class="grid grid-cols-3 gap-4 pt-4">
        <div class="border border-gray-200 rounded-lg">
          <div class="">
            <div class="">
              <div class="flex justify-start flex-col items-center gap-x-3 p-4">
                <select
                  name=""
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
                  id=""
                  v-model="amend_mail_sent"
                >
                  <option value="">Select</option>
                  <option :value="true">Mail Sent</option>
                  <option :value="false">Mail Not Sent</option>
                </select>
                <button
                  class="bg-[#ff613c] text-white w-full mt-4 rounded-lg px-4 py-2 text-sm"
                  @click="updateAmendAction()"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-span-2 border border-gray-200 p-3 h-[57vh] overflow-y-auto rounded-lg"
        >
          <div class="flex justify-between items-center">
            <p class="text-lg font-medium text-[#FF613c]">
              Send Booking Request:
            </p>
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
          <div class="grid grid-cols-1 gap-4 py-4 overflow-hidden rounded-xl">
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
                    class="!bg-white/50 !border-1 !border-gray-200 !rounded-bl-md !rounded-br-md !text-xs !text-gray-900 !h-[300px]"
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
              <div class="p-4 space-y-2">
                <p class="pb-4 text-sm font-medium">Passports</p>
                <div
                  class="grid grid-cols-5 gap-2"
                  v-for="a in editData.reservation_ids ?? []"
                  :key="a"
                >
                  <div
                    class="w-full h-auto relative"
                    v-for="i in editData.customer_passport_have ?? []"
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
                      <p
                        class="text-[10px] flex justify-start items-center py-4"
                      >
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import { useAmendStore } from "../../stores/amend";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import { PlusIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { format } from "date-fns";
import { useReservationStore } from "../../stores/reservation";

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const amendStore = useAmendStore();
const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();
const showModal = ref(false);

const amend_mail_sent = ref(false);

const updateAmendAction = async () => {
  const frmData = new FormData();
  frmData.append("amend_mail_sent", amend_mail_sent.value ? 1 : 0);
  frmData.append("_method", "PUT");
  const res = await amendStore.updateAction(frmData, props.detail.id);
  //   props.getDetailAction();
  if (res.status) {
    toast.success("Amend Request Updated Successfully");
    props.getDetailAction(route.query.id);
  } else {
    toast.error("Amend Request Update Failed");
  }
};

const featureImageInput = ref(null);
const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const is_booking_request = ref(false);
const reservation_ids = ref([]);

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
    mail_to: "",
    mail_to_array: [],
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
        frmData.append("email_type", "booking");
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
        console.log(res, "this is email res");

        if (res?.status == "Request was successful.") {
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
  // console.log(props?.detail?.customer_passports, "customer_passports");

  // Determine if this is a hotel or ticket (entrance ticket)

  emailData.value.mail_subject = `Amend for ${showFormat(
    props?.detail?.booking_item?.service_date
  )}: ${props?.detail?.booking_item?.crm_id}`;

  is_booking_request.value =
    props?.detail?.booking_item.is_booking_request == 1 ? true : false;

  console.log("====================================");
  console.log(reservation_ids.value);
  console.log("====================================");

  // let detail = props?.detail?.booking;

  // Create a different template based on product type
  // Template for Entrance Tickets
  emailData.value.mail_body = `
    <p class="p1">Dear ${props?.detail.booking_item?.product?.name},</p>
    <p><strong>Greetings from ThAnywhere Co., Ltd.</strong></p>
    <p>We would like to book the accommodation as per the following description. Please note the booking is already checked and confirmed by phone.</p>
    
    <p>Passports for the bookings are attached in the email. Please arrange for the customer accordingly.</p>
    <p>Payment transaction will be done soon. Once the payment is received, Please kindly issue receipt with tax ID and send to us by post or mail.</p>
    <p><strong>Tax ID:</strong> 0105565081822<br> 
<strong>TH ANYWHERE CO.LTD.</strong><br> 
<strong>Invoice Date:</strong> ${format(new Date(), "dd/MM/yyyy")}</p>
    <p>If you may have any questions or concerns, please feel free to call us at <strong>0950423254</strong> LINE ID <strong>0983498197</strong>.</p>
    <p>Thank you,</p>
    <p><strong>Negyi @ Sunshine</strong> (Reservation Manager)</p>
    <p>143/51, Thepprasit Rd, Pattaya City, Bang Lamung District, Chon Buri 20150</p>
    `;
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
  if (dateStr) {
    return format(new Date(dateStr), "dd MMMM, YYY");
  } else {
    return "";
  }
};

const cancelAction = () => {
  emailData.value.attachments = [];
  previewFile.value = [];
  showModal.value = false;
};

const editData = ref({
  reservation_ids: [],
  customer_passport_have: [],
});

onMounted(() => {
  mailBodyChange();

  if (props?.detail) {
    amend_mail_sent.value = props.detail.amend_mail_sent;

    emailData.value.mail_to_array =
      props.detail?.booking?.items?.product?.email || [];

    if (props.detail?.booking_item?.receipt_images.length > 0) {
      for (
        let a = 0;
        a < props.detail?.booking_item?.receipt_images.length;
        a++
      ) {
        editData.value.customer_passport_have.push({
          id: props.detail?.booking_item?.receipt_images[a].id,
          reservation_id: props.detail?.booking_item?.id,
          crm_id: props.detail?.booking_item?.crm_id,

          file: props.detail?.booking_item?.receipt_images[a].file,
        });
      }
    }
  }
});
</script>
