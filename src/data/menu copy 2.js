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
    addons: [{ id: 9, name: "Cheese", rate: 50 }],
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
    addons: [{ id: 9, name: "Cheese", rate: 50 }],
  },
  {
    category: "Panani Sandwiches",
    items: [
      { id: 19, name: "Chicken Tikka", rate: 550 },
      { id: 20, name: "Chicken Fajita", rate: 550 },
      { id: 21, name: "Chicken Jamacin", rate: 550 },
      { id: 22, name: "Chicken Mughlai", rate: 550 },
      { id: 23, name: "Chicken Buffalo", rate: 550 },
      { id: 23, name: "Chicken Chapli Kebab", rate: 550 },
      { id: 23, name: "Vegetable Sandwich", rate: 550 },
      { id: 23, name: "French Loaf", rate: 800 },
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
    ],
  },
  {
    category: "Platter",
    items: [
      { id: 40, name: "Chicken Platter", rate: 400 },
      { id: 41, name: "Zinger Platter", rate: 450 },
      { id: 42, name: "Chicken Paratha Platter", rate: 400 },
      { id: 43, name: "Zinger Paratha Platter", rate: 450 },
    ],
  },
  {
    category: "Shapatta",
    items: [
      { id: 45, name: "Shapatta Roll", rate: 380 },
      { id: 46, name: "Shapatta Tikka Roll", rate: 400 },
      { id: 47, name: "Shapatta Malai Boti Roll", rate: 420 },
      { id: 48, name: "Shapatta Zinger Roll", rate: 450 },
      { id: 49, name: "Shapatta Special Roll", rate: 500 },
    ],
    addons: [{ id: 9, name: "Cheese", rate: 50 }],
  },
  {
    category: "Deals",
    deals: [
      {
        id: 1,
        name: "Deal 1",
        items: [
          { id: 45, name: "Zesty Zinger Burger" },
          { id: 46, name: "Fries" },
          { id: 47, name: "350ml Drink" },
        ],
      },
      {
        id: 2,
        name: "Deal 2 (Kids Deal)",
        items: [
          { id: 45, name: "Nuggets 5" },
          { id: 46, name: "Fries" },
          { id: 47, name: "Juicy Patty Burger" },
          { id: 47, name: "350ml Drink" },
        ],
      },
      {
        id: 3,
        name: "Deal 3",
        items: [
          { id: 45, name: "Thrill Grill Chicken Buger with Cheese" },
          { id: 46, name: "Thrill Grill Wrap" },
          { id: 47, name: "Fries" },
          { id: 47, name: "500ml Drink" },
        ],
      },
      {
        id: 4,
        name: "Deal 4",
        items: [
          { id: 45, name: "2 Zesty Burger with Cheese" },
          { id: 46, name: "2 Zesty Zinger Wrap" },
          { id: 47, name: "Large Fries" },
          { id: 47, name: "1 Liter Drink" },
        ],
      },
    ],
  },
  {
    category: "BBQ Shawarma",
    items: [
      { id: 51, name: "Tikka Shawarma", rate: 250 },
      { id: 52, name: "Malai Boti Shawarma", rate: 270 },
      { id: 53, name: "Chicken Kabab Shawarma", rate: 300 },
      { id: 54, name: "Chicken Shawarma", rate: 250 },
      { id: 55, name: "Steak Shawarma", rate: 350 },
      { id: 56, name: "Afghani Shawarma", rate: 400 },
      { id: 57, name: "Green Chatkhara Shawarma", rate: 370 },
      { id: 58, name: "Rajistani Shawarma", rate: 350 },
    ],
    addons: [{ id: 9, name: "Cheese", rate: 50 }],
  },
  {
    category: "Buffalo Wings",
    items: [
      { id: 67, name: "6 Pc Wings", rate: 350 },
      { id: 67, name: "12 Pc Wings", rate: 550 },
    ],
  },
  {
    category: "Nuggets",
    items: [
      { id: 67, name: "Nuggets 6 Pc", rate: 260 },
      { id: 67, name: "Nuggets 12 Pc", rate: 500 },
    ],
  },
  {
    category: "BBQ Items",
    items: [
      { id: 67, name: "Leg Piece", rate: 350 },
      { id: 67, name: "Chest Piece", rate: 380 },
      { id: 67, name: "Malai Leg Piece", rate: 400 },
      { id: 67, name: "Malai Chest Piece", rate: 450 },
      { id: 67, name: "Tikka Boti", rate: 200 },
      { id: 67, name: "Malai Boti", rate: 300 },
      { id: 67, name: "Chicken Kabab", rate: 150 },
      { id: 67, name: "Reshmi Kabab", rate: 250 },
      { id: 67, name: "Afghani Boti", rate: 300 },
      { id: 67, name: "Green Chatkhara Boti", rate: 300 },
      { id: 67, name: "Rajistani Boti", rate: 270 },
      { id: 67, name: "Kastoori Boti", rate: 320 },
    ],
  },
  {
    category: "Fries",
    items: [
      { id: 76, name: "Plain Fries", rate: 200 },
      { id: 77, name: "Zinger Fries", rate: 250 },
      { id: 78, name: "Mayo Fries", rate: 270 },
      { id: 79, name: "Loaded Fries", rate: 300 },
      { id: 80, name: "Masala Fries", rate: 320 },
      { id: 81, name: "Chicken Crunchy Fries", rate: 350 },
      { id: 82, name: "Curley Fries", rate: 350 },
    ],
  },
  {
    category: "Sauces",
    items: [
      { id: 84, name: "Extra Sauce", rate: 60 },
      { id: 85, name: "Extra Cheese Slice", rate: 50 },
      { id: 86, name: "Extra Patty", rate: 200 },
    ],
  },
  {
    category: "Beverages",
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
    scoops: ["1 scoop", "2 scoop", "3 scoop"],
    items: [
      {
        id: 96,
        name: "Mango Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 97,
        name: "Pista Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 98,
        name: "Kulfa Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 99,
        name: "Chocolate Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 100,
        name: "Tutti Frutti Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 101,
        name: "Strawberry Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 102,
        name: "Khoya Khajoor Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 103,
        name: "Blueberry Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 104,
        name: "Orange Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 105,
        name: "Vanilla Ice Cream",
        rates: [90, 170, 250],
      },
      {
        id: 106,
        name: "Pineapple Ice Cream",
        rates: [90, 170, 250],
      },
      { id: 107, name: "Oreo Ice Cream", rates: [90, 170, 250] },
      {
        id: 108,
        name: "Fresh Fruit Tutti Frutti",
        rates: [90, 170, 250],
      },
      { id: 110, name: "Special Cone with Any Flavour", rate: 170 },
      { id: 111, name: "Chocolate with Any Flavour", rate: 170 },
    ],
    addons: [
      { id: 130, name: "Sprinkles", rates: [30, 40, 50] },
      { id: 131, name: "Nuts", rates: [30, 40, 50] },
      { id: 131, name: "Carmel", rates: [30, 40, 50] },
      { id: 131, name: "Wafflers", rates: [30, 40, 50] },
    ],
  },
];
