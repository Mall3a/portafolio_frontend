import { action, makeAutoObservable, observable } from "mobx";

export class StoreImpl {
  selectedMenuOption = "Perfil";

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
