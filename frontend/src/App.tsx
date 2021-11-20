import { useEffect, useState } from 'react';
import './styles/App.css';
import Map from './components/Map';
import RouteList from './components/RouteList';

import socketIOClient, { Socket } from "socket.io-client";
const ENDPOINT = 'http://127.0.0.1:5000/';

export enum GeoRoutesEnum {
  HOME_TO_WORK = "Home To Work",
  LUNCH = "Lunch",
  WORK_TO_HOME = "Work To Home"
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
  const [updateInterval, setUpdateInterval] = useState(1);
  const [routeIsActive, setRouteIsActive] = useState(false);
  const [coordinates, setCoordinates] = useState<number[]>([])
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    console.log(ENDPOINT)
    const s = socketIOClient(ENDPOINT);
    setSocket(s);
    return () => { s.disconnect(); }
  }, []);
  useEffect(() => {
    // console.log(`Route changed: ${activeRoute}, update interval: ${updateInterval}`);
    if (socket) {
      if (routeIsActive) {
        socket.emit('cancelCurrentRoute');
      }

      socket.on("coordinates", data => {
        if (!routeIsActive) setRouteIsActive(true);
        console.log("Setting new coordinates", data);
        setCoordinates(data);
      });
      socket.on('cancellingCurrentRoute', () => {
        console.log(`Cancelling current route`);
        setTimeout(() => {
          console.log(`Requesting for coordinates again after timeout, route: ${activeRoute}`);
          socket.emit("getCoordinates", activeRoute, updateInterval);
        }, 1000);
      });
      console.log(`Route changed: ${activeRoute}, update interval: ${updateInterval}`);

      socket.emit("getCoordinates", activeRoute, updateInterval);
    }
  }, [activeRoute])



  return (
    <div className="App">
      <header className="App-header">
        🛰️ Popeye tracker 🛰️
      </header>
      <RouteList routes={availableRoutes} activeRoute={activeRoute} />
      <Map coordinates={coordinates} />
    </div>
  );
}

export default App;