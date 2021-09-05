import routes from "routes";

export const useRouteName = () => {
  let name = "";
  routes.forEach((route) => {
    if (window.location.href.indexOf(route.layout + route.path) !== -1) {
      name = routes.rtlActive ? route.rtlName : route.name;
    }
  });
  return name;
};

export const useRouteLayout = () => {
  let layout = "";
  routes.forEach((route) => {
    if (window.location.href.indexOf(route.layout + route.path) !== -1) {
      layout = route.layout;
    }
  });
  return layout.replace('/','');
}
