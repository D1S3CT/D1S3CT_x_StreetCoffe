import {
  Map as MapLibreMap,
  Popup,
  setWorkerUrl,
} from "maplibre-gl";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

import { locations } from "../data/locations";

setWorkerUrl(workerUrl);

const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";
const CITY_CENTER = [49.275, 53.518];
const INITIAL_ZOOM = 12.8;
const LOCATION_ZOOM = 15;

const SOURCE_ID = "streetcoffe-locations";
const CLUSTERS_LAYER_ID = "streetcoffe-clusters";
const CLUSTER_COUNT_LAYER_ID = "streetcoffe-cluster-count";
const POINTS_LAYER_ID = "streetcoffe-points";
const PIN_IMAGE_ID = "streetcoffe-coffee-pin";

let activeMap = null;
let activePopup = null;
let activePopupLocationId = null;
let resizeObserver = null;
let resizeHandler = null;
let orientationHandler = null;
let filterAbortController = null;
let focusRequestId = 0;

const isValidLocation = (location) =>
  Number.isFinite(location.lng) &&
  Number.isFinite(location.lat) &&
  location.lng >= -180 &&
  location.lng <= 180 &&
  location.lat >= -90 &&
  location.lat <= 90;

const validLocations = locations.filter(isValidLocation);

const locationsToGeoJSON = (items) => ({
  type: "FeatureCollection",
  features: items.map((location) => ({
    type: "Feature",
    id: location.id,
    properties: {
      id: location.id,
      name: location.name,
      address: location.address,
      image: location.image,
      open: location.hours?.open ?? "",
      close: location.hours?.close ?? "",
    },
    geometry: {
      type: "Point",
      coordinates: [location.lng, location.lat],
    },
  })),
});

// ========================================
// ИКОНКА МАРКЕРА
// ========================================

const createPinImage = (map) =>
  new Promise((resolve) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="72" height="88" viewBox="0 0 72 88">
        <path d="M36 3C17.8 3 4 16.8 4 34.2c0 22.2 32 49.8 32 49.8s32-27.6 32-49.8C68 16.8 54.2 3 36 3Z"
          fill="#171717" stroke="#ffffff" stroke-width="5" stroke-linejoin="round"/>
        <path d="M36 3C17.8 3 4 16.8 4 34.2c0 22.2 32 49.8 32 49.8s32-27.6 32-49.8C68 16.8 54.2 3 36 3Z"
          fill="none" stroke="#d99a61" stroke-width="1.2" opacity=".75"/>
        <g transform="translate(19 19)" fill="none" stroke="#d99a61" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12h22v11a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8V12Z"/>
          <path d="M26 15h3a5 5 0 0 1 0 10h-4"/>
          <path d="M10 5c0 2 2 2 2 4M17 5c0 2 2 2 2 4"/>
          <path d="M2 35h29"/>
        </g>
      </svg>
    `;

    const image = new Image();

    image.onload = () => {
      if (!map.hasImage(PIN_IMAGE_ID)) {
        map.addImage(PIN_IMAGE_ID, image, {
          pixelRatio: 2,
        });
      }

      resolve();
    };

    image.onerror = () => resolve();

    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });

// ========================================
// КЛАСТЕРЫ И СЛОИ КАРТЫ
// ========================================

const addClusterLayers = (map) => {
  if (!map.getSource(SOURCE_ID)) {
    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: locationsToGeoJSON(validLocations),
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 58,
      clusterMinPoints: 2,
    });
  }

  if (!map.getLayer(CLUSTERS_LAYER_ID)) {
    map.addLayer({
      id: CLUSTERS_LAYER_ID,
      type: "circle",
      source: SOURCE_ID,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#171717",
        "circle-radius": [
          "step",
          ["get", "point_count"],
          23,
          5, 27,
          10, 31,
        ],
        "circle-stroke-width": 3,
        "circle-stroke-color": "#ffffff",
        "circle-opacity": 0.98,
      },
    });
  }

  if (!map.getLayer(CLUSTER_COUNT_LAYER_ID)) {
    map.addLayer({
      id: CLUSTER_COUNT_LAYER_ID,
      type: "symbol",
      source: SOURCE_ID,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": 14,
        "text-allow-overlap": true,
        "text-ignore-placement": true,
      },
      paint: {
        "text-color": "#d99a61",
      },
    });
  }

  if (!map.getLayer(POINTS_LAYER_ID)) {
    map.addLayer({
      id: POINTS_LAYER_ID,
      type: "symbol",
      source: SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": PIN_IMAGE_ID,
        "icon-size": 0.82,
        "icon-anchor": "bottom",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });
  }
};

// ========================================
// АКТИВНАЯ КАРТОЧКА
// ========================================

const activateCard = (id) => {
  document.querySelectorAll("[data-location-card]").forEach((card) => {
    card.classList.toggle(
      "is-active",
      id !== null &&
        Number(card.dataset.locationId) === id,
    );
  });
};

// ========================================
// СОДЕРЖИМОЕ POPUP
// ========================================

const createPopupContent = (location) => {
  const wrapper = document.createElement("div");
  wrapper.className = "streetcoffe-popup";

  const photo = document.createElement("div");
  photo.className = "streetcoffe-popup__photo";

  const image = document.createElement("img");
  image.src = location.image;
  image.alt = `Кофейня ${location.name}`;
  image.loading = "lazy";

  image.addEventListener("error", () => {
    image.classList.add("image-error");
  });

  photo.appendChild(image);

  const content = document.createElement("div");
  content.className = "streetcoffe-popup__content";

  const title = document.createElement("strong");
  title.className = "streetcoffe-popup__title";
  title.textContent = location.name;

  const address = document.createElement("span");
  address.className = "streetcoffe-popup__address";
  address.textContent = location.address;

  const hours = document.createElement("span");
  hours.className = "streetcoffe-popup__hours";
  hours.textContent =
    `${location.hours.open} — ${location.hours.close}`;

  const route = document.createElement("a");
  route.className = "streetcoffe-popup__route";

  route.href = `https://yandex.ru/maps/?text=${encodeURIComponent(
    `Тольятти, ${location.address}`,
  )}`;

  route.target = "_blank";
  route.rel = "noopener noreferrer";
  route.textContent = "Построить маршрут";

  content.append(title, address, hours, route);
  wrapper.append(photo, content);

  return wrapper;
};

// ========================================
// УПРАВЛЕНИЕ POPUP
// ========================================

const closeActivePopup = () => {
  if (activePopup) {
    activePopup.remove();
  }

  activePopup = null;
  activePopupLocationId = null;

  activateCard(null);
};

const openLocationPopup = (location, map) => {
  closeActivePopup();

  const popup = new Popup({
    anchor: "bottom",
    offset: 18,
    closeButton: true,
    closeOnClick: false,
    closeOnMove: false,
    focusAfterOpen: false,
    maxWidth: "340px",
    className: "streetcoffe-map-popup",
  })
    .setLngLat([location.lng, location.lat])
    .setDOMContent(createPopupContent(location));

  popup.on("open", () => {
    activePopup = popup;
    activePopupLocationId = location.id;

    activateCard(location.id);
  });

  popup.on("close", () => {
    if (activePopup === popup) {
      activePopup = null;
      activePopupLocationId = null;

      activateCard(null);
    }
  });

  popup.addTo(map);
};

// ========================================
// ПОИСК КОФЕЙНИ ПО ID
// ========================================

const getLocationById = (id) =>
  validLocations.find(
    (location) => location.id === Number(id),
  );

// ========================================
// ПЕРЕХОД К КОФЕЙНЕ
// ========================================

const focusLocation = (location, map) => {
  if (!isValidLocation(location)) return;

  const requestId = ++focusRequestId;

  map.stop();
  closeActivePopup();

  const targetZoom = Math.max(
    map.getZoom(),
    LOCATION_ZOOM,
  );

  map.easeTo({
    center: [location.lng, location.lat],
    zoom: Math.min(targetZoom, 18),
    duration: 550,
    essential: true,
    padding: {
      top: 100,
      bottom: 90,
      left: 35,
      right: 35,
    },
  });

  map.once("moveend", () => {
    if (requestId !== focusRequestId) return;
    if (!map.getContainer().isConnected) return;

    openLocationPopup(location, map);
  });
};

// ========================================
// ОТКРЫТИЕ КОФЕЙНИ ПО МАРКЕРУ
// ========================================

const showLocationFromFeature = (feature, map) => {
  const id = Number(feature.properties?.id);
  const location = getLocationById(id);

  if (!location) return;

  openLocationPopup(location, map);
};

// ========================================
// ОБРАБОТКА КЛИКОВ ПО КАРТЕ
// ========================================

const setupMapInteractions = (map) => {
  // Нажатие на кластер приближает карту
  map.on("click", CLUSTERS_LAYER_ID, (event) => {
    const feature = event.features?.[0];

    if (!feature) return;

    const clusterId = feature.properties.cluster_id;
    const source = map.getSource(SOURCE_ID);

    if (!source) return;

    source.getClusterExpansionZoom(
      clusterId,
      (error, zoom) => {
        if (error || !Number.isFinite(zoom)) return;

        map.easeTo({
          center: feature.geometry.coordinates,
          zoom: Math.min(zoom + 0.5, 18),
          duration: 450,
          essential: true,
        });
      },
    );
  });

  // Нажатие на отдельную кофейню открывает её плашку
  map.on("click", POINTS_LAYER_ID, (event) => {
    const feature = event.features?.[0];

    if (feature) {
      showLocationFromFeature(feature, map);
    }
  });

  [CLUSTERS_LAYER_ID, POINTS_LAYER_ID].forEach((layerId) => {
    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
    });
  });

  // Клик по пустому месту закрывает плашку
  map.on("click", (event) => {
    const features = map.queryRenderedFeatures(
      event.point,
      {
        layers: [
          CLUSTERS_LAYER_ID,
          POINTS_LAYER_ID,
        ],
      },
    );

    if (!features.length) {
      closeActivePopup();
    }
  });
};

// ========================================
// СИНХРОНИЗАЦИЯ С ПОИСКОМ
// ========================================

const syncMarkers = (visibleIds, map) => {
  const visibleSet = new Set(
    (visibleIds || []).map(Number),
  );

  const filtered = validLocations.filter((location) =>
    visibleSet.has(location.id),
  );

  const source = map.getSource(SOURCE_ID);

  if (source) {
    source.setData(locationsToGeoJSON(filtered));
  }

  if (
    activePopupLocationId !== null &&
    !visibleSet.has(activePopupLocationId)
  ) {
    closeActivePopup();
  }
};

// ========================================
// СВЯЗЬ КАРТОЧЕК С КАРТОЙ
// ========================================

const setupCardInteractions = (map) => {
  const section = document.querySelector(".locations");

  if (
    !section ||
    section.dataset.mapInteractionsInitialized === "true"
  ) {
    return;
  }

  section.dataset.mapInteractionsInitialized = "true";

  section.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    if (
      target.closest("a, button, select, input")
    ) {
      return;
    }

    const card = target.closest("[data-location-card]");

    if (!card || card.hidden) return;

    const location = getLocationById(
      card.dataset.locationId,
    );

    if (location) {
      focusLocation(location, map);
    }
  });
};

// ========================================
// АДАПТАЦИЯ РАЗМЕРА КАРТЫ
// ========================================

const setupResize = (container, map) => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  let frame = 0;

  const resizeMap = () => {
    cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {
      if (container.isConnected) {
        map.resize();
      }
    });
  };

  resizeObserver = new ResizeObserver(resizeMap);
  resizeObserver.observe(container);

  if (resizeHandler) {
    window.removeEventListener(
      "resize",
      resizeHandler,
    );
  }

  if (orientationHandler) {
    window.removeEventListener(
      "orientationchange",
      orientationHandler,
    );
  }

  resizeHandler = resizeMap;

  orientationHandler = () => {
    window.setTimeout(resizeMap, 250);
  };

  window.addEventListener(
    "resize",
    resizeHandler,
    { passive: true },
  );

  window.addEventListener(
    "orientationchange",
    orientationHandler,
    { passive: true },
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(resizeMap);
  });
};

// ========================================
// ИНИЦИАЛИЗАЦИЯ КАРТЫ
// ========================================

const initLocationsMap = () => {
  const container = document.querySelector(
    "#streetcoffe-map",
  );

  if (
    !container ||
    container.dataset.initialized === "true"
  ) {
    return;
  }

  container.dataset.initialized = "true";

  const map = new MapLibreMap({
    container,
    style: MAP_STYLE,
    center: CITY_CENTER,
    zoom: INITIAL_ZOOM,

    minZoom: 10,
    maxZoom: 18,

    attributionControl: true,

    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,

    cooperativeGestures: false,
    trackResize: true,
  });

  activeMap = map;

  map.on("load", async () => {
    if (!container.isConnected) return;

    map.resize();

    await createPinImage(map);

    if (
      !container.isConnected ||
      map !== activeMap
    ) {
      return;
    }

    addClusterLayers(map);
    setupMapInteractions(map);
    setupCardInteractions(map);

    const visibleIds = Array.from(
      document.querySelectorAll(
        "[data-location-card]:not([hidden])",
      ),
    ).map((card) =>
      Number(card.dataset.locationId),
    );

    syncMarkers(visibleIds, map);

    map.jumpTo({
      center: CITY_CENTER,
      zoom: INITIAL_ZOOM,
    });
  });

  map.on("error", (event) => {
    console.error(
      "StreetCoffe map error:",
      event.error || event,
    );
  });

  setupResize(container, map);

  if (filterAbortController) {
    filterAbortController.abort();
  }

  filterAbortController = new AbortController();

  document.addEventListener(
    "streetcoffe:locations-filtered",
    (event) => {
      syncMarkers(
        event.detail?.visibleIds || [],
        map,
      );
    },
    {
      signal: filterAbortController.signal,
    },
  );

  container._streetCoffeMap = map;
};

// ========================================
// ЗАПУСК
// ========================================

initLocationsMap();

document.addEventListener(
  "astro:page-load",
  initLocationsMap,
);