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

const ProfileCheckPage: React.FC = () => {
  const title = "ProfileCheckPage";

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
            <IonItem>Name</IonItem>
          </IonItem>
          <IonItem>
            <IonItem>Phone Number</IonItem>
            <IonItem>Email</IonItem>
          </IonItem>
          <IonItem>
            <IonItem>Description</IonItem>
          </IonItem>
          <br />
          <form>
            <IonItem>Services History</IonItem>
            <IonItem>Client command</IonItem>
          </form>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ProfileCheckPage;
