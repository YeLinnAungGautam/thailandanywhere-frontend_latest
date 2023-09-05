import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    isShowSidebar: true,
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
