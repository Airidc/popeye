import { ReactElement, useEffect, useState } from "react";
import L, { Map as Lmap, MapOptions, Marker } from "leaflet";
import "../styles/Map.css";

interface MapProps {
    coordinates: number[]
}

export default function Map({ coordinates }: MapProps): ReactElement {
    const [marker, setMarker] = useState<Marker>();
    const [map, setMap] = useState<Lmap>();
    const MAP_TILE = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const mapParams: MapOptions = {
        center: [35.89968, 14.5148],
        zoom: 16,
        zoomControl: true,
        maxBounds: L.latLngBounds(L.latLng(-150, -240), L.latLng(150, 240)),
        layers: [MAP_TILE]
    };

    // This useEffect hook runs when the component is first mounted, 
    // similar to componentDidMount() lifecycle method of class-based
    // components:
    useEffect(() => {
        const m = L.map("map", mapParams);
        setMap(m);
        const mrker = L.marker([35.89968, 14.5148])
        mrker.addTo(m);
        setMarker(mrker);
    }, []);

    useEffect(() => {
        if (map && marker && coordinates && coordinates.length !== 0) {
            console.log("New coordinates", coordinates);
            marker.setLatLng([coordinates[1], coordinates[0]]);
            map.flyTo([coordinates[1], coordinates[0]])
        }
    }, [coordinates])

    return (
        <div>
            <div id="map" />
        </div>
    )
}
