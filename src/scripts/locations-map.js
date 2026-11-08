import {
  Map as MapLibreMap,
  Marker,
  Popup,
  LngLatBounds,
  setWorkerUrl,
} from "maplibre-gl";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import "maplibre-gl/dist/maplibre-gl.css";

import { locations } from "../data/locations";

// Настройка Worker для Vite / Astro
setWorkerUrl(workerUrl);

// Стиль OpenFreeMap Bright
const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";

// Начальная позиция — Автозаводский район Тольятти
const CITY_CENTER = [49.275, 53.518];
const INITIAL_ZOOM = 12.8;

// Коллекция маркеров
const markers = new globalThis.Map();

let activePopup = null;
let currentMap = null;
let resizeObserver = null;

// ========================================
// СОЗДАНИЕ HTML МАРКЕРА
// ========================================

const createMarkerElement = (location) => {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "streetcoffe-marker";

  button.setAttribute(
    "aria-label",
    `Кофейня ${location.name}`
  );

  button.innerHTML = `
    <span class="streetcoffe-marker__pin">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        />
        <path
          d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        />
        <path
          d="M8 4c0 1 1 1 1 2M12 4c0 1 1 1 1 2"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        />
        <path
          d="M4 21h16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        />
      </svg>
    </span>
  `;

  return button;
};

// ========================================
// СОЗДАНИЕ POPUP
// ========================================

const createPopupContent = (location) => {
  const wrapper = document.createElement("div");
  wrapper.className = "streetcoffe-popup";

  const photo = document.createElement("div");
  photo.className = "streetcoffe-popup__photo";

  const image = document.createElement("img");
  image.src = location.image;
  image.alt = `Интерьер кофейни ${location.name}`;

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
  hours.textContent = `${location.hours.open} — ${location.hours.close}`;

  const route = document.createElement("a");
  route.className = "streetcoffe-popup__route";

  route.href = `https://yandex.ru/maps/?text=${encodeURIComponent(
    `Тольятти, ${location.address}`
  )}`;

  route.target = "_blank";
  route.rel = "noopener noreferrer";
  route.textContent = "Построить маршрут";

  content.append(
    title,
    address,
    hours,
    route
  );

  wrapper.append(photo, content);

  return wrapper;
};

// ========================================
// АКТИВНАЯ КАРТОЧКА
// ========================================

const activateCard = (id) => {
  document
    .querySelectorAll("[data-location-card]")
    .forEach((card) => {
      card.classList.toggle(
        "is-active",
        Number(card.dataset.locationId) === id
      );
    });
};

// ========================================
// ОТКРЫТИЕ POPUP
// ========================================

const openLocationPopup = (location, map) => {
  activePopup?.remove();

  activateCard(location.id);

  const popup = new Popup({
    offset: 35,
    closeButton: true,
    closeOnClick: false,
    maxWidth: "340px",
    className: "streetcoffe-map-popup",
  })
    .setLngLat([location.lng, location.lat])
    .setDOMContent(createPopupContent(location))
    .addTo(map);

  activePopup = popup;

  popup.on("close", () => {
    if (activePopup === popup) {
      activePopup = null;
      activateCard(null);
    }
  });
};

// ========================================
// ДОБАВЛЕНИЕ МАРКЕРОВ
// ========================================

const addMarkers = (map) => {
  // Защита от повторного добавления
  markers.forEach((marker) => marker.remove());
  markers.clear();

  locations.forEach((location) => {
    // Пропускаем филиалы без координат
    if (
      typeof location.lng !== "number" ||
      typeof location.lat !== "number"
    ) {
      return;
    }

    const element = createMarkerElement(location);

    const marker = new Marker({
      element,
      anchor: "bottom",
    })
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    element.addEventListener("click", () => {
      map.flyTo({
        center: [location.lng, location.lat],
        zoom: Math.max(map.getZoom(), 14),
        speed: 1.2,
        essential: true,
      });

      openLocationPopup(location, map);
    });

    markers.set(location.id, marker);
  });

  console.log(
    "StreetCoffe: маркеров добавлено:",
    markers.size
  );
};

// ========================================
// СИНХРОНИЗАЦИЯ МАРКЕРОВ С ПОИСКОМ
// ========================================

const syncMarkers = (visibleIds) => {
  const visibleSet = new Set(visibleIds);

  markers.forEach((marker, id) => {
    marker.getElement().style.display =
      visibleSet.has(id) ? "" : "none";
  });

  if (activePopup) {
    const popupLocation = locations.find(
      (location) =>
        location.lng === activePopup.getLngLat().lng &&
        location.lat === activePopup.getLngLat().lat
    );

    if (
      popupLocation &&
      !visibleSet.has(popupLocation.id)
    ) {
      activePopup.remove();
      activePopup = null;
      activateCard(null);
    }
  }
};

// ========================================
// ВЗАИМОДЕЙСТВИЕ С КАРТОЧКАМИ
// ========================================

const setupCardInteractions = (map) => {
  const section = document.querySelector(".locations");

  if (!section) return;

  // Не добавляем обработчик повторно
  if (section.dataset.mapInteractionsInitialized === "true") {
    return;
  }

  section.dataset.mapInteractionsInitialized = "true";

  section.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    // Не перехватываем нажатия по ссылкам
    if (target.closest("a")) return;

    const card = target.closest("[data-location-card]");

    if (!card) return;

    const locationId = Number(card.dataset.locationId);

    const location = locations.find(
      (item) => item.id === locationId
    );

    if (!location) return;

    // Если координат пока нет — просто выделяем карточку
    if (
      typeof location.lng !== "number" ||
      typeof location.lat !== "number"
    ) {
      activateCard(location.id);
      return;
    }

    map.flyTo({
      center: [location.lng, location.lat],
      zoom: Math.max(map.getZoom(), 14),
      speed: 1.2,
      essential: true,
    });

    openLocationPopup(location, map);
  });
};

// ========================================
// ИНИЦИАЛИЗАЦИЯ КАРТЫ
// ========================================

const initLocationsMap = () => {
  const container = document.querySelector("#streetcoffe-map");

  if (
    !container ||
    container.dataset.initialized === "true"
  ) {
    return;
  }

  container.dataset.initialized = "true";

  console.log("StreetCoffe: инициализация карты...");

  const map = new MapLibreMap({
    container,
    style: MAP_STYLE,

    // Начальная позиция — Автозаводский район
    center: CITY_CENTER,
    zoom: INITIAL_ZOOM,

    minZoom: 10,
    maxZoom: 18,

    attributionControl: true,

    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
  });

  currentMap = map;

  // Карта полностью загружена
  map.on("load", () => {
    console.log("StreetCoffe: карта загружена");

    map.resize();

    // Добавляем маркеры
    addMarkers(map);

    // Связываем карточки с картой
    setupCardInteractions(map);

    // Синхронизируем начальную видимость
    const visibleIds = Array.from(
      document.querySelectorAll(
        "[data-location-card]:not([hidden])"
      )
    ).map((card) => Number(card.dataset.locationId));

    syncMarkers(visibleIds);

    // Сохраняем начальное положение
    map.jumpTo({
      center: CITY_CENTER,
      zoom: INITIAL_ZOOM,
    });
  });

  // Загрузка стиля
  map.on("style.load", () => {
    console.log("StreetCoffe: стиль Bright загружен");
  });

  // Ошибки карты
  map.on("error", (event) => {
    console.error(
      "StreetCoffe map error:",
      event.error || event
    );
  });

  // Отслеживание изменения размеров
  resizeObserver = new ResizeObserver(() => {
    map.resize();
  });

  resizeObserver.observe(container);

  // Синхронизация поиска и сортировки
  document.addEventListener(
    "streetcoffe:locations-filtered",
    (event) => {
      syncMarkers(event.detail?.visibleIds || []);
    }
  );

  container._streetCoffeMap = map;
};

// ========================================
// ЗАПУСК
// ========================================

initLocationsMap();

document.addEventListener(
  "astro:page-load",
  initLocationsMap
);