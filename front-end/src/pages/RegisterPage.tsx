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
import { useForm, SubmitHandler, set } from "react-hook-form";
import {
  is_email,
  is_hk_mobile_phone,
  to_full_hk_mobile_phone,
} from "@beenotung/tslib/validate";

const RegisterPage: React.FC = () => {
  const title = "Register";

  const [stateUsername, setStateUsername] = useState({ username: "" });
  const [stateEmail, setStateEmail] = useState({ email: "" });
  const [stateHKID, setStateHKID] = useState({ HKID: "" });
  const [stateCard, setStateCard] = useState({ card: "" });
  const [statePhone, setStatePhone] = useState({ phone: "" });

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9]{6,}$/;
    return usernameRegex.test(username);
  };

  // const validateUsername2 = (ev: Event) => {
  //   const value = (ev.target as HTMLInputElement).value;

  //   setIsValidUsername(undefined);

  //   if (value === "") return;

  //   const isValidUsername = validateUsername(value);

  //   if (isValidUsername) {
  //     setIsValidUsername(true);
  //   } else {
  //     setIsValidUsername(false);
  //   }
  // };

  const HKIDMask = useMaskito({
    options: {
      mask: [
        /[A-Z]/, // 第一个字符限制为英文字母

        ...Array(6).fill(/\d/),

        /[A-Z0-9]/,
      ],
    },
  });

  const validateHKID = (HKID: string) => {
    // 根据您的要求，只验证 hkid 的格式，不使用完整的 mask
    const hkidRegex = /^[A-Z]{1,2}\d{6}\([A-Z0-9]\)$/;
    return hkidRegex.test(HKID);
  };

  // const validateHKID2 = (ev: Event) => {
  //   const inputElement = ev.target as HTMLInputElement | null;

  //   if (!inputElement) return;

  //   const value = inputElement.value;

  //   setIsValidHKID(undefined);

  //   if (value === "") return;

  //   const isValidHKID = validateHKID(value);

  //   if (isValidHKID) {
  //     setIsValidHKID(true);
  //     // inputElement.classList.add("ion-touched");
  //   } else {
  //     setIsValidHKID(false);
  //     // inputElement.classList.remove("ion-valid");
  //   }
  // };

  const validateCard = (card: string) => {
    const cardRegex = /^\d{4} \d{4} \d{4} \d{4}$/;
    return cardRegex.test(card);
  };

  // const validateCard2 = (ev: Event) => {
  //   const value = (ev.target as HTMLInputElement).value;

  //   setIsValidCard(undefined);

  //   if (value === "") return;

  //   const isValidCard = validateCard(value);

  //   if (isValidCard) {
  //     setIsValidCard(true);
  //   } else {
  //     setIsValidCard(false);
  //   }
  // };

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

  // const validatePhone2 = (ev: Event) => {
  //   const value = (ev.target as HTMLInputElement).value;

  //   setIsValidPhone(undefined);

  //   if (value === "") return;

  //   const isValidPhone = validatePhone(value);

  //   if (isValidPhone) {
  //     setIsValidPhone(true);
  //   } else {
  //     setIsValidPhone(false);
  //   }
  // };

  const phoneMask = useMaskito({
    options: {
      mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    },
  });

  const [isTouchedHKID, setIsTouchedHKID] = useState(false);
  const [isTouchedEmail, setIsTouchedEmail] = useState(false);
  const [isTouchedPhone, setIsTouchedPhone] = useState(false);
  const [isTouchedCard, setIsTouchedCard] = useState(false);
  const [isTouchedUsername, setIsTouchedUsername] = useState(false);

  const [HKID, setHKID] = useState<string>();
  const [Card, setCard] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [username, setUsername] = useState<string>();

  const [IsValidUsername, setIsValidUsername] = useState<boolean>();
  const [IsValidHKID, setIsValidHKID] = useState<boolean>();
  const [IsValidPhone, setIsValidPhone] = useState<boolean>();
  const [IsValidCard, setIsValidCard] = useState<boolean>();

  const { register, handleSubmit } = useForm();
  const isEmailValid = is_email(email as string);

  const canSubmit = isEmailValid;

  const onSubmit = (data: any) => {
    data["HKID"] = HKID;
    data["Card"] = Card;
    data["phone"] = phone;
    console.log("data:", data);
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonInput //username
                // onIonInput={(event) => validateUsername2(event)}
                // onIonBlur={() => setIsTouchedUsername(true)}
                labelPlacement="floating"
                className={`${IsValidUsername && "ion-valid"} ${
                  IsValidUsername === false && "ion-invalid"
                } ${isTouchedEmail && "ion-touched"}`}
                fill="solid"
                type="text"
                label="Username"
                {...register("username")}
              />
            </IonItem>
            <IonItem>
              <IonInput //fullname
                labelPlacement="floating"
                helperText="as shown on HKID"
                fill="solid"
                type="text"
                label="Full Name"
                {...register("fullName")}
              />
            </IonItem>
            <IonItem>
              <IonInput //HKID
                onIonInput={(e) => {
                  setStateHKID({ ...stateHKID, HKID: e.detail.value || "" });
                  setHKID(e.detail.value as string);
                }}
                {...register("HKID")}
                className={
                  stateHKID.HKID && !isTouchedHKID
                    ? "ion-invalid ion-touched"
                    : stateHKID.HKID && isTouchedHKID
                    ? "ion-valid ion-touched"
                    : ""
                }
                labelPlacement="floating"
                ref={async (HKIDInput) => {
                  if (HKIDInput) {
                    const input = await HKIDInput.getInputElement();
                    HKIDMask(input);
                  }
                }}
                fill="solid"
                label="Hong Kong Identity Card"
                placeholder="A 123456 (7)"
                onIonChange={(e) => {
                  const value = e.detail.value as string;
                  const IsValidHKID = validateHKID(value);
                  if (!IsValidHKID) {
                    console.log("Invalid HKID");
                  }
                  setHKID(value);
                }}
              />
            </IonItem>
            <IonItem>
              <IonInput //card
                onIonInput={(e) => {
                  setStateCard({ ...stateCard, card: e.detail.value || "" });
                  setCard(e.detail.value as string);
                }}
                className={
                  stateCard.card && !isTouchedCard
                    ? "ion-invalid ion-touched"
                    : stateCard.card && isTouchedCard
                    ? "ion-valid ion-touched"
                    : ""
                }
                labelPlacement="floating"
                ref={async (cardRef) => {
                  if (cardRef) {
                    const input = await cardRef.getInputElement();
                    cardMask(input);
                  }
                }}
                fill="solid"
                label="Card number"
                placeholder="0000 0000 0000 0000"
                onIonChange={(e) => {
                  const value = e.detail.value as string;
                  const IsValidCard = validateCard(value);
                  if (!IsValidCard) {
                    console.log("Invalid Card");
                  }
                  setCard(value);
                }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonInput //phone
                className={
                  statePhone.phone && !isTouchedPhone
                    ? "ion-invalid ion-touched"
                    : statePhone.phone && isTouchedPhone
                    ? "ion-valid ion-touched"
                    : ""
                }
                ref={async (phoneInput) => {
                  if (phoneInput) {
                    const input = await phoneInput.getInputElement();
                    phoneMask(input);
                  }
                }}
                fill="solid"
                label="HK phone number"
                labelPlacement="floating"
                placeholder="+(852) xxxx-xxxx"
                onIonChange={(e) => {
                  setPhone(e.detail.value as string);
                }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonInput //email
                onIonInput={(e) => {
                  setStateEmail({ ...stateEmail, email: e.detail.value || "" });
                  setEmail(e.detail.value as string);
                }}
                {...register("email")}
                className={
                  stateEmail.email && !isEmailValid
                    ? "ion-invalid ion-touched"
                    : stateEmail.email && isEmailValid
                    ? "ion-valid ion-touched"
                    : ""
                }
                type="email"
                fill="solid"
                label="Email"
                labelPlacement="floating"
                placeholder="example@mail.com"
              ></IonInput>
            </IonItem>
            <IonButton
              type="submit"
              // routerLink="/drawKey"
              disabled={!canSubmit}
            >
              SignUp
            </IonButton>
          </form>
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
