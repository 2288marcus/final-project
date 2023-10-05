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

const RequirementPage: React.FC = () => {
  const title = "Requirement";

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
          <IonItem>
            <IonInput type="text">Title</IonInput>
          </IonItem>
          <IonItem>
            <IonInput type="text">Description</IonInput>
          </IonItem>
          <IonItem>
            <IonInput type="number" min="0">
              Price (HKD)
            </IonInput>
            <IonInput type="date">Service Date</IonInput>
          </IonItem>
          <br />
          <br />
          <br />
          <br />
          <p>Contact Person (Optional)</p>
          <IonItem>
            <IonInput label="Name" labelPlacement="floating" />
            <IonInput label="Phone" labelPlacement="floating" />
          </IonItem>
        </IonList>
        <IonButton>Post</IonButton>
        {/* <p>
          Already have an account?
          <IonButton routerLink="/login">Login</IonButton>
        </p> */}
      </IonContent>
    </IonPage>
  );
};

export default RequirementPage;
