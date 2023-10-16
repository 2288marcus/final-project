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
import forge from "node-forge";
import { toBase64, toHex } from "../utils/crypto";
import useAuth from "../hooks/useAuth";
import { routes } from "../routes";
import { savePrivateKeyBase64 } from "../api/config";

const LoginPage: React.FC = () => {
  const title = "Login";

  const [error, setError] = useState("");
  const [privateKeyBase64, setPrivateKeyBase64] = useState("");

  const router = useIonRouter();

  const auth = useAuth();

  const isKeyValid =
    forge.util.binary.base64.decode(privateKeyBase64).length == 64;

  async function submit() {
    try {
      savePrivateKeyBase64(privateKeyBase64);
      let privateKey = forge.util.binary.base64.decode(privateKeyBase64);
      let publicKey = forge.pki.ed25519.publicKeyFromPrivateKey({ privateKey });
      let now = Date.now();

      let message = JSON.stringify({ now });

      let md = forge.sha512.create();
      md.update(message);
      let signature = forge.pki.ed25519.sign({ privateKey, md });

      let json = await login({
        now,
        public_key: toBase64(publicKey),
        signature: toBase64(signature),
      });
      console.log("login result:", json);
      auth.setState({ id: json.id, privateKeyBase64 });
      setPrivateKeyBase64("");
      router.push(routes.ProfilePage);
    } catch (error) {
      console.log("login error:", error);
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
              type="password"
              label="Private Key"
              labelPlacement="floating"
              clearInput={true}
              value={privateKeyBase64}
              onIonChange={(e) => setPrivateKeyBase64(e.detail.value || "")}
            />
          </IonItem>
        </IonList>
        <IonButton onClick={submit} disabled={!isKeyValid}>
          Login
        </IonButton>
        <p>Haven't an account?</p>
        <IonButton routerLink="/register">signUp</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
