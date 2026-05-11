export const categories = [
  { id: 'sweets', name: 'Mithai (Sweets)', image: 'https://images.unsplash.com/photo-1599598425947-330026e3c150?auto=format&fit=crop&q=80&w=800' },
  { id: 'chocolates', name: 'Premium Chocolates', image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800' },
  { id: 'cakes', name: 'Designer Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800' },
  { id: 'namkin', name: 'Savory Namkin', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800' },
  { id: 'wafers', name: 'Crispy Wafers', image: 'https://images.unsplash.com/photo-1621236378699-8597fac6bb1d?auto=format&fit=crop&q=80&w=800' },
  { id: 'biscuits', name: 'Luxury Biscuits', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800' },
  { id: 'drinks', name: 'Cold Drinks', image: 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80&w=800' },
];

const generateProducts = () => {
  const products = [];
  let id = 1;

  const exactImages = {
    'Gulab Jamun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Bowl_of_Gulab_Jamuns.jpg/960px-Bowl_of_Gulab_Jamuns.jpg',
    'Rasgulla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Rasgulla.jpg/960px-Rasgulla.jpg',
    'Kaju Katli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Kaju_katli_sweet.jpg/960px-Kaju_katli_sweet.jpg',
    'Motichoor Laddu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Laddu_Sweet.JPG/960px-Laddu_Sweet.JPG',
    'Besan Laddu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Laddu_Sweet.JPG/960px-Laddu_Sweet.JPG',
    'Jalebi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Basavanagudi_Kadalekai_Parishe_%282025%29_Bangalore_%2886%29.jpg/960px-Basavanagudi_Kadalekai_Parishe_%282025%29_Bangalore_%2886%29.jpg',
    'Barfi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Almond_Khoa_based_burfi_Mumbai_India_%28cropped%29.jpg/960px-Almond_Khoa_based_burfi_Mumbai_India_%28cropped%29.jpg',
    'Sandesh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Bengali_Sandesh_-_1.jpg/960px-Bengali_Sandesh_-_1.jpg',
    'Gajar Ka Halwa': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Cuisine_%28268%29_44.jpg',
    'Peda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Almond_Khoa_based_burfi_Mumbai_India_%28cropped%29.jpg/960px-Almond_Khoa_based_burfi_Mumbai_India_%28cropped%29.jpg',
    'Aloo Bhujia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Shop_selling_Bikaneri_bhujia_in_Jaipur.jpg/960px-Shop_selling_Bikaneri_bhujia_in_Jaipur.jpg',
    'Bikaneri Bhujia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Shop_selling_Bikaneri_bhujia_in_Jaipur.jpg/960px-Shop_selling_Bikaneri_bhujia_in_Jaipur.jpg',
    'Black Forest': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Black_Forest_gateau.jpg/960px-Black_Forest_gateau.jpg',
    
    // Sweets Fallback
    '__sweetsFallback': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Laddu_Sweet.JPG/960px-Laddu_Sweet.JPG',
    
    // Category Fallbacks
    '__cakesFallback': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pound_cake_2.jpg/960px-Pound_cake_2.jpg',
    '__namkinFallback': 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Bombaymix.jpg',
    '__wafersFallback': 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Bombaymix.jpg',
    '__biscuitsFallback': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Bourbon_and_Custard_Cream.jpeg/960px-Bourbon_and_Custard_Cream.jpeg',
    '__drinksFallback': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Salt_lassi.jpg/960px-Salt_lassi.jpg',
    '__chocolatesFallback': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Truffles_with_nuts_and_chocolate_dusting_in_detail.jpg/960px-Truffles_with_nuts_and_chocolate_dusting_in_detail.jpg'
  };

  const getImage = (name, fallback) => {
    return exactImages[name] || exactImages[fallback];
  };

  // Existing categories from previous turn... (I'll keep them consistent)
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
    const img = getImage(name, '__sweetsFallback');
    products.push({ id: id++, name, category: 'sweets', price: 200 + (index * 10), rating: 4.5 + (Math.random() * 0.5), description: `Delicious handcrafted ${name} made with pure ghee.`, image: img, reviews: [] });
  });

  const cakeNames = [
    'Black Forest', 'Red Velvet', 'Pineapple Delight', 'Chocolate Truffle', 'Vanilla Bean',
    'Butterscotch', 'Fruit Overload', 'Dark Fantasy', 'White Forest', 'Strawberry Bliss',
    'Mango Tango', 'Blueberry Glaze', 'Coffee Mocha', 'Caramel Crunch', 'Tiramisu',
    'Hazelnut Praline', 'Lemon Zest', 'Pistachio Rose', 'Rainbow Cake', 'Omni Chocolate',
    'Belgian Dark', 'Swiss Milk', 'Ferrero Rocher Special', 'KitKat Overload', 'Oreo Crush',
    'Red Wine Velvet', 'Almond Crunch', 'Cherry Blossom', 'Orange Blossom', 'Honey Cake',
    'Japanese Cheesecake', 'New York Style Cheese', 'Opera Cake', 'Medovik', 'Pavlova',
    'Lamington', 'Madeira Cake', 'Battenberg', 'Victoria Sponge', 'Princess Cake',
    'Sachertorte', 'Gâteau Basque', 'Dobos Torte', 'Esterházy Cake', 'Schwarzwälder',
    'St. Honoré', 'Charlotte Royale', 'Blackcurrant Cake', 'Passion Fruit Cake', 'Exotic Lychee'
  ];
  cakeNames.forEach((name, index) => {
    const img = getImage(name, '__cakesFallback');
    products.push({ id: id++, name, category: 'cakes', price: 500 + (index * 20), rating: 4.6 + (Math.random() * 0.4), description: `Premium ${name} cake, freshly baked.`, image: img, reviews: [] });
  });

  const namkinNames = [
    'Aloo Bhujia', 'Bikaneri Bhujia', 'Khatta Meetha', 'Moong Dal', 'Chana Dal',
    'Masala Peanuts', 'Cornflakes Mixture', 'Soya Sticks', 'Mini Samosa', 'Dry Kachori',
    'Murukku', 'Chakli', 'Sev Puri Mix', 'Bhel Puri Mix', 'Navratan Mix',
    'Panchratan Mix', 'Potato Wafers', 'Banana Chips', 'Garlic Sev', 'Ratlam Sev',
    'Longo Sev', 'Plain Sev', 'Papdi Gathiya', 'Bhavnagari Gathiya', 'Methi Gathiya',
    'Moongfali', 'Cashew Salted', 'Badam Masala', 'Pista Salted', 'Roasted Makhana',
    'Masala Makhana', 'Peri Peri Fox Nuts', 'Cheesy Jowar Puffs', 'Quinoa Puffs', 'Corn Puffs',
    'Jackfruit Chips', 'Tapioca Chips', 'Sweet Potato Chips', 'Beetroot Chips', 'Veggie Crisps',
    'Gujarati Mix', 'Madras Mixture', 'Bombay Mix', 'Kara Boondi', 'Spicy Sev',
    'Onion Murukku', 'Butter Murukku', 'Ribbon Pakoda', 'Thattai', 'Chekkalu'
  ];
  namkinNames.forEach((name, index) => {
    const img = getImage(name, '__namkinFallback');
    products.push({ id: id++, name, category: 'namkin', price: 50 + (index * 5), rating: 4.4 + (Math.random() * 0.6), description: `Crispy and delicious ${name}.`, image: img, reviews: [] });
  });

  // NEW: Wafers (30 items)
  const wafersNames = [
    'Classic Salted Wafers', 'Masala Wafers', 'Cheese Wafers', 'Hot & Spicy Wafers', 'Cream & Onion Wafers',
    'Thin Crust Wafers', 'Potato Crisps', 'Peri Peri Wafers', 'Tomato Wafers', 'Garlic Wafers',
    'Barbeque Wafers', 'Honey Butter Wafers', 'Sour Cream Wafers', 'Chili Lemon Wafers', 'Pickle Style Wafers',
    'Sea Salt Wafers', 'Truffle Wafers', 'Wasabi Wafers', 'Himalayan Salt Wafers', 'Vinegar Wafers',
    'Cheddar Jack Wafers', 'Salsa Wafers', 'Sweet Chili Wafers', 'Black Pepper Wafers', 'Paprika Wafers',
    'Zesty Lime Wafers', 'Buffalo Wings Wafers', 'Jalapeno Wafers', 'Ranch Wafers', 'Double Salted Wafers'
  ];
  wafersNames.forEach((name, index) => {
    const img = getImage(name, '__wafersFallback');
    products.push({ id: id++, name, category: 'wafers', price: 40 + (index * 2), rating: 4.3 + (Math.random() * 0.7), description: `Thin and crispy ${name}, perfectly seasoned.`, image: img, reviews: [] });
  });

  // NEW: Biscuits (30 items)
  const biscuitsNames = [
    'Butter Cookies', 'Cashew Biscuits', 'Pista Biscuits', 'Chocolate Chip Cookies', 'Oatmeal Cookies',
    'Almond Biscotti', 'Shortbread Cookies', 'Digestive Biscuits', 'Milk Biscuits', 'Fruit & Nut Cookies',
    'Coconut Crunch', 'Elaichi Biscuits', 'Ginger Snaps', 'Honey Glazed Cookies', 'Peanut Butter Cookies',
    'Jeera Biscuits', 'Salted Crackers', 'Marie Gold Premium', 'Bourbon Delight', 'Cream Fill Cookies',
    'Dark Fantasy Cookies', 'Red Velvet Cookies', 'Lemon Cream Biscuits', 'Orange Slice Cookies', 'Strawberry Wafers',
    'Premium Assorted Box', 'Handcrafted Cookies', 'Whole Wheat Biscuits', 'Sugar Free Cookies', 'Multigrain Biscuits'
  ];
  biscuitsNames.forEach((name, index) => {
    const img = getImage(name, '__biscuitsFallback');
    products.push({ id: id++, name, category: 'biscuits', price: 60 + (index * 5), rating: 4.5 + (Math.random() * 0.5), description: `Freshly baked ${name}, melt-in-your-mouth texture.`, image: img, reviews: [] });
  });

  // NEW: Drinks (30 items)
  const drinksNames = [
    'Mango Lassi', 'Sweet Thandai', 'Refreshing Rose Milk', 'Masala Chaas', 'Cold Coffee',
    'Pista Shake', 'Badam Milk', 'Lemon Sharbath', 'Orange Juice', 'Watermelon Twist',
    'Pineapple Punch', 'Blue Lagoon Mocktail', 'Lime & Mint Soda', 'Jeera Soda', 'Kala Khatta',
    'Rose Sharbath', 'Kokum Juice', 'Aam Panna', 'Coconut Water', 'Bel Juice',
    'Strawberry Milkshake', 'Chocolate Shake', 'Vanilla Frappe', 'Iced Tea Lemon', 'Peach Iced Tea',
    'Grape Juice', 'Guava Punch', 'Litchi Delight', 'Apple Juice', 'Mixed Fruit Blast'
  ];
  drinksNames.forEach((name, index) => {
    const img = getImage(name, '__drinksFallback');
    products.push({ id: id++, name, category: 'drinks', price: 80 + (index * 5), rating: 4.6 + (Math.random() * 0.4), description: `Chilled and refreshing ${name}, made fresh to order.`, image: img, reviews: [] });
  });

  const chocolateNames = [
    'Deep Dark 85%', 'Silky Milk 35%', 'Hazelnut Heaven', 'Almond Bliss', 'Fruit & Nut Deluxe',
    'Caramel Sea Salt', 'White Raspberry', 'Matcha Green tea', 'Dark Mint', 'Orange Infusion',
    'Espresso Shot', 'Peanut Butter Cup', 'Luxury Gold Box', 'Handcrafted Truffles', 'Praline Selection'
  ];
  chocolateNames.forEach((name, index) => {
    const img = getImage(name, '__chocolatesFallback');
    products.push({ id: id++, name, category: 'chocolates', price: 150 + (index * 30), rating: 4.7 + (Math.random() * 0.3), description: `Premium handcrafted ${name}.`, image: img, reviews: [] });
  });

  return products;
};

export const products = generateProducts();
