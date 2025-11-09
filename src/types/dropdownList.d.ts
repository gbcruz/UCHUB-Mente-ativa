import type { ComponentType } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

declare module "react-native-dropdown-select-list" {
  export type SelectDataItem = { key: string; value: string };

  export interface SelectListProps {
    data?: SelectDataItem[];
    setSelected?: (val: string | string[]) => void;
    save?: string;
    multiple?: boolean;
    search?: boolean;
    boxStyles?: StyleProp<ViewStyle>;
    dropdownStyles?: StyleProp<ViewStyle>;
    inputStyles?: StyleProp<TextStyle>;
    dropdownTextStyles?: StyleProp<TextStyle>;
    searchStyles?: StyleProp<TextStyle | ViewStyle>;
    placeholder?: string;
    // allow other props the library might expose
    [key: string]: any;
  }

  const SelectList: ComponentType<SelectListProps>;
  export default SelectList;
}