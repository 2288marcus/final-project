import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./RequirementPage.css";
import { format_2_digit, format_datetime } from "@beenotung/tslib/format";

function toDateString(date: Date) {
  let y = date.getFullYear();
  let m = format_2_digit(date.getMonth() + 1);
  let d = format_2_digit(date.getDate());
  return `${y}-${m}-${d}`;
}

const RequirementPage: React.FC = () => {
  const title = "Requirement";

  const [state, setState] = useState({
    price: "",
    date: toDateString(new Date()),
  });

  let price = +state.price;
  let priceErrorMessage =
    price >= 1 && price == Math.floor(price)
      ? ""
      : "(must be greater than zero, and round to dollar (no cents))";

  return (
    <IonPage className="RequirementPage">
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
        <IonItem>
          <IonSegment value="Default" className="demandoffer">
            <IonSegmentButton value="Demand">
              <IonLabel>demand</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="Default">
              <IonLabel>Choose one</IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="Offer">
              <IonLabel>supply</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonItem>
        <IonList>
          <IonItem>
            <IonInput type="text">Title</IonInput>
          </IonItem>
          <IonItem>
            <IonInput type="text">Description</IonInput>
          </IonItem>
          <IonItem className="half">
            <IonLabel
              position="floating"
              color={priceErrorMessage ? "danger" : ""}
            >
              <IonText color="dark">Price (HKD)</IonText>
            </IonLabel>

            {/* <IonItem>
        <IonSelect label="Fixed label" labelPlacement="fixed" placeholder="Favorite fruit">
          <IonSelectOption value="apple">Apple</IonSelectOption>
          <IonSelectOption value="banana">Banana</IonSelectOption>
          <IonSelectOption value="orange">Orange</IonSelectOption>
        </IonSelect>
      </IonItem> */}

            <IonInput
              type="number"
              min="1"
              step="1"
              value={state.price}
              onIonChange={(e) => {
                setState({ ...state, price: e.detail.value! });

                // let price = Math.floor(+e.detail.value!);
                // if (price >= 1) {
                //   setState({ ...state, price });
                // } else {
                //   price = state.price;
                // }
                // e.target.value = price;
              }}
            ></IonInput>
          </IonItem>
          {priceErrorMessage ? (
            <IonNote className="ion-padding-horizontal ion-margin-bottom">
              <IonText color="danger">{priceErrorMessage}</IonText>
            </IonNote>
          ) : null}

          <IonItem className="half">
            <IonInput
              type="date"
              value={state.date}
              min={toDateString(new Date())}
              onIonChange={(e) => {
                console.log(e.detail.value);
              }}
            >
              Service Date
            </IonInput>
          </IonItem>
          <br />
          <br />
          <br />
          <br />
        </IonList>
        <IonButton>Post</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RequirementPage;
