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
  IonSearchbar,
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
        <IonSearchbar
          animated={true}
          placeholder="Search for Service"
        ></IonSearchbar>
        <IonList>
          <IonItem routerLink="/ProfileCheckPage"> JobList 1 </IonItem>
          <IonItem routerLink="/ProfileCheckPage"> JobList 2 </IonItem>
          <IonItem routerLink="/ProfileCheckPage"> JobList 3 </IonItem>
          <IonItem routerLink="/ProfileCheckPage"> JobList 4 </IonItem>
          <IonItem routerLink="/ProfileCheckPage"> JobList 5 </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default JobList;
