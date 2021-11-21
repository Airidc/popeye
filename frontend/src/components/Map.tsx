import { ReactElement, useEffect, useState } from "react";
import L, { DivIcon, Map as Lmap, MapOptions, Marker } from "leaflet";
import "../styles/Map.css";
import { GeoRoutesEnum } from "../App";

interface MapProps {
    coordinates: number[],
    activeRoute: GeoRoutesEnum | null
}

export default function Map({ coordinates, activeRoute }: MapProps): ReactElement {
    const [marker, setMarker] = useState<Marker>();
    const [map, setMap] = useState<Lmap>();
    const [walkIcon, setWalkIcon] = useState<DivIcon>();
    const [driveIcon, setDriveIcon] = useState<DivIcon>();
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
        const carIcon = L.divIcon({
            html: `<svg width="34" height="41" viewBox="0 0 34 41" fill="transparent" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 41L27.3923 30.5H6.6077L17 41Z" fill="#4A80E8"/>
                    <circle cx="17" cy="17" r="17" fill="#4A80E8"/>
                    <circle cx="17" cy="17" r="14" fill="#C4C4C4"/>
                    <path d="M25.772 14.156L24.404 10.051C24.2056 9.45348 23.8238 8.9337 23.3131 8.56551C22.8024 8.19732 22.1886 7.99944 21.559 8H12.441C11.8114 7.99944 11.1976 8.19732 10.6869 8.56551C10.1762 8.9337 9.79445 9.45348 9.596 10.051L8.228 14.156C7.86461 14.3085 7.55428 14.5648 7.33584 14.8928C7.11741 15.2208 7.00059 15.6059 7 16V21C7 21.753 7.423 22.402 8.039 22.743C8.026 22.809 8 22.869 8 22.938V25C8 25.2652 8.10536 25.5196 8.29289 25.7071C8.48043 25.8946 8.73478 26 9 26H10C10.2652 26 10.5196 25.8946 10.7071 25.7071C10.8946 25.5196 11 25.2652 11 25V23H23V25C23 25.2652 23.1054 25.5196 23.2929 25.7071C23.4804 25.8946 23.7348 26 24 26H25C25.2652 26 25.5196 25.8946 25.7071 25.7071C25.8946 25.5196 26 25.2652 26 25V22.938C26 22.869 25.974 22.808 25.961 22.743C26.2744 22.5721 26.5362 22.3202 26.7189 22.0136C26.9017 21.707 26.9988 21.357 27 21V16C27 15.171 26.492 14.459 25.772 14.156ZM9 21V16H25L25.002 21H9ZM12.441 10H21.558C21.989 10 22.371 10.274 22.507 10.684L23.613 14H10.387L11.492 10.684C11.5583 10.4848 11.6857 10.3115 11.856 10.1888C12.0264 10.066 12.231 9.99995 12.441 10V10Z" fill="black"/>
                    <path d="M11.5 20C12.3284 20 13 19.3284 13 18.5C13 17.6716 12.3284 17 11.5 17C10.6716 17 10 17.6716 10 18.5C10 19.3284 10.6716 20 11.5 20Z" fill="black"/>
                    <path d="M22.5 20C23.3284 20 24 19.3284 24 18.5C24 17.6716 23.3284 17 22.5 17C21.6716 17 21 17.6716 21 18.5C21 19.3284 21.6716 20 22.5 20Z" fill="black"/>
                    </svg>
                `,
            iconSize: [34, 41],
            iconAnchor: [17, 40],
        })
        setDriveIcon(carIcon);

        const personIcon = L.divIcon({
            html: `<svg width="34" height="41" viewBox="0 0 34 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 41L27.3923 30.5H6.6077L17 41Z" fill="#B54AE8"/>
                    <circle cx="17" cy="17" r="17" fill="#B54AE8"/>
                    <circle cx="17" cy="17" r="14" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.3044 5.875C17.3049 5.875 16.5125 6.67 16.5125 7.631C16.5125 8.592 17.3049 9.38725 18.3044 9.38725C19.3381 9.38725 20.1306 8.592 20.1306 7.631C20.1306 6.67025 19.3381 5.875 18.3044 5.875V5.875ZM16.7537 9.2545C16.3747 9.28775 16.0645 9.4865 15.8232 9.652C15.513 9.88425 15.0307 10.3813 15.0307 10.3813V10.4143C14.9961 10.4143 13.101 12.5348 11.9983 13.5288C11.8949 13.6283 11.826 13.7275 11.7916 13.8603L11.2404 16.7428C11.137 17.074 11.4126 17.4718 11.7571 17.5378C12.1018 17.6043 12.5152 17.3393 12.5495 16.9748L13.101 14.2908L15.2374 12.2365V17.7035L14.0313 20.586L10.3102 25.6558C10.1653 25.8593 10.1039 26.1072 10.1378 26.3518C10.1724 26.5835 10.3102 26.8155 10.5169 26.948C10.7236 27.1138 10.9992 27.1468 11.275 27.1138C11.516 27.0475 11.7573 26.915 11.8951 26.7163V26.683L15.6511 21.5805L15.7546 21.3818L17.1674 18.002L19.9585 21.6135L22.026 26.2523C22.1984 26.683 22.8185 26.9148 23.2665 26.716C23.7145 26.5505 23.9557 25.954 23.7834 25.5235L21.6815 20.8185L21.578 20.6195L18.8902 17.1735V12.9655L19.9582 14.1583L20.0617 14.2578L22.8182 16.312C23.0595 16.5108 23.5421 16.4778 23.7488 16.2125C23.9555 15.9475 23.8866 15.5168 23.6453 15.285L20.9577 13.2638C20.1306 12.336 19.0623 11.0438 18.58 10.4475C18.3387 10.1493 17.7183 9.354 16.9259 9.2545H16.7537Z" fill="black"/>
                    </svg>
                    `,
            iconSize: [34, 41],
            iconAnchor: [17, 40],
        });
        setWalkIcon(personIcon);

        const mrker = L.marker([35.89968, 14.5148], {
            icon: personIcon
        })
        mrker.addTo(m);
        setMarker(mrker);
    }, []);

    useEffect(() => {
        if (marker && activeRoute && walkIcon && driveIcon) {
            (activeRoute === GeoRoutesEnum.LUNCH) ? marker.setIcon(walkIcon) : marker.setIcon(driveIcon);
        }
    }, [activeRoute])

    useEffect(() => {
        if (map && marker && coordinates && coordinates.length !== 0) {
            // console.log("New coordinates", coordinates);
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
