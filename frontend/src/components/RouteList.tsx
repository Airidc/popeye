import '../styles/RouteList.css';
import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react'
import { GeoRoute, GeoRoutesEnum } from '../App'

interface RouteListProps {
    routes: GeoRoute[],
    activeRoute: GeoRoutesEnum | null,
    dataInterval: { interval: number, updateInterval: Dispatch<SetStateAction<number>> }
}

export default function RouteList({ routes, activeRoute, dataInterval }: RouteListProps): ReactElement {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeInterval, setActiveInterval] = useState<number>();

    const updateInterval = (intervalValue: number) => {
        dataInterval.updateInterval(intervalValue);
    }

    useEffect(() => {
        setActiveInterval(dataInterval.interval);
    }, [dataInterval])

    return (
        <div className="dropdown">
            <div className="dropdown--controls">
                <span className="dropdown--active" onClick={() => setIsExpanded(!isExpanded)}>{activeRoute ? activeRoute : "Select route"}</span>
                <span className="dropdown--interval">
                    <button className={`dropdown--interval-item ${activeInterval === 1 ? "active" : ''}`} onClick={() => updateInterval(1)}>1s</button>
                    <button className={`dropdown--interval-item ${activeInterval === 5 ? "active" : ''}`} onClick={() => updateInterval(5)}>5s</button>
                    <button className={`dropdown--interval-item ${activeInterval === 10 ? "active" : ''}`} onClick={() => updateInterval(10)}>10s</button>
                </span>
            </div>
            <div
                className={`dropdown--items ${isExpanded ? "" : "hidden"}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {routes.map(route =>
                    <div
                        key={route.routeText}
                        className="dropdown--item"
                        onClick={route.setActiveRoute}
                    >
                        {route.routeText}
                    </div>
                )}
            </div>
        </div>
    )
}
