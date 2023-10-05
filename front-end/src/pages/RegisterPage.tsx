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

const RegisterPage: React.FC = () => {
  const title = "Register";

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
            <IonInput type="text" label="username" />
          </IonItem>
          <IonItem>
            <IonInput type="email" label="Email" />
          </IonItem>
          {/* <IonItem>
            <IonInput type="password" label="Password" />
          </IonItem> */}
        </IonList>
        <IonButton routerLink="/drawKey">SignUp</IonButton>
        <p>
          Already have an account?
          <IonButton routerLink="/login">Login</IonButton>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
