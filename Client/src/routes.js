// Icons from @material-ui/icons/
import { Dashboard, Today, Forum, Info } from "@material-ui/icons/";

// Component Views
import Subjects from "./views/General/Subjects";
import About from "./views/General/About";

const dashboardRoutes = [
  {
    path: "/subjects",
    name: "Materias",
    rtlName: "",
    icon: Dashboard,
    component: Subjects,
    layout: "/dashboard",
  },
  {
    path: "/schedule",
    name: "Horario",
    rtlName: "",
    icon: Today,
    component: Subjects,
    layout: "/dashboard",
  },
  {
    path: "/chat",
    name: "Chat",
    rtlName: "",
    icon: Forum,
    component: Subjects,
    layout: "/dashboard",
  },
  {
    path: "/about",
    name: "Acerca de",
    rtlName: "",
    icon: Info,
    component: About,
    layout: "/subject",
  },
];

export default dashboardRoutes;
