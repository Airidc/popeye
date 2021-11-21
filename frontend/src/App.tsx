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
  const [activeRoute, setActiveRoute] = useState<GeoRoutesEnum | null>(null);
  const [dataInterval, setDataInterval] = useState(1);
  const [routeIsActive, setRouteIsActive] = useState(false);
  const [coordinates, setCoordinates] = useState<number[]>([])
  const [socket, setSocket] = useState<Socket>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // console.log(ENDPOINT);
    setIsLoading(false);
    const s = socketIOClient(ENDPOINT, {
      'reconnection': true,
      'reconnectionDelay': 500
    });
    setSocket(s);

    s.on("coordinates", data => {
      setIsLoading(false);
      if (!routeIsActive) setRouteIsActive(true);
      // console.log("Setting new coordinates", data);
      setCoordinates(data);
    });
    return () => { s.disconnect(); }
  }, []);

  useEffect(() => {
    // console.log("Updating interval ->", dataInterval);
    socket?.emit("updateInterval", dataInterval);
  }, [dataInterval])

  useEffect(() => {
    // console.log(`Route changed: ${activeRoute}, update interval: ${updateInterval}`);
    if (socket) {
      if (routeIsActive) {
        socket.close();
        setRouteIsActive(false);
        socket.connect();
      }
      setIsLoading(true);
      // console.log(`Route changed: ${activeRoute}, update interval: ${dataInterval}`);

      socket.emit("getCoordinates", activeRoute, dataInterval);
    }
  }, [activeRoute])



  return (
    <div className="App">
      <header className="App-header">
        🛰️ Popeye tracker 🛰️
      </header>
      <RouteList routes={availableRoutes} activeRoute={activeRoute} dataInterval={{ interval: dataInterval, updateInterval: setDataInterval }} />
      <div className="map-wrapper">
        <Map coordinates={coordinates} activeRoute={activeRoute} />
        {isLoading && <div className="loading"> <span className="spinner"><svg width="50" height="50" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 11H7V13H2V11ZM17 11H22V13H17V11ZM11 17H13V22H11V17ZM11 2H13V7H11V2ZM4.222 5.636L5.636 4.222L9.172 7.758L7.758 9.172L4.222 5.636ZM19.778 18.364L18.364 19.778L14.828 16.242L16.242 14.828L19.778 18.364ZM7.758 14.828L9.172 16.242L5.636 19.778L4.222 18.364L7.758 14.828ZM14.828 7.757L18.364 4.222L19.778 5.637L16.242 9.172L14.828 7.757Z" fill="white" />
        </svg>
        </span></div>}
      </div>

    </div>
  );
}

export default App;