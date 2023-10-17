import {
  IonButton,
  IonButtons,
  IonCard,
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
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
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

        {/* <IonCard>
          <>
            1<IonItem />2 3<IonItem />4
            <div className="d-flex-md HalfInputFieldContainer">
              1<IonItem />2 3<IonItem />4
            </div>
            1<IonItem />2
            <div className="d-flex-md HalfInputFieldContainer">
              1<IonItem />2 3<IonItem />4
            </div>
            <div className="d-flex-md HalfInputFieldContainer">
              1<IonItem />2 3<IonItem />4
            </div>
            <div>
              1<IonItem />2
            </div>
          </>
        </IonCard> */}

        <IonCard>
          <IonItem>
            <IonLabel position="floating">
              <IonText>Title:</IonText>
            </IonLabel>
            <IonInput type="text" />
          </IonItem>

          <IonItem>
            <IonSelect label="Service" placeholder="Type:">
              <IonSelectOption value="demand">Demand</IonSelectOption>
              <IonSelectOption value="supply">Supply</IonSelectOption>
            </IonSelect>
            <IonItem />
            <IonInput
              label="Service Date:"
              type="date"
              value={state.date}
              min={toDateString(new Date())}
              onIonChange={(e) => {
                console.log(e.detail.value);
              }}
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              autoGrow
              label="Description"
              labelPlacement="floating"
            />
          </IonItem>

          <IonItem>
            <IonLabel
              position="floating"
              color={priceErrorMessage ? "danger" : ""}
            >
              <IonText color="dark">Price (HKD)</IonText>
            </IonLabel>

            <IonInput
              type="number"
              min="1"
              step="1"
              value={state.price}
              onIonChange={(e) => {
                setState({ ...state, price: e.detail.value! });
              }}
            ></IonInput>
          </IonItem>
          {priceErrorMessage ? (
            <IonNote className="ion-padding-horizontal ion-margin-bottom">
              <IonText color="danger">{priceErrorMessage}</IonText>
            </IonNote>
          ) : null}
        </IonCard>
        <IonButton expand="full">Post</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RequirementPage;
