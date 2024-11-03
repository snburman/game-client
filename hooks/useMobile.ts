import { useWindowDimensions } from "react-native";

export function useMobile() {
  const { width } = useWindowDimensions();
  return width < 768;
}