<template>
  <div>
    <div class="py-2 space-y-2 pr-1" v-if="!loading">
      <div class="flex justify-between items-center"></div>

      <div class="pt-2 grid grid-cols-4 gap-x-4">
        <div class="space-y-2 pt-2" @click="carModalOpen = true">
          <div
            class="w-full h-[180px] border border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed"
          >
            +
          </div>
          <div
            class="w-full px-4 pb-1 border-dashed border border-[#FF613c] space-y-2 text-[#FF613c] hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">
              <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
              Invoice Date
            </p>
            <p class="text-[10px] flex justify-start items-center">
              <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
              Company Name
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              Invoice Amount
            </p>
          </div>
        </div>
        <div
          v-for="image in detail?.booking_confirm_letters"
          :key="image"
          class="flex flex-col relative justify-stretch group space-y-2 w-full"
        >
          <p
            @click="openPassportModal(image)"
            class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] px-2 py-0.5 rounded-lg"
          >
            <span class="text-[10px]">edit</span>
          </p>
          <div class="h-[180px] w-full">
            <img
              :src="image.file"
              class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
              alt=""
            />
          </div>
          <div
            class="w-full px-4 pb-1 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">
              <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
              Invoice Date
            </p>
            <p class="text-[10px] flex justify-start items-center">
              <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
              Company Name
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              Invoice Amount
            </p>
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Invoice Update</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="closeAction" />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-8">
              <div
                v-if="!featureImagePreview"
                class="w-[200px] h-[250px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
                @click="openFileFeaturePicker"
              >
                +
              </div>
              <div v-if="featureImagePreview" class="w-[200px] h-[250px]">
                <img
                  :src="featureImagePreview"
                  class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
                  alt=""
                />
              </div>
              <input
                type="file"
                ref="featureImageInput"
                class="hidden"
                @change="handlerFeatureFileChange"
                accept="image/*"
              />
              <div class="space-y-4 relative pt-4">
                <div class="space-x-6">
                  <label for="" class="text-[12px] font-medium">Amount</label>
                  <input
                    type="number"
                    name=""
                    placeholder="xxxx"
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="space-x-6">
                  <label for="" class="text-[12px] font-medium"
                    >Date <span class="opacity-0">.....</span></label
                  >
                  <input
                    type="date"
                    name=""
                    placeholder=""
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="space-x-2.5">
                  <label for="" class="text-[12px] font-medium">Company</label>
                  <input
                    type="text"
                    name=""
                    placeholder=""
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="space-x-6 flex justify-start">
                  <label for="" class="text-[12px] font-medium"
                    >Bank ? <span class="opacity-0">..</span></label
                  >
                  <div class="flex justify-start items-center space-x-2">
                    <input
                      type="checkbox"
                      name=""
                      placeholder="name"
                      class="py-1.5 focus:outline-none text-xs"
                      id=""
                    />
                    <p class="text-[12px]">Is Corporate ?</p>
                  </div>
                </div>

                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <p
                    v-if="edit == null"
                    @click="addInvoiceAction"
                    class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Save
                  </p>
                  <p
                    v-if="edit != null"
                    @click="deleteAction(edit.id)"
                    class="px-3 py-1 bg-red-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Delete
                  </p>
                  <p
                    @click="closeAction"
                    class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                  >
                    Close
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import invoice from "../../assets/invoice_exp.jpg";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const editData = ref({
  car_photo: null,
});

const loading = ref(false);

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const carModalOpen = ref(false);

const featureImageInput = ref(null);

const featureImagePreview = ref(null);
const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  editData.value.car_photo = e.target.files[0];
  featureImagePreview.value = URL.createObjectURL(selectedFile);
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const closeAction = async () => {
  editData.value.car_photo = null;
  featureImagePreview.value = null;
  carModalOpen.value = false;
  edit.value = null;
};

const deleteAction = async (id) => {
  const res = await reservationStore.deleteConfirmationLetterAction(id);
  editData.value.car_photo = null;
  featureImagePreview.value = null;
  carModalOpen.value = false;
  toast.success("delete successfully");
  edit.value = null;

  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

const edit = ref(null);

const openPassportModal = (data) => {
  // open passport modal
  featureImagePreview.value = data.file;
  edit.value = data;
  carModalOpen.value = true;
};

const addInvoiceAction = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");

  if (
    props.detail?.product_type == "App\\Models\\EntranceTicket" ||
    props.detail?.product_type == "App\\Models\\Hotel"
  ) {
    frmData.append("booking_confirm_letter", editData.value.car_photo);
  }

  const res = await reservationStore.updateInfoAction(
    frmData,
    props.detail?.id
  );

  console.log(res, "this is res");

  toast.success(res.message);

  // props.closeTravellerModal();
  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

onMounted(() => {
  if (props.data) {
    loading.value = true;
    loading.value = false;
  }
});
</script>
