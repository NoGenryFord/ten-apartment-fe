import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const houseIcon = L.divIcon({
    html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
            <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
            </filter>
            <g filter="url(#shadow)">
                <!-- Pin shape -->
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill="#228be6"/>
                <!-- House icon inside -->
                <path d="M12 5.5L8.5 8.5V13h2v-2.5h3V13h2V8.5L12 5.5z"
                    fill="white"/>
            </g>
        </svg>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
});


function RecenterView({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
}

interface ApartmentMapProps {
    latitude: number;
    longitude: number;
    name: string;
    address?: string;  
}

export const ApartmentMap = ({ latitude, longitude, name, address }: ApartmentMapProps) => {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: '320px', width: '100%', borderRadius: '8px', zIndex: 0 }}
        >
            {/* Carto Voyager — no API key needed */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                maxZoom={20}
            />
            <Marker position={[latitude, longitude]} icon={houseIcon}>
                <Popup>
                    <strong>{name}</strong>
                    {address && <><br />{address}</>}
                </Popup>
            </Marker>
            <RecenterView lat={latitude} lng={longitude} />
        </MapContainer>
    );
};
