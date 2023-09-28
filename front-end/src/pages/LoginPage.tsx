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
} from "@ionic/react";

const LoginPage: React.FC = () => {
  const title = "Login";

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
            <IonInput type="email" label="Email" labelPlacement="floating" />
          </IonItem>
          <IonItem>
            <IonInput
              type="password"
              label="Password"
              labelPlacement="floating"
            />
          </IonItem>

          <IonItem>
            <IonInput type="email" label="Email" />
          </IonItem>
          <IonItem>
            <IonInput type="password" label="Password" />
          </IonItem>
        </IonList>

        <IonButton routerLink="/register">Signup</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
