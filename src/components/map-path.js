import {GoogleMap, useJsApiLoader, Polyline} from '@react-google-maps/api';
import axios from 'axios';
import * as React from "react";
import './main.css'

const containerStyle = {
    width: '400px',
    height: '400px'
};



const MapPathContainer = ({path, source, destination}) => {
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDQkoIx58Yls4-63ZKAhxng86ANa5recEo"
    })

    const [map, setMap] = React.useState(null)


    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    const center = {
        lat: source.location.latitude,
        lng: source.location.longitude
    };

    const polylinePath = () => {
        let polyline = []
        path.routes.forEach( route => {
            polyline.push({lat: route.source.location.latitude, lng: route.source.location.longitude})
            polyline.push({lat: route.destination.location.latitude, lng: route.destination.location.longitude})
        })
        return polyline
    }

    const polylineOpts = () => {
        return {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 30000,
            paths: polylinePath(),
            zIndex: 1
        }
    }

    return isLoaded ? (
        <div className={'path-card'}>
            <div className={'path-info'}>
                <div className={'path-route-info'}>
                    {path.routes.map(route => {
                        return (
                            <div className={'route-info'}>
                                <div>
                                    {route.source.name} -> {route.destination.name}:
                                </div>
                                <div>
                                    {route.distance} meters, {route.duration} minutes, {route.type}
                                </div>
                                <br/>
                            </div>
                        )
                    })}


                </div>
                <div className={'total-info'}>
                    <span>Total distance: <strong>{path.total_distance}</strong> meters</span>
                    <span>Total duration: <strong>{path.total_duration}</strong> minutes</span>
                    <span>Total cost: <strong>{path.total_cost}</strong> euro</span>
                </div>
            </div>
            <br/>

            <GoogleMap
                clickableIcons={false}
                mapContainerStyle={containerStyle}
                center={center}
                zoom={2}
                onUnmount={onUnmount}
            >

                <Polyline path={polylinePath()}/>
            </GoogleMap>
        </div>
    ) : <></>
}

export default React.memo(MapPathContainer)