import React, { useState, useEffect } from "react";
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
  IonSearchbar,
  IonAccordion,
  IonAccordionGroup,
  IonSegment,
  IonSegmentButton,
  IonIcon,
} from "@ionic/react";
import { star } from "ionicons/icons";
import "./HomePage.css";
import useGet from "../hooks/useGet";
import { del } from "../api/config";
import { useEvent } from "react-use-event";
import { JobCard, jobCardParser } from "../components/JobCard";
import { array, object } from "cast.ts";
import useToast from "../hooks/useToast";
import {
  AddBookmarkEvent,
  CancelJobEvent,
  RemoveBookmarkEvent,
} from "../events";

let bookmarkParser = object({
  jobList: array(jobCardParser),
});

const BookmarkList: React.FC = () => {
  const title = "Bookmark List";

  const [segment, setSegment] = useState<"demand" | "supply">("demand");
  // const [bookmark, setBookmark] = useState(true);
  let bookmarkList = useGet("/jobs/bookmark", bookmarkParser);

  const dispatchRemoveBookmarkEvent =
    useEvent<RemoveBookmarkEvent>("RemoveBookmark");

  useEvent<AddBookmarkEvent>("AddBookmark", (event) => {
    bookmarkList.setData((data) => {
      if (data?.jobList.find((job) => job.job_id == event.job.job_id)) {
        return data;
      }
      return {
        jobList: [event.job, ...(data?.jobList || [])],
      };
    });
  });

  useEvent<CancelJobEvent>("CancelJob", (event) => {
    bookmarkList.setData((json) => ({
      jobList: json!.jobList.filter((job) => job.job_id !== event.job_id),
    }));
  });

  const toast = useToast();

  const deleteBookmark = async (job_id: number) => {
    try {
      let json = await del(`/jobs/${job_id}/bookmark`, object({}));
      // const json = await handleFetch2(`/jobs/bookmark/${bookmarkID}`, "DELETE");
      // if (json.error) {
      //   console.log(json.error);
      //   return;
      // }
      console.log("successfully deleted");
      bookmarkList.setData((data) => ({
        jobList: data!.jobList.filter((bookmark) => bookmark.job_id != job_id),
      }));
      dispatchRemoveBookmarkEvent({ job_id });
      // bookmarkList.reload();
      // const res = await fetch(`${api_origin}/jobs/bookmark/${7}`, {
      //   method: "DELETE",
      //   headers:{
      //     "Content-Type":"application/json",
      //     Accept:"application/json",
      //     authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify(body)
      // })

      // const json = await res.json();
      // if(json.error){
      //   /// Error Handle
      //   return
      // }

      // // Do what you want
    } catch (error) {
      console.log(error);
      toast.showError(error);
      return;
    }
  };

  return (
    <IonPage className="HomePage">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonList class="SH">
            <IonTitle>{title}</IonTitle>
            <IonSearchbar animated={true} placeholder="Search"></IonSearchbar>
          </IonList>
          <IonAccordionGroup>
            <IonAccordion value="first">
              <div slot="content">
                <IonButton>Education</IonButton>
                <IonButton>Cleaning</IonButton>
                <IonButton>Logistics</IonButton>
                <IonButton>Sport</IonButton>
                <IonButton>Travel</IonButton>
                <IonButton>Food and Beverage</IonButton>
                <IonButton>IT</IonButton>
                <IonButton>Photography</IonButton>
                <IonButton>Journalist</IonButton>
                <IonButton>Designer</IonButton>
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value as any)}
        >
          <IonSegmentButton value="demand">demand</IonSegmentButton>
          <IonSegmentButton value="supply">supply</IonSegmentButton>
        </IonSegment>
        <div>
          {bookmarkList.render((json) =>
            json.jobList
              ?.filter((job) => job.type == segment)
              .map((job, index) => {
                return (
                  <JobCard
                    key={index}
                    job={job}
                    buttons={
                      <IonButton onClick={() => deleteBookmark(job.job_id)}>
                        <IonIcon slot="icon-only" icon={star}></IonIcon>
                      </IonButton>
                    }
                  />
                );
              })
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookmarkList;
