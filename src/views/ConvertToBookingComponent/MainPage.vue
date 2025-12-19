<template>
  <div>
    <Navigation v-model="activeTab" />

    <div class="py-4">
      <div v-if="activeTab == 0">
        <ChooseUser :confirmUser="confirmUser" :selectedRows="selectedRows" />
      </div>

      <div v-if="activeTab == 1">
        <FillData :fillData="fillData" :selectedRows="selectedRows" />
      </div>
      <div v-if="activeTab == 2">
        <ConfirmItem
          :confirmItem="confirmItem"
          :cancel="cancel"
          :selectedRows="selectedRows"
        />
      </div>
      <div v-if="activeTab == 3">
        <Success :response="responseData" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navigation from "./Navigation.vue";
import ChooseUser from "./ChooseUser.vue";
import ConfirmItem from "./ConfirmItem.vue";
import FillData from "./FillData.vue";
import Success from "./Success.vue";
import { useCustomerStore } from "../../stores/customer";
import { useBookingStore } from "../../stores/booking";
import { useToast } from "vue-toastification";
import { useAvailableStore } from "../../stores/available";

const activeTab = ref(0);
const customerStore = useCustomerStore();
const bookingStore = useBookingStore();
const availableStore = useAvailableStore();
const toast = useToast();

const props = defineProps({
  selectedRows: Array,
  cancel: Function,
});

const formData = ref({
  payment_notes: "",
  customer_id: "",
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  is_corporate: "",
  sold_from: "",
  payment_method: "",
  bank_name: "",
  payment_status: "not_paid", // Set default
  booking_date: "",
  payment_currency: "",
  items: [],
  item_availables: [],
  money_exchange_rate: "",
  discount: "0",
  comment: "",
  due_date: "",
  deposit: 0,
  balance_due_date: "",
  sub_total: 0,
  grand_total: 0,
});

const status = ref({
  user: false,
  item: false,
  fill: false,
});

const confirmUser = (message) => {
  console.log(message);
  status.value.user = true;
  activeTab.value = 1;
  formData.value.customer_name = message.name;
  formData.value.customer_phone = message.phone;
  formData.value.sold_from = message.soldFrom;
};

const fillData = (message) => {
  console.log(message);
  formData.value.booking_date = new Date().toISOString().slice(0, 10);
  formData.value.bank_name = message.bank_name;
  formData.value.payment_method = message.payment_method;
  formData.value.payment_currency = message.payment_currency;
  formData.value.money_exchange_rate = message.money_exchange_rate;
  status.value.fill = true;
  activeTab.value = 2;
};

const changeStatus = async () => {
  try {
    // Extract IDs and join them with commas
    const ids = formData.value.item_availables.map((item) => item.id).join(",");

    const response = await availableStore.changeStatus(ids);
    toast.success(response.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update status");
  }
};

const confirmItem = async (message) => {
  console.log(message);
  status.value.item = true;
  formData.value.item_availables = message;

  // Calculate totals and generate items
  let subTotal = 0;
  let totalDiscount = 0;
  let earliestServiceDate = null;
  const items = [];

  message.forEach((item, index) => {
    // Calculate totals
    subTotal += parseFloat(item.subtotal_amount || 0);
    totalDiscount += parseFloat(item.discount || 0);

    // Find earliest service date
    const serviceDate = item.service_date || item.checkin_date;
    if (serviceDate) {
      if (
        !earliestServiceDate ||
        new Date(serviceDate) < new Date(earliestServiceDate)
      ) {
        earliestServiceDate = serviceDate;
      }
    }

    // Map product_type
    let productType = null;
    let productId = item.ownerable_id;
    let variableId = item.variable_id;

    if (
      item.product_type === "hotel" ||
      item.ownerable_type?.includes("Hotel")
    ) {
      productType = "6"; // Hotel
    } else if (
      item.product_type === "entrance_ticket" ||
      item.ownerable_type?.includes("EntranceTicket")
    ) {
      productType = "4"; // Entrance Ticket
    }

    // Build item object for formData.items
    const formItem = {
      product_id: productId,
      product_type: productType,
      car_id: variableId, // This will be room_id for hotel or variation_id for entrance ticket
      quantity: item.quantity || 0,
      selling_price:
        item.product_type === "hotel"
          ? item.selling_price || 0
          : item.adult_selling_price || 0,
      amount: parseFloat(item.subtotal_amount || 0),
      total_amount: parseFloat(item.total_amount || 0),
      discount: parseFloat(item.discount || 0),
      checkin_date: item.checkin_date || null,
      checkout_date: item.checkout_date || null,
      service_date: item.service_date || item.checkin_date || null,
      special_request: item.commands || "",
      comment: item.commands || "",
      payment_method: formData.value.payment_method,
      payment_status: "not_paid",
      cost_price: item.cost_price || item.adult_selling_price || 0, // Add if you have cost price
      total_cost_price: item.total_cost_price || 0, // Add if you have cost price
      is_inclusive: 0,
    };

    // Add days for hotel
    if (item.product_type === "hotel" && item.nights) {
      formItem.days = item.nights;
    }

    // Add individual pricing for entrance tickets with children
    if (productType === "4" && item.child_qty > 0) {
      formItem.individual_pricing = {
        adult: {
          quantity: item.quantity || 0,
          selling_price: parseFloat(item.adult_selling_price || 0),
          cost_price: item.adult_cost_price || 0,

          amount:
            (item.quantity || 0) * parseFloat(item.adult_selling_price || 0),
        },
        child: {
          quantity: item.child_qty || 0,
          selling_price: parseFloat(item.child_selling_price || 0),
          cost_price: item.child_cost_price || 0,
          amount:
            (item.child_qty || 0) * parseFloat(item.child_selling_price || 0),
        },
      };
    }

    items.push(formItem);
  });

  // Calculate grand total
  const grandTotal = subTotal - totalDiscount;

  // Update formData
  formData.value.items = items;
  formData.value.sub_total = subTotal.toFixed(2);
  formData.value.grand_total = grandTotal.toFixed(2);
  formData.value.discount = totalDiscount.toFixed(2);
  formData.value.balance_due_date = earliestServiceDate || "";
  formData.value.payment_status = "not_paid";

  console.log("Updated formData:", formData.value);
  console.log("Generated items:", items);

  // Move to success page
  activeTab.value = 3;

  await createCustomer();
};

const createCustomer = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.customer_name);
  frmData.append("phone", formData.value.customer_phone);
  const response = await customerStore.createBookingCustomerAction(frmData);
  if (response.status == 1) {
    formData.value.customer_id = response.result.id;
    activeTab.value = 3;
    createAction();
  }
};

const errors = ref(null);
const loading = ref(false);
const responseData = ref(null);

const createAction = async () => {
  loading.value = true;
  const frmData = new FormData();

  // Customer info
  formData.value.customer_id &&
    frmData.append("customer_id", formData.value.customer_id);
  formData.value.customer_name &&
    frmData.append("customer_name", formData.value.customer_name);
  formData.value.customer_phone &&
    frmData.append("customer_phone", formData.value.customer_phone);
  formData.value.payment_notes &&
    frmData.append("payment_notes", formData.value.payment_notes);
  formData.value.sold_from &&
    frmData.append("sold_from", formData.value.sold_from);

  // Payment info
  formData.value.payment_method &&
    frmData.append("payment_method", formData.value.payment_method);
  formData.value.bank_name &&
    frmData.append("bank_name", formData.value.bank_name);
  formData.value.payment_status &&
    frmData.append("payment_status", formData.value.payment_status);
  formData.value.booking_date &&
    frmData.append("booking_date", formData.value.booking_date);
  formData.value.payment_currency &&
    frmData.append("payment_currency", formData.value.payment_currency);

  // Money exchange
  if (formData.value.money_exchange_rate) {
    frmData.append("money_exchange_rate", formData.value.money_exchange_rate);
  } else {
    frmData.append("money_exchange_rate", 0);
  }

  // Totals
  formData.value.discount
    ? frmData.append("discount", formData.value.discount)
    : frmData.append("discount", 0);
  formData.value.sub_total &&
    frmData.append("sub_total", formData.value.sub_total * 1);
  formData.value.grand_total &&
    frmData.append("grand_total", formData.value.grand_total * 1);
  formData.value.deposit && frmData.append("deposit", formData.value.deposit);
  formData.value.balance_due_date &&
    frmData.append("balance_due_date", formData.value.balance_due_date);

  // Calculate balance due
  const balanceDue =
    parseFloat(formData.value.grand_total || 0) -
    parseFloat(formData.value.deposit || 0);
  frmData.append("balance_due", balanceDue.toFixed(2));

  // Items
  for (var x = 0; x < formData.value.items.length; x++) {
    const item = formData.value.items[x];

    frmData.append("items[" + x + "][product_id]", item.product_id);

    frmData.append("items[" + x + "][is_inclusive]", item.is_inclusive || 0);
    frmData.append("items[" + x + "][amount]", item.total_amount);

    // Cost prices
    if (item.cost_price) {
      frmData.append("items[" + x + "][cost_price]", item.cost_price);
    }
    if (item.total_cost_price) {
      frmData.append(
        "items[" + x + "][total_cost_price]",
        item.total_cost_price
      );
    }

    // Individual pricing for entrance tickets
    if (item.product_type == "4" && item.individual_pricing) {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\EntranceTicket`
      );
      frmData.append(
        "items[" + x + "][individual_pricing][adult][quantity]",
        item.individual_pricing.adult.quantity
      );
      frmData.append(
        "items[" + x + "][individual_pricing][adult][selling_price]",
        item.individual_pricing.adult.selling_price
      );
      frmData.append(
        "items[" + x + "][individual_pricing][adult][cost_price]",
        item.individual_pricing.adult.cost_price
      );
      frmData.append(
        "items[" + x + "][individual_pricing][adult][total_cost_price]",
        item.individual_pricing.adult.cost_price *
          item.individual_pricing.quantity
      );
      frmData.append(
        "items[" + x + "][individual_pricing][adult][amount]",
        item.individual_pricing.adult.amount
      );
      frmData.append(
        "items[" + x + "][individual_pricing][child][quantity]",
        item.individual_pricing.child.quantity
      );
      frmData.append(
        "items[" + x + "][individual_pricing][child][selling_price]",
        item.individual_pricing.child.selling_price
      );
      frmData.append(
        "items[" + x + "][individual_pricing][child][cost_price]",
        item.individual_pricing.child.cost_price
      );
      frmData.append(
        "items[" + x + "][individual_pricing][child][total_cost_price]",
        item.individual_pricing.child.cost_price *
          item.individual_pricing.child.quantity
      );
      frmData.append(
        "items[" + x + "][individual_pricing][child][amount]",
        item.individual_pricing.child.amount
      );
    } else {
      frmData.append("items[" + x + "][individual_pricing]", null);
    }

    // Discount
    if (item.discount) {
      frmData.append("items[" + x + "][discount]", item.discount);
    } else {
      frmData.append("items[" + x + "][discount]", 0);
    }

    // Dates
    if (item.checkin_date) {
      frmData.append("items[" + x + "][checkin_date]", item.checkin_date);
    }
    if (item.checkout_date) {
      frmData.append("items[" + x + "][checkout_date]", item.checkout_date);
    }
    if (item.service_date) {
      frmData.append("items[" + x + "][service_date]", item.service_date);
    }

    // Room/Car/Variation/Ticket IDs based on product type
    if (item.product_type == "6") {
      frmData.append("items[" + x + "][product_type]", `App\\Models\\Hotel`);
      // Hotel
      if (item.car_id) {
        frmData.append("items[" + x + "][room_id]", item.car_id);
      } else {
        toast.warning("အခန်းအမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return;
      }
    }

    if (item.product_type == "4") {
      // Entrance Ticket
      if (item.car_id) {
        frmData.append("items[" + x + "][variation_id]", item.car_id);
      } else {
        toast.warning("ticket အမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return;
      }
    }

    // Other fields
    if (item.quantity) {
      frmData.append("items[" + x + "][quantity]", item.quantity);
    }
    if (item.days) {
      frmData.append("items[" + x + "][days]", item.days);
    }
    if (item.special_request) {
      frmData.append("items[" + x + "][special_request]", item.special_request);
    }
    if (item.selling_price) {
      frmData.append("items[" + x + "][selling_price]", item.selling_price);
    }
    if (item.comment) {
      frmData.append("items[" + x + "][comment]", item.comment);
    }
    if (item.payment_method) {
      frmData.append("items[" + x + "][payment_method]", item.payment_method);
    }
    if (item.payment_status) {
      frmData.append("items[" + x + "][payment_status]", item.payment_status);
    }
  }

  try {
    const response = await bookingStore.addNewAction(frmData);
    console.log(response, "create response");
    if (response.status == 1) {
      errors.value = null;
      toast.success(response.message);
      loading.value = false;
      responseData.value = response.result;
      await changeStatus();
    }
  } catch (error) {
    console.log("Error:", error);
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message);
  }
};
</script>
