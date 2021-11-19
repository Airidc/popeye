import { ReactElement, useEffect } from "react";
import L, { MapOptions } from "leaflet";

export default function Map(): ReactElement {
    const MAP_TILE = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const mapStyles = {
        overflow: "hidden",
        width: "700px",
        height: "350px"
    };

    const mapParams: MapOptions = {
        center: [35.89968, 14.5148],
        zoom: 12,
        zoomControl: true,
        maxBounds: L.latLngBounds(L.latLng(-150, -240), L.latLng(150, 240)),
        layers: [MAP_TILE]
    };

    // This useEffect hook runs when the component is first mounted, 
    // similar to componentDidMount() lifecycle method of class-based
    // components:
    useEffect(() => {
        const map = L.map("map", mapParams);
    }, []);

    return (
        <div>
            <div id="map" style={mapStyles} />
        </div>
    )
}
