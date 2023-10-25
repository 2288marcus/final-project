import { useIonToast } from "@ionic/react";

export default function useToast() {
  const [present, dismiss] = useIonToast();
  function showError(error: any) {
    present({
      message: String(error)
        .replace("Error: ", "")
        .replace("Invalid object, ", ""),
      color: "danger",
      duration: 5000,
      buttons: [{ text: "Dismiss", handler: dismiss }],
    });
  }
  function showSuccess(message: string) {
    present({
      message,
      color: "success",
      duration: 3500,
      buttons: [{ text: "Dismiss", handler: dismiss }],
    });
  }
  function showWarning(message: string) {
    present({
      message,
      color: "Warning",
      duration: 6000,
      buttons: [{ text: "Dismiss", handler: dismiss }],
    });
  }
  return { showError, showSuccess, showWarning };
}
