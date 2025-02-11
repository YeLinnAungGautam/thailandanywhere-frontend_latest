<template>
  <div>
    <div class="flex justify-between items-center">
      <!-- <p class="font-medium pb-2">Booking Request</p> -->
      <div class="space-x-2">
        <button
          class="text-xs px-4 py-2 border rounded-lg shadow border-gray-100/50 bg-gray-100/50 text-[#FF613c]"
          @click="cancelEmailFunction"
        >
          Clear Email
        </button>
        <button
          v-if="detail?.payment_status == 'fully_paid'"
          class="text-xs px-4 py-2 border rounded-lg shadow border-[#FF6300] bg-[#FF6300] text-white"
          @click="sendEmailFunction"
        >
          Send Email
        </button>
        <button
          v-if="detail?.payment_status != 'fully_paid'"
          class="text-xs px-4 py-2 border rounded-lg shadow border-[#FF6300] bg-transfer"
        >
          Send Email
        </button>
      </div>
    </div>
    <div>
      <div class="grid grid-cols-1 gap-4 py-4 overflow-hidden rounded-xl">
        <div class="text-center" v-if="emailLoading">
          Email sending , Please wait loading .....
        </div>
        <div class="w-full mb-4 space-y-3 text-xs">
          <div class="space-y-4">
            <div>
              <input
                type="email"
                v-model="emailData.mail_to"
                class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
                placeholder="Send to Email"
              />
            </div>

            <div>
              <input
                type="text"
                v-model="emailData.mail_subject"
                class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
                placeholder="Subject"
              />
            </div>

            <div class="flex justify-start items-center gap-2">
              <input
                type="checkbox"
                v-model="emailData.send_to_default"
                name=""
                id=""
                class="w-6 h-6 rounded-lg border border-gray-200 focus:outline-none"
              />
              <p class="text-xs">default email send ?</p>
            </div>
            <div class="">
              <QuillEditor
                ref="textEditor"
                :options="editorOptions"
                theme="snow"
                class="!bg-white/50 !border-1 !border-[#FF6300] !rounded-bl-md !rounded-br-md !shadow-sm !text-xs !text-gray-900 !h-[200px]"
                toolbar="essential"
                contentType="html"
                v-model:content="emailData.mail_body"
              />
            </div>
            <div class="space-y-2">
              <p class="text-[10px] text-[#FF6300]">
                Attachment Files must be under 25mb .
              </p>
              <input
                type="file"
                multiple
                @change="addAttracted"
                class="border px-4 py-2 border-gray-200 focus:outline-none rounded-lg text-xs w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const props = defineProps({
  detail: Object,
});

const cancelEmailFunction = () => {
  emailData.value = {
    mail_subject: "",
    mail_to: "",
    send_to_default: false,
    attachments: [],
  };
};

const emailLoading = ref(false);
const sendEmailFunction = async () => {
  Swal.fire({
    title: "Are you sure ?",
    text: `Send email to ${emailData.value.mail_to} `,
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
        frmData.append("mail_to", emailData.value.mail_to);
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
            send_to_default: false,
            attachments: [],
          };
          toast.success(res.data.message);
        }
      } catch (error) {
        emailLoading.value = false;
        toast.error(error.response.data.message);
      }
    }
  });
};

const emailData = ref({
  mail_subject: "",
  mail_to: "",
  send_to_default: false,
  mail_body: "",
  attachments: [],
});

const addAttracted = (e) => {
  for (let i = 0; i < e.target.files.length; i++) {
    emailData.value.attachments.push(e.target.files[i]);
    console.log(e.target.files[i], "this is att");
  }
};

const editorOptions = {
  placeholder: "Write an awesome mail here ...",
};

const mailBodyChange = () => {
  if (props?.detail?.product_type == "App\\Models\\EntranceTicket") {
    emailData.value.mail_body = `<p>Dear Reservation Manager<b> of ${props?.detail?.product?.name}</b>,</p><p>Greetings from Thailand Anywhere travel and tour.</p><p>We are pleased to book the tickets for our customers as per following description ka.</p>
      <p>Date :<b>${props?.detail?.service_date}</b></p><p>Ticket :<b>${props?.detail?.variation?.name}</b></p><p>Total :<b>${props?.detail?.quantity}</b></p><p>Name :<b>${props?.detail?.associated_customer[0]?.name}</b></p><p>Special Request :<b>${props?.detail?.special_request}</b></p>
      <p>Passport and payment slips are attached with this email .</p><b><em>Please kindly arrange and invoice & voucher for our clients accordingly .</em></b><p>Should there be anything more required you can call us at +66983498197 and LINE ID 58858380 .</p>`;
  } else if (props?.detail?.product_type == "App\\Models\\Hotel") {
    emailData.value.mail_body = `<p>Dear Reservation Manager<b> of ${
      props?.detail?.product?.name
    }</b>,</p><p>Greetings from Thailand Anywhere travel and tour. Good day to you ka.</p><p>We are pleased to book the room for our customers as per following description checks availability by phone.</p>
      <p>Check In :<strong>${
        props?.detail?.checkin_date
      }</strong></p><p>Check Out :<strong>${
      props?.detail?.checkout_date
    }</strong></p><p>Total :<strong>${
      props?.detail?.quantity
    } rooms & ${daysBetween(
      props?.detail?.checkin_date,
      props?.detail?.checkout_date
    )} nights</strong></p><p>Name :<strong>${
      props?.detail?.associated_customer[0]?.name
    } & ${
      props?.detail?.customer_passport.length
    } passports</strong></p><p>Room Type :<strong>${
      props?.detail?.room?.name
    }</strong></p><p>Special Request :<strong>${
      props?.detail?.special_request
    }</strong></p>
      <p>Passport and payment slips are attached with this email .</p><b><em>Please arrange the invoice and confirmation letter ka.</em></b><p>Should there be anything more required you can call us at +66983498197 and LINE ID 58858380 .</p>`;
  }
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
    console.log(formData.value.checkin_date, result, "this is result");
    return result;
  }
};

onMounted(() => {
  mailBodyChange();
});
</script>
