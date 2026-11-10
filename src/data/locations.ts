export interface CoffeeLocation {
  id: number;
  name: string;
  address: string;
  lng: number | null;
  lat: number | null;
  image: string;
  hours: {
    open: string;
    close: string;
  };
}

export const locations: CoffeeLocation[] = [
  {
    id: 1,
    name: "Кофейня №1",
    address: "Спортивная, 31А",
    lng: 49.255842,
    lat: 53.507421,
    image: "/locations/location-01.webp",
    hours: {
      open: "00:00",
      close: "23:59",
    },
  },
  {
    id: 2,
    name: "Кофейня №2",
    address: "Юбилейная, 91А",
    lng: 53.501993,
    lat: 49.275666,
    image: "/locations/location-02.webp",
    hours: {
      open: "07:00",
      close: "23:00",
    },
  },
  {
    id: 3,
    name: "Кофейня №3",
    address: "Юбилейная, 55/2",
    lng: 49.273105,
    lat: 53.518641,
    image: "/locations/location-03.webp",
    hours: {
      open: "00:00",
      close: "23:59",
    },
  },
  {
    id: 4,
    name: "Кофейня №4",
    address: "Спортивная, 3А",
    lng: 49.277834,
    lat: 53.504958,
    image: "/locations/location-04.webp",
    hours: {
      open: "00:00",
      close: "23:59",
    },
  },
  {
    id: 5,
    name: "Кофейня №5",
    address: "Революционная, 64А",
    lng: 49.273397,
    lat: 53.530349,
    image: "/locations/location-05.webp",
    hours: {
      open: "00:00",
      close: "23:59",
    },
  },
  {
    id: 6,
    name: "Кофейня №6",
    address: "Приморский бульвар, 37с1",
    lng: null,
    lat: null,
    image: "/locations/location-06.webp",
    hours: {
      open: "00:00",
      close: "23:59",
    },
  },
  {
    id: 7,
    name: "Кофейня №7",
    address: "Строителей, 2А",
    lng: null,
    lat: null,
    image: "/locations/location-07.webp",
    hours: {
      open: "00:00",
      close: "23:59",
    },
  },
  {
    id: 8,
    name: "Кофейня №8",
    address: "Строителей, 15",
    lng: null,
    lat: null,
    image: "/locations/location-08.webp",
    hours: {
      open: "00:00",
      close: "23:59",
    },
  },
];