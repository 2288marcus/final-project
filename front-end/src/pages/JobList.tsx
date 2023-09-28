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

const JobList: React.FC = () => {
  const title = "JobList";

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
          <IonItem> JobList 1 </IonItem>
          <IonItem> JobList 2 </IonItem>
          <IonItem> JobList 3 </IonItem>
          <IonItem> JobList 4 </IonItem>
          <IonItem> JobList 5 </IonItem>
        </IonList>

        {/* <IonButton routerLink="/">hk</IonButton> */}
      </IonContent>
    </IonPage>
  );
};

export default JobList;
