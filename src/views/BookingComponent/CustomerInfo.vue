<script setup>
import { storeToRefs } from "pinia";
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCustomerStore } from "../../stores/customer";
import debounce from "lodash/debounce";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/vue/24/outline";
import { useSidebarStore } from "../../stores/sidebar";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import CustomerCreate from "../../components/CustomerCreate.vue";

const props = defineProps({
  data: [Object, String],
});

const router = useRouter();
const sidebar = useSidebarStore();
const customerStore = useCustomerStore();
const emit = defineEmits(["checked"]);
const { customer, customers, loading } = storeToRefs(customerStore);
const { isOpenCustomerCreate } = storeToRefs(sidebar);

const search = ref("");

const checkValue = ref("");
const customerName = ref("");
const change = (id, name) => {
  if (checkValue.value != id) {
    checkValue.value = id;
    customerName.value = name;
    let data = {
      id: id,
      name: name,
    };
    emit("checked", data);
  } else {
    console.log("again");
  }
};

// const customerOpen = ref(false);
const customerOpenH = () => {
  sidebar.toggleCustomerCreate();
};
const customerClose = async () => {
  sidebar.toggleCustomerCreate();
  await customerStore.getSimpleListAction();
};

onMounted(async () => {
  // await customerStore.getListAction();
  if (customers?.value == null) {
    await customerStore.getListAction();
  }
  console.log(customer.value);
  checkValue.value = props.data.customer_id;
  customerName.value = props.data.customer_name;
});

watch(
  search,
  debounce(async (newValue) => {
    await customerStore.getListAction({ search: search.value });
  }, 500)
);
</script>

<template>
  <div>
    <div class="relative">
      <div class="flex justify-between items-center py-2">
        <h1
          class="sticky top-0 bg-white z-10 py-1 text-xs font-medium text-[#ff613c]"
        >
          Customer
        </h1>
        <div
          class="bg-[#ff613c] cursor-pointer px-1.5 text-white rounded-full"
          @click="customerOpenH"
        >
          +
        </div>
      </div>

      <div class="w-full space-y-2 pt-2">
        <!-- <p v-for="customer in customer?.data" :key="customer.id">
          {{ customer.name }}
        </p> -->
        <p
          class="flex justify-start items-center bg-white/80 rounded-lg px-4 py-2 text-xs"
        >
          <UserIcon class="w-4 h-4 mr-3" />
          {{ customerName }}
        </p>

        <div class="relative">
          <input
            type="text"
            v-model="search"
            name=""
            id=""
            class="w-full pr-4 pl-12 py-2 border border-gray-300 text-xs rounded-lg"
            placeholder="search customer"
          />
          <MagnifyingGlassIcon
            class="w-4 h-4 absolute text-[#ff613c] top-2 left-4"
          />
        </div>

        <div
          class="flex justify-start items-center gap-6 bg-white/50 px-4 py-2"
          v-for="customer in customer?.data"
          :key="customer.id"
        >
          <input
            type="checkbox"
            :name="customer.id"
            :id="customer.id"
            @change="change(customer.id, customer.name)"
            :checked="checkValue === customer.id"
          />
          <p class="text-xs">{{ customer.name }}</p>
        </div>
      </div>
    </div>
    <Modal :isOpen="isOpenCustomerCreate" @closeModal="customerClose">
      <DialogPanel
        class="w-full max-w-[600px] transform overflow-hidden rounded-lg bg-white pt-4 text-left align-middle shadow-xl transition-all"
      >
        <CustomerCreate action="sales" />
        <!-- <div class="flex items-center justify-end">
          <button @click="customerClose" class="text-sm">close</button>
        </div> -->
      </DialogPanel>
    </Modal>
  </div>
</template>
