import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonPage,
  IonAlert,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import forge from "node-forge";
import {
  is_email,
  is_hk_mobile_phone,
  to_full_hk_mobile_phone,
} from "@beenotung/tslib/validate";
import { post } from "../api/config";
import { object } from "cast.ts";
import { toBase64, toHex } from "../utils/crypto";

interface Track {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
}

const RegisterPage: React.FC = () => {
  const title = "Register";

  const [state, setState] = useState({
    username: "",
    fullName: "",
    hkId: "",
    hk_phone: "",
    email: "",
  });
  const phonePrefix = "+(852) ";
  const phone = state.hk_phone.replace(phonePrefix, "");
  const isValidates = {
    username: state.username.length > 0,
    fullName: state.fullName.length > 0,
    hkId: is_hk_id(state.hkId),
    hk_phone: is_hk_mobile_phone(phone),
    email: is_email(state.email),
  };
  function is_hk_id(value: string): boolean {
    let match = value.match(/^([a-zA-Z]) ?([\d]{6}) ?\(?([a-zA-Z0-9])\)?$/);
    if (!match) return false;
    let letter = match[1].toUpperCase();
    let numbers = match[2];
    let verify = match[3].toUpperCase();

    let string = `${letter}${numbers}${verify}`;

    let sum =
      36 * 9 +
      (string.charCodeAt(0) - 65 + 10) * 8 +
      parseInt(string[1], 16) * 7 +
      parseInt(string[2], 16) * 6 +
      parseInt(string[3], 16) * 5 +
      parseInt(string[4], 16) * 4 +
      parseInt(string[5], 16) * 3 +
      parseInt(string[6], 16) * 2 +
      parseInt(string[7], 16) * 1;

    return sum % 11 == 0;
  }
  const masks = {
    username(value: string) {
      return (
        value
          .replace(/[^0-9a-zA-Z_\-.]/g, "")
          .match(/([0-9a-zA-Z_\-.]+)/)?.[1]
          .toLowerCase() || ""
      );
    },
    hkId(value: string) {
      let match = value.match(
        /^([a-zA-Z])? ?([\d]{0,6}) ?\(?([a-zA-Z0-9])?\)?/
      );
      if (!match) return "";
      let letter = match[1]?.toUpperCase();
      let numbers = match[2];
      let verify = match[3]?.toUpperCase();
      if (letter && numbers && verify) return `${letter} ${numbers} ${verify}`;
      if (letter && numbers) return `${letter} ${numbers}`;
      if (letter) return `${letter}`;
      return "";
    },
    hk_phone(value: string) {
      value =
        value
          .replace(phonePrefix.trim(), "")
          .replace(/-/g, "")
          .replace(/ /g, "")
          .match(/(\d+)/)?.[1] || "";
      if (value.length > 4) {
        value = value.slice(0, 4) + "-" + value.slice(4, 8);
      }
      return phonePrefix + value;
    },
  };

  type State = typeof state;

  function update(patch: Partial<State>) {
    setState((state) => ({ ...state, ...patch }));
  }

  const canSubmit =
    isValidates.username &&
    isValidates.fullName &&
    isValidates.hkId &&
    isValidates.email &&
    isValidates.hk_phone;

  const submit = () => {
    let public_key = toHex(keyPair!.publicKey);
    let data = {
      ...state,
      hk_phone: to_full_hk_mobile_phone(phone).replace("+852", ""),
      hkId: state.hkId.replace(/ /g, ""),
      public_key: toBase64(keyPair!.publicKey),
    };
    console.log("data:", data);

    // 发送POST请求到后端
    post("/user/signUp", data, object({}))
      .then((res) => {
        console.log("signUp result:", res);
      })
      .catch((err) => {
        console.log("signUp fail:", err);
      });
    // routerLink="/drawKey"
  };

  function renderField(props: {
    field: keyof State;
    type: "email" | "text" | "tel";
    label: string;
    helperText?: string;
    placeholder?: string;
    maxlength?: number;
    clearInput: boolean;
    mask?: (value: string) => string;
  }) {
    const { field } = props;
    const value = state[field];
    const isValid = isValidates[field];

    return (
      <IonItem>
        <IonInput
          helperText={props.helperText}
          value={value}
          onIonInput={(e) => {
            let value = e.detail.value || "";
            if (props.mask) {
              value = props.mask(value);
            }
            update({ [props.field]: value });
          }}
          className={
            value && !isValid
              ? "ion-invalid ion-touched"
              : value && isValid
              ? "ion-valid ion-touched"
              : ""
          }
          maxlength={props.maxlength}
          pattern="\d"
          type={props.type}
          fill="solid"
          label={props.label}
          labelPlacement="floating"
          placeholder={props.placeholder}
          clearInput={props.clearInput}
        ></IonInput>
      </IonItem>
    );
  }

  const [seed, setSeed] = useState("");
  const [progress, setProgress] = useState(0);
  const [keyPair, setKeyPair] = useState<forge.pki.KeyPair | undefined>();
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
      const keyPair = forge.pki.ed25519.generateKeyPair({
        seed: forge.util.decode64(seed),
      });
      setKeyPair(keyPair);
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

    setProgress(Math.min(progress + 0.007, 1));
  };

  const handleReset = () => {
    setProgress(0);
    setSeed("");
    setTracks([]); // 清空绘图轨迹
  };

  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);

  const copyPrivateKey = () => {
    if (keyPair && keyPair.privateKey) {
      navigator.clipboard
        .writeText(toBase64(keyPair.privateKey))
        .then(() => {
          setPrivateKeyCopied(false);
        })
        .catch((error) => {
          console.error("Failed to copy private key:", error);
        });
    }
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
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {renderField({
            field: "username",
            type: "text",
            label: "Username",
            clearInput: true,
            mask: masks.username,
          })}
          {renderField({
            field: "fullName",
            type: "text",
            label: "Full Name",
            clearInput: true,
            helperText: "as shown on HKID",
            placeholder: "Chan Tai Man",
          })}
          {renderField({
            field: "hkId",
            type: "text",
            label: "Hong Kong Identity Card",
            clearInput: true,
            placeholder: "A 123456 (7)",
            mask: masks.hkId,
          })}
          {renderField({
            field: "hk_phone",
            type: "tel",
            label: "HK phone number",
            clearInput: true,
            placeholder: "+(852) xxxx-xxxx",
            mask: masks.hk_phone,
          })}
          {renderField({
            field: "email",
            type: "email",
            label: "Email",
            clearInput: true,
            placeholder: "example@mail.com",
          })}
        </IonList>
        <>
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
            onMouseMove={progress == 1 ? () => {} : handleMouseMove}
          ></canvas>
          <div>
            <div className="ion-margin ion-text-center">
              Progress: {(progress * 100).toFixed(1)}%
            </div>
            <IonProgressBar value={progress}></IonProgressBar>
            <div className="ion-margin" style={{ fontFamily: "monospace" }}>
              {/* Seed: {seed || "none"} */}
            </div>
            {keyPair ? (
              <>
                <div className="ion-margin" style={{ fontFamily: "monospace" }}>
                  Public Key: {toBase64(keyPair.publicKey)}
                </div>
                <div className="ion-margin" style={{ fontFamily: "monospace" }}>
                  Private Key: {toBase64(keyPair.privateKey)}
                </div>
              </>
            ) : null}
          </div>
          <IonButton
            routerLink="/login"
            disabled={progress < 1 || !canSubmit}
            // routerLink="/drawKey"
            onClick={submit}
          >
            signUp
          </IonButton>
          <IonButton
            id="copied-alert"
            // disabled={privateKeyCopied}
            disabled={progress < 1}
            onClick={copyPrivateKey}
          >
            {privateKeyCopied ? "Private Key Copied" : "Copy Private Key"}
          </IonButton>
          <IonAlert
            trigger="copied-alert"
            header="Alert"
            subHeader="private key copied."
            // message="Private key copied"
            buttons={["OK"]}
          ></IonAlert>
          Already have an account?
          <IonButton routerLink="/login">Login</IonButton>
        </>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
