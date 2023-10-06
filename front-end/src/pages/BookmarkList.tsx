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

const BookmarkList: React.FC = () => {
  const title = "BookmarkList";

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
          <IonItem routerLink="/ProfileCheckPage"> Job 1 </IonItem>
          <IonItem routerLink="/ProfileCheckPage"> Job 2 </IonItem>
          <IonItem routerLink="/ProfileCheckPage"> Job 3 </IonItem>
          <IonItem routerLink="/ProfileCheckPage"> Job 4 </IonItem>
          <IonItem routerLink="/ProfileCheckPage"> Job 5 </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default BookmarkList;
