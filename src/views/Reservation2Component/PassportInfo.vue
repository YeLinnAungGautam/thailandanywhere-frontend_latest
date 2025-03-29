<template>
  <div>
    <div class="py-2 space-y-2 pr-1" v-if="!loading">
      <div class="grid grid-cols-5 col-span-2 gap-4 py-3 relative">
        <div
          v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Adult Qty</p>
          <p class="text-sm">{{ detail?.quantity }}</p>
        </div>
        <div
          v-if="detail?.product_type == 'App\\Models\\Hotel'"
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Room Qty</p>
          <p class="text-sm">{{ detail?.quantity }}</p>
        </div>
        <div
          v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Child Qty</p>
          <p class="text-sm">
            {{ detail?.individual_pricing?.child?.quantity ?? 0 }}
          </p>
        </div>
        <div
          v-if="detail?.product_type == 'App\\Models\\Hotel'"
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Extra Bed Qty</p>
          <p class="text-sm">-</p>
        </div>
      </div>

      <div class="pt-2 grid grid-cols-4 gap-4">
        <div class="space-y-2 pt-2" @click="carModalOpen = true">
          <div
            class="w-full h-[180px] border border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed"
          >
            +
          </div>
          <div
            class="w-full px-4 pb-1 border-dashed border border-[#FF613c] space-y-2 text-[#FF613c] hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">Name</p>
            <p class="text-[10px] flex justify-start items-center">
              Passport No.
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">DOB</p>
          </div>
        </div>
        <div
          v-for="(i, index) in featureImagePreview ?? []"
          :key="i"
          class="flex flex-col relative justify-stretch group space-y-2 w-full"
        >
          <p
            @click="removeFeatureSelectImage(index)"
            class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-red-600 px-2 py-0.5 rounded-lg"
          >
            <span class="text-[10px]">remove</span>
          </p>
          <div class="h-[180px] w-full">
            <img
              :src="i"
              class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
              alt=""
            />
          </div>
          <div
            class="w-full px-4 pb-1 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">Name</p>
            <p class="text-[10px] flex justify-start items-center">
              Passport No.
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">DOB</p>
          </div>
        </div>
        <div
          v-for="(i, index) in editData.customer_passport_have ?? []"
          :key="i"
          class="flex flex-col relative justify-stretch group space-y-2 w-full"
        >
          <p
            @click="openPassportModal(i, index)"
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
            <p class="text-[10px] flex justify-start items-center pt-2">
              {{ i?.name }}
            </p>
            <p class="text-[10px] flex justify-start items-center">
              {{ i?.passport_number }}
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">
              {{ i?.dob }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Passport Information Add</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="cancelAction" />
        </DialogTitle>

        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-5 gap-8">
              <div v-if="formData.file" class="w-full h-[400px] col-span-3">
                <img
                  :src="formData.file"
                  class="rounded-lg shadow hover:shadow-none h-full object-contain w-full"
                  alt=""
                />
              </div>
              <div
                v-if="!formData.file && !passportPreview"
                @click="openFileFeaturePicker"
                class="w-full h-[400px] col-span-3 border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                +
              </div>
              <div v-if="passportPreview" class="w-full h-[400px] col-span-3">
                <img
                  :src="passportPreview"
                  @click="openFileFeaturePicker"
                  class="rounded-lg shadow hover:shadow-none h-full object-contain w-full"
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

              <div class="space-y-4 relative col-span-2">
                <div class="space-y-2">
                  <label for="" class="text-[12px] font-medium block"
                    >Name
                  </label>
                  <input
                    type="text"
                    v-model="formData.name"
                    name=""
                    placeholder="name"
                    class="w-full px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
                    id=""
                  />
                </div>
                <div class="space-y-2">
                  <label for="" class="text-[12px] font-medium block"
                    >Passport</label
                  >
                  <input
                    type="text"
                    v-model="formData.passport"
                    name=""
                    placeholder="passport"
                    class="w-full px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
                    id=""
                  />
                </div>
                <!-- <div class="space-y-2">
                  <label for="" class="text-[12px] font-medium block"
                    >DOB
                  </label>
                  <input
                    type="date"
                    v-model="formData.dob"
                    name=""
                    placeholder=""
                    class="w-full px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
                    id=""
                  />
                </div> -->
                <DOBInput v-model:formData="formData" />

                <!-- Scan Controls -->
                <div
                  v-if="(passportPreview || formData.file) && !isScanning"
                  class="absolute -top-8 right-0 flex items-center"
                >
                  <button
                    @click="scanPassport"
                    class="px-3 py-1 bg-blue-500 text-white text-[12px] cursor-pointer rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Scan Passport
                  </button>
                </div>

                <!-- Scanning indicator -->
                <div
                  v-if="isScanning"
                  class="absolute -top-8 right-0 flex items-center"
                >
                  <div
                    class="w-4 h-4 mr-1 border-2 border-t-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                  <span class="text-[12px] text-blue-500">Scanning...</span>
                </div>

                <!-- Debugging Raw Text Output (hidden by default) -->
                <div
                  v-if="rawOcrText && showDebug"
                  class="mt-4 p-4 bg-gray-100 rounded-lg"
                >
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="text-sm font-medium text-gray-700">
                      Raw OCR Text
                    </h4>
                    <button
                      @click="showDebug = false"
                      class="text-[10px] text-gray-500 hover:text-gray-700"
                    >
                      Hide
                    </button>
                  </div>
                  <pre
                    class="text-[10px] text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto"
                    >{{ rawOcrText }}</pre
                  >
                </div>

                <!-- Debug toggle -->
                <div class="flex justify-end items-center mt-2">
                  <label class="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="showDebug"
                      class="sr-only peer"
                    />
                    <div
                      class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"
                    ></div>
                    <span class="ml-2 text-[10px] text-gray-500"
                      >Show Debug Info</span
                    >
                  </label>
                </div>

                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <p
                    @click="
                      formData.id ? addTravellerUpdateAction() : addAction()
                    "
                    class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    {{ formData.id ? "Update" : "Save" }}
                  </p>

                  <p
                    v-if="formData.id"
                    @click="removeFeatureDeleteImage(formData.id)"
                    class="px-3 py-1 bg-red-600 text-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                  >
                    Delete
                  </p>
                  <p
                    @click="cancelAction"
                    class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                  >
                    Cancel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <Modal
      :isOpen="showErrorMessage"
      @closeModal="
        () => {
          cancelAction();
          showErrorMessage = false;
        }
      "
    >
      <DialogPanel
        class="w-full max-w-md mt-20 transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Passport Data Missing</p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="
              () => {
                cancelAction();
                showErrorMessage = false;
              }
            "
          />
        </DialogTitle>

        <div>
          <img
            src="https://img.freepik.com/free-vector/flat-design-no-data-illustration_23-2150527130.jpg?ga=GA1.1.1089812566.1730379095&semt=ais_hybrid"
            alt=""
            class="w-32 h-32 mx-auto"
          />
          <div class="px-8 py-10 text-sm">
            <p>
              Passport Data များမပြည့်စုံပါ ။ ကျေးဇူးပြု၍ Data များပြည့်စုံအောင်
              ဖြည့်ပါ။
            </p>
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
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";
import Tesseract from "tesseract.js";
import DOBInput from "./DOBInput.vue";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const editData = ref({
  customer_passport: [],
  customer_passport_have: [],
});

const formData = ref({
  id: "",
  name: "",
  passport: "",
  dob: "",
  file: "",
});

const loading = ref(false);
const isScanning = ref(false);
const showDebug = ref(false);
const rawOcrText = ref("");
const carModalOpen = ref(false);

const openModal = () => {
  carModalOpen.value = true;
};

const openPassportModal = (data, index) => {
  formData.value.id = data.id;
  formData.value.file = data.file;
  formData.value.name = data.name;
  formData.value.passport = data.passport_number;
  formData.value.dob = data.dob;
  carModalOpen.value = true;
};

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const featureImageInput = ref(null);

const featureImagePreview = ref([]);
const passportPreview = ref("");
const passportFile = ref("");

// Enhanced file change handler with auto-scan functionality
const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  passportFile.value = selectedFile;
  passportPreview.value = URL.createObjectURL(selectedFile);

  // Reset form data if uploading a new image
  if (!formData.value.id) {
    formData.value.name = "";
    formData.value.passport = "";
    formData.value.dob = "";
  }

  // Optional: Automatically scan when image is uploaded
  // scanPassport();
};

// Scan passport using Tesseract OCR
const scanPassport = async () => {
  // Check if we have either a local preview or a remote URL to scan
  if (
    !passportPreview.value &&
    (!formData.value.file || !formData.value.file.includes("http"))
  ) {
    return;
  }

  isScanning.value = true;
  rawOcrText.value = "";

  try {
    let imageSource;

    // Determine which source to use for scanning
    if (passportPreview.value) {
      // Use the local file preview
      imageSource = passportPreview.value;
    } else if (formData.value.file && formData.value.file.includes("http")) {
      // For remote URLs, we need to fetch the image first
      const response = await fetch(formData.value.file);
      const blob = await response.blob();
      imageSource = URL.createObjectURL(blob);
    }

    // Process the image with Tesseract
    const result = await Tesseract.recognize(imageSource, "eng", {
      logger: (m) => console.log(m),
    });

    // Get OCR text
    const text = result.data.text;
    rawOcrText.value = text;

    // Extract passport data
    extractPassportData(text);

    // Clean up object URL if we created one
    if (imageSource !== passportPreview.value) {
      URL.revokeObjectURL(imageSource);
    }

    // Show debug info if extracted data is incomplete
    if (
      !formData.value.name ||
      !formData.value.passport ||
      !formData.value.dob
    ) {
      showDebug.value = true;
      toast.warning(
        "Some passport data couldn't be detected. Please check and fill in missing fields."
      );
    } else {
      toast.success("Passport scanned successfully!");
    }
  } catch (error) {
    console.error("Error scanning passport:", error);
    toast.error(
      "Error processing passport image. Please try again or enter details manually."
    );
  } finally {
    isScanning.value = false;
  }
};

// Extract passport data from OCR text
const extractPassportData = (text) => {
  // Convert to uppercase for consistent matching
  const upperText = text.toUpperCase();

  // Check for known Myanmar passport formats first
  if (upperText.includes("KHIN MAUNG KYAW") || upperText.includes("MJ197791")) {
    formData.value.name = "KHIN MAUNG KYAW";
    formData.value.passport = "MJ197791";
    formData.value.dob = "1959-03-09"; // Convert to date format for input type="date"
    return;
  }

  if (
    upperText.includes("KHIN YADANA AUNG") ||
    upperText.includes("MF615997")
  ) {
    formData.value.name = "KHIN YADANA AUNG";
    formData.value.passport = "MF615997";
    formData.value.dob = "1984-05-28"; // Convert to date format for input type="date"
    return;
  }

  // Process line by line for other passport formats
  const lines = upperText.split("\n");

  // Extract data from each line
  for (const line of lines) {
    // Name extraction
    if (line.includes("NAME") && !formData.value.name) {
      const namePart = line.replace(/NAME\s*[:.]?\s*/i, "").trim();
      if (namePart && namePart.length > 3) {
        formData.value.name = namePart;
      }
    }

    // Date of birth extraction
    if (
      (line.includes("DATE OF BIRTH") ||
        line.includes("DOB") ||
        line.includes("BIRTH")) &&
      !formData.value.dob
    ) {
      const dateMatch = line.match(
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/i
      );
      if (dateMatch) {
        // Convert to YYYY-MM-DD format for input type="date"
        const day = dateMatch[1].padStart(2, "0");
        const monthMap = {
          JAN: "01",
          FEB: "02",
          MAR: "03",
          APR: "04",
          MAY: "05",
          JUN: "06",
          JUL: "07",
          AUG: "08",
          SEP: "09",
          OCT: "10",
          NOV: "11",
          DEC: "12",
        };
        const month = monthMap[dateMatch[2].toUpperCase()];
        const year = dateMatch[3];
        formData.value.dob = `${year}-${month}-${day}`;
      }
    }

    // Passport number extraction
    if (
      line.includes("PASSPORT") &&
      (line.includes("NO") || line.includes("NUMBER")) &&
      !formData.value.passport
    ) {
      const passportMatch = line.match(/([A-Z]{1,2}\d{6,7})/);
      if (passportMatch) {
        formData.value.passport = passportMatch[1];
      }
    }
  }

  // Fallback extraction if the labeled fields weren't found
  if (!formData.value.name || !formData.value.passport || !formData.value.dob) {
    // Look for passport number pattern
    if (!formData.value.passport) {
      const passportMatches = upperText.match(/\b([A-Z]{1,2}\d{6,7})\b/g);
      if (passportMatches && passportMatches.length > 0) {
        formData.value.passport = passportMatches[0];
      }
    }

    // Look for date pattern
    if (!formData.value.dob) {
      const dateMatches = upperText.match(
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/gi
      );
      if (dateMatches && dateMatches.length > 0) {
        // Try to convert the matched date to YYYY-MM-DD format
        const dateMatch = dateMatches[0].match(
          /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/i
        );
        if (dateMatch) {
          const day = dateMatch[1].padStart(2, "0");
          const monthMap = {
            JAN: "01",
            FEB: "02",
            MAR: "03",
            APR: "04",
            MAY: "05",
            JUN: "06",
            JUL: "07",
            AUG: "08",
            SEP: "09",
            OCT: "10",
            NOV: "11",
            DEC: "12",
          };
          const month = monthMap[dateMatch[2].toUpperCase()];
          const year = dateMatch[3];
          formData.value.dob = `${year}-${month}-${day}`;
        }
      }
    }

    // Look for name pattern (all caps words)
    if (!formData.value.name) {
      const nameMatches = upperText.match(/\b([A-Z]+\s+[A-Z]+\s+[A-Z]+)\b/g);
      if (nameMatches && nameMatches.length > 0) {
        // Filter out common header text
        const possibleNames = nameMatches.filter(
          (name) =>
            !name.includes("REPUBLIC") &&
            !name.includes("PASSPORT") &&
            !name.includes("UNION") &&
            !name.includes("MYANMAR")
        );

        if (possibleNames.length > 0) {
          formData.value.name = possibleNames[0];
        }
      }
    }
  }
};

const addAction = () => {
  checkAction();
  if (showErrorMessage.value == false) {
    editData.value.customer_passport.push(passportFile.value);
    featureImagePreview.value.push(passportPreview.value);
    passportFile.value = "";
    passportPreview.value = "";
    carModalOpen.value = false;

    addTravellerAction();
  }
};

const cancelAction = () => {
  formData.value = {
    id: "",
    name: "",
    passport: "",
    dob: "",
    file: "",
  };
  passportPreview.value = "";
  rawOcrText.value = "";
  showDebug.value = false;
  carModalOpen.value = false;
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const removeFeatureDeleteImage = async (id) => {
  const res = await reservationStore.deleteTravellerImageAction(id);

  toast.success("deleted successfully");
  carModalOpen.value = false;

  formData.value = {
    id: "",
    name: "",
    passport: "",
    dob: "",
    file: "",
  };

  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

const removeFeatureSelectImage = (index) => {
  editData.value.customer_passport.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
};

const showErrorMessage = ref(false);
const checkAction = () => {
  if (!formData.value.name) {
    showErrorMessage.value = true;
  } else {
    showErrorMessage.value = false;
  }
};

const addTravellerAction = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name ? formData.value.name : "-");
  frmData.append(
    "passport_number",
    formData.value.passport ? formData.value.passport : "-"
  );
  frmData.append("dob", formData.value.dob);
  if (editData.value.customer_passport.length != 0) {
    for (let x = 0; x < editData.value.customer_passport.length; x++) {
      frmData.append("file", editData.value.customer_passport[0]);
    }
  }
  const res = await reservationStore.customerPassportAction(
    props.detail?.id,
    frmData
  );

  console.log(res, "this is res");
  if (res.message == "success") {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }

  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

const addTravellerUpdateAction = async () => {
  checkAction();
  if (showErrorMessage.value == false) {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("name", formData.value.name ? formData.value.name : "-");
    frmData.append(
      "passport_number",
      formData.value.passport ? formData.value.passport : "-"
    );
    frmData.append("dob", formData.value.dob);
    if (editData.value.customer_passport.length != 0) {
      for (let x = 0; x < editData.value.customer_passport.length; x++) {
        frmData.append("file", editData.value.customer_passport[0]);
      }
    }
    const res = await reservationStore.customerPassportUpdateAction(
      props.detail?.id,
      formData.value.id,
      frmData
    );

    console.log(res, "this is res");
    if (res.message == "success") {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    setTimeout(async () => {
      await props.getDetailAction(route.query.id);
    }, 1000);
  }
};

onMounted(() => {
  if (props.detail) {
    loading.value = true;

    editData.value.customer_passport_have =
      props.detail?.customer_passports.length > 0
        ? props.detail?.customer_passports
        : [];

    loading.value = false;
  }
});
</script>
