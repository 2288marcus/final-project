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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonAvatar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToggle,
} from "@ionic/react";

const SettingPage: React.FC = () => {
  const title = "Setting";
  function logout() {}
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
            <IonToggle>Receive Push Notifications</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle>Receive Emails</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle>Receive Text Messages</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle>Dark Mode</IonToggle>
          </IonItem>
        </IonList>
        <div className="ion-padding">
          <IonButton color="dark" onClick={logout}>
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default SettingPage;
