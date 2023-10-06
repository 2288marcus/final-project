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
import React, { useState } from "react";
import {
  is_email,
  is_hk_mobile_phone,
  to_full_hk_mobile_phone,
} from "@beenotung/tslib/validate";

const RegisterPage: React.FC = () => {
  const title = "Register";

  const [state, setState] = useState({ email: "" });

  const HKIDMask = useMaskito({
    options: {
      mask: [
        /[A-Z]/, // 第一个字符限制为英文字母
        " ",
        ...Array(6).fill(/\d/),
        " ",
        "(",
        /[A-Z0-9]/,
        ")",
      ],
    },
  });

  const validateHKID = (hkid: string) => {
    // 根据您的要求，只验证 hkid 的格式，不使用完整的 mask
    const hkidRegex = /^[A-Z]{1,2}\d{6}\([A-Z0-9]\)$/;
    return hkidRegex.test(hkid);
  };

  const validateHKID2 = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;

    setIsValid(undefined);

    if (value === "") return;

    const isValidHKID = validateHKID(value);

    if (isValidHKID) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

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
      ],
    },
  });

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validatePhone2 = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;

    setIsValid(undefined);

    if (value === "") return;

    const isValidPhone = validatePhone(value);

    if (isValidPhone) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

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

  // const validateHKID = (value: string) => {
  //   const firstChar = value.charAt(0);
  //   const lastChar = value.charAt(value.length - 1);
  //   const isValidFirstChar = /^[A-Z]$/.test(firstChar);
  //   const isValidLastChar = /^[A-Z0-9]$/.test(lastChar);
  //   return isValidFirstChar && isValidLastChar;
  // };
  const [isTouchedHKID, setIsTouchedHKID] = useState(false);
  const [isTouchedEmail, setIsTouchedEmail] = useState(false);
  const [isTouchedPhone, setIsTouchedPhone] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();

  const isEmailValid = is_email(state.email);

  const canSubmit = isEmailValid;

  // const validateEmail = (email: string) => {
  //   return email.match(
  //     /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  //   );
  // };

  // const validateEmail2 = (ev: Event) => {
  //   const value = (ev.target as HTMLInputElement).value;

  //   setIsValid(undefined);

  //   if (value === "") return;

  //   const isValidEmail = validateEmail(value);

  //   if (isValidEmail && value.includes("@") && value.includes(".")) {
  //     setIsValid(true);
  //   } else {
  //     setIsValid(false);
  //   }
  // };

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
            <IonInput labelPlacement="floating" type="text" label="Username" />
          </IonItem>
          <IonItem>
            <IonInput
              labelPlacement="floating"
              helperText="as shown on HKID"
              type="text"
              label="Full Name"
            />
          </IonItem>
          <IonItem>
            <IonInput
              onIonInput={(event) => validateHKID2(event)}
              onIonBlur={() => setIsTouchedHKID(true)}
              className={`${isValid && "ion-valid"} ${
                isValid === false && "ion-invalid"
              } ${isTouchedHKID && "ion-touched"}`}
              labelPlacement="floating"
              // helperText="Enter Your Hong Kong Identity Card"
              // errorText="Invalid email"
              ref={async (phoneInput) => {
                if (phoneInput) {
                  const input = await phoneInput.getInputElement();
                  HKIDMask(input);
                }
              }}
              type="text"
              fill="solid"
              label="Hong Kong Identity Card"
              placeholder="X XXXXXX (X)"
              onIonChange={(e) => {
                const value = e.detail.value as string;
                const isValid = validateHKID(value);
                if (!isValid) {
                  // 根据需要显示错误信息或执行其他操作
                  console.log("Invalid HKID");
                }
              }}
            />
          </IonItem>
          <IonItem>
            <IonInput
              labelPlacement="floating"
              // helperText="Enter a Card number"
              // errorText="Invalid email"
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
              labelPlacement="floating"
              // helperText="Enter a Phone number"
              // errorText="Invalid email"
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
          <IonItem>
            <IonInput
              value={state.email}
              onIonInput={(e) =>
                setState({ ...state, email: e.detail.value || "" })
              }
              className={
                state.email && !isEmailValid
                  ? "ion-invalid ion-touched"
                  : state.email && isEmailValid
                  ? "ion-valid ion-touched"
                  : ""
              }
              // className={`${isValid && "ion-valid"} ${
              //   isValid === false && "ion-invalid"
              // } ${isTouchedEmail && "ion-touched"}`}
              type="email"
              fill="solid"
              label="Email"
              labelPlacement="floating"
              // helperText="Enter a valid email"
              // errorText="Invalid email"
              // onIonInput={(event) => validateEmail2(event)}
              // onIonBlur={() => setIsTouchedEmail(true)} // 设置isTouched为true
            ></IonInput>
          </IonItem>
          <p>{state.email}</p>
        </IonList>
        <IonButton routerLink="/drawKey" disabled={!canSubmit}>
          SignUp
        </IonButton>
        <p>
          Already have an account?
          <IonButton routerLink="/login">Login</IonButton>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
