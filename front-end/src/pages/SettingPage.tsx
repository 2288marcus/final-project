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
} from "@ionic/react";

const SettingPage: React.FC = () => {
  const title = "SettingPage";
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
        <IonSegment value="default">
          <IonSegmentButton value="default">
            <IonLabel>Dark</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="segment">
            <IonLabel>Light</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonContent>
    </IonPage>
  );
};
export default SettingPage;
