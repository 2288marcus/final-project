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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonAvatar,
  IonLabel,
  IonSearchbar,
  IonAccordion,
  IonAccordionGroup,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonChip,
  IonBadge,
  IonCardContent,
} from "@ionic/react";
import "./index.css";
import JobList from "./JobList";
import UserList from "./UserList";

function Fake() {
  return <div className="real"></div>;
}

const Index: React.FC = () => {
  const title = "Index";

  const [segment, setSegment] = useState("job");

  const [items, setItems] = useState<string[]>([]);

  const generateItems = () => {
    const newItems = [];
    for (let i = 0; i < 50; i++) {
      newItems.push(`Job ${1 + items.length + i}`);
    }
    setItems([...items, ...newItems]);
  };

  useEffect(() => {
    generateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
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
          onIonChange={(e) => setSegment(e.detail.value as string)}
        >
          <IonSegmentButton value="job">Jobs</IonSegmentButton>
          <IonSegmentButton value="user">Users</IonSegmentButton>
        </IonSegment>
        {segment == "job" ? (
          <>
            {[
              {
                id: 1,
                name: "alice",
                tags: ["sport", "travel"],
                title: "Teach me React",
              },
              {
                id: 2,
                name: "batty",
                tags: ["cleaning"],
                title: "Teach me ",
              },
              {
                id: 3,
                name: "cat",
                tags: ["sport", "travel", "IT"],
                title: "Teach me ride",
              },
            ].map((item) => (
              <IonCard key={item.id}>
                <IonCardContent>
                  <div className="d-flex align-center" style={{ gap: "8px" }}>
                    <div className="d-flex col align-center ion-justify-content-center">
                      <IonAvatar>
                        <img
                          src={"https://picsum.photos/80/80?random=" + item.id}
                          alt="avatar"
                        />
                      </IonAvatar>
                      <span className="author-name">{item.name}</span>
                    </div>
                    <div>
                      <h1>- {item.title} -</h1>
                      <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Fugit ipsa eligendi, optio provident aut dolore
                        ullam quae iusto, deleniti consequuntur debitis culpa in
                        aspernatur sunt error doloremque facilis accusamus
                        maxime?
                      </p>
                    </div>
                  </div>
                </IonCardContent>
                <div hidden={item.id != 1}>
                  {item.tags.map((tag) => (
                    <IonChip key={tag}>{tag}</IonChip>
                  ))}
                </div>
                <div className="tag-list" hidden={item.id != 2}>
                  {item.tags.map((tag) => (
                    <IonBadge key={tag}>{tag}</IonBadge>
                  ))}
                </div>
                <div hidden={item.id != 3}>
                  {item.tags.map((tag) => (
                    <IonButton size="small" key={tag}>
                      {tag}
                    </IonButton>
                  ))}
                </div>
              </IonCard>
            ))}
          </>
        ) : null}
        {/* {segment == "user" ? <>222</> : null} */}
        {segment == "user" ? (
          <>
            {[
              {
                id: 1,
                name: "i",
                tags: ["sport", "travel"],
                title: "Teach me React",
              },
              {
                id: 2,
                name: "k",
                tags: ["cleaning"],
                title: "Teach me ",
              },
              {
                id: 3,
                name: "g",
                tags: ["sport", "travel", "IT"],
                title: "Teach me ride",
              },
            ].map((item) => (
              <IonCard key={item.id}>
                <IonCardContent>
                  <div className="d-flex align-center" style={{ gap: "8px" }}>
                    <div className="d-flex col align-center ion-justify-content-center">
                      <IonAvatar>
                        <img
                          src={"https://picsum.photos/80/80?random=" + item.id}
                          alt="avatar"
                        />
                      </IonAvatar>
                      <span className="author-name">{item.name}</span>
                    </div>
                    <div>
                      <h1>- {item.title} -</h1>
                      <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Fugit ipsa eligendi, optio provident aut dolore
                        ullam quae iusto, deleniti consequuntur debitis culpa in
                        aspernatur sunt error doloremque facilis accusamus
                        maxime?
                      </p>
                    </div>
                  </div>
                </IonCardContent>
                <div hidden={item.id != 1}>
                  {item.tags.map((tag) => (
                    <IonChip key={tag}>{tag}</IonChip>
                  ))}
                </div>
                <div className="tag-list" hidden={item.id != 2}>
                  {item.tags.map((tag) => (
                    <IonBadge key={tag}>{tag}</IonBadge>
                  ))}
                </div>
                <div hidden={item.id != 3}>
                  {item.tags.map((tag) => (
                    <IonButton size="small" key={tag}>
                      {tag}
                    </IonButton>
                  ))}
                </div>
              </IonCard>
            ))}
          </>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default Index;
