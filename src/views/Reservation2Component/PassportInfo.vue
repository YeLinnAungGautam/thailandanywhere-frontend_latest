<template>
  <div>
    <div class="py-2 space-y-2 pr-1" v-if="!loading">
      <div class="grid grid-cols-5 col-span-2 gap-4 py-3 relative">
        <!-- <p
          class="bg-[#FF613c] text-white px-1.5 inline-block absolute top-3 right-3 cursor-pointer rounded-full"
          @click="openFileFeaturePicker"
        >
          +
        </p> -->
        <div
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Adult Qty</p>
          <p class="text-sm">2</p>
        </div>
        <div
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Child Qty</p>
          <p class="text-sm">1</p>
        </div>
      </div>

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
            <p class="text-[12px] flex justify-start items-center pt-2">
              <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
              Name
            </p>
            <p class="text-[12px] flex justify-start items-center">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              Passport No.
            </p>
            <p class="text-[12px] flex justify-start items-center">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              DOB
            </p>
          </div>
        </div>
        <div
          v-for="i in editData.customer_passport_have ?? []"
          :key="i"
          class="flex flex-col relative justify-stretch group space-y-2 w-[160px]"
        >
          <p
            @click="openModal(i)"
            class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] px-2 py-0.5 rounded-lg"
          >
            <span class="text-[10px]">edit</span>
          </p>
          <div class="h-[180px] w-full">
            <img
              :src="i?.file"
              class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
              alt=""
            />
          </div>
          <div
            class="w-full px-4 pb-1 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
          >
            <p class="text-[12px] flex justify-start items-center pt-2">
              <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
              Name
            </p>
            <p class="text-[12px] flex justify-start items-center">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              Passport No.
            </p>
            <p class="text-[12px] flex justify-start items-center">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              DOB
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
          <p>Passport Infomation Add</p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="carModalOpen = false"
          />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500">Full Name</label>
              <input
                type="text"
                v-model="editData.name"
                name=""
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Passport or ID Number</label
              >
              <input
                type="text"
                v-model="editData.passport"
                name=""
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Phone Number</label
              >
              <input
                type="text"
                v-model="editData.phone"
                name=""
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500">Email</label>
              <input
                type="text"
                v-model="editData.email"
                name=""
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1 col-span-2">
              <label for="" class="text-[12px] text-gray-500"
                >Customer Passports</label
              >
              <input
                type="file"
                ref="featureImageInput"
                multiple
                class="hidden"
                @change="handlerFeatureFileChange"
                accept="image/*"
              />
            </div>
            <label
              for=""
              class="text-[12px] text-gray-500"
              v-if="featureImagePreview.length > 0"
              >Preveiw Passports</label
            >
            <div class="grid grid-cols-4 col-span-2 gap-3 mt-4">
              <div
                class="relative"
                v-for="(image, index) in featureImagePreview"
                :key="index"
              >
                <button
                  @click.prevent="removeFeatureSelectImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>

                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
            </div>
            <div class="grid grid-cols-4 col-span-2 gap-3 mt-4">
              <div
                class="relative"
                v-for="(image, index) in editData.customer_passport_have"
                :key="index"
              >
                <button
                  @click.prevent="removeFeatureDeleteImage(index, image.id)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>
                <img class="h-auto w-full rounded" :src="image.file" alt="" />
              </div>
            </div>
          </div>
          <div class="flex justify-end items-center gap-x-2 pt-2">
            <button
              @click="addTravellerAction"
              class="bg-[#ff613c] text-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
            >
              Add Traveller
            </button>
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

const reservationStore = useReservationStore();
const toast = useToast();

const editData = ref({
  name: "",
  passport: "",
  phone: "",
  email: "",
  customer_passport: [],
  customer_passport_have: [],
});

const loading = ref(false);

const carModalOpen = ref(false);

const openModal = () => {
  carModalOpen.value = true;
};

const props = defineProps({
  closeTravellerModal: Function,
  data: Object,
});

const featureImageInput = ref(null);

const featureImagePreview = ref([]);
const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files;

  for (let index = 0; index < selectedFile.length; index++) {
    editData.value.customer_passport.push(selectedFile[index]);
    featureImagePreview.value.push(URL.createObjectURL(selectedFile[index]));
  }
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const removeFeatureDeleteImage = async (index, id) => {
  const res = await reservationStore.deleteTravellerImageAction(id);
  if (res) {
    editData.value.customer_passport_have.splice(index, 1);
    // featureImagePreview.value.splice(index, 1);
  }
  // console.log(editData.value.customer_passport, "this is remove");
};

const removeFeatureSelectImage = (index) => {
  editData.value.customer_passport.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  // console.log(editData.value.customer_passport, "this is remove");
};

const addTravellerAction = async () => {
  const frmData = new FormData();
  frmData.append("name", editData.value.name ? editData.value.name : "-");
  frmData.append(
    "passport",
    editData.value.passport ? editData.value.passport : "-"
  );
  frmData.append("phone", editData.value.phone ? editData.value.phone : "09");
  editData.value.email && frmData.append("email", editData.value.email);
  if (editData.value.customer_passport.length != 0) {
    for (let x = 0; x < editData.value.customer_passport.length; x++) {
      frmData.append(
        "customer_passport[" + x + "]",
        editData.value.customer_passport[x]
      );
    }
  }
  const res = await reservationStore.updateTravellerAction(
    frmData,
    props.data?.id
  );

  console.log(res, "this is res");
  if (res.message == "success") {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
  // props.closeTravellerModal();
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

onMounted(() => {
  if (props.data) {
    loading.value = true;
    editData.value.name =
      props.data?.associated_customer.length > 0
        ? props.data?.associated_customer[0]?.name
        : "";
    editData.value.passport =
      props.data?.associated_customer.length > 0
        ? props.data?.associated_customer[0]?.passport
        : "";
    editData.value.phone =
      props.data?.associated_customer.length > 0
        ? props.data?.associated_customer[0]?.phone
        : "";
    editData.value.email =
      props.data?.associated_customer.length > 0
        ? props.data?.associated_customer[0]?.email
        : "";
    editData.value.customer_passport_have =
      props.data?.customer_passports.length > 0
        ? props.data?.customer_passports
        : [];

    loading.value = false;
  }
});
</script>
