export const categories = [
  { id: 'sweets', name: 'Mithai (Sweets)', image: 'https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'chocolates', name: 'Premium Chocolates', image: 'https://images.pexels.com/photos/65882/pexels-photo-65882.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'cakes', name: 'Designer Cakes', image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'namkin', name: 'Savory Namkin', image: 'https://images.pexels.com/photos/37153389/pexels-photo-37153389.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'wafers', name: 'Crispy Wafers', image: 'https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'biscuits', name: 'Luxury Biscuits', image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'drinks', name: 'Cold Drinks', image: 'https://images.pexels.com/photos/29684991/pexels-photo-29684991.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const generateProducts = () => {
  const products = [];
  let id = 1;

  const getPexelsUrl = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

  const exactImages = {
    // Top Sweets & Snacks (Verified Specific IDs)
    'Gulab Jamun': '15014918',
    'Jalebi': '36551398',
    'Mini Samosa': '37153389',
    'Kaju Katli': '18488310',
    'Rasgulla': '16005658',
    'Motichoor Laddu': '8659010',
    'Besan Laddu': '8659010',
    'Barfi': '7182054',
    'Gajar Ka Halwa': '37153764',
    'Rasmalai': '29699512',
    'Ghevar': '14775031',
    'Mysore Pak': '26341215',
    'Soan Papdi': '34270742',
    'Imarti': '27695747',
    'Mango Lassi': '1126359',
    'Aloo Bhujia': '1611311',
    'Biscuits': '230325',
    
    // Category Pools
    '__cakesPool': [
      '1070850', '1126359', '1854652', '2144112', '2144113', '1055272', '140831', '1721932', '269108', '461060',
      '2337822', '3026808', '1120464', '2067425', '2684554', '264893', '264892', '264939', '1028714', '1126359'
    ],
    '__drinksPool': [
      '1126359', '1213447', '2109099', '2045362', '214333', '1586942', '1092730', '1269025', '1304540', '1516983'
    ],
    '__namkinPool': [
      '37153389', '1611311', '1586942', '1437267', '229528', '2474661', '1611311', '1586942', '1437267', '229528'
    ]
  };

  const sweetsNames = [
    'Gulab Jamun', 'Rasgulla', 'Kaju Katli', 'Motichoor Laddu', 'Besan Laddu', 
    'Mysore Pak', 'Soan Papdi', 'Jalebi', 'Imarti', 'Barfi', 
    'Peda', 'Gajar Ka Halwa', 'Moong Dal Halwa', 'Rasmalai', 'Khas Khas Halwa',
    'Chum Chum', 'Sandesh', 'Rabri', 'Balushahi', 'Ghevar',
    'Gujiya', 'Shrikhand', 'Phirni', 'Malpua', 'Lapsi',
    'Kala Jamun', 'Boondi Laddu', 'Dharwad Peda', 'Agra Pethas', 'Mathura Peda',
    'Kaju Roll', 'Anjeer Barfi', 'Dry Fruit Laddu', 'Coconut Barfi', 'Mawa Barfi',
    'Kesar Peda', 'Champakali', 'Lobongo Lotika', 'Patisapta', 'Narkel Naru',
    'Adhirasam', 'Ariselu', 'Mysore Pak Premium', 'Doodh Peda', 'Badam Halwa',
    'Kaju Pista Roll', 'Chocolate Barfi', 'Rose Barfi', 'Mango Barfi', 'Saffron Laddu'
  ];
  sweetsNames.forEach((name, index) => {
    let photoId = exactImages[name] || (16773240 + index).toString();
    products.push({ id: id++, name, category: 'sweets', price: 200 + (index * 10), rating: 4.5 + (Math.random() * 0.5), description: `Delicious handcrafted ${name} made with pure ghee.`, image: getPexelsUrl(photoId), reviews: [] });
  });

  const cakeNames = [
    'Black Forest', 'Red Velvet', 'Pineapple Delight', 'Chocolate Truffle', 'Vanilla Bean',
    'Butterscotch', 'Fruit Overload', 'Dark Fantasy', 'White Forest', 'Strawberry Bliss',
    'Mango Tango', 'Blueberry Glaze', 'Coffee Mocha', 'Caramel Crunch', 'Tiramisu',
    'Hazelnut Praline', 'Lemon Zest', 'Pistachio Rose', 'Rainbow Cake', 'Omni Chocolate'
  ];
  cakeNames.forEach((name, index) => {
    const photoId = exactImages[name] || exactImages['__cakesPool'][index % exactImages['__cakesPool'].length];
    products.push({ id: id++, name, category: 'cakes', price: 500 + (index * 20), rating: 4.6 + (Math.random() * 0.4), description: `Premium ${name} cake, freshly baked.`, image: getPexelsUrl(photoId), reviews: [] });
  });

  const namkinNames = [
    'Aloo Bhujia', 'Bikaneri Bhujia', 'Khatta Meetha', 'Moong Dal', 'Chana Dal',
    'Masala Peanuts', 'Cornflakes Mixture', 'Soya Sticks', 'Mini Samosa', 'Dry Kachori'
  ];
  namkinNames.forEach((name, index) => {
    const photoId = exactImages[name] || exactImages['__namkinPool'][index % exactImages['__namkinPool'].length];
    products.push({ id: id++, name, category: 'namkin', price: 50 + (index * 5), rating: 4.4 + (Math.random() * 0.6), description: `Crispy and delicious ${name}.`, image: getPexelsUrl(photoId), reviews: [] });
  });

  const wafersNames = [
    'Classic Salted Wafers', 'Masala Wafers', 'Cheese Wafers', 'Hot & Spicy Wafers'
  ];
  wafersNames.forEach((name, index) => {
    products.push({ id: id++, name, category: 'wafers', price: 40 + (index * 2), rating: 4.3 + (Math.random() * 0.7), description: `Thin and crispy ${name}, perfectly seasoned.`, image: getPexelsUrl(30622220 + index), reviews: [] });
  });

  const biscuitsNames = [
    'Butter Cookies', 'Cashew Biscuits', 'Pista Biscuits', 'Chocolate Chip Cookies'
  ];
  biscuitsNames.forEach((name, index) => {
    products.push({ id: id++, name, category: 'biscuits', price: 60 + (index * 5), rating: 4.5 + (Math.random() * 0.5), description: `Freshly baked ${name}, melt-in-your-mouth texture.`, image: getPexelsUrl(230325 + index), reviews: [] });
  });

  const drinksNames = [
    'Mango Lassi', 'Sweet Thandai', 'Refreshing Rose Milk', 'Masala Chaas'
  ];
  drinksNames.forEach((name, index) => {
    const photoId = exactImages[name] || exactImages['__drinksPool'][index % exactImages['__drinksPool'].length];
    products.push({ id: id++, name, category: 'drinks', price: 80 + (index * 5), rating: 4.6 + (Math.random() * 0.4), description: `Chilled and refreshing ${name}, made fresh to order.`, image: getPexelsUrl(photoId), reviews: [] });
  });

  const chocolateNames = [
    'Deep Dark 85%', 'Silky Milk 35%', 'Hazelnut Heaven'
  ];
  chocolateNames.forEach((name, index) => {
    products.push({ id: id++, name, category: 'chocolates', price: 150 + (index * 30), rating: 4.7 + (Math.random() * 0.3), description: `Premium handcrafted ${name}.`, image: getPexelsUrl(65882 + index), reviews: [] });
  });

  return products;
};

export const products = generateProducts();
