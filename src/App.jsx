import { GoogleMap, LoadScript, Data } from "@react-google-maps/api";
import { useRef } from "react";
import geoData from "./geoData";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

function App() {
  const mapRef = useRef(null);
  const circleRefs = useRef([]);

  const onLoadMap = (map) => {
    mapRef.current = map;
  };

  const onLoadRevenue = (dataLayer) => {
    dataLayer.addGeoJson(geoData.revenu);

    dataLayer.setStyle({
      fillColor: "#FFC0E6",
      fillOpacity: 0.35,
      strokeColor: "#9E9E9E",
      strokeWeight: 1.2,
    });

    const bounds = new google.maps.LatLngBounds();
    dataLayer.forEach((f) =>
      f.getGeometry().forEachLatLng((ll) => bounds.extend(ll))
    );
    mapRef.current.fitBounds(bounds);
  };

  const onLoadPoints = (dataLayer) => {
    dataLayer.addGeoJson(geoData.circle);

    dataLayer.forEach((feature) => {
      const geom = feature.getGeometry();
      if (geom.getType() !== "Point") return;

      const pos = geom.get();

      const circle = new google.maps.Circle({
        map: mapRef.current,
        center: pos,
        radius: 25, // meters
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        clickable: false,
      });

      circleRefs.current.push(circle);
    });

    dataLayer.setMap(null);
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoadMap}
        mapTypeId="satellite"
      >
        <Data onLoad={onLoadRevenue} />
        <Data onLoad={onLoadPoints} />
      </GoogleMap>
    </LoadScript>
  );
}

export default App;
