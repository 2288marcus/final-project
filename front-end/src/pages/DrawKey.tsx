import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import forge from "node-forge";

interface Track {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
}

const DrawKey: React.FC = () => {
  const title = "Draw key";
  // const seed = []; // 32-byte seed, controlled by mouse track
  const [seed, setSeed] = useState("");
  const [progress, setProgress] = useState(0);
  const [keypair, setKeyPair] = useState<forge.pki.KeyPair | undefined>();
  const [tracks, setTracks] = useState<Track[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let canvas = canvasRef.current;
    if (!canvas) return;
    let context = canvas.getContext("2d");
    if (!context) return;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let track of tracks) {
      let maxR = 10;
      let step = 1;
      let a = 0.15;
      for (let size = 1; size < maxR; size += step) {
        context.fillStyle = `rgba(${track.r}, ${track.g}, ${track.b}, ${a})`;
        context.beginPath();
        context.arc(track.x, track.y, size, 0, 2 * Math.PI);
        context.fill();
      }
    }
  }, [canvasRef.current, tracks]);

  useEffect(() => {
    if (progress >= 1) {
      const keypair = forge.pki.ed25519.generateKeyPair({
        seed: forge.util.decode64(seed),
      });
      setKeyPair(keypair);
    } else {
      setKeyPair(undefined);
    }
  }, [seed, progress]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newTracks: Track[] = [
      ...tracks,
      {
        x,
        y,
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
      },
    ];
    setTracks(newTracks);

    const hash = forge.sha256.create();
    hash.update(JSON.stringify(newTracks));
    setSeed(forge.util.encode64(hash.digest().bytes()));

    setProgress(Math.min(progress + 0.003, 1));
  };

  const handleReset = () => {
    setProgress(0);
    setSeed("");
    setTracks([]); // 清空绘图轨迹
  };

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
        <div>Draw the key</div>
        <IonButton onClick={handleReset}>Reset</IonButton>

        <canvas
          ref={canvasRef}
          style={{
            border: "1px solid",
            // padding: "1rem",
            display: "flex",
            height: "20rem",
            maxHeight: "50vh",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onMouseMove={handleMouseMove}
        ></canvas>
        <div>
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
                  if (s.length === 1) {
                    return "0" + s;
                  }
                  return s;
                })}
              </div>
              <div className="ion-margin" style={{ fontFamily: "monospace" }}>
                Private Key:{" "}
                {Array.from(keypair.privateKey as any).map((x) => {
                  let s = (x as number).toString(16);
                  if (s.length === 1) {
                    return "0" + s;
                  }
                  return s;
                })}
              </div>
            </>
          ) : null}
        </div>

        <IonButton routerLink="/DownloadKey" disabled={progress < 1}>
          Confirm
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DrawKey;
