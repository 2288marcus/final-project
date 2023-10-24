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
  IonToggle,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  bookmarkOutline,
  mailOutline,
  mailSharp,
  settingsOutline,
  settingsSharp,
  personCircle,
  mail,
  reader,
  earth,
  link,
  heartOutline,
  heartSharp,
  sunny,
} from "ionicons/icons";
import "./Menu.css";
import { routes } from "../routes";
import useAuth from "../hooks/useAuth";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const labels = ["1", "2", "3", "4", "5", "6"];

const Menu: React.FC = () => {
  const location = useLocation();
  const auth = useAuth();

  const appPages: AppPage[] = [
    {
      title: "Home",
      url: routes.home,
      iosIcon: earth,
      mdIcon: earth,
    },
    {
      title: "Bookmark List",
      url: routes.BookmarkList,
      iosIcon: heartOutline,
      mdIcon: heartSharp,
    },

    {
      title: "Chatroom List",
      url: routes.ChatroomList,
      iosIcon: mail,
      mdIcon: mail,
    },
    // {
    //   title: "Self-Profile",
    //   url: routes.ProfilePage,
    //   iosIcon: personCircle,
    //   mdIcon: personCircle,
    // },

    {
      title: "Submit Job",
      url: routes.submit_job,
      iosIcon: reader,
      mdIcon: reader,
    },
    // {
    //   title: "Setting",
    //   url: routes.SettingPage,
    //   iosIcon: settingsOutline,
    //   mdIcon: settingsSharp,
    // },
    {
      title: "Job status",
      url: routes.JobStatus,
      iosIcon: mail,
      mdIcon: mail,
    },
    {
      title: "BlockChain",
      url: routes.Blockchain,
      iosIcon: link,
      mdIcon: link,
    },
    auth.state
      ? {
          title: "Profile",
          url: routes.ProfilePage,
          iosIcon: personCircle,
          mdIcon: personCircle,
        }
      : {
          title: "Login / Register",
          url: routes.register,
          iosIcon: mailOutline,
          mdIcon: mailSharp,
        },
    // {
    //   title: "Profile Checking",
    //   url: routes.othersProfilePage,
    //   iosIcon: personCircle,
    //   mdIcon: personCircle,
    // },
  ];

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Fair</IonListHeader>
          <IonNote>Deal</IonNote>
          <IonItem>
            <IonToggle>
              Dark Mode <IonIcon icon={sunny}></IonIcon>
            </IonToggle>
          </IonItem>
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

        {/* <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon aria-hidden="true" slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList> */}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
