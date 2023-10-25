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
import { add, star } from "ionicons/icons";
import "./HomePage.css";
import useGet from "../hooks/useGet";
import { del, post } from "../api/config";
import { useEvent } from "react-use-event";
import { JobCard, jobCardParser } from "../components/JobCard";
import { array, number, object } from "cast.ts";
import useToast from "../hooks/useToast";
import {
  AddBookmarkEvent,
  AddChatroomEvent,
  CancelJobEvent,
  RemoveBookmarkEvent,
} from "../events";
import { useParams } from "react-router";

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

  const dispatchAddChatroomEvent = useEvent<AddChatroomEvent>("AddChatroom");

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

  const startChatroom = async (job_id: number) => {
    post(`/chat/${job_id}/start-chat`, {}, object({ chatroom_id: number() }))
      .then((json) => {
        console.log("POST result:", json);
        let chatroom_id = json.chatroom_id;
        // 在这里执行打开新聊天室的操作，例如导航到聊天室页面
        // TODO
        dispatchAddChatroomEvent({ chatroom_id });
      })
      .catch((error) => {
        toast.showError(error);
      });
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
                    buttons={[
                      <IonButton onClick={() => startChatroom(job.job_id)}>
                        chat
                      </IonButton>,
                      <IonButton onClick={() => deleteBookmark(job.job_id)}>
                        <IonIcon slot="icon-only" icon={star}></IonIcon>
                      </IonButton>,
                    ]}
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
