import '../styles/RouteList.css';
import { ReactElement, useState } from 'react'
import { GeoRoute, GeoRoutesEnum } from '../App'

interface RouteListProps {
    routes: GeoRoute[],
    activeRoute: GeoRoutesEnum
}

export default function RouteList({ routes, activeRoute }: RouteListProps): ReactElement {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="dropdown" onClick={() => setIsExpanded(!isExpanded)}>
            <span className="dropdown--active">{activeRoute}</span>
            <div className={`dropdown--items ${isExpanded ? "" : "hidden"}`}>
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
