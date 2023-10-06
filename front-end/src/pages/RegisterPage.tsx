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
  useIonRouter,
} from "@ionic/react";
import { Link } from "react-router-dom";
import { useMaskito } from "@maskito/react";
const RegisterPage: React.FC = () => {
  const title = "Register";

  const cardMask = useMaskito({
    options: {
      mask: [
        ...Array(4).fill(/\d/),
        " ",
        ...Array(4).fill(/\d/),
        " ",
        ...Array(4).fill(/\d/),
        " ",
        ...Array(4).fill(/\d/),
        " ",
        ...Array(3).fill(/\d/),
      ],
    },
  });

  const phoneMask = useMaskito({
    options: {
      mask: [
        "+",
        "(",
        "8",
        "5",
        "2",
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ],
    },
  });

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
            <IonInput type="text" label="username" />
          </IonItem>
          <IonItem>
            <IonInput type="email" label="Email" />
          </IonItem>
          <IonItem>
            <IonInput type="number" label="HKID" />
          </IonItem>
          <IonItem>
            <IonInput
              ref={async (cardRef) => {
                if (cardRef) {
                  const input = await cardRef.getInputElement();
                  cardMask(input);
                }
              }}
              label="Card number"
              placeholder="0000 0000 0000 0000"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              ref={async (phoneInput) => {
                if (phoneInput) {
                  const input = await phoneInput.getInputElement();
                  phoneMask(input);
                }
              }}
              label="HK phone number"
              placeholder="+(852) xxxx-xxxx"
            ></IonInput>
          </IonItem>
        </IonList>
        <IonButton routerLink="/drawKey">SignUp</IonButton>
        <p>
          Already have an account?
          <IonButton routerLink="/login">Login</IonButton>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
