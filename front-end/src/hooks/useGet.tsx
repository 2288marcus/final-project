import { Parser } from "cast.ts";
import { useEffect, useState } from "react";
import { get } from "../api/config";
import { IonButton, IonButtons, IonIcon, IonText } from "@ionic/react";
import { reloadCircle } from "ionicons/icons";

export default function useGet<T>(url: string, parser: Parser<T>) {
  type State = T & { error?: string };
  const [data, setData] = useState<State>();

  function reload() {
    setTimeout(async () => {
      try {
        let json = await get(url, parser);
        setData(json as State);
      } catch (error) {
        setData({ error } as State);
      }
    }, 1000);
  }

  useEffect(() => {
    reload();
  }, []);

  function render(customRender: (data: T) => any) {
    if (!data) {
      return <p className="ion-text-center">Loading ...</p>;
    }
    if (data.error) {
      return (
        <>
          <p className="ion-text-center">
            <IonText color="danger">
              {String(data.error).replace("TypeError: ", "")}
            </IonText>
          </p>
          <div className="ion-text-center">
            <IonButton onClick={reload}>
              <IonIcon slot="start" src={reloadCircle}></IonIcon>
              Retry
            </IonButton>
          </div>
        </>
      );
    }

    return customRender(data);
  }

  return { data, setData, reload, render };
}
