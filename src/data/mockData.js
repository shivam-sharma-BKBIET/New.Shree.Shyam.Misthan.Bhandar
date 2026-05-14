export const categories = [
  { id: 'sweets', name: 'Mithai (Sweets)', image: 'https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'chocolates', name: 'Premium Chocolates', image: 'https://images.pexels.com/photos/65882/pexels-photo-65882.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'cakes', name: 'Designer Cakes', image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'namkin', name: 'Savory Namkin', image: 'https://images.pexels.com/photos/8992923/pexels-photo-8992923.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'wafers', name: 'Crispy Wafers', image: 'https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'biscuits', name: 'Luxury Biscuits', image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'drinks', name: 'Cold Drinks', image: 'https://images.pexels.com/photos/29684991/pexels-photo-29684991.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const generateProducts = () => {
  const products = [];
  let id = 1;

  const exactImages = {
    "Gulab Jamun": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Rasgulla": "https://images.pexels.com/photos/16005658/pexels-photo-16005658.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Kaju Katli": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Motichoor Laddu": "https://images.pexels.com/photos/27695746/pexels-photo-27695746.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Besan Laddu": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Mysore Pak": "https://images.pexels.com/photos/26341215/pexels-photo-26341215.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Soan Papdi": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Jalebi": "https://images.pexels.com/photos/29253305/pexels-photo-29253305.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Imarti": "https://images.pexels.com/photos/27695747/pexels-photo-27695747.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Barfi": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Peda": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Gajar Ka Halwa": "https://images.pexels.com/photos/37153764/pexels-photo-37153764.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Moong Dal Halwa": "https://images.pexels.com/photos/30203314/pexels-photo-30203314.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Rasmalai": "https://images.pexels.com/photos/29699512/pexels-photo-29699512.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Khas Khas Halwa": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Chum Chum": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Sandesh": "https://images.pexels.com/photos/26341215/pexels-photo-26341215.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Rabri": "https://images.pexels.com/photos/29684991/pexels-photo-29684991.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Balushahi": "https://images.pexels.com/photos/27695747/pexels-photo-27695747.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Ghevar": "https://images.pexels.com/photos/14775031/pexels-photo-14775031.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Gujiya": "https://images.pexels.com/photos/37106474/pexels-photo-37106474.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Shrikhand": "https://images.pexels.com/photos/29684991/pexels-photo-29684991.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Phirni": "https://images.pexels.com/photos/15820609/pexels-photo-15820609.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Malpua": "https://images.pexels.com/photos/9552567/pexels-photo-9552567.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Lapsi": "https://images.pexels.com/photos/11644812/pexels-photo-11644812.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Kala Jamun": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Boondi Laddu": "https://images.pexels.com/photos/27695746/pexels-photo-27695746.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Dharwad Peda": "https://images.pexels.com/photos/20434731/pexels-photo-20434731.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Agra Pethas": "https://images.pexels.com/photos/11521904/pexels-photo-11521904.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Mathura Peda": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Kaju Roll": "https://images.pexels.com/photos/37106473/pexels-photo-37106473.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Anjeer Barfi": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Dry Fruit Laddu": "https://images.pexels.com/photos/37180553/pexels-photo-37180553.png?auto=compress&cs=tinysrgb&w=800",
    "Coconut Barfi": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Mawa Barfi": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Kesar Peda": "https://images.pexels.com/photos/29066270/pexels-photo-29066270.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Champakali": "https://images.pexels.com/photos/26341215/pexels-photo-26341215.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Lobongo Lotika": "https://images.pexels.com/photos/37106474/pexels-photo-37106474.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Patisapta": "https://images.pexels.com/photos/37106473/pexels-photo-37106473.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Narkel Naru": "https://images.pexels.com/photos/27695747/pexels-photo-27695747.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Adhirasam": "https://images.pexels.com/photos/23948798/pexels-photo-23948798.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Ariselu": "https://images.pexels.com/photos/9552567/pexels-photo-9552567.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Mysore Pak Premium": "https://images.pexels.com/photos/20586597/pexels-photo-20586597.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Doodh Peda": "https://images.pexels.com/photos/28664618/pexels-photo-28664618.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Badam Halwa": "https://images.pexels.com/photos/15820609/pexels-photo-15820609.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Kaju Pista Roll": "https://images.pexels.com/photos/15801053/pexels-photo-15801053.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Chocolate Barfi": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Rose Barfi": "https://images.pexels.com/photos/7247318/pexels-photo-7247318.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Mango Barfi": "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Saffron Laddu": "https://images.pexels.com/photos/27695746/pexels-photo-27695746.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Black Forest": "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Red Velvet": "https://images.pexels.com/photos/12027376/pexels-photo-12027376.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Pineapple Delight": "https://images.pexels.com/photos/20120560/pexels-photo-20120560.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Chocolate Truffle": "https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Vanilla Bean": "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Butterscotch": "https://images.pexels.com/photos/11145155/pexels-photo-11145155.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Fruit Overload": "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Dark Fantasy": "https://images.pexels.com/photos/1414234/pexels-photo-1414234.jpeg?auto=compress&cs=tinysrgb&w=800",
    "White Forest": "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Strawberry Bliss": "https://images.pexels.com/photos/12027376/pexels-photo-12027376.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Mango Tango": "https://images.pexels.com/photos/20120560/pexels-photo-20120560.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Blueberry Glaze": "https://images.pexels.com/photos/2144411/pexels-photo-2144411.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Coffee Mocha": "https://images.pexels.com/photos/29684988/pexels-photo-29684988.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Caramel Crunch": "https://images.pexels.com/photos/11145155/pexels-photo-11145155.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Tiramisu": "https://images.pexels.com/photos/29684988/pexels-photo-29684988.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Hazelnut Praline": "https://images.pexels.com/photos/29684988/pexels-photo-29684988.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Lemon Zest": "https://images.pexels.com/photos/2144411/pexels-photo-2144411.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Pistachio Rose": "https://images.pexels.com/photos/15820609/pexels-photo-15820609.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Rainbow Cake": "https://images.pexels.com/photos/12027376/pexels-photo-12027376.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Omni Chocolate": "https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Belgian Dark": "https://images.pexels.com/photos/1414234/pexels-photo-1414234.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Swiss Milk": "https://images.pexels.com/photos/29684988/pexels-photo-29684988.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Ferrero Rocher Special": "https://images.pexels.com/photos/1414234/pexels-photo-1414234.jpeg?auto=compress&cs=tinysrgb&w=800",
    "KitKat Overload": "https://images.pexels.com/photos/1414234/pexels-photo-1414234.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Oreo Crush": "https://images.pexels.com/photos/1414234/pexels-photo-1414234.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Red Wine Velvet": "https://images.pexels.com/photos/12027376/pexels-photo-12027376.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Almond Crunch": "https://images.pexels.com/photos/15820609/pexels-photo-15820609.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Cherry Blossom": "https://images.pexels.com/photos/12027376/pexels-photo-12027376.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Orange Blossom": "https://images.pexels.com/photos/20120560/pexels-photo-20120560.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Honey Cake": "https://images.pexels.com/photos/11145155/pexels-photo-11145155.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Japanese Cheesecake": "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    "New York Style Cheese": "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Opera Cake": "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Medovik": "https://images.pexels.com/photos/11145155/pexels-photo-11145155.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Pavlova": "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Lamington": "https://images.pexels.com/photos/29684988/pexels-photo-29684988.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Madeira Cake": "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Battenberg": "https://images.pexels.com/photos/29684988/pexels-photo-29684988.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Victoria Sponge": "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Princess Cake": "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Sachertorte": "https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Gâteau Basque": "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Dobos Torte": "https://images.pexels.com/photos/29684988/pexels-photo-29684988.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Esterházy Cake": "https://images.pexels.com/photos/29684988/pexels-photo-29684988.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Schwarzwälder": "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800",
    "St. Honoré": "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Charlotte Royale": "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Blackcurrant Cake": "https://images.pexels.com/photos/2144411/pexels-photo-2144411.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Passion Fruit Cake": "https://images.pexels.com/photos/25585181/pexels-photo-25585181.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Exotic Lychee": "https://images.pexels.com/photos/27689938/pexels-photo-27689938.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Aloo Bhujia": "https://images.pexels.com/photos/29684988/pexels-photo-29684988.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Bikaneri Bhujia": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Khatta Meetha": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Moong Dal": "https://images.pexels.com/photos/30203314/pexels-photo-30203314.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Chana Dal": "https://images.pexels.com/photos/30203314/pexels-photo-30203314.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Masala Peanuts": "https://images.pexels.com/photos/6448483/pexels-photo-6448483.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Cornflakes Mixture": "https://images.pexels.com/photos/37180554/pexels-photo-37180554.png?auto=compress&cs=tinysrgb&w=800",
    "Soya Sticks": "https://images.pexels.com/photos/343873/pexels-photo-343873.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Mini Samosa": "https://images.pexels.com/photos/8992923/pexels-photo-8992923.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Dry Kachori": "https://images.pexels.com/photos/34949285/pexels-photo-34949285.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Murukku": "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Chakli": "https://images.pexels.com/photos/18012040/pexels-photo-18012040.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Sev Puri Mix": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Bhel Puri Mix": "https://images.pexels.com/photos/29699504/pexels-photo-29699504.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Navratan Mix": "https://images.pexels.com/photos/37180553/pexels-photo-37180553.png?auto=compress&cs=tinysrgb&w=800",
    "Panchratan Mix": "https://images.pexels.com/photos/37180553/pexels-photo-37180553.png?auto=compress&cs=tinysrgb&w=800",
    "Potato Wafers": "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Banana Chips": "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Garlic Sev": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Ratlam Sev": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Longo Sev": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Plain Sev": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Papdi Gathiya": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Bhavnagari Gathiya": "https://images.pexels.com/photos/6485578/pexels-photo-6485578.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Methi Gathiya": "https://images.pexels.com/photos/35156984/pexels-photo-35156984.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Moongfali": "https://images.pexels.com/photos/7090155/pexels-photo-7090155.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Cashew Salted": "https://images.pexels.com/photos/37180553/pexels-photo-37180553.png?auto=compress&cs=tinysrgb&w=800",
    "Badam Masala": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Pista Salted": "https://images.pexels.com/photos/20727015/pexels-photo-20727015.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Roasted Makhana": "https://images.pexels.com/photos/20556455/pexels-photo-20556455.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Masala Makhana": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Peri Peri Fox Nuts": "https://images.pexels.com/photos/20556452/pexels-photo-20556452.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Cheesy Jowar Puffs": "https://images.pexels.com/photos/26341212/pexels-photo-26341212.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Quinoa Puffs": "https://images.pexels.com/photos/6895775/pexels-photo-6895775.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Corn Puffs": "https://images.pexels.com/photos/24031437/pexels-photo-24031437.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Jackfruit Chips": "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Tapioca Chips": "https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Sweet Potato Chips": "https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Beetroot Chips": "https://images.pexels.com/photos/6468551/pexels-photo-6468551.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Veggie Crisps": "https://images.pexels.com/photos/11663127/pexels-photo-11663127.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Gujarati Mix": "https://images.pexels.com/photos/37180553/pexels-photo-37180553.png?auto=compress&cs=tinysrgb&w=800",
    "Madras Mixture": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Bombay Mix": "https://images.pexels.com/photos/37180553/pexels-photo-37180553.png?auto=compress&cs=tinysrgb&w=800",
    "Kara Boondi": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Spicy Sev": "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Onion Murukku": "https://images.pexels.com/photos/32986487/pexels-photo-32986487.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Butter Murukku": "https://images.pexels.com/photos/20206800/pexels-photo-20206800.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Ribbon Pakoda": "https://images.pexels.com/photos/3631685/pexels-photo-3631685.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Thattai": "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Chekkalu": "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=800"
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
    let img = exactImages[name] || "https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&w=800";
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
    const img = exactImages[name] || "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800";
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
    const img = exactImages[name] || "https://images.pexels.com/photos/8992923/pexels-photo-8992923.jpeg?auto=compress&cs=tinysrgb&w=800";
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
    products.push({ id: id++, name, category: 'wafers', price: 40 + (index * 2), rating: 4.3 + (Math.random() * 0.7), description: `Thin and crispy ${name}, perfectly seasoned.`, image: `https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=800`, reviews: [] });
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
    products.push({ id: id++, name, category: 'biscuits', price: 60 + (index * 5), rating: 4.5 + (Math.random() * 0.5), description: `Freshly baked ${name}, melt-in-your-mouth texture.`, image: `https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800`, reviews: [] });
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
    products.push({ id: id++, name, category: 'drinks', price: 80 + (index * 5), rating: 4.6 + (Math.random() * 0.4), description: `Chilled and refreshing ${name}, made fresh to order.`, image: `https://images.pexels.com/photos/29684991/pexels-photo-29684991.jpeg?auto=compress&cs=tinysrgb&w=800`, reviews: [] });
  });

  const chocolateNames = [
    'Deep Dark 85%', 'Silky Milk 35%', 'Hazelnut Heaven', 'Almond Bliss', 'Fruit & Nut Deluxe',
    'Caramel Sea Salt', 'White Raspberry', 'Matcha Green tea', 'Dark Mint', 'Orange Infusion',
    'Espresso Shot', 'Peanut Butter Cup', 'Luxury Gold Box', 'Handcrafted Truffles', 'Praline Selection'
  ];
  chocolateNames.forEach((name, index) => {
    products.push({ id: id++, name, category: 'chocolates', price: 150 + (index * 30), rating: 4.7 + (Math.random() * 0.3), description: `Premium handcrafted ${name}.`, image: `https://images.pexels.com/photos/65882/pexels-photo-65882.jpeg?auto=compress&cs=tinysrgb&w=800`, reviews: [] });
  });

  return products;
};

export const products = generateProducts();
