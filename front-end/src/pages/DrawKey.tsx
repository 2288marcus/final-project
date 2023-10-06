import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import forge from "node-forge";

interface Coordinate {
  x: number;
  y: number;
}

const DrawKey: React.FC = () => {
  const title = "Draw key";
  // const seed = []; // 32-byte seed, controlled by mouse track
  const [seed, setSeed] = useState("");
  const [progress, setProgress] = useState(0);
  const [keypair, setKeyPair] = useState<forge.pki.KeyPair | undefined>();
  const [track, setTrack] = useState<Coordinate[]>([]);

  useEffect(() => {
    if (progress >= 1) {
      const keypair = forge.pki.ed25519.generateKeyPair({
        seed: forge.util.decode64(seed),
      });
      setKeyPair(keypair);
    }
  }, [seed, progress]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setProgress(Math.min(progress + 0.004, 1));
    const hash = forge.sha256.create();
    hash.update(seed + e.movementX + e.movementY);
    setSeed(forge.util.encode64(hash.digest().bytes()));

    const { clientX, clientY } = e;
    setTrack((prevTrack) => [...prevTrack, { x: clientX, y: clientY }]);
  };

  const handleReset = () => {
    setProgress(0);
    setSeed("");
    setTrack([]); // 清空绘图轨迹
  };

  const getRandomRGB = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
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
        <IonButton onClick={handleReset}>Reset</IonButton>
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
          onMouseMove={handleMouseMove}
        >
          {/* 绘制轨迹 */}
          <svg width="100%" height="100%">
            <polyline
              points={track.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke={getRandomRGB()} // 设置为彩色值，例如 "blue", "#FF0000", "rgb(255, 0, 0)" 等
              stroke-opacity="0.8" // 设置不透明度
              stroke-width="2" // 设置宽度
              stroke-linecap="round" // 设置线条端点形状
              stroke-linejoin="round" // 设置线条相交处形状
              // stroke-dasharray="5, 2" // 设置虚线样式
            />
          </svg>
          <div>Draw the key</div>
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
