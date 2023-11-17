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
import useToast from "../hooks/useToast";

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
  type?: "text" | "textarea" | "timestamp";
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  save?: (field: keyof T) => Promise<void>;
}) {
  const Input = props.type == "textarea" ? IonTextarea : IonInput;

  type Mode = "view" | "edit" | "cancel" | "save";

  const [mode, setMode] = useState<Mode>("view");

  const toast = useToast();

  async function saveProfile() {
    try {
      console.log("has save?", typeof props.save);
      await props.save?.(props.field);
      setMode("view");
      console.log("saved", props.field);
    } catch (error) {
      console.log("failed to save", props.field, error);
      setMode("edit");
      toast.showError(error);
    }
  }

  const { field } = props;
  const editable = !!props.save;
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

  let value = String(state[field]);
  if (props.type == "timestamp") {
    value = new Date(value).toLocaleString("zh-cn");
  }

  return (
    <div className="flex-grow HalfInputField">
      <IonItem lines={props.errorText ? "none" : undefined}>
        <Input
          className={props.errorText ? "ion-invalid ion-touched" : ""}
          label={props.label!}
          labelPlacement={mode == "view" ? "fixed" : "floating"}
          autoGrow
          value={value}
          placeholder={props.placeholder}
          helperText={props.helperText}
          errorText={props.errorText}
          onIonInput={(e) =>
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
