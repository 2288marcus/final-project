import React, { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  useIonAlert,
} from "@ionic/react";
import { trash } from "ionicons/icons";
import "./HomePage.css";
import useGet from "../hooks/useGet";
import { array, date, object } from "cast.ts";
import { post } from "../api/config";
import useAuth from "../hooks/useAuth";
import { JobCard, jobCardParser } from "../components/JobCard";
import { del } from "../api/config";
import useToast from "../hooks/useToast";
import useEvent from "react-use-event";
import { CancelJobEvent, NewJobEvent } from "../events";

let jobListParser = object({
  jobList: array(jobCardParser),
});

const MyJobList: React.FC = () => {
  const title = "My Jobs";

  const [segment, setSegment] = useState<"demand" | "supply" | "Cancel">(
    "demand"
  );

  const user_id = useAuth().state?.id;
  let jobList = useGet(`/jobs/search?user_id=${user_id}`, jobListParser);
  /////////////////////////////////////
  useEvent<NewJobEvent>("NewJob", (event) => {
    jobList.setData((json) => ({
      jobList: [event.job, ...(json?.jobList || [])],
    }));
  });
  const dispatchCancelJobEvent = useEvent<CancelJobEvent>("CancelJob");

  const toast = useToast();

  const [presentAlert] = useIonAlert();

  async function cancelJob(job_id: number) {
    presentAlert("Confirm to cancel job #" + job_id + " ?", [
      {
        text: "Keep the job",
        role: "cancel",
      },
      {
        text: "Cancel job",
        role: "destructive",
        handler: async () => {
          try {
            let json = await post(`/jobs/${job_id}/cancel`, {}, object({}));
            toast.showSuccess("cancelled job #" + job_id);
            jobList.setData((json) => ({
              jobList: json!.jobList.filter((job) => job.job_id !== job_id),
            }));
            dispatchCancelJobEvent({ job_id });
          } catch (error) {
            toast.showError(error);
          }
        },
      },
    ]);
  }

  ///////////////////////////////////////////
  return (
    <IonPage className="HomePage">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonList class="SH">
            <IonTitle>{title}</IonTitle>
          </IonList>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value as any)}
        >
          <IonSegmentButton value="demand">demand</IonSegmentButton>
          <IonSegmentButton value="supply">supply</IonSegmentButton>
        </IonSegment>
        <div>
          {jobList.render((json) =>
            json.jobList
              ?.filter((job) => job.type == segment)
              .map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  buttons={
                    <IonButton
                      color="danger"
                      onClick={() => cancelJob(job.job_id)}
                    >
                      <IonIcon src={trash} slot="icon-only"></IonIcon>
                    </IonButton>
                  }
                />
              ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyJobList;
