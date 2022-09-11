import { action, makeAutoObservable, observable } from "mobx";

export class StoreImpl {
  selectedMenuOption = "";

  constructor() {
    makeAutoObservable(this, {
      selectedMenuOption: observable,
      setSelectedMenuOption: action,
    });
  }

  setSelectedMenuOption(option) {
    this.selectedMenuOption = option;
  }
}
export const Store = new StoreImpl();
