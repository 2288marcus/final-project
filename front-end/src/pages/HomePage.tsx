import React, { useState, useEffect } from "react";
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
  IonAvatar,
  IonLabel,
  IonSearchbar,
  IonAccordion,
  IonAccordionGroup,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonChip,
  IonIcon,
  IonCardContent,
  IonNavLink,
  IonRouterLink,
} from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import "./HomePage.css";
import { get, post } from "../api/config";
import useGet from "../hooks/useGet";
import {
  array,
  date,
  float,
  id,
  object,
  string,
  values,
  ParseResult,
  int,
  number,
} from "cast.ts";
import { routes } from "../routes";
import { JobCard, jobCardParser } from "../components/JobCard";
import { useEvent } from "react-use-event";
import { AddBookmarkEvent, RemoveBookmarkEvent } from "../events";

function Fake() {
  return <div className="real"></div>;
}

let jobListParser = object({
  jobList: array(jobCardParser),
});

let bookmarkParser = object({
  bookmarkList: array(
    object({
      id: number(),
      username: string(),
      job_id: number(),
      title: string(),
      description: string(),
      price: number(),
      type: values(["demand" as const, "supply" as const]),
    })
  ),
});

const HomePage: React.FC = () => {
  const title = "Home";

  const [segment, setSegment] = useState<"demand" | "supply">("demand");

  let jobList = useGet("/jobs", jobListParser);

  useEvent<RemoveBookmarkEvent>("RemoveBookmark", (event) => {
    jobList.setData((data) => {
      console.log("update", { event, data });
      if (!data?.jobList) return data;
      return {
        jobList: data.jobList.map((job) => {
          if (job.job_id == event.job_id) {
            return {
              ...job,
              has_bookmark: 0,
            };
          }
          return job;
        }),
      };
    });
  });

  useEvent<AddBookmarkEvent>("AddBookmark", (event) => {
    jobList.setData((data) => {
      console.log("update", { event, data });
      if (!data?.jobList) return data;
      return {
        jobList: data.jobList.map((job) => {
          if (job.job_id == event.job.job_id) {
            return {
              ...job,
              has_bookmark: 1,
            };
          }
          return job;
        }),
      };
    });
  });

  return (
    <IonPage className="HomePage">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonList class="SH">
            <IonTitle>Home Page</IonTitle>
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
              .map((job, index) => {
                return <JobCard key={index} job={job} />;
              })
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
