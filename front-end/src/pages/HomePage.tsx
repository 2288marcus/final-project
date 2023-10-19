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
} from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import "./HomePage.css";
import useGet from "../hooks/useGet";
import { array, date, float, id, object, string, values } from "cast.ts";

function Fake() {
  return <div className="real"></div>;
}

let jobListParser = object({
  jobList: array(
    object({
      job_id: id(),
      username: string(),
      user_id: id(),
      title: string(),
      description: string(),
      price: float(),
      created_at: date(),
      type: values(["demand" as const, "supply" as const]),
      tags: array(string()),
    })
  ),
});

const HomePage: React.FC = () => {
  const title = "Home";

  const [segment, setSegment] = useState<"demand" | "supply">("demand");
  const [Bookmark, setBookmark] = useState(false);

  let jobList = useGet("/jobs", jobListParser);
  // console.log("jobList:", jobList);

  // const [items, setItems] = useState<string[]>([]);

  // const generateItems = () => {
  //   const newItems = [];
  //   for (let i = 0; i < 50; i++) {
  //     newItems.push(`Job ${1 + items.length + i}`);
  //   }
  //   setItems([...items, ...newItems]);
  // };

  // useEffect(() => {
  //   generateItems();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
              <IonItem slot="header" color="light">
                <IonLabel>Common Tag</IonLabel>
              </IonItem>
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
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <IonContent class="indexcontent">
          <IonContent>
            <IonButton href="./JobList">Job</IonButton>
            <JobList />
          </IonContent>
          <IonContent>
            <IonButton href="./Userlist">User</IonButton>
            <UserList />
          </IonContent>
        </IonContent> */}
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
              .map((job) => (
                <IonCard key={job.job_id}>
                  <IonCardContent>
                    <div className="d-flex align-center" style={{ gap: "8px" }}>
                      <div className="d-flex col align-center ion-justify-content-center">
                        <IonAvatar>
                          <img
                            src={
                              "https://picsum.photos/80/80?random=" + job.job_id
                            }
                            alt="avatar"
                          />
                        </IonAvatar>
                        <span className="author-name">{job.username}</span>
                      </div>
                      <div>
                        <h1>- {job.title} -</h1>
                        <p>{job.description}</p>
                      </div>
                      <IonButtons slot="end">
                        <IonButton
                          onClick={() => {
                            setBookmark(!Bookmark);
                          }}
                        >
                          <IonIcon
                            slot="icon-only"
                            icon={Bookmark ? star : starOutline}
                          ></IonIcon>
                        </IonButton>
                      </IonButtons>
                    </div>
                  </IonCardContent>
                  <div>
                    {job.tags.map((tag) => (
                      <IonChip key={tag}>{tag}</IonChip>
                    ))}
                  </div>
                </IonCard>
              ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
