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
import { useState } from "react";
import { login } from "../api/user";

const LoginPage: React.FC = () => {
  const title = "Login";

  const [user, setUser] = useState({ username: "", password: "" });

  const [error, setError] = useState("");

  const router = useIonRouter();

  async function submit() {
    try {
      let json = await login(user);
      router.push("/JobList");
    } catch (error) {
      setError(String(error));
    }
  }

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
            <IonInput
              type="email"
              label="Email"
              labelPlacement="floating"
              value={user.username}
              onIonChange={(e) =>
                setUser({ ...user, username: e.detail.value || "" })
              }
            />
          </IonItem>
          <IonItem>
            <IonInput
              type="password"
              label="password"
              labelPlacement="floating"
              value={user.password}
              onIonChange={(e) =>
                setUser({ ...user, password: e.detail.value || "" })
              }
            />
          </IonItem>
        </IonList>
        <IonButton onClick={submit}>Login</IonButton>
        {/* <p>{error}</p> */}
        Haven't an account?
        <IonButton routerLink="/register">Signup</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
