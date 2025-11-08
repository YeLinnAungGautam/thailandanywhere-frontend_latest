// composables/useSharedHotel.js
import { ref } from "vue";

const sharedHotelId = ref(47);
const sharedHotelName = ref("");

export function useSharedHotel() {
  const setHotel = (id, name) => {
    sharedHotelId.value = id;
    sharedHotelName.value = name;
  };

  return {
    sharedHotelId,
    sharedHotelName,
    setHotel,
  };
}
