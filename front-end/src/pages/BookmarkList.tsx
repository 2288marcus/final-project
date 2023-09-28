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
          <IonItem> BookmarkList 1 </IonItem>
          <IonItem> BookmarkList 2 </IonItem>
          <IonItem> BookmarkList 3 </IonItem>
          <IonItem> BookmarkList 4 </IonItem>
          <IonItem> BookmarkList 5 </IonItem>
        </IonList>

        {/* <IonButton routerLink="/">hk</IonButton> */}
      </IonContent>
    </IonPage>
  );
};

export default BookmarkList;
