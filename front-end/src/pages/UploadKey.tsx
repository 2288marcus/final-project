import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { cloudUploadOutline } from "ionicons/icons";
import { Link } from "react-router-dom";

const UploadKey: React.FC = () => {
  const title = "Upload key";
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton>
          <IonIcon icon={cloudUploadOutline} />
        </IonButton>
        <p>Upload the key</p>
        <IonButton routerLink="/Welcome">Comfirm</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default UploadKey;
