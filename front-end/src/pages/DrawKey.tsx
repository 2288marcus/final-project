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
  IonProgressBar,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import forge from "node-forge";

const DrawKey: React.FC = () => {
  const title = "Draw key";
  // const seed = []; // 32-byte seed, controlled by mouse track
  const [seed, setSeed] = useState("");
  const [progress, setProgress] = useState(0);
  const [keypair, setKeyPair] = useState<forge.pki.KeyPair>();
  useEffect(() => {
    if (progress >= 1) {
      let keypair = forge.pki.ed25519.generateKeyPair({
        seed: forge.util.decode64(seed),
      });
      setKeyPair(keypair);
    }
  }, [seed, progress]);

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
      <IonContent className="ion-padding">
        <p>Draw the key</p>
        <IonButton
          onClick={() => {
            setProgress(0);
            setSeed("");
          }}
        >
          Reset
        </IonButton>
        <div
          style={{
            border: "1px solid",
            padding: "1rem",
            display: "flex",
            height: "20rem",
            maxHeight: "50vh",
            justifyContent: "center",
            alignItems: "center",
          }}
          onMouseMove={(e) => {
            setProgress(Math.min(progress + 0.004, 1));
            let hash = forge.sha256.create();
            hash.update(seed + e.movementX + e.movementY);
            setSeed(forge.util.encode64(hash.digest().bytes()));
          }}
        >
          mouse your mouse here
        </div>
        <div className="">
          <div className="ion-margin ion-text-center">
            Progress: {(progress * 100).toFixed(1)}%
          </div>
          <IonProgressBar value={progress}></IonProgressBar>
          <div className="ion-margin" style={{ fontFamily: "monospace" }}>
            Seed: {seed || "(none)"}
          </div>
          {keypair ? (
            <>
              <div className="ion-margin" style={{ fontFamily: "monospace" }}>
                Public Key:{" "}
                {Array.from(keypair.publicKey as any).map((x) => {
                  let s = (x as number).toString(16);
                  if (s.length == 1) {
                    return "0" + s;
                  }
                  return s;
                })}
              </div>
              <div className="ion-margin" style={{ fontFamily: "monospace" }}>
                Private Key:{" "}
                {Array.from(keypair.privateKey as any).map((x) => {
                  let s = (x as number).toString(16);
                  if (s.length == 1) {
                    return "0" + s;
                  }
                  return s;
                })}
              </div>
            </>
          ) : null}
        </div>

        <IonButton routerLink="/DownloadKey" disabled={progress < 1}>
          Comfirm
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DrawKey;
