import "dotenv/config";
import slugify from "slugify";
import { prisma } from "../config/database.config";

export const rawProductsData: Record<string, Array<{
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discountPercent?: number;
  unit: string;
  stockCount: number;
  images: string[];
}>> = {
  "Beverages": [
    {
      name: "Fresh Pressed Orange Juice 1L",
      description: "100% pure cold-pressed orange juice without added sugar or preservatives.",
      originalPrice: 5.99,
      salePrice: 4.49,
      discountPercent: 25,
      unit: "bottle",
      stockCount: 85,
      images: ["https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Sparkling Mineral Water 750ml",
      description: "Naturally carbonated mineral water sourced from mountain springs.",
      originalPrice: 3.49,
      salePrice: 2.99,
      discountPercent: 14,
      unit: "bottle",
      stockCount: 120,
      images: ["https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Cold Brew Organic Coffee 330ml",
      description: "Smooth, low-acid cold brew crafted from 100% Arabica organic beans.",
      originalPrice: 4.99,
      salePrice: 3.99,
      discountPercent: 20,
      unit: "can",
      stockCount: 95,
      images: ["https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Matcha Green Tea Powder 100g",
      description: "Ceremonial grade Japanese matcha packed with antioxidants.",
      originalPrice: 18.99,
      salePrice: 15.99,
      discountPercent: 15,
      unit: "pack",
      stockCount: 40,
      images: ["https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Unsweetened Almond Milk 1L",
      description: "Creamy plant-based almond milk enriched with Vitamin D and Calcium.",
      originalPrice: 3.99,
      salePrice: 3.29,
      discountPercent: 17,
      unit: "carton",
      stockCount: 110,
      images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Coconut Water Hydration Drink 500ml",
      description: "Pure young coconut water packed with natural electrolytes.",
      originalPrice: 3.89,
      salePrice: 2.99,
      discountPercent: 23,
      unit: "bottle",
      stockCount: 75,
      images: ["https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Craft Ginger Ale 4x330ml",
      description: "Spicy and refreshing artisan ginger ale made with real ginger root extract.",
      originalPrice: 6.99,
      salePrice: 5.49,
      discountPercent: 21,
      unit: "pack",
      stockCount: 60,
      images: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Apple Cider Vinegar Drink",
      description: "Invigorating detox drink infused with raw honey and organic apple cider vinegar.",
      originalPrice: 4.49,
      salePrice: 3.79,
      discountPercent: 15,
      unit: "bottle",
      stockCount: 50,
      images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Raspberry Lemonade 1L",
      description: "Tangy sweet raspberry lemonade made with real lemons and fresh berries.",
      originalPrice: 4.29,
      salePrice: 3.49,
      discountPercent: 18,
      unit: "bottle",
      stockCount: 80,
      images: ["https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Probiotic Kombucha Berry Bliss",
      description: "Raw fermented tea rich in live probiotics and digestive enzymes.",
      originalPrice: 4.99,
      salePrice: 4.19,
      discountPercent: 16,
      unit: "bottle",
      stockCount: 65,
      images: ["https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Mango Passionfruit Smoothie 500ml",
      description: "Tropical fruit blend with Alphonso mangoes and tangy passionfruit.",
      originalPrice: 4.99,
      salePrice: 3.99,
      discountPercent: 20,
      unit: "bottle",
      stockCount: 70,
      images: ["https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Whole Bean Dark Roast Coffee 500g",
      description: "Rich, bold roasted beans with notes of dark cocoa and toasted hazelnut.",
      originalPrice: 14.99,
      salePrice: 12.49,
      discountPercent: 16,
      unit: "bag",
      stockCount: 55,
      images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Oat Milk Barista Edition 1L",
      description: "Ultra-frothy oat milk formulated specifically for latte art and coffee drinks.",
      originalPrice: 4.49,
      salePrice: 3.89,
      discountPercent: 13,
      unit: "carton",
      stockCount: 90,
      images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Wild Cranberry Juice 100% 750ml",
      description: "Tart and authentic wild cranberry juice with zero added artificial flavors.",
      originalPrice: 6.49,
      salePrice: 5.29,
      discountPercent: 18,
      unit: "bottle",
      stockCount: 45,
      images: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Herbal Chamomile Tea 20 Bags",
      description: "Soothing caffeine-free chamomile tea leaves harvested for relaxation.",
      originalPrice: 3.99,
      salePrice: 2.99,
      discountPercent: 25,
      unit: "box",
      stockCount: 130,
      images: ["https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop&q=80"]
    }
  ],
  "Snacks": [
    {
      name: "Sea Salt Kettle Cooked Potato Chips",
      description: "Crispy thick-cut kettle chips seasoned with hand-harvested sea salt.",
      originalPrice: 3.99,
      salePrice: 2.99,
      discountPercent: 25,
      unit: "bag",
      stockCount: 140,
      images: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Dry Roasted Almonds 250g",
      description: "Premium California almonds dry roasted to perfection with light sea salt.",
      originalPrice: 7.99,
      salePrice: 6.49,
      discountPercent: 18,
      unit: "pack",
      stockCount: 95,
      images: ["https://images.unsplash.com/photo-1508061252966-17325f4c22ed?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "70% Dark Chocolate Sea Salt Bar 100g",
      description: "Single-origin dark chocolate bar elevated with sea salt crystals.",
      originalPrice: 4.49,
      salePrice: 3.49,
      discountPercent: 22,
      unit: "bar",
      stockCount: 110,
      images: ["https://images.unsplash.com/photo-1582176647444-ac30d306b3e7?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Air-Popped Butter Popcorn",
      description: "Light and fluffy air-popped corn tossed in organic clarified butter.",
      originalPrice: 3.49,
      salePrice: 2.79,
      discountPercent: 20,
      unit: "bag",
      stockCount: 80,
      images: ["https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Honey Roasted Cashews 200g",
      description: "Whole jumbo cashews coated in sweet wildflower honey glaze.",
      originalPrice: 8.49,
      salePrice: 6.99,
      discountPercent: 17,
      unit: "pack",
      stockCount: 75,
      images: ["https://images.unsplash.com/photo-1536591375315-1989938b8152?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Crispy Seaweed Snacks 6-Pack",
      description: "Toasted roasted Nori seaweed sheets lightly brushed with sesame oil.",
      originalPrice: 5.99,
      salePrice: 4.49,
      discountPercent: 25,
      unit: "pack",
      stockCount: 130,
      images: ["https://images.unsplash.com/photo-1606851282873-e86b2b622c7a?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Dried Alphonso Mango Slices 150g",
      description: "Naturally sweet dried mango slices without added sugars or sulfur.",
      originalPrice: 5.49,
      salePrice: 4.29,
      discountPercent: 21,
      unit: "pack",
      stockCount: 85,
      images: ["https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Aged Cheddar Cheese Crackers",
      description: "Crunchy baked crackers made with real 12-month sharp cheddar cheese.",
      originalPrice: 3.79,
      salePrice: 2.99,
      discountPercent: 21,
      unit: "box",
      stockCount: 105,
      images: ["https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Dark Chocolate Covered Almonds",
      description: "Crunchy roasted almonds smothered in Belgian dark chocolate.",
      originalPrice: 7.49,
      salePrice: 5.99,
      discountPercent: 20,
      unit: "pack",
      stockCount: 90,
      images: ["https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Granola Energy Bars 5-Pack",
      description: "Wholesome oat and nut bars sweetened naturally with dates and maple syrup.",
      originalPrice: 6.49,
      salePrice: 5.19,
      discountPercent: 20,
      unit: "box",
      stockCount: 70,
      images: ["https://images.unsplash.com/photo-1622484210800-a78b548b2611?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Spicy Lime Tortilla Chips 200g",
      description: "Authentic stone-ground corn tortilla chips seasoned with zesty chili lime.",
      originalPrice: 3.99,
      salePrice: 3.19,
      discountPercent: 20,
      unit: "bag",
      stockCount: 115,
      images: ["https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Pistachios Roasted & Salted 200g",
      description: "In-shell California pistachios roasted with natural sea salt.",
      originalPrice: 9.99,
      salePrice: 7.99,
      discountPercent: 20,
      unit: "bag",
      stockCount: 65,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Gourmet Fruit Gummy Bears 150g",
      description: "Soft chewy gummy bears crafted with real fruit juices and organic cane sugar.",
      originalPrice: 3.29,
      salePrice: 2.49,
      discountPercent: 24,
      unit: "bag",
      stockCount: 150,
      images: ["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Raw Trail Mix Berry & Nut",
      description: "Nutritious mix of raw walnuts, almonds, pumpkin seeds, and dried cranberries.",
      originalPrice: 7.29,
      salePrice: 5.79,
      discountPercent: 20,
      unit: "pack",
      stockCount: 80,
      images: ["https://images.unsplash.com/photo-1614961908530-22d7a46d6a80?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Oatmeal Chocolate Chip Cookies",
      description: "Soft-baked homemade style oatmeal cookies loaded with dark chocolate chips.",
      originalPrice: 4.99,
      salePrice: 3.89,
      discountPercent: 22,
      unit: "box",
      stockCount: 100,
      images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80"]
    }
  ],
  "Bakery": [
    {
      name: "Artisan Sourdough Boule 500g",
      description: "Naturally leavened sourdough bread baked daily with a golden crispy crust.",
      originalPrice: 5.99,
      salePrice: 4.49,
      discountPercent: 25,
      unit: "loaf",
      stockCount: 40,
      images: ["https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "French Butter Croissants 4-Pack",
      description: "Flaky, buttery multi-layered croissants handmade with French butter.",
      originalPrice: 6.99,
      salePrice: 5.49,
      discountPercent: 21,
      unit: "box",
      stockCount: 50,
      images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Whole Wheat Sandwich Bread",
      description: "Nutritious 100% whole grain wheat bread packed with fiber and seeds.",
      originalPrice: 4.49,
      salePrice: 3.49,
      discountPercent: 22,
      unit: "loaf",
      stockCount: 85,
      images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Cinnamon Swirl Rolls 2-Pack",
      description: "Warm soft bakery cinnamon rolls generously topped with cream cheese frosting.",
      originalPrice: 4.99,
      salePrice: 3.99,
      discountPercent: 20,
      unit: "pack",
      stockCount: 35,
      images: ["https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Fresh Blueberry Muffins 4-Pack",
      description: "Moist bakery muffins bursting with fresh wild blueberries.",
      originalPrice: 5.49,
      salePrice: 4.29,
      discountPercent: 21,
      unit: "box",
      stockCount: 45,
      images: ["https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Sesame Everything Bagels 6-Pack",
      description: "Boiled and baked New York style bagels coated in everything seasoning.",
      originalPrice: 5.29,
      salePrice: 4.19,
      discountPercent: 20,
      unit: "bag",
      stockCount: 60,
      images: ["https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Traditional Garlic Herb Baguette",
      description: "Crusty French baguette stuffed with garlic butter and parsley.",
      originalPrice: 3.99,
      salePrice: 2.99,
      discountPercent: 25,
      unit: "pc",
      stockCount: 55,
      images: ["https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Golden Brioche Hamburger Buns 4s",
      description: "Rich and buttery brioche buns glazed for high-end burgers.",
      originalPrice: 4.79,
      salePrice: 3.79,
      discountPercent: 20,
      unit: "pack",
      stockCount: 70,
      images: ["https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Almond Paste Filled Croissant",
      description: "Decadent croissant filled with almond cream and topped with toasted almond flakes.",
      originalPrice: 3.89,
      salePrice: 2.99,
      discountPercent: 23,
      unit: "pc",
      stockCount: 40,
      images: ["https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Soft Pita Flatbread 5-Pack",
      description: "Authentic Mediterranean pocket pita bread ideal for wraps and hummus.",
      originalPrice: 3.49,
      salePrice: 2.69,
      discountPercent: 22,
      unit: "pack",
      stockCount: 90,
      images: ["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Decadent Red Velvet Cupcakes 2s",
      description: "Rich cocoa red velvet cupcakes topped with whipped cream cheese swirl.",
      originalPrice: 5.99,
      salePrice: 4.69,
      discountPercent: 21,
      unit: "box",
      stockCount: 30,
      images: ["https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Gluten-Free Seeded Loaf",
      description: "Hearty gluten-free bread crafted with flaxseeds, sunflower seeds, and chia.",
      originalPrice: 6.99,
      salePrice: 5.49,
      discountPercent: 21,
      unit: "loaf",
      stockCount: 40,
      images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Chocolatier Pain au Chocolat 2s",
      description: "Crispy puff pastry rolls filled with dark Belgian chocolate bars.",
      originalPrice: 4.49,
      salePrice: 3.49,
      discountPercent: 22,
      unit: "pack",
      stockCount: 50,
      images: ["https://images.unsplash.com/photo-1623334044303-241021148842?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Fresh Strawberry Tartlet",
      description: "Pastry shell filled with vanilla pastry cream and topped with fresh strawberries.",
      originalPrice: 4.99,
      salePrice: 3.99,
      discountPercent: 20,
      unit: "pc",
      stockCount: 25,
      images: ["https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Garlic Butter Naan Bread 3s",
      description: "Traditional tandoor-baked Indian flatbread brushed with garlic coriander oil.",
      originalPrice: 3.99,
      salePrice: 2.99,
      discountPercent: 25,
      unit: "pack",
      stockCount: 80,
      images: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80"]
    }
  ],
  "Baby Care": [
    {
      name: "Organic Banana Apple Puree 120g",
      description: "Smooth 100% organic fruit puree with no artificial additives or preservatives.",
      originalPrice: 2.29,
      salePrice: 1.79,
      discountPercent: 21,
      unit: "pouch",
      stockCount: 150,
      images: ["https://images.unsplash.com/photo-1595188812268-e4b9bc9750b3?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Gentle Unscented Baby Wipes 80s",
      description: "Hypoallergenic 99% pure water wipes safe for newborn delicate skin.",
      originalPrice: 4.49,
      salePrice: 3.49,
      discountPercent: 22,
      unit: "pack",
      stockCount: 200,
      images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Ultra-Absorbent Baby Diapers Size 3",
      description: "Breathable leakage-protection diapers suitable for babies 4-9kg (44 Count).",
      originalPrice: 16.99,
      salePrice: 13.99,
      discountPercent: 17,
      unit: "pack",
      stockCount: 90,
      images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Calming Chamomile Baby Wash 500ml",
      description: "Tear-free head-to-toe baby wash enriched with natural chamomile extract.",
      originalPrice: 7.99,
      salePrice: 6.29,
      discountPercent: 21,
      unit: "bottle",
      stockCount: 75,
      images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Iron-Fortified Baby Oatmeal Cereal",
      description: "Single-grain organic oatmeal cereal designed for infant first solid foods.",
      originalPrice: 4.99,
      salePrice: 3.89,
      discountPercent: 22,
      unit: "can",
      stockCount: 80,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Teething Biscuits 12s",
      description: "Easily dissolvable organic rice teething wafers gently soothing sore gums.",
      originalPrice: 3.99,
      salePrice: 2.99,
      discountPercent: 25,
      unit: "box",
      stockCount: 110,
      images: ["https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Zinc Oxide Diaper Rash Cream 100g",
      description: "Fast-acting protective barrier skin cream treating and preventing diaper rash.",
      originalPrice: 6.49,
      salePrice: 5.19,
      discountPercent: 20,
      unit: "tube",
      stockCount: 95,
      images: ["https://images.unsplash.com/photo-1608248597260-2fe4d5b24479?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Nourishing Coconut Baby Oil 200ml",
      description: "Pure cold-pressed virgin coconut oil ideal for baby massage and dry skin.",
      originalPrice: 6.99,
      salePrice: 5.49,
      discountPercent: 21,
      unit: "bottle",
      stockCount: 65,
      images: ["https://images.unsplash.com/photo-1608248597260-2fe4d5b24479?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Anti-Colic Baby Bottle 260ml",
      description: "BPA-free ergonomic feeding bottle with advanced anti-colic nipple design.",
      originalPrice: 9.99,
      salePrice: 7.99,
      discountPercent: 20,
      unit: "pc",
      stockCount: 70,
      images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Sweet Potato & Carrot Puree",
      description: "Smooth veggie blend providing natural Beta-Carotene for growing infants.",
      originalPrice: 2.39,
      salePrice: 1.89,
      discountPercent: 20,
      unit: "pouch",
      stockCount: 140,
      images: ["https://images.unsplash.com/photo-1595188812268-e4b9bc9750b3?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Soft Cotton Safety Swabs 200s",
      description: "100% pure cotton swabs with safety ear bulb protection.",
      originalPrice: 3.49,
      salePrice: 2.69,
      discountPercent: 22,
      unit: "box",
      stockCount: 160,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Infant Formula Stage 1 800g",
      description: "Complete nutrition formula inspired by breast milk with DHA and Omega-3.",
      originalPrice: 28.99,
      salePrice: 24.49,
      discountPercent: 15,
      unit: "can",
      stockCount: 50,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Silicone Baby Teether Ring",
      description: "Food-grade BPA-free textured teether ring designed for tiny hands.",
      originalPrice: 4.99,
      salePrice: 3.79,
      discountPercent: 24,
      unit: "pc",
      stockCount: 85,
      images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Baby Laundry Detergent Gentle 1.5L",
      description: "Plant-based laundry liquid formulation tough on stains yet gentle on skin.",
      originalPrice: 11.99,
      salePrice: 9.49,
      discountPercent: 20,
      unit: "bottle",
      stockCount: 55,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Baby Snack Puffs Spinach",
      description: "Melt-in-mouth organic grain puffs enriched with vitamins and minerals.",
      originalPrice: 3.49,
      salePrice: 2.79,
      discountPercent: 20,
      unit: "can",
      stockCount: 100,
      images: ["https://images.unsplash.com/photo-1595188812268-e4b9bc9750b3?w=800&auto=format&fit=crop&q=80"]
    }
  ],
  "Frozen Foods": [
    {
      name: "Organic Frozen Mixed Berries 500g",
      description: "Grade-A flash frozen strawberries, blueberries, blackberries, and raspberries.",
      originalPrice: 6.99,
      salePrice: 5.49,
      discountPercent: 21,
      unit: "bag",
      stockCount: 110,
      images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Wood-Fired Margherita Frozen Pizza",
      description: "Authentic Italian stone-baked pizza topped with mozzarella and basil sauce.",
      originalPrice: 7.99,
      salePrice: 5.99,
      discountPercent: 25,
      unit: "box",
      stockCount: 85,
      images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Crispy Vegetable Spring Rolls 10s",
      description: "Crispy golden rolls filled with shredded cabbage, carrots, and mushrooms.",
      originalPrice: 5.49,
      salePrice: 4.29,
      discountPercent: 21,
      unit: "box",
      stockCount: 90,
      images: ["https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "French Cut Frozen Sweet Peas 500g",
      description: "Sweet garden peas frozen at peak ripeness to lock in crisp sweetness.",
      originalPrice: 3.49,
      salePrice: 2.69,
      discountPercent: 22,
      unit: "bag",
      stockCount: 130,
      images: ["https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Vanilla Bean Creamy Ice Cream Pint",
      description: "Ultra-rich ice cream churned with real Madagascar vanilla bean pods.",
      originalPrice: 5.99,
      salePrice: 4.49,
      discountPercent: 25,
      unit: "tub",
      stockCount: 95,
      images: ["https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Crispy Oven Baked French Fries 1kg",
      description: "Golden russet potato fries seasoned and pre-crisped for easy oven baking.",
      originalPrice: 4.99,
      salePrice: 3.79,
      discountPercent: 24,
      unit: "bag",
      stockCount: 120,
      images: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Wild Caught Alaska Salmon Fillets 400g",
      description: "Skin-on vacuum sealed wild salmon portions packed with Omega-3 fats.",
      originalPrice: 14.99,
      salePrice: 11.99,
      discountPercent: 20,
      unit: "pack",
      stockCount: 60,
      images: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Pork & Chive Frozen Dumplings 500g",
      description: "Authentic handmade Asian potstickers filled with juicy seasoned pork.",
      originalPrice: 8.99,
      salePrice: 6.99,
      discountPercent: 22,
      unit: "bag",
      stockCount: 75,
      images: ["https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Breaded Whitefish Fish Sticks 400g",
      description: "Crispy golden breadcrumb coated wild cod fish sticks.",
      originalPrice: 6.49,
      salePrice: 4.99,
      discountPercent: 23,
      unit: "box",
      stockCount: 85,
      images: ["https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Crispy Whole Grain Chicken Tenders",
      description: "100% white meat chicken tenderloins in a seasoned crispy coating.",
      originalPrice: 9.99,
      salePrice: 7.99,
      discountPercent: 20,
      unit: "bag",
      stockCount: 70,
      images: ["https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Frozen Chopped Spinach 450g",
      description: "Freshly harvested organic spinach chopped and flash frozen.",
      originalPrice: 3.29,
      salePrice: 2.49,
      discountPercent: 24,
      unit: "bag",
      stockCount: 140,
      images: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Homestyle Frozen Waffles 8s",
      description: "Golden fluffy toaster waffles perfect for quick maple syrup breakfasts.",
      originalPrice: 4.29,
      salePrice: 3.39,
      discountPercent: 21,
      unit: "box",
      stockCount: 100,
      images: ["https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Unsweetened Acai Puree Smoothie Packets",
      description: "Pure organic Brazilian acai pulp packs for superfood bowls.",
      originalPrice: 8.49,
      salePrice: 6.99,
      discountPercent: 17,
      unit: "box",
      stockCount: 50,
      images: ["https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Frozen Mango Chunks 500g",
      description: "Sweet ripe mango dice ideal for tropical smoothies and desserts.",
      originalPrice: 5.49,
      salePrice: 4.29,
      discountPercent: 21,
      unit: "bag",
      stockCount: 105,
      images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Four Cheese Frozen Ravioli 400g",
      description: "Italian pasta pillows stuffed with ricotta, parmesan, romano, and mozzarella.",
      originalPrice: 6.99,
      salePrice: 5.49,
      discountPercent: 21,
      unit: "bag",
      stockCount: 80,
      images: ["https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80"]
    }
  ],
  "Fruits & Vegetables": [
    {
      name: "Organic Crisp Cavendish Bananas 1kg",
      description: "Sustainably grown sweet bananas packed with potassium and energy.",
      originalPrice: 2.99,
      salePrice: 2.19,
      discountPercent: 26,
      unit: "bunch",
      stockCount: 200,
      images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Red Gala Crisp Apples 1kg",
      description: "Crispy sweet Gala apples picked fresh from local orchards.",
      originalPrice: 4.49,
      salePrice: 3.29,
      discountPercent: 26,
      unit: "bag",
      stockCount: 150,
      images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Fresh Sweet Strawberries 250g",
      description: "Juicy ripe red strawberries handpicked for peak sweetness.",
      originalPrice: 4.99,
      salePrice: 3.79,
      discountPercent: 24,
      unit: "pack",
      stockCount: 120,
      images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Ripe Hass Avocados 4-Pack",
      description: "Creamy ready-to-eat Hass avocados high in healthy monounsaturated fats.",
      originalPrice: 5.99,
      salePrice: 4.49,
      discountPercent: 25,
      unit: "pack",
      stockCount: 130,
      images: ["https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Baby Spinach Leaves 250g",
      description: "Pre-washed tender organic baby spinach leaves for salads and cooking.",
      originalPrice: 3.99,
      salePrice: 2.99,
      discountPercent: 25,
      unit: "tub",
      stockCount: 140,
      images: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Fresh Farm Broccoli Head",
      description: "Dense green broccoli crown rich in Vitamin C, K, and dietary fiber.",
      originalPrice: 2.89,
      salePrice: 2.19,
      discountPercent: 24,
      unit: "head",
      stockCount: 110,
      images: ["https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Vine Ripened Cherry Tomatoes 300g",
      description: "Sweet burst cherry tomatoes grown on the vine.",
      originalPrice: 3.79,
      salePrice: 2.89,
      discountPercent: 23,
      unit: "pack",
      stockCount: 125,
      images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Cultivated Blueberries 125g",
      description: "Plump superfood blueberries packed with anti-aging antioxidants.",
      originalPrice: 4.49,
      salePrice: 3.49,
      discountPercent: 22,
      unit: "pack",
      stockCount: 100,
      images: ["https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Juicy Yellow Lemons 500g",
      description: "Bright fragrant zesty lemons perfect for salad dressings and marinades.",
      originalPrice: 2.99,
      salePrice: 2.29,
      discountPercent: 23,
      unit: "bag",
      stockCount: 160,
      images: ["https://images.unsplash.com/photo-1534531141161-e41d133a4b50?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Seedless English Cucumbers 2s",
      description: "Crisp thin-skinned seedless cucumbers great for snacking and salads.",
      originalPrice: 2.69,
      salePrice: 1.99,
      discountPercent: 26,
      unit: "pack",
      stockCount: 140,
      images: ["https://images.unsplash.com/photo-1447175008436-08417090ea77?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Farm Fresh Orange Carrots 1kg",
      description: "Sweet crunchy orange carrots loaded with Vitamin A.",
      originalPrice: 2.49,
      salePrice: 1.79,
      discountPercent: 28,
      unit: "bag",
      stockCount: 180,
      images: ["https://images.unsplash.com/photo-1598170845058-12f9a6a5da58?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Spanish Red Onions 1kg",
      description: "Mild sweet red onions essential for fresh salsas, burgers, and stews.",
      originalPrice: 2.79,
      salePrice: 1.99,
      discountPercent: 28,
      unit: "bag",
      stockCount: 170,
      images: ["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Aromatic Garlic Bulbs 3-Pack",
      description: "Firm flavorful garlic bulbs adding depth to your favorite dishes.",
      originalPrice: 1.99,
      salePrice: 1.49,
      discountPercent: 25,
      unit: "pack",
      stockCount: 220,
      images: ["https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Sweet Honeycrisp Apples 1kg",
      description: "Ultra-crisp juicy apples with a perfect balance of sweet and tangy.",
      originalPrice: 5.49,
      salePrice: 4.29,
      discountPercent: 21,
      unit: "bag",
      stockCount: 95,
      images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Fresh Portobello Mushroom Caps 250g",
      description: "Meaty portobello mushrooms suitable for grilling and vegetarian steaks.",
      originalPrice: 4.29,
      salePrice: 3.29,
      discountPercent: 23,
      unit: "pack",
      stockCount: 80,
      images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"]
    }
  ],
  "Meat & Seafood": [
    {
      name: "Boneless Skinless Chicken Breast 500g",
      description: "Lean, tender chicken breast portions raised without antibiotics.",
      originalPrice: 7.99,
      salePrice: 6.29,
      discountPercent: 21,
      unit: "pack",
      stockCount: 95,
      images: ["https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Atlantic Salmon Fillet Portion 350g",
      description: "Fresh sustainably farmed Atlantic salmon fillet high in Omega-3.",
      originalPrice: 12.99,
      salePrice: 9.99,
      discountPercent: 23,
      unit: "pack",
      stockCount: 70,
      images: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Grass-Fed Ground Beef 85/15 450g",
      description: "100% grass-fed ground beef perfect for juicy burgers and meatballs.",
      originalPrice: 8.99,
      salePrice: 6.99,
      discountPercent: 22,
      unit: "pack",
      stockCount: 110,
      images: ["https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Jumbo Raw Tiger Prawns 400g",
      description: "Peeled and deveined tail-on tiger prawns ready for grilling or sauteing.",
      originalPrice: 14.49,
      salePrice: 11.49,
      discountPercent: 20,
      unit: "bag",
      stockCount: 65,
      images: ["https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Prime Aged Ribeye Steak 300g",
      description: "Marbled USDA Choice ribeye cut seasoned for steakhouse grilling.",
      originalPrice: 16.99,
      salePrice: 13.99,
      discountPercent: 17,
      unit: "pc",
      stockCount: 50,
      images: ["https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Juicy Chicken Thighs Bone-In 600g",
      description: "Flavorful skin-on chicken thighs ideal for roasting and curries.",
      originalPrice: 6.49,
      salePrice: 4.99,
      discountPercent: 23,
      unit: "pack",
      stockCount: 100,
      images: ["https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Cold Smoked Atlantic Salmon 100g",
      description: "Traditional beechwood smoked thin sliced salmon for bagels.",
      originalPrice: 7.49,
      salePrice: 5.99,
      discountPercent: 20,
      unit: "pack",
      stockCount: 80,
      images: ["https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Center-Cut Pork Loin Chops 450g",
      description: "Tender bone-in pork loin chops perfect for skillet searing.",
      originalPrice: 7.29,
      salePrice: 5.79,
      discountPercent: 20,
      unit: "pack",
      stockCount: 85,
      images: ["https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Fresh Cod Fillet Portion 300g",
      description: "Flaky wild-caught Pacific cod fillet perfect for fish and chips.",
      originalPrice: 9.49,
      salePrice: 7.49,
      discountPercent: 21,
      unit: "pack",
      stockCount: 60,
      images: ["https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Mild Italian Pork Sausage 400g",
      description: "Traditional seasoned pork sausage links with fennel and garlic.",
      originalPrice: 6.99,
      salePrice: 5.49,
      discountPercent: 21,
      unit: "pack",
      stockCount: 90,
      images: ["https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Sliced Roasted Turkey Breast 200g",
      description: "Lean deli roasted turkey breast slices free of nitrates.",
      originalPrice: 5.49,
      salePrice: 4.29,
      discountPercent: 21,
      unit: "pack",
      stockCount: 105,
      images: ["https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Whole Roast Chicken Grade A 1.4kg",
      description: "Fresh farm-raised whole chicken ready for Sunday roasting.",
      originalPrice: 11.99,
      salePrice: 8.99,
      discountPercent: 25,
      unit: "pc",
      stockCount: 45,
      images: ["https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Fresh Blue Mussels in Shell 500g",
      description: "Ocean fresh live blue mussels harvested from clean coastal waters.",
      originalPrice: 8.49,
      salePrice: 6.79,
      discountPercent: 20,
      unit: "bag",
      stockCount: 40,
      images: ["https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Thick Cut Smoked Bacon 300g",
      description: "Hickory wood smoked pork belly bacon strips.",
      originalPrice: 6.99,
      salePrice: 5.49,
      discountPercent: 21,
      unit: "pack",
      stockCount: 120,
      images: ["https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Lamb Loin Chops 400g",
      description: "Grass-fed tender lamb loin chops seasoned with rosemary.",
      originalPrice: 15.99,
      salePrice: 12.99,
      discountPercent: 18,
      unit: "pack",
      stockCount: 50,
      images: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"]
    }
  ],
  "Pantry Staples": [
    {
      name: "Extra Virgin Olive Oil Cold Pressed 1L",
      description: "First cold pressed Mediterranean olive oil with rich fruity flavor.",
      originalPrice: 14.99,
      salePrice: 11.99,
      discountPercent: 20,
      unit: "bottle",
      stockCount: 130,
      images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Aromatic Jasmine Rice 5kg",
      description: "Long grain Thai jasmine rice known for its delicate floral aroma.",
      originalPrice: 16.99,
      salePrice: 13.49,
      discountPercent: 20,
      unit: "bag",
      stockCount: 90,
      images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic White Quinoa 500g",
      description: "High-protein gluten-free ancient grain complete with 9 essential amino acids.",
      originalPrice: 5.99,
      salePrice: 4.49,
      discountPercent: 25,
      unit: "pack",
      stockCount: 115,
      images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Bronze Cut Penne Rigate 500g",
      description: "Traditional Italian durum wheat semolina pasta cut through bronze dies.",
      originalPrice: 2.99,
      salePrice: 2.19,
      discountPercent: 26,
      unit: "pack",
      stockCount: 200,
      images: ["https://images.unsplash.com/photo-1621996346565-e3d5d6281288?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Pure Wildflower Honey 500g",
      description: "Unpasteurized 100% pure raw wildflower honey sourced from local apiaries.",
      originalPrice: 8.99,
      salePrice: 6.99,
      discountPercent: 22,
      unit: "jar",
      stockCount: 85,
      images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Creamy Peanut Butter Smooth 500g",
      description: "All-natural roasted peanut butter made with 99% peanuts and sea salt.",
      originalPrice: 4.99,
      salePrice: 3.89,
      discountPercent: 22,
      unit: "jar",
      stockCount: 140,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Virgin Coconut Oil 500ml",
      description: "Unrefined unbleached cold-pressed virgin coconut oil for cooking and skin.",
      originalPrice: 7.99,
      salePrice: 6.19,
      discountPercent: 22,
      unit: "jar",
      stockCount: 95,
      images: ["https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Tomato Paste 200g",
      description: "Concentrated Italian sun-ripened tomatoes without added salt.",
      originalPrice: 1.99,
      salePrice: 1.49,
      discountPercent: 25,
      unit: "can",
      stockCount: 210,
      images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Naturally Fermented Soy Sauce 250ml",
      description: "Traditionally brewed Japanese tamari soy sauce with non-GMO soybeans.",
      originalPrice: 3.99,
      salePrice: 3.19,
      discountPercent: 20,
      unit: "bottle",
      stockCount: 120,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Whole Rolled Oats 1kg",
      description: "Heart-healthy whole grain old fashioned rolled oats for morning porridge.",
      originalPrice: 3.99,
      salePrice: 2.99,
      discountPercent: 25,
      unit: "bag",
      stockCount: 160,
      images: ["https://images.unsplash.com/photo-1517093728432-a0440f8d45af?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Canned Chickpeas 400g",
      description: "Tender organic garbanzo beans packed in water for homemade hummus.",
      originalPrice: 1.89,
      salePrice: 1.39,
      discountPercent: 26,
      unit: "can",
      stockCount: 220,
      images: ["https://images.unsplash.com/photo-1585703900462-604b9c1d0172?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Coarse Himalayan Pink Salt 500g",
      description: "Pure unrefined mineral-rich pink rock salt harvested from ancient sea beds.",
      originalPrice: 3.49,
      salePrice: 2.69,
      discountPercent: 22,
      unit: "pouch",
      stockCount: 175,
      images: ["https://images.unsplash.com/photo-1518110168401-f28404f0cf4b?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Whole Black Peppercorns Grinder 100g",
      description: "Aromatic Tellicherry black peppercorns in built-in ceramic grinder.",
      originalPrice: 4.49,
      salePrice: 3.49,
      discountPercent: 22,
      unit: "bottle",
      stockCount: 130,
      images: ["https://images.unsplash.com/photo-1509358271058-acd05cc93224?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Apple Cider Vinegar 500ml",
      description: "Raw unfiltered apple cider vinegar containing the beneficial Mother culture.",
      originalPrice: 4.99,
      salePrice: 3.89,
      discountPercent: 22,
      unit: "bottle",
      stockCount: 105,
      images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Baking Powder Aluminum-Free 250g",
      description: "Double-acting aluminum-free baking powder for light fluffy baked goods.",
      originalPrice: 2.49,
      salePrice: 1.89,
      discountPercent: 24,
      unit: "can",
      stockCount: 190,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"]
    }
  ],
  "Personal Care": [
    {
      name: "Hydrating Coconut & Shea Body Wash 500ml",
      description: "Sulfate-free creamy shower gel infused with shea butter and coconut extract.",
      originalPrice: 7.99,
      salePrice: 5.99,
      discountPercent: 25,
      unit: "bottle",
      stockCount: 110,
      images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Argan Oil Repairing Shampoo 400ml",
      description: "Restorative Moroccan argan oil shampoo for shiny hydrated hair.",
      originalPrice: 8.99,
      salePrice: 6.99,
      discountPercent: 22,
      unit: "bottle",
      stockCount: 95,
      images: ["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Activated Charcoal Whitening Toothpaste",
      description: "Natural fluoride-free whitening toothpaste with peppermint essential oil.",
      originalPrice: 4.99,
      salePrice: 3.89,
      discountPercent: 22,
      unit: "tube",
      stockCount: 150,
      images: ["https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Hyaluronic Acid Moisturizing Face Cream",
      description: "Lightweight 24-hour hydration facial gel-cream suitable for all skin types.",
      originalPrice: 14.99,
      salePrice: 11.49,
      discountPercent: 23,
      unit: "jar",
      stockCount: 75,
      images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic French Lavender Hand Soap 300ml",
      description: "Gentle moisturizing liquid hand soap with soothing French lavender oils.",
      originalPrice: 4.49,
      salePrice: 3.49,
      discountPercent: 22,
      unit: "bottle",
      stockCount: 130,
      images: ["https://images.unsplash.com/photo-1608248597260-2fe4d5b24479?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Mineral Sunscreen Lotion SPF 50 150ml",
      description: "Non-greasy reef-safe zinc mineral sunscreen with broad spectrum protection.",
      originalPrice: 12.99,
      salePrice: 9.99,
      discountPercent: 23,
      unit: "tube",
      stockCount: 80,
      images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Pure Lavender Essential Oil 15ml",
      description: "100% therapeutic grade pure lavender essential oil for aromatherapy.",
      originalPrice: 9.99,
      salePrice: 7.99,
      discountPercent: 20,
      unit: "bottle",
      stockCount: 85,
      images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Argan & Macadamia Hair Mask 250ml",
      description: "Deep conditioning hair mask treatment repairing damaged color-treated hair.",
      originalPrice: 11.99,
      salePrice: 8.99,
      discountPercent: 25,
      unit: "tub",
      stockCount: 65,
      images: ["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Natural Aluminum-Free Deodorant Stick",
      description: "Long-lasting odor protection with tea tree and eucalyptus essential oils.",
      originalPrice: 6.99,
      salePrice: 5.49,
      discountPercent: 21,
      unit: "stick",
      stockCount: 120,
      images: ["https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Biodegradable Bamboo Toothbrush 4-Pack",
      description: "Eco-friendly natural bamboo toothbrushes with soft BPA-free bristles.",
      originalPrice: 5.99,
      salePrice: 4.49,
      discountPercent: 25,
      unit: "box",
      stockCount: 160,
      images: ["https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Hydrating Aloe Vera Sheet Masks 5-Pack",
      description: "Cooling soothing facial sheet masks soaked in natural aloe extract.",
      originalPrice: 7.49,
      salePrice: 5.89,
      discountPercent: 21,
      unit: "box",
      stockCount: 100,
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Organic Lip Balm Trio (Mint, Berry, Vanilla)",
      description: "Nourishing beeswax and shea butter lip balms in 3 delicious natural flavors.",
      originalPrice: 5.99,
      salePrice: 4.49,
      discountPercent: 25,
      unit: "pack",
      stockCount: 140,
      images: ["https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Vitamin C Brightening Facial Serum 30ml",
      description: "Potent 15% Vitamin C serum fading dark spots and boosting collagen.",
      originalPrice: 18.99,
      salePrice: 14.99,
      discountPercent: 21,
      unit: "bottle",
      stockCount: 70,
      images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Deep Cleansing Micellar Water 400ml",
      description: "Gentle facial cleanser and makeup remover with zero rinsing required.",
      originalPrice: 8.49,
      salePrice: 6.79,
      discountPercent: 20,
      unit: "bottle",
      stockCount: 90,
      images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"]
    },
    {
      name: "Exfoliating Sea Salt Body Scrub 300g",
      description: "Invigorating body polish with Dead Sea salt crystals and jojoba oil.",
      originalPrice: 9.99,
      salePrice: 7.99,
      discountPercent: 20,
      unit: "jar",
      stockCount: 65,
      images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"]
    }
  ]
};

export const seedProducts = async () => {
  try {
    await prisma.$connect();
    console.log("🌱 [Product Seed] Connected to Database...");

    // Find admin user to assign as owner of seeded products
    let adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (!adminUser) {
      console.log("⚠️ No admin found. Creating default admin for products...");
      adminUser = await prisma.user.create({
        data: {
          name: "CartMind Admin",
          email: "admin@cartmind.com",
          password: "Admin@123456_hashed",
          role: "admin",
        },
      });
    }

    // Get categories from DB
    const dbCategories = await prisma.category.findMany();
    if (dbCategories.length === 0) {
      console.log("⚠️ No categories found. Please seed categories first!");
      return;
    }

    const categoryMap = new Map(dbCategories.map(c => [c.name, c.id]));
    let totalCreatedCount = 0;

    for (const [categoryName, products] of Object.entries(rawProductsData)) {
      const categoryId = categoryMap.get(categoryName);
      if (!categoryId) {
        console.warn(`Category "${categoryName}" not found in DB. Skipping...`);
        continue;
      }

      for (const item of products) {
        const baseSlug = slugify(item.name, { lower: true, strict: true });
        
        // Ensure slug uniqueness
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.product.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        await prisma.product.create({
          data: {
            userId: adminUser.id,
            categoryId,
            name: item.name,
            slug,
            description: item.description,
            images: item.images,
            originalPrice: item.originalPrice,
            salePrice: item.salePrice,
            discountPercent: item.discountPercent || Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100),
            discountLabel: item.discountPercent ? `${item.discountPercent}% OFF` : undefined,
            unit: item.unit,
            stockCount: item.stockCount,
            ratingAverage: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
            reviewCount: Math.floor(12 + Math.random() * 88),
            isActive: true,
          },
        });
        totalCreatedCount++;
      }
    }

    console.log(`✅ [Product Seed] Successfully injected ${totalCreatedCount} products into database across ${dbCategories.length} categories!`);
    return totalCreatedCount;
  } catch (error) {
    console.error("❌ [Product Seed Error]:", error);
  }
};

// If run directly via command line
if (require.main === module) {
  seedProducts().then(() => process.exit(0));
}
