/**
 * StreetCoffe — каталог напитков
 *
 * Источник данных для страницы /menu.
 * Пока не заполнены: описания, состав и фотографии.
 *
 * Для карточки каталога используйте getCatalogPrice(product):
 * она вернёт цену за 300 мл, если такой объём есть,
 * иначе — за ближайший доступный средний объём.
 */

export type ProductCategory =
  | "coffee"
  | "tea"
  | "cold"
  | "hot"
  | "milkshakes"
  | "bubble-tea"
  | "other";

export type ProductSize = {
  /** Отображаемая подпись: например, "300 мл" */
  label: string;
  /** Объём в миллилитрах; null, если объём в прайсе не указан */
  volumeMl: number | null;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  /** Названия для поиска и фильтрации */
  tags: string[];

  /** Цены и доступные объёмы из прайса */
  sizes: ProductSize[];

  /** Будущие поля — пока оставляем пустыми */
  description: string;
  composition: string[];
  gallery: string[];

  /** Дополнительные изображения/данные можно будет подключить позже */
  image: string;
  isAvailable: boolean;

  /** Примечание для редактора, не обязательно выводить на сайт */
  note?: string;
};

export const categoryLabels: Record<ProductCategory, string> = {
  coffee: "Кофе",
  tea: "Чай",
  cold: "Холодные напитки",
  hot: "Горячие напитки",
  milkshakes: "Молочные коктейли",
  "bubble-tea": "Bubble Tea",
  other: "Другое",
};

export const products: Product[] = [
  // --------------------------------------------------
  // КОФЕЙНЫЕ НАПИТКИ
  // --------------------------------------------------
  {
    id: "espresso",
    name: "Эспрессо",
    category: "coffee",
    tags: ["кофе", "эспрессо", "классика"],
    sizes: [{ label: "Порция", volumeMl: null, price: 219 }],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
    note: "В исходном прайсе указан один ценник — 219 ₽; объём неразборчив/не указан.",
  },
  {
    id: "americano",
    name: "Американо",
    category: "coffee",
    tags: ["кофе", "американо", "классика"],
    sizes: [
      { label: "200 мл", volumeMl: 200, price: 219 },
      { label: "300 мл", volumeMl: 300, price: 269 },
      { label: "400 мл", volumeMl: 400, price: 319 },
      { label: "500 мл", volumeMl: 500, price: 389 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "cappuccino",
    name: "Капучино",
    category: "coffee",
    tags: ["кофе", "капучино", "молочный кофе", "классика"],
    sizes: [
      { label: "200 мл", volumeMl: 200, price: 229 },
      { label: "300 мл", volumeMl: 300, price: 289 },
      { label: "400 мл", volumeMl: 400, price: 339 },
      { label: "500 мл", volumeMl: 500, price: 399 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "cappuccino-syrup",
    name: "Капучино с сиропом",
    category: "coffee",
    tags: ["кофе", "капучино", "сироп"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 349 },
      { label: "400 мл", volumeMl: 400, price: 399 },
      { label: "500 мл", volumeMl: 500, price: 459 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
    note: "Сироп — в ассортименте.",
  },
  {
    id: "cappuccino-bounty",
    name: "Капучино Баунти",
    category: "coffee",
    tags: ["кофе", "капучино", "кокос", "десертный кофе"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 429 },
      { label: "400 мл", volumeMl: 400, price: 479 },
      { label: "500 мл", volumeMl: 500, price: 539 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "cappuccino-mm",
    name: "Капучино M&M’s",
    category: "coffee",
    tags: ["кофе", "капучино", "шоколад", "десертный кофе"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 429 },
      { label: "400 мл", volumeMl: 400, price: 479 },
      { label: "500 мл", volumeMl: 500, price: 539 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "mochaccino",
    name: "Моккачино",
    category: "coffee",
    tags: ["кофе", "моккачино", "шоколад"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 329 },
      { label: "400 мл", volumeMl: 400, price: 379 },
      { label: "500 мл", volumeMl: 500, price: 429 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "flat-white",
    name: "Флэт уайт",
    category: "coffee",
    tags: ["кофе", "флэт уайт", "молочный кофе"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 329 },
      { label: "400 мл", volumeMl: 400, price: 379 },
      { label: "500 мл", volumeMl: 500, price: 429 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "latte",
    name: "Латте",
    category: "coffee",
    tags: ["кофе", "латте", "молочный кофе", "классика"],
    sizes: [
      { label: "200 мл", volumeMl: 200, price: 279 },
      { label: "300 мл", volumeMl: 300, price: 339 },
      { label: "400 мл", volumeMl: 400, price: 399 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
    note: "В прайсе также есть несколько повторяющихся строк «Латте» с ценами 339/389/459 ₽ без различимых уточнений. Не добавлены как отдельные товары.",
  },
  {
    id: "iced-latte",
    name: "Холодный латте",
    category: "coffee",
    tags: ["кофе", "латте", "холодный кофе", "айс"],
    sizes: [
      { label: "200 мл", volumeMl: 200, price: 279 },
      { label: "300 мл", volumeMl: 300, price: 339 },
      { label: "400 мл", volumeMl: 400, price: 399 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "bumble",
    name: "Бамбл",
    category: "coffee",
    tags: ["кофе", "бамбл", "холодный кофе"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 359 },
      { label: "400 мл", volumeMl: 400, price: 409 },
      { label: "500 мл", volumeMl: 500, price: 479 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "warm-bumble",
    name: "Бамбл тёплый",
    category: "coffee",
    tags: ["кофе", "бамбл"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 349 },
      { label: "400 мл", volumeMl: 400, price: 399 },
      { label: "500 мл", volumeMl: 500, price: 469 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "bumble-berry-mix",
    name: "Бамбл ягодный микс",
    category: "coffee",
    tags: ["кофе", "бамбл", "ягодный", "фруктовый"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 359 },
      { label: "400 мл", volumeMl: 400, price: 409 },
      { label: "500 мл", volumeMl: 500, price: 479 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "bumble-tropic",
    name: "Бамбл тропик",
    category: "coffee",
    tags: ["кофе", "бамбл", "тропический", "фруктовый"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 359 },
      { label: "400 мл", volumeMl: 400, price: 409 },
      { label: "500 мл", volumeMl: 500, price: 479 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "latte-syrup",
    name: "Латте с сиропом",
    category: "coffee",
    tags: ["кофе", "латте", "сироп"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 339 },
      { label: "400 мл", volumeMl: 400, price: 389 },
      { label: "500 мл", volumeMl: 500, price: 459 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
    note: "Сироп — в ассортименте.",
  },
  {
    id: "ice-macchiato",
    name: "ICE Macchiato",
    category: "coffee",
    tags: ["кофе", "маккиато", "холодный кофе", "айс"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 419 },
      { label: "400 мл", volumeMl: 400, price: 469 },
      { label: "500 мл", volumeMl: 500, price: 519 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "raf",
    name: "Раф",
    category: "coffee",
    tags: ["кофе", "раф", "сливочный кофе"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 309 },
      { label: "400 мл", volumeMl: 400, price: 359 },
      { label: "500 мл", volumeMl: 500, price: 419 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "cheese-raf",
    name: "Раф сырный",
    category: "coffee",
    tags: ["кофе", "раф", "сырный"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 359 },
      { label: "400 мл", volumeMl: 400, price: 409 },
      { label: "500 мл", volumeMl: 500, price: 469 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "peanut-raf",
    name: "Раф арахисовый",
    category: "coffee",
    tags: ["кофе", "раф", "арахис"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 359 },
      { label: "400 мл", volumeMl: 400, price: 409 },
      { label: "500 мл", volumeMl: 500, price: 469 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "belgian-waffle-raf",
    name: "Раф Бельгийская вафля",
    category: "coffee",
    tags: ["кофе", "раф", "десертный кофе"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 389 },
      { label: "400 мл", volumeMl: 400, price: 439 },
      { label: "500 мл", volumeMl: 500, price: 499 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "cocoa",
    name: "Какао",
    category: "coffee",
    tags: ["какао", "шоколадный напиток", "без кофе"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 319 },
      { label: "400 мл", volumeMl: 400, price: 379 },
      { label: "500 мл", volumeMl: 500, price: 439 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "banana-kids-cocoa",
    name: "Какао BANANA KIDS",
    category: "coffee",
    tags: ["какао", "банан", "детский напиток"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 429 },
      { label: "400 мл", volumeMl: 400, price: 479 },
      { label: "500 мл", volumeMl: 500, price: 539 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },
  {
    id: "hot-chocolate",
    name: "Горячий шоколад",
    category: "coffee",
    tags: ["шоколад", "горячий напиток", "без кофе"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 339 },
      { label: "400 мл", volumeMl: 400, price: 379 },
      { label: "500 мл", volumeMl: 500, price: 449 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  },

    // --------------------------------------------------
  // BUBBLE TEA
  // --------------------------------------------------
  ...[
    // BUBBLE TEA
    ["bubble-tea-blueberry-banana", "Bubble Tea Чер-гол-банан", [319, 369], ["bubble tea", "чер-гол-банан", "черника", "голубика", "банан"]],
    ["bubble-tea-kiwi-feijoa", "Bubble Tea Киви фейхоа", [319, 369], ["bubble tea", "киви", "фейхоа"]],
    ["bubble-tea-mango-lychee", "Bubble Tea Манго личи", [319, 369], ["bubble tea", "манго", "личи"]],
    ["bubble-tea-melon-lemongrass", "Bubble Tea Дыня лемонграсс", [319, 369], ["bubble tea", "дыня", "лемонграсс"]],
    ["bubble-tea-watermelon-aloe", "Bubble Tea Арбуз алоэ", [319, 369], ["bubble tea", "арбуз", "алоэ"]],

    // BUBBLE ICE
    ["bubble-ice-blueberry-banana", "Bubble Ice Чер-гол-банан", [319, 369], ["bubble ice", "чер-гол-банан", "черника", "голубика", "банан"]],
    ["bubble-ice-kiwi-feijoa", "Bubble Ice Киви фейхоа", [319, 369], ["bubble ice", "киви", "фейхоа"]],
    ["bubble-ice-mango-lychee", "Bubble Ice Манго личи", [319, 369], ["bubble ice", "манго", "личи"]],
    ["bubble-ice-melon-lemongrass", "Bubble Ice Дыня лемонграсс", [319, 369], ["bubble ice", "дыня", "лемонграсс"]],
    ["bubble-ice-watermelon-aloe", "Bubble Ice Арбуз алоэ", [319, 369], ["bubble ice", "арбуз", "алоэ"]],

    // BUBBLE COFFEE / MILK / OREO
    ["bubble-coffee-blueberry-boom", "Bubble Coffee Черничный бум", [319, 369, 489], ["bubble coffee", "черничный бум", "черника"]],
    ["bubble-coffee-apple-strudel", "Bubble Coffee Яблочный штрудель", [319, 369, 489], ["bubble coffee", "яблоко", "штрудель"]],
    ["bubble-milk-raspberry-chocolate", "Bubble Milk Малина в шоколаде", [319, 369, 489], ["bubble milk", "малина", "шоколад"]],
    ["bubble-oreo", "Bubble Oreo", [319, 369, 489], ["bubble", "oreo", "орео", "шоколад"]],
    ["bubble-coffee-raspberry-mint", "Bubble Coffee Малина мята", [319, 369, 489], ["bubble coffee", "малина", "мята"]],
  ].map(([id, name, prices, tags]) => ({
    id: id as string,
    name: name as string,
    category: "bubble-tea" as const,
    tags: tags as string[],
    sizes: (prices as number[]).map((price, index) => ({
      label: `${[375, 500, 600][index]} мл`,
      volumeMl: [375, 500, 600][index],
      price,
    })),
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  })),

  // --------------------------------------------------
  // КОЛЛЕКЦИЯ ЧАЯ
  // --------------------------------------------------
  ...[
    ["milk-oolong", "Молочный Улун", [209, 259, 319], ["чай", "улун"]],
    ["jasmine-tea", "Классический с жасмином", [209, 259, 319], ["чай", "жасмин"]],
    ["assam", "Ассам", [209, 259, 319], ["чай", "чёрный чай"]],
    ["sencha", "Сенча", [209, 259, 319], ["чай", "зелёный чай"]],
    ["naked-fruit", "Наглый фрукт", [209, 259, 319], ["чай", "фруктовый"]],
    ["sicilian-breakfast", "Сицилийский Завтрак", [209, 259, 319], ["чай", "цитрусовый"]],
    ["mango-passion", "Манго-Маракуйя", [209, 259, 319], ["чай", "манго", "маракуйя"]],
    ["orange-cookie", "Апельсиновое печенье", [209, 259, 319], ["чай", "апельсин"]],
    ["thyme-tea", "С чабрецом", [209, 259, 319], ["чай", "чабрец"]],
    ["matcha", "Матча", [309, 359, 419], ["чай", "матча", "зелёный чай"]],
  ].map(([id, name, prices, tags]) => ({
    id: id as string,
    name: name as string,
    category: "tea" as const,
    tags: tags as string[],
    sizes: (prices as number[]).map((price, index) => ({
      label: `${[300, 400, 500][index]} мл`,
      volumeMl: [300, 400, 500][index],
      price,
    })),
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
    note: "В прайсе три цены; сопоставлены с объёмами 300/400/500 мл по расположению колонок.",
  })),

  // --------------------------------------------------
  // ПРОХЛАДИТЕЛЬНЫЕ НАПИТКИ
  // --------------------------------------------------
  ...[
    ["strawberry-mojito", "Клубничный Мохито", [249, 299, 359], ["холодный напиток", "клубника", "мохито"]],
    ["mango-passion-cold", "Манго-Маракуйя", [249, 299, 359], ["холодный напиток", "манго", "маракуйя"]],
    ["sangria", "Сангрия", [249, 299, 359], ["холодный напиток", "фруктовый"]],
    ["blackcurrant", "Чёрная смородина", [249, 299, 359], ["холодный напиток", "ягодный"]],
    ["raspberry-mors", "Малиновый морс", [249, 299, 359], ["холодный напиток", "морс", "малина"]],
  ].map(([id, name, prices, tags]) => ({
    id: id as string,
    name: name as string,
    category: "cold" as const,
    tags: tags as string[],
    sizes: (prices as number[]).map((price, index) => ({
      label: `${[300, 400, 500][index]} мл`,
      volumeMl: [300, 400, 500][index],
      price,
    })),
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
    note: "В прайсе три цены; сопоставлены с объёмами 300/400/500 мл по расположению колонок.",
  })),

  // --------------------------------------------------
  // ГОРЯЧИЕ НАПИТКИ
  // --------------------------------------------------
  ...[
    ["glintvein", "Глинтвейн"],
    ["spicy-punch", "Пряный пунш"],
    ["ginger-honey", "Имбирь мёд"],
    ["berry-mors", "Ягодный морс"],
    ["raspberry-ginger", "Малина имбирь"],
    ["sea-buckthorn-mors", "Облепиховый морс"],
  ].map(([id, name]) => ({
    id,
    name,
    category: "hot" as const,
    tags: ["горячий напиток", "зимний напиток"],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 249 },
      { label: "400 мл", volumeMl: 400, price: 299 },
      { label: "500 мл", volumeMl: 500, price: 359 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
    note: "В прайсе три цены; сопоставлены с объёмами 300/400/500 мл по расположению колонок.",
  })),

  // --------------------------------------------------
  // МОЛОЧНЫЕ КОКТЕЙЛИ
  // --------------------------------------------------
  ...[
    ["strawberry-milkshake", "Клубничный", ["клубника", "молочный коктейль"]],
    ["chocolate-milkshake", "Шоколадный", ["шоколад", "молочный коктейль"]],
    ["banana-milkshake", "Банановый", ["банан", "молочный коктейль"]],
    ["vanilla-milkshake", "Ванильный", ["ваниль", "молочный коктейль"]],
  ].map(([id, name, tags]) => ({
    id: id as string,
    name: name as string,
    category: "milkshakes" as const,
    tags: tags as string[],
    sizes: [
      { label: "300 мл", volumeMl: 300, price: 299 },
      { label: "400 мл", volumeMl: 400, price: 349 },
    ],
    description: "",
    composition: [],
    gallery: [],
    image: "",
    isAvailable: true,
  })),
];

export type Addon = {
  id: string;
  name: string;
  price: number;
  unit: string;
  note?: string;
};

/** Добавки и дополнительные опции из прайса */
export const addons: Addon[] = [
  { id: "topping", name: "Топпинг", price: 50, unit: "порция" },
  { id: "marshmallow", name: "Маршмеллоу", price: 90, unit: "порция" },
  { id: "syrup", name: "Сиропы", price: 50, unit: "порция" },
  { id: "whipped-cream", name: "Взбитые сливки", price: 90, unit: "порция" },
  {
    id: "coconut-milk-200",
    name: "Молоко кокосовое / овсяное / соевое с ванилью",
    price: 90,
    unit: "200 г",
  },
  {
    id: "coconut-milk-300",
    name: "Молоко кокосовое / овсяное / соевое с ванилью",
    price: 100,
    unit: "300 г",
  },
  {
    id: "coconut-milk-400",
    name: "Молоко кокосовое / овсяное / соевое с ванилью",
    price: 130,
    unit: "400 г",
  },
  {
    id: "coconut-milk-500",
    name: "Молоко кокосовое / овсяное / соевое с ванилью",
    price: 150,
    unit: "500 г",
  },
];

/**
 * Возвращает цену для карточки каталога.
 * Приоритет: 300 мл → ближайший к 300 мл объём → первая цена.
 */
export function getCatalogPrice(product: Product): ProductSize | undefined {
  if (!product.sizes.length) return undefined;

  const exactMedium = product.sizes.find((size) => size.volumeMl === 300);
  if (exactMedium) return exactMedium;

  const withVolume = product.sizes.filter(
    (size): size is ProductSize & { volumeMl: number } =>
      size.volumeMl !== null,
  );

  if (!withVolume.length) return product.sizes[0];

  return withVolume.reduce((closest, current) =>
    Math.abs(current.volumeMl - 300) < Math.abs(closest.volumeMl - 300)
      ? current
      : closest,
  );
}

/** Быстрый поиск товара по id */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
