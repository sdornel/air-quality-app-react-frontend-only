import React, { useRef, useEffect, useState, SetStateAction, Dispatch, MutableRefObject } from 'react';
import './map-of-usa.css';
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
        const features: Feature<Geometry, GeoJsonProperties>[] = []
        console.log('props.airQualityData.current', props.airQualityData.current);
        for (let i = 0; i < props.airQualityData.current.length; i++) {
            // const entityImage = "museum";
            // eslint-disable-next-line default-case
            let entityImage;
            // console.log('props.airQualityData.current[i]', props.airQualityData.current[0]);
            // leaving the below commented out code. the image/icon should be derived from the entity propery. Currently it seems like the API response is getting null for this so we are just manually setting it to be "museum" for all of them. this is a temporart fix until we are able to resolve the issues with the API response. 

            switch(props.airQualityData.current[i].entity) {
                case 'government':
                    entityImage = 'museum';
                    break;
                case 'community':
                    entityImage = 'theatre';
                    break;
                case 'research':
                    entityImage = 'rocket';
                    break;
            }
            features.push(
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [
                            props.airQualityData.current[i].coordinates?.longitude, props.airQualityData.current[i].coordinates?.latitude
                        ]
                    },
                    'properties': {
                        'id': `${props.airQualityData.current[i].id}`,
                        'title': `${props.airQualityData.current[i].entity}`,
                        'description': 
                          // <LocationMeasurements/>
                        `
                            <div>
                                <strong>${props.airQualityData.current[i].entity}</strong>
                                <div className="location-data-div">
                                  <button class="more-info-button" id="more-info-button">More info</button>
                                  <p>id: ${props.airQualityData.current[i].id}</p>
                                  <p>Country: ${props.airQualityData.current[i].country || 'N/A'}<p/>
                                  <p>City: ${props.airQualityData.current[i].city || 'N/A'}<p/>
                                  <p>Location: ${props.airQualityData.current[i].name || 'N/A'}<p/>
                                  <p>Sensor Type: ${props.airQualityData.current[i].manufacturers[0].modelName}<p/>
                                  <p>Coordinates: ${props.airQualityData.current[i].coordinates?.longitude} - ${props.airQualityData.current[i].coordinates?.latitude}<p/>
                                  <p>First Updated: ${props.airQualityData.current[i].firstUpdated}<p/>
                                  <p>Last Updated: ${props.airQualityData.current[i].lastUpdated}<p/>
                                </div>
                            </div>
                            `
                            ,
                        'icon': `${entityImage}`
                    }
                },
            )
        }

        const places: string | Feature<Geometry, GeoJsonProperties> | FeatureCollection<Geometry, GeoJsonProperties> | undefined = {
            'type': 'FeatureCollection',
            'features': features,
        };

        // Add a GeoJSON source containing place coordinates and information.
        map.addSource('places', {
            'type': 'geojson',
            'data': places
        });

        for (const feature of places.features) {
          const symbol: string = feature.properties?.icon;
          const LayerID: string = `poi-${symbol}`;
          // Add a layer for this symbol type if it hasn't been added already.
          if (!map.getLayer(LayerID)) {
              map.addLayer({
                  'id': LayerID,
                  'type': 'symbol',
                  'source': 'places',
                  'layout': {
                      'icon-image': `${symbol}-15`,
                      'icon-allow-overlap': true
                  },
                  'filter': ['==', 'icon', symbol]
                });
                
                // When a click event occurs on a feature in the places layer, open a popup at the
                // location of the feature, with description HTML from its properties.
                map.on("click", LayerID, (e:  { features?: EventData; lngLat: EventData }) => {
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
                    const measurementData = await props.getMeasurementData(selectedLocationId.current);
                    props.navigate(`/measurements/${Number(selectedLocationId.current)}`, {
                      state: {
                        measurementData,
                      },
                    });
                  });
                });

                // Change the cursor to a pointer when the mouse is over the places layer.
                map.on('mouseenter', LayerID, (): void => {
                  map.getCanvas().style.cursor = 'pointer';
                });
                
                // Change it back to a pointer when it leaves.
                map.on('mouseleave', LayerID, (): void => {
                    map.getCanvas().style.cursor = '';
                });
              }
            }
    });
  
      map.on('move', (): void => {
        setLng(Number(map.getCenter().lng.toFixed(4)));
        setLat(Number(map.getCenter().lat.toFixed(4)));
        setZoom(Number(map.getZoom().toFixed(2)));
      });
      setMap(map);
      // Clean up on unmount
      return () => map.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const toggleVisibility = (event: ChangeEvent<HTMLInputElement>): void => {
    let layerId: string = '';
    switch(event.target.name) {
      case CheckboxButton.Community:
        layerId = 'poi-theatre'
        break;
      case CheckboxButton.Research:
        layerId = 'poi-rocket'
        break;
      case CheckboxButton.Government:
        layerId = 'poi-museum'
        break;
    }
    map.setLayoutProperty(
      layerId,
      'visibility',
      event.target.checked ? 'visible' : 'none',
    )
  }

  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
      <Checkboxes toggleVisibility={toggleVisibility}/>
    </div>
  );
};

export default WorldMap;