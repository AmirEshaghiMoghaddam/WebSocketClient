import React, { useState, useCallback, useEffect } from "react";
import { Popup, Marker, MapContainer, TileLayer } from "react-leaflet";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { LatLngTuple, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
// importing red location icon for distinction
import markerNewIconPng from "./../../Assets/Icons/NewMarker.png";
import markers from "./listings.json";

const defaultLatLng: LatLngTuple = [59.955572, 10.783523];
const zoom: number = 12;

export const LeafletMap: React.FC = () => {
    const [socketUrl, setSocketUrl] = useState(
        /* Insert websocket address here in order to connect */ 
        "ws://localhost:8080/"
    );
    const [messageHistory, setMessageHistory] = useState([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(JSON.parse(lastMessage?.data)));
            // Confirm data is received by the client from over the Web Socket
            console.log(lastMessage?.data);
        }
    }, [lastMessage, setMessageHistory]);

    // Visually indicate on the map any relevant data received from the Web Socket server
    // the icon becomes red when new data received
    const getMarker = (tlfnr: any): any => {
        const newData = messageHistory.findIndex(
            (bid: any) => {
                return bid.tlfnr == tlfnr;
            }
        )
        if (newData >= 0){
            return markerNewIconPng;
        }
        else
            return markerIconPng;
    }    

    return (
        <div className="w-100">
            {/* Tile Layers */}
            <MapContainer
                preferCanvas={true}
                style={{ height: "100vh", width: "100%" }}
                center={defaultLatLng}
                zoom={zoom}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers.map((unit, idx) => (
                    <Marker
                        key={`marker-${unit.finnkode}`}
                        position={[Number(unit.lat), Number(unit.lng)]}
                        icon={
                            new Icon({
                                iconUrl: getMarker(unit.megler.phone),
                                iconSize: [20, 30],
                                iconAnchor: [12, 41],
                            })
                        }
                    >
                        <Popup>
                            <span>
                                En fin bolig verdt ca {unit?.Totalpris}{" "}
                            </span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
