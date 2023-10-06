import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  searchCircleOutline,
  settingsOutline,
  settingsSharp,
  searchCircle,
  chatbox,
  person,
  personCircle,
  mail,
  reader,
  earth,
} from "ionicons/icons";
import "./Menu.css";
import useToken from "../hooks/useToken";
import ProfilePage from "../pages/ProfilePage";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Login / Register",
    url: "/login",
    iosIcon: mailOutline,
    mdIcon: mailSharp,
  },
  {
    title: "Services",
    url: "/JobList",
    iosIcon: earth,
    mdIcon: earth,
  },
  // {
  //   title: "BookmarkList",
  //   url: "/BookmarkList",
  //   iosIcon: heartOutline,
  //   mdIcon: heartSharp,
  // },
  {
    title: "Chatroom",
    url: "/Chatroom",
    iosIcon: "",
    mdIcon: "",
  },
  {
    title: "ChatroomList",
    url: "/ChatroomList",
    iosIcon: mail,
    mdIcon: mail,
  },
  {
    title: "Profile",
    url: "/ProfilePage",
    iosIcon: personCircle,
    mdIcon: personCircle,
  },
  {
    title: "Requirement",
    url: "/RequirementPage",
    iosIcon: reader,
    mdIcon: reader,
  },
  {
    title: "Setting",
    url: "/SettingPage",
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
  },
  // {
  //   title: "Home",
  //   url: "/HomePage",
  //   iosIcon: trashOutline,
  //   mdIcon: trashSharp,
  // },
];

const labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];

const Menu: React.FC = () => {
  const location = useLocation();
  const token = useToken();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Fair</IonListHeader>
          <IonNote>Trade</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon aria-hidden="true" slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
