import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
} from "@ionic/react";
import { close, create, save } from "ionicons/icons";
import { useEffect, useState } from "react";

export type InputContext<T> = {
  state: T;
  setState?: (value: T) => void;
  reset?: () => void;
  editingField?: keyof T;
  setEditingField?(value?: keyof T): void;
  alwaysEditable?: boolean;
};

export function InputField<T>(props: {
  inputContext: InputContext<T>;
  label: string | undefined | null;
  field: keyof T;
  editable?: boolean;
  type?: "text" | "textarea";
  placeholder?: string;
  helperText?: string;
  errorText?: string;
}) {
  const Input = props.type == "textarea" ? IonTextarea : IonInput;

  type Mode = "view" | "edit" | "cancel" | "save";

  const [mode, setMode] = useState<Mode>("view");

  async function saveProfile() {
    // TODO post to server
    setTimeout(() => {
      setMode("view");
    }, 5000);
  }

  const { field, editable } = props;
  const { setEditingField, reset, state, setState, editingField } =
    props.inputContext;

  const shouldResetEditingField = mode != "edit" && editingField == field;

  useEffect(() => {
    if (shouldResetEditingField) {
      setEditingField?.();
    }
    switch (mode) {
      case "edit":
        setEditingField?.(field);
        return;
      case "cancel":
        reset?.();
        setMode("view");
        return;
      case "save":
        saveProfile();
        return;
    }
  }, [
    shouldResetEditingField,
    mode,
    setEditingField,
    saveProfile,
    reset,
    field,
  ]);

  return (
    <div className="flex-grow HalfInputField">
      <IonItem lines={props.errorText ? "none" : undefined}>
        {/* <IonLabel position={mode == "view" ? "fixed" : "floating"}>
          {props.label}
        </IonLabel> */}
        <Input
          className={props.errorText ? "ion-invalid ion-touched" : ""}
          label={props.label!}
          labelPlacement={mode == "view" ? "fixed" : "floating"}
          autoGrow
          value={String(state[field])}
          placeholder={props.placeholder}
          helperText={props.helperText}
          errorText={props.errorText}
          onIonChange={(e) =>
            setState?.({
              ...state,
              [props.field]: e.detail.value || "",
            })
          }
          readonly={mode != "edit" && !props.inputContext.alwaysEditable}
        />
        <IonButtons slot="end">
          <IonButton
            slot="end"
            size="small"
            color="primary"
            onClick={() => setMode("edit")}
            hidden={!editable || mode != "view"}
            disabled={editingField && editingField != field}
          >
            <IonIcon src={create} slot="icon-only"></IonIcon>
          </IonButton>
        </IonButtons>
      </IonItem>
      <div className="d-flex">
        <IonButton
          color="dark"
          className="flex-grow ion-no-margin"
          expand="full"
          onClick={() => setMode("cancel")}
          hidden={mode != "edit"}
        >
          <IonIcon src={close} slot="icon-only"></IonIcon>
        </IonButton>
        <IonButton
          color="success"
          className="flex-grow ion-no-margin"
          expand="full"
          onClick={() => setMode("save")}
          hidden={mode != "edit"}
        >
          <IonIcon src={save} slot="icon-only"></IonIcon>
        </IonButton>
        <IonButton
          color="success"
          className="flex-grow ion-no-margin"
          expand="full"
          disabled
          hidden={mode != "save"}
        >
          Saving ...
        </IonButton>
      </div>
    </div>
  );
}
