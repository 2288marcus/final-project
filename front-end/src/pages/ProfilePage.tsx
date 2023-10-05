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
} from "@ionic/react";
import { Link } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const title = "(User update) Person Profile";

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

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonInput>Name:</IonInput>
          <IonInput>Phone Number:</IonInput>
          {/* ///////////////image///////////////// */}
          <IonButton>CV upload</IonButton>

          <IonInput>Service History</IonInput>

          <IonInput>Contact Comment</IonInput>
        </IonList>
        <IonButton>Update</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
