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
  useIonRouter,
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
import { routes } from "../routes";
import useAuth from "../hooks/useAuth";

let bookmarkParser = object({
  jobList: array(jobCardParser),
});

const BookmarkList: React.FC = () => {
  const title = "Bookmark List";

  const user_id = useAuth().state?.id;

  const [segment, setSegment] = useState<"demand" | "supply">("supply");

  const [searchText, setSearchText] = useState("");
  const toast = useToast();
  let bookmarkList = useGet(
    "/jobs/bookmark?" + new URLSearchParams({ keyword: searchText }),
    bookmarkParser
  );

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

  const deleteBookmark = async (job_id: number) => {
    try {
      let json = await del(`/jobs/${job_id}/bookmark`, object({}));

      console.log("successfully deleted");
      bookmarkList.setData((data) => ({
        jobList: data!.jobList.filter((bookmark) => bookmark.job_id != job_id),
      }));
      dispatchRemoveBookmarkEvent({ job_id });
    } catch (error) {
      console.log(error);
      toast.showError(error);
      return;
    }
  };

  const router = useIonRouter();

  const startChatroom = async (job_id: number) => {
    post(`/chat/${job_id}/start-chat`, {}, object({ chatroom_id: number() }))
      .then((json) => {
        console.log("POST result:", json);
        let chatroom_id = json.chatroom_id;
        // 在这里执行打开新聊天室的操作，例如导航到聊天室页面
        // TODO
        dispatchAddChatroomEvent({ chatroom_id });
        router.push(routes.Chatroom(chatroom_id));
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
            <IonTitle>{title}</IonTitle>{" "}
          </IonList>
        </IonToolbar>
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value || "")}
        />
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
                    tagOnClick={(tag) => {
                      setSearchText((searchText.trim() + " " + tag).trim());
                    }}
                    key={index}
                    job={job}
                    buttons={[
                      <IonButton
                        disabled={job.user_id == user_id}
                        onClick={() => startChatroom(job.job_id)}
                      >
                        chat
                      </IonButton>,
                      <IonButton
                        disabled={job.user_id == user_id}
                        onClick={() => deleteBookmark(job.job_id)}
                      >
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
