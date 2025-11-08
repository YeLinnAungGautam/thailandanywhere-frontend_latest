import axios from "axios";
import { defineStore } from "pinia";

// https://api-blog.thanywhere.com
// http://127.0.0.1:8000

export const useRoomV2Store = defineStore("roomV2", {
  state: () => ({ loading: false }),
  getters: {},
  actions: {
    async getRoomPeriod(data, id) {
      this.loading = true;
      const response = await axios.get(
        "https://api-blog.thanywhere.com/api/v2/rooms/" + id + "/price",
        {
          params: data,
        }
      );
      this.loading = false;
      return response.data;
    },
  },
});
