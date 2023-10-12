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
import { useForm, SubmitHandler } from "react-hook-form";
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

        ...Array(6).fill(/\d/),

        /[A-Z0-9]/,
      ],
    },
  });

  const validateHKID = (hkid: string) => {
    // 根据您的要求，只验证 hkid 的格式，不使用完整的 mask
    const hkidRegex = /^[A-Z]{1,2}\d{6}\([A-Z0-9]\)$/;
    return hkidRegex.test(hkid);
  };

  const validateHKID2 = (ev: Event) => {
    const inputElement = ev.target as HTMLInputElement | null;

    if (!inputElement) return;

    const value = inputElement.value;

    setIsValid(undefined);

    if (value === "") return;

    const isValidHKID = validateHKID(value);

    if (isValidHKID) {
      setIsValid(true);
      // inputElement.classList.add("ion-touched");
    } else {
      setIsValid(false);
      // inputElement.classList.remove("ion-valid");
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
      mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
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
  const [hkId, setHkId] = useState<string>();
  const [hkPhone, setHkPhone] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [isValid, setIsValid] = useState<boolean>();

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
  const { register, handleSubmit } = useForm();
  const isEmailValid = is_email(email as string);

  const canSubmit = isEmailValid;

  const onSubmit = (data: any) => console.log("data:", data);
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
              <IonInput
                labelPlacement="floating"
                type="text"
                label="Username"
                {...register("username")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                labelPlacement="floating"
                helperText="as shown on HKID"
                type="text"
                label="Full Name"
                {...register("fullName")}
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
                // ref={async (phoneInput) => {
                //   if (phoneInput) {
                //     const input = await phoneInput.getInputElement();
                //     HKIDMask(input);
                //   }
                // }}
                {...register("HKID")}
                type="text"
                fill="solid"
                label="Hong Kong Identity Card"
                placeholder="A 123456 (7)"
                onIonChange={(e) => {
                  const value = e.detail.value as string;
                  const isValid = validateHKID(value);
                  if (!isValid) {
                    // 根据需要显示错误信息或执行其他操作
                    console.log("Invalid HKID");
                  }
                  setHkId(value);
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
                // helperText="Enter a Phone number"
                // errorText="Invalid email"
                // ref={async (phoneInput) => {
                //   if (phoneInput) {
                //     const input = await phoneInput.getInputElement();
                //     phoneMask(input);
                //   }
                // }}
                {...register("HK phone")}
                type="text"
                fill="solid"
                label="HK phone number"
                labelPlacement="floating"
                placeholder="+(852) xxxx-xxxx"
                onIonChange={(e) => {
                  setHkPhone(e.detail.value as string);
                }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                // value={state.email}
                onIonInput={(e) => {
                  setState({ ...state, email: e.detail.value || "" });
                  setEmail(e.detail.value as string);
                }}
                {...register("email")}
                className={
                  state.email && !isEmailValid
                    ? "ion-invalid ion-touched"
                    : state.email && isEmailValid
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
              routerLink="/drawKey"
              disabled={!canSubmit}
            >
              SignUp
            </IonButton>
          </form>
          {/* <p>{state.email}</p> */}
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
