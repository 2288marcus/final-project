import { useIonToast } from "@ionic/react";

export default function useToast() {
  const [present, dismiss] = useIonToast();
  function showError(error: any) {
    present({
      message: String(error),
      color: "danger",
      duration: 5000,
      buttons: [{ text: "Dismiss", handler: dismiss }],
    });
  }
  return { showError };
}
