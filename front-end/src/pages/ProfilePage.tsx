import {
  IonButton,
  IonButtons,
  IonCardHeader,
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
import "./ProfilePage.css";

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
          <IonCardHeader className="Hd">Information</IonCardHeader>
          <br />
          <IonItem>
            <IonInput label="Name" />
          </IonItem>
          <IonItem>
            <IonInput label="Phone Number" />
            <IonInput label="Email" />
          </IonItem>
          <br />
          <IonItem>
            <IonInput>Description</IonInput>
          </IonItem>
          <IonItem>
            <IonItem>Optional:</IonItem>
            <IonButton>CV upload</IonButton>
          </IonItem>
          <br />
          <br />
          <br />
          <IonCardHeader className="Hd">Pasword update</IonCardHeader>
          <IonItem>
            <IonInput
              type="password"
              label="New Pasword"
              labelPlacement="floating"
            ></IonInput>
          </IonItem>
        </IonList>
        <IonButton>Send</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
