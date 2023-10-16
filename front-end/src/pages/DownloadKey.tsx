import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonText,
} from "@ionic/react";
import { Link } from "react-router-dom";

const DownloadKey: React.FC = () => {
  const title = "Download key";
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
        <IonList>
          <IonItem>
            <IonInput
              labelPlacement="floating"
              type="password"
              clearInput={true}
            >
              <div slot="label">
                Private Key <IonText color="danger">(Required)</IonText>
              </div>
            </IonInput>
          </IonItem>
        </IonList>
        <IonButton routerLink="/UploadKey">confirm</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DownloadKey;
