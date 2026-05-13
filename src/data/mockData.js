export const categories = [
  { id: 'sweets', name: 'Mithai (Sweets)', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Laddu_Sweet.JPG/800px-Laddu_Sweet.JPG' },
  { id: 'chocolates', name: 'Premium Chocolates', image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80' },
  { id: 'cakes', name: 'Designer Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80' },
  { id: 'namkin', name: 'Savory Namkin', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Shop_selling_Bikaneri_bhujia_in_Jaipur.jpg/800px-Shop_selling_Bikaneri_bhujia_in_Jaipur.jpg' },
  { id: 'wafers', name: 'Crispy Wafers', image: 'https://images.unsplash.com/photo-1621236378699-8597fac6bb1d?w=800&q=80' },
  { id: 'biscuits', name: 'Luxury Biscuits', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Bourbon_and_Custard_Cream.jpeg/800px-Bourbon_and_Custard_Cream.jpeg' },
  { id: 'drinks', name: 'Cold Drinks', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Salt_lassi.jpg/800px-Salt_lassi.jpg' },
];

const generateProducts = () => {
  const products = [];
  let id = 1;

  const exactImages = {
    // Sweets (Wikimedia)
    'Gulab Jamun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Bowl_of_Gulab_Jamuns.jpg/800px-Bowl_of_Gulab_Jamuns.jpg',
    'Rasgulla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Rasgulla.jpg/800px-Rasgulla.jpg',
    'Kaju Katli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Kaju_katli_sweet.jpg/800px-Kaju_katli_sweet.jpg',
    'Motichoor Laddu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Laddu_Sweet.JPG/800px-Laddu_Sweet.JPG',
    'Besan Laddu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Saffron_Ladoo.jpg/800px-Saffron_Ladoo.jpg',
    'Mysore Pak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Mysore_pak.jpg/800px-Mysore_pak.jpg',
    'Soan Papdi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Soan_sohan_papdi_India_Festive_Sweets.jpg/800px-Soan_sohan_papdi_India_Festive_Sweets.jpg',
    'Jalebi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Jalebi_%28Zulbia%29.jpg/800px-Jalebi_%28Zulbia%29.jpg',
    'Imarti': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Imarti_Sweet.jpg/800px-Imarti_Sweet.jpg',
    'Barfi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Almond_Khoa_based_burfi_Mumbai_India_%28cropped%29.jpg/800px-Almond_Khoa_based_burfi_Mumbai_India_%28cropped%29.jpg',
    'Peda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Mathura_Peda.jpg/800px-Mathura_Peda.jpg',
    'Gajar Ka Halwa': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Cuisine_%28268%29_44.jpg',
    'Moong Dal Halwa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Moong_dal_halwa.JPG/800px-Moong_dal_halwa.JPG',
    'Rasmalai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rasmalai%2C_Indian_Dessert.jpg/800px-Rasmalai%2C_Indian_Dessert.jpg',
    'Khas Khas Halwa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Poppy_seed_halwa.jpg/800px-Poppy_seed_halwa.jpg',
    'Chum Chum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Cham_cham_sweet.jpg/800px-Cham_cham_sweet.jpg',
    'Sandesh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Bengali_Sandesh_-_1.jpg/800px-Bengali_Sandesh_-_1.jpg',
    'Rabri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Rabri_Sweet.jpg/800px-Rabri_Sweet.jpg',
    'Balushahi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Balushahi.jpg/800px-Balushahi.jpg',
    'Ghevar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Ghevar_Sweet.jpg/800px-Ghevar_Sweet.jpg',
    'Gujiya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Gujiya1.jpg/800px-Gujiya1.jpg',
    'Shrikhand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Shrikhand.JPG/800px-Shrikhand.JPG',
    'Phirni': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Phirni.jpg/800px-Phirni.jpg',
    'Malpua': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/MalPua.JPG/800px-MalPua.JPG',
    'Kala Jamun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Kala_jamun.jpg/800px-Kala_jamun.jpg',
    'Boondi Laddu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Boondi_Ladoo.jpg/800px-Boondi_Ladoo.jpg',
    'Dharwad Peda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Dharwad_pedha.jpg/800px-Dharwad_pedha.jpg',
    'Agra Pethas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Petha.jpg/800px-Petha.jpg',
    'Mathura Peda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Kesar_Peda.jpg/800px-Kesar_Peda.jpg',
    'Adhirasam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Adhirasam.jpeg/800px-Adhirasam.jpeg',
    'Ariselu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ariselu_or_Adhirasam_or_Kajjaya_or_Athirasa.jpg/800px-Ariselu_or_Adhirasam_or_Kajjaya_or_Athirasa.jpg',
    
    // Namkin (Wikimedia)
    'Aloo Bhujia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Aloo_Bhujia.jpg/800px-Aloo_Bhujia.jpg',
    'Bikaneri Bhujia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Shop_selling_Bikaneri_bhujia_in_Jaipur.jpg/800px-Shop_selling_Bikaneri_bhujia_in_Jaipur.jpg',
    'Moong Dal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Moong_dal_snack.jpg/800px-Moong_dal_snack.jpg',
    'Chana Dal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Chana_dal_fry.jpg/800px-Chana_dal_fry.jpg',
    'Mini Samosa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Mini_Samosa.jpg/800px-Mini_Samosa.jpg',
    'Murukku': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Murukku_South_Indian_Snack.jpg/800px-Murukku_South_Indian_Snack.jpg',
    'Chakli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chakli_Snack.jpg/800px-Chakli_Snack.jpg',
    'Bhel Puri Mix': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bhel_Puri_Chaat.jpg/800px-Bhel_Puri_Chaat.jpg',

    // Fallbacks (Unsplash unique pools)
    '__cakesPool': [
      'photo-1599785209707-a456fc1337bb', 'photo-1586788680434-30d324631ff6', 'photo-1606890737304-57a1ca8a5b62',
      'photo-1578985545062-69928b1d9587', 'photo-1535141192574-5d4897c12636', 'photo-1464349153735-7db50ed83c84',
      'photo-1565958011703-44f9829ba187', 'photo-1606313564200-e75d5e30476c', 'photo-1571115177098-24ec42ed204d',
      'photo-1516738901171-8eb4fc13bd20', 'photo-1544850225-9f7045263062', 'photo-1550617931-e17a7b70dce2',
      'photo-1495474472287-4d71bcdd2085', 'photo-1582215256331-7482e4828552', 'photo-1571877227200-a0d98ea607e9',
      'photo-1504113888839-1c8950233dce', 'photo-1519869325930-281384150729', 'photo-1516054120332-5ac5a3597395',
      'photo-1558301211-0d8c8ddee6ec', 'photo-1582196615556-9188402280d8', 'photo-1551024506-0bccd828d307',
      'photo-1533134242443-d4fd215305ad', 'photo-1488477181946-6428a0291777', 'photo-1576618148400-f54b8859df8d',
      'photo-1588195538326-c5b1e9f80a1b', 'photo-1557308535-4421df454839', 'photo-1496116218417-1a781b1c416c',
      'photo-1505976378723-9726bd5da04c', 'photo-1582716401301-b2407dc7563d', 'photo-1506459225024-1428097a7a18',
      'photo-1551024601-bec78aea704b', 'photo-1562233237-10a0c5014dca', 'photo-1627834377411-8da5f4f09de1',
      'photo-1621303837174-89787a7d4729', 'photo-1517433670267-08bbd4be890f', 'photo-1542826438-bd32f43d626f',
      'photo-1508737027454-e6454ef45afd', 'photo-1534433880262-f47958500d47', 'photo-1614707267537-b85aaf00c4b7',
      'photo-1542826438-bd32f43d626f', 'photo-1557928203-346764d081f2', 'photo-1606312619070-d48b4c6c2a52',
      'photo-1551024709-8f23befc6f87', 'photo-1578985545062-69928b1d9587', 'photo-1516738901171-8eb4fc13bd20',
      'photo-1544850225-9f7045263062', 'photo-1550617931-e17a7b70dce2', 'photo-1495474472287-4d71bcdd2085',
      'photo-1582215256331-7482e4828552', 'photo-1571877227200-a0d98ea607e9'
    ],
    '__drinksPool': [
      'photo-1544145945-f904253db0ad', 'photo-1513558161293-cdaf765ed2fd', 'photo-1556679343-c7306c1976bc',
      'photo-1540189549336-e6e99c3679fe', 'photo-1542990253-0d0f5be5f0ed', 'photo-1551024709-8f23befc6f87',
      'photo-1570197788417-0e93327c63ad', 'photo-1497515114629-f71d768fd07c', 'photo-1517048676732-d65bc937f952',
      'photo-1517701604599-bb29b565090c', 'photo-1536939459926-301728717817', 'photo-1510626176961-4b57d4fbadff',
      'photo-1541167760496-1629557bd579', 'photo-1495474472287-4d71bcdd2085', 'photo-1509042239860-f550ce710b93',
      'photo-1511920170033-f8396924c348', 'photo-1514432324607-a09d9b4aefdd', 'photo-1512568400610-62da28bc8a13',
      'photo-1525351484163-7529414344d8', 'photo-1444418776041-9c7e33cc5a9c', 'photo-1525351484163-7529414344d8',
      'photo-1444418776041-9c7e33cc5a9c', 'photo-1544145945-f904253db0ad', 'photo-1513558161293-cdaf765ed2fd',
      'photo-1556679343-c7306c1976bc', 'photo-1540189549336-e6e99c3679fe', 'photo-1542990253-0d0f5be5f0ed',
      'photo-1551024709-8f23befc6f87', 'photo-1570197788417-0e93327c63ad', 'photo-1497515114629-f71d768fd07c'
    ],
    '__namkinPool': [
      'photo-1601050690597-df0568f70950', 'photo-1613113073258-7228a012bb36', 'photo-1613113253258-7228a012bb36',
      'photo-1601050690597-df0568f70950', 'photo-1613113073258-7228a012bb36', 'photo-1613113253258-7228a012bb36',
      'photo-1601050690597-df0568f70950', 'photo-1613113073258-7228a012bb36', 'photo-1613113253258-7228a012bb36',
      'photo-1601050690597-df0568f70950', 'photo-1613113073258-7228a012bb36', 'photo-1613113253258-7228a012bb36',
      'photo-1601050690597-df0568f70950', 'photo-1613113073258-7228a012bb36', 'photo-1613113253258-7228a012bb36'
    ],
    '__sweetsFallback': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Laddu_Sweet.JPG/800px-Laddu_Sweet.JPG'
  };

  const getUnsplashUrl = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

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
    let img = exactImages[name] || exactImages['__sweetsFallback'];
    // For varieties not in exactImages, use unique Unsplash IDs or different Wikimedia thumbnails if possible
    if (!exactImages[name]) {
        // Unique fallback logic for sweets to ensure no duplicates
        img = `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Laddu_Sweet.JPG/800px-Laddu_Sweet.JPG?v=${index}`;
    }
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
    const photoId = exactImages['__cakesPool'][index % exactImages['__cakesPool'].length];
    products.push({ id: id++, name, category: 'cakes', price: 500 + (index * 20), rating: 4.6 + (Math.random() * 0.4), description: `Premium ${name} cake, freshly baked.`, image: getUnsplashUrl(photoId), reviews: [] });
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
    let img = exactImages[name] || `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Bombaymix.jpg/800px-Bombaymix.jpg?v=${index}`;
    products.push({ id: id++, name, category: 'namkin', price: 50 + (index * 5), rating: 4.4 + (Math.random() * 0.6), description: `Crispy and delicious ${name}.`, image: img, reviews: [] });
  });

  const wafersNames = [
    'Classic Salted Wafers', 'Masala Wafers', 'Cheese Wafers', 'Hot & Spicy Wafers', 'Cream & Onion Wafers',
    'Thin Crust Wafers', 'Potato Crisps', 'Peri Peri Wafers', 'Tomato Wafers', 'Garlic Wafers',
    'Barbeque Wafers', 'Honey Butter Wafers', 'Sour Cream Wafers', 'Chili Lemon Wafers', 'Pickle Style Wafers',
    'Sea Salt Wafers', 'Truffle Wafers', 'Wasabi Wafers', 'Himalayan Salt Wafers', 'Vinegar Wafers',
    'Cheddar Jack Wafers', 'Salsa Wafers', 'Sweet Chili Wafers', 'Black Pepper Wafers', 'Paprika Wafers',
    'Zesty Lime Wafers', 'Buffalo Wings Wafers', 'Jalapeno Wafers', 'Ranch Wafers', 'Double Salted Wafers'
  ];
  wafersNames.forEach((name, index) => {
    products.push({ id: id++, name, category: 'wafers', price: 40 + (index * 2), rating: 4.3 + (Math.random() * 0.7), description: `Thin and crispy ${name}, perfectly seasoned.`, image: `https://images.unsplash.com/photo-1566478431375-704288757ff5?w=800&q=80&v=${index}`, reviews: [] });
  });

  const biscuitsNames = [
    'Butter Cookies', 'Cashew Biscuits', 'Pista Biscuits', 'Chocolate Chip Cookies', 'Oatmeal Cookies',
    'Almond Biscotti', 'Shortbread Cookies', 'Digestive Biscuits', 'Milk Biscuits', 'Fruit & Nut Cookies',
    'Coconut Crunch', 'Elaichi Biscuits', 'Ginger Snaps', 'Honey Glazed Cookies', 'Peanut Butter Cookies',
    'Jeera Biscuits', 'Salted Crackers', 'Marie Gold Premium', 'Bourbon Delight', 'Cream Fill Cookies',
    'Dark Fantasy Cookies', 'Red Velvet Cookies', 'Lemon Cream Biscuits', 'Orange Slice Cookies', 'Strawberry Wafers',
    'Premium Assorted Box', 'Handcrafted Cookies', 'Whole Wheat Biscuits', 'Sugar Free Cookies', 'Multigrain Biscuits'
  ];
  biscuitsNames.forEach((name, index) => {
    products.push({ id: id++, name, category: 'biscuits', price: 60 + (index * 5), rating: 4.5 + (Math.random() * 0.5), description: `Freshly baked ${name}, melt-in-your-mouth texture.`, image: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Bourbon_and_Custard_Cream.jpeg/800px-Bourbon_and_Custard_Cream.jpeg?v=${index}`, reviews: [] });
  });

  const drinksNames = [
    'Mango Lassi', 'Sweet Thandai', 'Refreshing Rose Milk', 'Masala Chaas', 'Cold Coffee',
    'Pista Shake', 'Badam Milk', 'Lemon Sharbath', 'Orange Juice', 'Watermelon Twist',
    'Pineapple Punch', 'Blue Lagoon Mocktail', 'Lime & Mint Soda', 'Jeera Soda', 'Kala Khatta',
    'Rose Sharbath', 'Kokum Juice', 'Aam Panna', 'Coconut Water', 'Bel Juice',
    'Strawberry Milkshake', 'Chocolate Shake', 'Vanilla Frappe', 'Iced Tea Lemon', 'Peach Iced Tea',
    'Grape Juice', 'Guava Punch', 'Litchi Delight', 'Apple Juice', 'Mixed Fruit Blast'
  ];
  drinksNames.forEach((name, index) => {
    const photoId = exactImages['__drinksPool'][index % exactImages['__drinksPool'].length];
    products.push({ id: id++, name, category: 'drinks', price: 80 + (index * 5), rating: 4.6 + (Math.random() * 0.4), description: `Chilled and refreshing ${name}, made fresh to order.`, image: getUnsplashUrl(photoId), reviews: [] });
  });

  const chocolateNames = [
    'Deep Dark 85%', 'Silky Milk 35%', 'Hazelnut Heaven', 'Almond Bliss', 'Fruit & Nut Deluxe',
    'Caramel Sea Salt', 'White Raspberry', 'Matcha Green tea', 'Dark Mint', 'Orange Infusion',
    'Espresso Shot', 'Peanut Butter Cup', 'Luxury Gold Box', 'Handcrafted Truffles', 'Praline Selection'
  ];
  chocolateNames.forEach((name, index) => {
    products.push({ id: id++, name, category: 'chocolates', price: 150 + (index * 30), rating: 4.7 + (Math.random() * 0.3), description: `Premium handcrafted ${name}.`, image: `https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80&v=${index}`, reviews: [] });
  });

  return products;
};

export const products = generateProducts();
