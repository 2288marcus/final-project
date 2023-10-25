import React, { useState, useEffect } from "react";
import {
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
  IonButton,
  IonIcon,
  IonSearchbar,
  IonChip,
  IonInput,
  IonItem,
  IonLabel,
  IonListHeader,
  IonNote,
} from "@ionic/react";
import "./HomePage.css";
import useGet from "../hooks/useGet";
import { useEvent } from "react-use-event";
import {
  AddBookmarkEvent,
  CancelJobEvent,
  NewJobEvent,
  RemoveBookmarkEvent,
} from "../events";
import { get, post } from "../api/config";
import { array, object, string, ParseResult, id, int } from "cast.ts";
import { JobCard, JobCardData, jobCardParser } from "../components/JobCard";
import useToast from "../hooks/useToast";
import { add, star, starOutline } from "ionicons/icons";

let jobListParser = object({
  jobList: array(jobCardParser),
});

const HomePage: React.FC = () => {
  const title = "Home";

  const [segment, setSegment] = useState<"demand" | "supply">("demand");

  /////////////////////////////////////////////////

  let getTagListParser = object({
    tagList: array(
      object({
        id: id(),
        name: string(),
        used: int(),
      })
    ),
  });

  const commonTags = useGet("/tags", getTagListParser);
  type Tag = ParseResult<typeof getTagListParser>["tagList"][number];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [searchedTags, setSearchedTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!newTag) {
      setSearchedTags([]);
      return;
    }
    get("/tags/search?" + new URLSearchParams({ q: newTag }), getTagListParser)
      .then((json) => {
        setSearchedTags(json.tagList);
      })
      .catch((err) => {
        toast.showError(err);
      });
  }, [newTag]);
  /////////////////////////////////////////////////

  const toast = useToast();
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

  useEvent<CancelJobEvent>("CancelJob", (event) => {
    jobList.setData((json) => ({
      jobList: json!.jobList.filter((job) => job.job_id !== event.job_id),
    }));
  });

  useEvent<NewJobEvent>("NewJob", (event) => {
    jobList.setData((json) => ({
      jobList: [event.job, ...(json?.jobList || [])],
    }));
  });

  const dispatchAddBookmarkEvent = useEvent<AddBookmarkEvent>("AddBookmark");

  const addBookmark = async (job: JobCardData) => {
    try {
      const json = await post(`/jobs/${job.job_id}/bookmark`, {}, object({}));
      console.log("successfully add");
      dispatchAddBookmarkEvent({ job });
    } catch (error) {
      console.log(error);
      toast.showError(error);
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
        {/* /////////////////////////////// */}
        <div>
          <IonItem>
            <IonLabel position="fixed">Search:</IonLabel>
            <IonInput
              placeholder="Enter"
              type="text"
              value={newTag}
              onIonInput={(e) => setNewTag(e.detail.value || "")}
            />
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  setSelectedTags([...selectedTags, newTag]);
                  setNewTag("");
                }}
              >
                <IonIcon src={add}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonItem>
        </div>
        <IonListHeader>Selected Tags:</IonListHeader>
        <div className="ion-padding-horizontal d-flex">
          {selectedTags.length == 0 ? (
            <IonNote className="ion-padding-horizontal">No result</IonNote>
          ) : null}
          {selectedTags.map((tag) => (
            <IonChip
              key={tag}
              onClick={() =>
                setSelectedTags(
                  selectedTags.filter((selectedTag) => selectedTag != tag)
                )
              }
            >
              {tag}
            </IonChip>
          ))}
        </div>
        {newTag && searchedTags.length > 0}
        {/* /////////////////////////////// */}
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
                return (
                  <JobCard
                    key={index}
                    job={job}
                    buttons={
                      <IonButton
                        hidden={!job.job_id}
                        onClick={() => addBookmark(job)}
                      >
                        <IonIcon
                          slot="icon-only"
                          icon={job.has_bookmark == 0 ? starOutline : star}
                        ></IonIcon>
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

export default HomePage;
