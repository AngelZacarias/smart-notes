// Icons from @material-ui/icons/
import { Dashboard, Today, Forum, Info } from "@material-ui/icons/";

// Component Views
import Subjects from "./views/General/Subjects";
import Chat from "./views/General/Chat";
import Schedule from "./views/General/Schedule";
import About from "./views/General/About";
import Profile from "./views/General/Profile";

const dashboardRoutes = [
  {
    path: "/subjects",
    name: "Materias",
    rtlName: "",
    icon: Dashboard,
    component: Subjects,
    layout: "/dashboard",
    menu: true,
  },
  {
    path: "/schedule",
    name: "Horario",
    rtlName: "",
    icon: Today,
    component: Schedule,
    layout: "/dashboard",
    menu: true,
  },
  {
    path: "/chat",
    name: "Chat",
    rtlName: "",
    icon: Forum,
    component: Chat,
    layout: "/dashboard",
    menu: true,
  },
  {
    path: "/about",
    name: "Acerca de",
    rtlName: "",
    icon: Info,
    component: About,
    layout: "/dashboard",
    menu: true,
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "",
    icon: Info,
    component: Profile,
    layout: "/dashboard",
    menu: false,
  },
];

export default dashboardRoutes;
