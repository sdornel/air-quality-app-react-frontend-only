import React, { useRef, useEffect, useState, SetStateAction, Dispatch, MutableRefObject } from 'react';
import './world-map.css';
import mapboxgl, { EventData, Popup } from 'mapbox-gl';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { Feature } from 'geojson';
import { ChangeEvent } from 'react';
import Checkboxes from '../../checkboxes/checkboxes';
import { CheckboxButton } from '../../enum/enums';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Rvcm5lbCIsImEiOiJjbDBidTE5Z3YxMHE0M2NtbjN5ZzJkMDk1In0.kRcnZyDcmcDMs7DvPmXvGg';

const WorldMap = (props: any) => {
    const mapContainerRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement | null>(null);
    const popupRef: MutableRefObject<Popup> = useRef(new mapboxgl.Popup({ offset: 15 }));

    const [lng, setLng]: Array<number | Dispatch<SetStateAction<number>>> = useState(5);
    const [lat, setLat]: Array<number | Dispatch<SetStateAction<number>>> = useState(34);
    const [zoom, setZoom]: Array<number | Dispatch<SetStateAction<number>>> = useState(1.5);
    const [map, setMap] = useState<mapboxgl.Map>();
    const selectedLocationId = useRef(0);
    // Initialize map when component mounts
    useEffect(() => {
      const map: mapboxgl.Map = new mapboxgl.Map({
        container: mapContainerRef.current as any,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
      });
  
      // Add navigation control (the +/- zoom buttons)
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.on('load', (): void => {
        const locationMarker = `${process.env.PUBLIC_URL}/images/purple-dot-with-white-outline.png`;
        map.loadImage(locationMarker, (error, image) => {
          if (error) throw error;
          if (!map.hasImage('purple-dot')) map.addImage('purple-dot', image);

          const features: Array<Feature<Geometry, GeoJsonProperties>> = props.airQualityData.current.map(data => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [data.coordinates?.longitude, data.coordinates?.latitude]
            },
            properties: {
                id: data.id,
                description: `
                  <div style="text-align: left;">
                    <div className="location-data-div">
                      <button class="more-info-button" id="more-info-button">More info</button>
                      <p>Latest PM2.5 Level: ${data.parameters[0].average.toFixed(2)} µg/m³</p>
                      <p>Country: ${data.country || 'N/A'}<p/>
                      <p>City: ${data.city || 'N/A'}<p/>
                      <p>Location: ${data.name || 'N/A'}<p/>
                      <p>Sensor Type: ${data.manufacturers[0].modelName}<p/>
                      <p>Coordinates: ${data.coordinates?.longitude} - ${data.coordinates?.latitude}<p/>
                      <p>First Updated: ${data.firstUpdated}<p/>
                      <p>Last Updated: ${data.lastUpdated}<p/>
                    </div>
                  </div>
                `,
                icon: 'purple-dot'
            }
          }));
          
          const places: string | Feature<Geometry, GeoJsonProperties> | FeatureCollection<Geometry, GeoJsonProperties> | undefined = {
            'type': 'FeatureCollection',
            'features': features,
          };
          
          // Add a GeoJSON source containing place coordinates and information.
          map.addSource('places', {
            'type': 'geojson',
            'data': places
          });

          features.forEach((feature: Feature<Geometry, {
            [name: string]: any;
          }>) => {
            const layerID = `poi-${feature.properties.icon}`;
            if (!map.getLayer(layerID)) {
              map.addLayer({
                  id: layerID,
                  type: 'symbol',
                  source: 'places',
                  layout: {
                      'icon-image': 'purple-dot',
                      'icon-allow-overlap': true,
                      'icon-size': [
                        "interpolate", ["linear"], ["zoom"],
                        1, 0.02,  // At zoom level 1, icon size is 0.02
                        22, 0.15   // At zoom level 22, icon size is 0.15
                      ]
                  }
              });

              map.on("click", layerID, (e:  { features?: EventData; lngLat: EventData }) => {
                if (e.features.length) {
                  const coordinates = e.features[0].geometry.coordinates;
                  const description = e.features[0].properties.description;
                  selectedLocationId.current = Number(e.features[0].properties.id);
                  // Ensure that if the map is zoomed out such that multiple
                  // copies of the feature are visible, the popup appears
                  // over the copy being pointed to.
                  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                  }

                  popupRef.current
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map)
                }
                const seeMoreButton = document.getElementById('more-info-button');
                seeMoreButton?.addEventListener('click', async () => {
                  props.onLoad();
                  const measurementDataPromise: MutableRefObject<{}> = await props.getMeasurementData(selectedLocationId.current);
                  const measurementData = await measurementDataPromise.current; // vscode thinks the await here is not required. it IS required

                  props.navigate(`/measurements/${selectedLocationId.current}`, {
                    state: {
                      measurementData,
                    },
                  });
                });
              });

              // Change the cursor to a pointer when the mouse is over the places layer.
              map.on('mouseenter', layerID, (): void => {
                map.getCanvas().style.cursor = 'pointer';
              });
              
              // Change it back to a pointer when it leaves.
              map.on('mouseleave', layerID, (): void => {
                  map.getCanvas().style.cursor = '';
              });
            }
          });
        });
    });
  
      map.on('move', (): void => {
        setLng(Number(map.getCenter().lng.toFixed(4)));
        setLat(Number(map.getCenter().lat.toFixed(4)));
        setZoom(Number(map.getZoom().toFixed(2)));
      });
      setMap(map);

      return () => map.remove(); // Clean up on unmount
    }, []); // only run once

  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default WorldMap;