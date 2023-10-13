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
import React, { useState } from "react";
import { is_email, is_hk_mobile_phone } from "@beenotung/tslib/validate";

const RegisterPage: React.FC = () => {
  const title = "Register";

  const [state, setState] = useState({
    username: "",
    fullName: "",
    hkId: "",
    phone: "",
    email: "",
  });
  const phonePrefix = "+(852) ";
  const phone = state.phone.replace(phonePrefix, "");
  const isValidates = {
    username: state.username.length > 0,
    fullName: state.fullName.length > 0,
    hkId: is_hk_id(state.hkId),
    phone: is_hk_mobile_phone(phone),
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
      parseInt(string[0], 16) * 8 +
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
    phone(value: string) {
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
    isValidates.phone;

  const submit = () => {
    console.log("data:", state);

    // 发送POST请求到后端
    fetch("http://localhost:3000/user/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // 处理后端响应
        console.log(responseData);
      })
      .catch((error) => {
        // 处理错误
        console.error(error);
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
        ></IonInput>
      </IonItem>
    );
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
          {renderField({
            field: "username",
            type: "text",
            label: "Username",
            mask: masks.username,
          })}
          {renderField({
            field: "fullName",
            type: "text",
            label: "Full Name",
            helperText: "as shown on HKID",
            placeholder: "Chan Tai Man",
          })}
          {renderField({
            field: "hkId",
            type: "text",
            label: "Hong Kong Identity Card",
            placeholder: "A 123456 (7)",
            mask: masks.hkId,
          })}
          {renderField({
            field: "phone",
            type: "tel",
            label: "HK phone number",
            placeholder: "+(852) xxxx-xxxx",
            mask: masks.phone,
          })}
          {renderField({
            field: "email",
            type: "email",
            label: "Email",
            placeholder: "example@mail.com",
          })}
          <IonButton
            routerLink="/drawKey"
            onClick={submit}
            disabled={!canSubmit}
          >
            SignUp
          </IonButton>
        </IonList>
        <p>
          Already have an account?
          <IonButton routerLink="/login">Login</IonButton>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
