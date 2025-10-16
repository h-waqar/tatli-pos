// data/menu.js
export const menuData = [
  {
    category: "Burgers",
    items: [
      { id: 1, name: "Zinger Burger", rate: 350 },
      { id: 2, name: "Chicken Burger", rate: 270 },
      { id: 3, name: "Steak Burger", rate: 340 },
      { id: 4, name: "Petty Burger", rate: 240 },
      { id: 5, name: "Malai Boti Burger", rate: 340 },
      { id: 6, name: "Double Petty Burger", rate: 400 },
      { id: 7, name: "Double Steak Burger", rate: 600 },
      { id: 8, name: "Tower Burger", rate: 400 },
      { id: 112, name: "Zesty Zinger Burger", rate: null },
    ],
    addons: [{ id: 9, name: "Cheese", rate: 50 }],
  },
  {
    category: "Paratha Rolls",
    items: [
      { id: 11, name: "Chicken Paratha Roll", rate: 230 },
      { id: 12, name: "Zinger Paratha Roll", rate: 280 },
      { id: 13, name: "Tikka Paratha Roll", rate: 270 },
      { id: 14, name: "Malai Paratha Roll", rate: 280 },
      { id: 15, name: "Kabab Paratha Roll", rate: 250 },
      { id: 16, name: "Steak Paratha Roll", rate: 300 },
      { id: 17, name: "Special Paratha Roll", rate: 270 },
    ],
  },
  {
    category: "Wraps",
    items: [
      { id: 19, name: "Tikka Wrap", rate: 350 },
      { id: 20, name: "Malai Boti Wrap", rate: 380 },
      { id: 21, name: "Kabab Wrap", rate: 370 },
      { id: 22, name: "Zinger Wrap", rate: 400 },
      { id: 23, name: "Grilled Wrap", rate: 380 },
    ],
  },
  {
    category: "Main Dishes",
    items: [
      { id: 25, name: "Chicken Tikka", rate: 550 },
      { id: 26, name: "Chicken Fajita", rate: 550 },
      { id: 27, name: "Chicken Jamacin", rate: 550 },
      { id: 28, name: "Chicken Mughlai", rate: 550 },
      { id: 29, name: "Chicken Buffalo", rate: 550 },
      { id: 30, name: "Chicken Chapli Kaba", rate: 550 },
      { id: 31, name: "Vegetable Sandwich", rate: 550 },
      { id: 32, name: "French Loaf", rate: 800 },
    ],
  },
  {
    category: "Shawarma",
    items: [
      { id: 34, name: "Chicken Shawarma", rate: 190 },
      { id: 35, name: "Zinger Shawarma", rate: 270 },
      { id: 36, name: "Cheese Shawarma", rate: 270 },
      { id: 37, name: "Open Shawarma", rate: 300 },
      { id: 38, name: "Special Shawarma", rate: 260 },
      { id: 51, name: "Tikka Shawarma", rate: 250 },
      { id: 52, name: "Malai Boti Shawarma", rate: 270 },
      { id: 53, name: "Chicken Kabab Shawarma", rate: 300 },
      { id: 54, name: "Chicken Shawarma", rate: 250 },
      { id: 55, name: "Steak Shawarma", rate: 350 },
      { id: 56, name: "Afghani Shawarma", rate: 400 },
      { id: 57, name: "Green Chatkhara Shawarma", rate: 370 },
      { id: 58, name: "Rajistani Shawarma", rate: 350 },
    ],
  },
  {
    category: "Platters",
    items: [
      { id: 40, name: "Chicken Platter", rate: 400 },
      { id: 41, name: "Zinger Platter", rate: 450 },
      { id: 42, name: "Chicken Paratha Platter", rate: 400 },
      { id: 43, name: "Zinger Paratha Platter", rate: 450 },
    ],
  },
  {
    category: "Shapatta Rolls",
    items: [
      { id: 45, name: "Shapatta Roll", rate: 380 },
      { id: 46, name: "Shapatta Tikka Roll", rate: 400 },
      { id: 47, name: "Shapatta Malai Boti Roll", rate: 420 },
      { id: 48, name: "Shapatta Zinger Roll", rate: 450 },
      { id: 49, name: "Shapatta Special Roll", rate: 500 },
    ],
  },
  {
    category: "Boti & Kabab",
    items: [
      { id: 67, name: "Tikka Boti", rate: 200 },
      { id: 68, name: "Malai Boti", rate: 300 },
      { id: 69, name: "Chicken Kabab", rate: 150 },
      { id: 70, name: "Reshmi Kabab", rate: 250 },
      { id: 71, name: "Afghani Boti", rate: 300 },
      { id: 72, name: "Green Chakhara Boti", rate: 300 },
      { id: 73, name: "Rajistani Boti", rate: null },
      { id: 74, name: "Kastori Boti", rate: 320 },
    ],
  },
  {
    category: "Fries & Extras",
    items: [
      { id: 76, name: "Plain Fries", rate: 200 },
      { id: 77, name: "Zinger Fries", rate: 250 },
      { id: 78, name: "Mayo Fries", rate: 270 },
      { id: 79, name: "Loaded Fries", rate: 300 },
      { id: 80, name: "Masala Fries", rate: 320 },
      { id: 81, name: "Chicken Crunchy Fries", rate: 350 },
      { id: 82, name: "Curley Fries", rate: 350 },
    ],
    addons: [
      { id: 84, name: "Extra Sauce", rate: 60 },
      { id: 85, name: "Extra Cheese Slice", rate: 50 },
      { id: 86, name: "Extra Patty", rate: 200 },
    ],
  },
  {
    category: "Drinks",
    items: [
      { id: 88, name: "Regular Bottle 350 ml", rate: 80 },
      { id: 89, name: "1 Liter Bottle", rate: 170 },
      { id: 90, name: "1.5 Liter Bottle", rate: 210 },
      { id: 91, name: "Tin Pack", rate: 120 },
      { id: 92, name: "Mint Margarita", rate: 250 },
      { id: 93, name: "Mineral Water Half", rate: 60 },
      { id: 94, name: "Mineral Water Full", rate: 120 },
    ],
  },
  {
    category: "Ice Cream",
    // Synchronize labels with the 6 rates available in item.rates
    scoops: [
      "2 scoop",
      "3 scoop",
      "4 scoop",
      "5 scoop",
      "Special Cone",
      "Chocolate Dip",
    ],
    items: [
      { id: 96, name: "Mango Ice Cream", rates: [90, 120, 170, 210, 250, 300] },
      { id: 97, name: "Pista Ice Cream", rates: [90, 120, 170, 210, 250, 300] },
      { id: 98, name: "Kulfa Ice Cream", rates: [90, 120, 170, 210, 250, 300] },
      {
        id: 99,
        name: "Chocolate Ice Cream",
        rates: [90, 120, 170, 210, 250, 300],
      },
      {
        id: 100,
        name: "Tutti Frutti Ice Cream",
        rates: [90, 120, 170, 210, 250, 300],
      },
      {
        id: 101,
        name: "Strawberry Ice Cream",
        rates: [90, 120, 170, 210, 250, 300],
      },
      {
        id: 102,
        name: "Khoya Khajoor Ice Cream",
        rates: [90, 120, 170, 210, 250, 300],
      },
      {
        id: 103,
        name: "Blueberry Ice Cream",
        rates: [90, 120, 170, 210, 250, 300],
      },
      {
        id: 104,
        name: "Orange Ice Cream",
        rates: [90, 120, 170, 210, 250, 300],
      },
      {
        id: 105,
        name: "Vanilla Ice Cream",
        rates: [90, 120, 170, 210, 250, 300],
      },
      {
        id: 106,
        name: "Pineapple Ice Cream",
        rates: [90, 120, 170, 210, 250, 300],
      },
      { id: 107, name: "Oreo Ice Cream", rates: [90, 120, 170, 210, 250, 300] },
      {
        id: 108,
        name: "Fresh Fruit Tutti Frutti",
        rates: [90, 120, 170, 210, 250, 300],
      },
      { id: 110, name: "Special Cone with Any Flavour", rate: 170 }, // This remains a single-rate item
      { id: 111, name: "Chocolate with Any Flavour", rate: 170 }, // This remains a single-rate item
    ],
    addons: [
      { id: 130, name: "Sprinkles", rates: [10, 20, 30, 40, 30, 30] },
      { id: 131, name: "Chocolate Syrup", rates: [20, 30, 50, 70, 50, 50] },
    ],
  },
  {
    category: "Extras",
    items: [
      { id: 60, name: "Nuggets (6 Pieces)", rate: 260 },
      { id: 61, name: "Nuggets (12 Pieces)", rate: 500 },
      { id: 63, name: "Leg Piece", rate: 350 },
      { id: 64, name: "Chest Piece", rate: 380 },
      { id: 65, name: "Malai Leg Piece", rate: 400 },
      { id: 66, name: "Malai Chest Piece", rate: 450 },
    ],
  },
];
