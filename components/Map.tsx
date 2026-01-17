import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon in Leaflet + React
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    position: [number, number];
    zoom?: number;
    className?: string;
}

const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
        // Invalidate size after mount to fix rendering issues
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);

    return null;
};

const Map: React.FC<MapProps> = ({ position, zoom = 15, className = "h-96 w-full" }) => {
    return (
        <div className={`overflow-hidden rounded-lg shadow-lg ${className}`}>
            <MapContainer
                center={position}
                zoom={zoom}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
                dragging={true}
            >
                <MapUpdater />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold text-wine">Amanaia Menteng</h3>
                            <p className="text-xs">Jl. Dr. Abdul Rahman Saleh I No.12</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline text-xs mt-1 block"
                            >
                                Get Directions
                            </a>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default Map;
