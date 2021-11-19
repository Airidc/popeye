import { useState } from 'react';
import './App.css';
import Map from './components/Map';
import RouteList from './components/RouteList';

export enum GeoRoutesEnum {
  HOME_TO_WORK = "Home to Work",
  LUNCH = "Lunch",
  WORK_TO_HOME = "Work to Home"
}

export interface GeoRoute {
  route: GeoRoutesEnum,
  routeText: string;
  setActiveRoute: () => void
}

function App() {
  const availableRoutes: GeoRoute[] = [{
    route: GeoRoutesEnum.HOME_TO_WORK,
    routeText: "Home To Work",
    setActiveRoute: () => setActiveRoute(GeoRoutesEnum.HOME_TO_WORK)
  }, {
    route: GeoRoutesEnum.LUNCH,
    routeText: "Lunch",
    setActiveRoute: () => setActiveRoute(GeoRoutesEnum.LUNCH)
  }, {
    route: GeoRoutesEnum.WORK_TO_HOME,
    routeText: "Work To Home",
    setActiveRoute: () => setActiveRoute(GeoRoutesEnum.WORK_TO_HOME)
  }];
  const [activeRoute, setActiveRoute] = useState<GeoRoutesEnum>(availableRoutes[0].route);

  return (
    <div className="App">
      <header className="App-header">
        🛰️ Popeye tracker 🛰️
      </header>
      <Map />
      <RouteList routes={availableRoutes} activeRoute={activeRoute} />
    </div>
  );
}

export default App;
