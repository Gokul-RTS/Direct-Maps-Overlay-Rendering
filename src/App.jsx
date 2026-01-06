import { GoogleMap, LoadScript, Data, Marker } from "@react-google-maps/api";
import { useRef } from "react";
import geoData from "./geoData";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const hyderabadPos = {
  lat: 17.407645370415413,
  lng: 78.45112399424097,
};

function App() {
  const mapRef = useRef(null);
  const revenuePolygons = useRef([]);

  const onLoadMap = (map) => {
    mapRef.current = map;
    map.panTo(hyderabadPos);
    map.setZoom(14);
  };

  const onLoadRevenue = (dataLayer) => {
    dataLayer.addGeoJson(geoData.revenu);

    dataLayer.setStyle({
      fillColor: "#FFC0E6",
      fillOpacity: 0.35,
      strokeColor: "#9E9E9E",
      strokeWeight: 1.2,
    });

    dataLayer.forEach((feature) => {
      const geom = feature.getGeometry();

      if (geom.getType() === "Polygon") {
        const paths = [];
        geom.getArray().forEach((ring) => {
          paths.push(ring.getArray());
        });

        revenuePolygons.current.push(new google.maps.Polygon({ paths }));
      }
    });
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCsv8wCUCRDDwdsF1XLV82Yt8m0KqJnK-Y"
      libraries={["geometry"]}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoadMap}
        mapTypeId="satellite"
      >
        <Data onLoad={onLoadRevenue} />

        <Marker position={hyderabadPos} title="Hyderabad Point" />
      </GoogleMap>
    </LoadScript>
  );
}

export default App;
