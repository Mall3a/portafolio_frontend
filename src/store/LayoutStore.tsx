import { observable, action } from "mobx";
export default class LayoutStore {
  @observable
  drawerWidth: number = 240;
  @observable
  mobileOpen = false;

  @action
  setMobileOpen(open: boolean) {
    this.mobileOpen = open;
  }

  @action
  handleDrawerToggle = () => {
    this.setMobileOpen(!this.mobileOpen);
  };
}
