import React, { ReactElement, useState } from 'react'
import { GeoRoute, GeoRoutesEnum } from '../App'

interface RouteListProps {
    routes: GeoRoute[],
    activeRoute: GeoRoutesEnum
}

export default function RouteList({ routes, activeRoute }: RouteListProps): ReactElement {

    return (
        <div className="dropdown">
            <span>Active route: {activeRoute}</span>
            <input type="hidden" name="" value={activeRoute} />
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
    )
}
