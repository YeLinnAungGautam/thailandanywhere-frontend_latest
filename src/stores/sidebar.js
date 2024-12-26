import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    isShowSidebar: true,
    isReservationShow: false,
    isSideBarDropdownShow: false,
    isTopBarDropdownShow: false,
    isOpenCustomerCreate: false,
    isShowSetting: false,
  }),
  getters: {},
  actions: {
    customSideBar() {
      this.isShowSidebar = false;
    },
    showReservation() {
      this.isReservationShow = true;
    },
    showSidebar() {
      this.isShowSidebar = true;
    },
    hideSidebar() {
      this.isShowSidebar = false;
    },
    showSettingHandle() {
      this.isShowSetting = true;
    },
    toggleShowSetting() {
      this.isShowSetting = !this.isShowSetting;
    },
    toggleSidebar() {
      this.isShowSidebar = !this.isShowSidebar;
    },
    toggleReservation() {
      this.isReservationShow = !this.isReservationShow;
    },
    toggleSideBarDropdown() {
      this.isSideBarDropdownShow = !this.isSideBarDropdownShow;
    },
    toggleTopBarDropdown() {
      this.isTopBarDropdownShow = !this.isTopBarDropdownShow;
    },
    toggleCustomerCreate() {
      this.isOpenCustomerCreate = !this.isOpenCustomerCreate;
    },
  },
});
