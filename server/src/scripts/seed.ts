import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Auction from '../models/Auction';

dotenv.config();

const categories = [
    'Electronics', 'Fashion', 'Collectibles', 'Art',
    'Sports', 'Home', 'Automotive', 'Other'
];

const products = [
    // Electronics (10)
    {
        title: 'iPhone 15 Pro Max',
        description: 'Titanium design, A17 Pro chip, customizable Action button, and a more versatile Pro camera system.',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 1199,
        minIncrement: 50,
        durationMinutes: 120
    },
    {
        title: 'Sony Alpha a7 IV',
        description: '33MP full-frame sensor, 4K 60p video, and advanced real-time tracking autofocus.',
        imageUrl: 'https://images.unsplash.com/photo-1616423641454-da9890cc3266?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 2499,
        minIncrement: 100,
        durationMinutes: 180
    },
    {
        title: 'MacBook Pro 16" M3 Max',
        description: 'The most advanced chips ever built for a personal computer. Extraordinary battery life.',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 3499,
        minIncrement: 150,
        durationMinutes: 240
    },
    {
        title: 'ASUS ROG Swift OLED',
        description: '27-inch 1440p monitor with 240Hz refresh rate. The ultimate gaming display.',
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 899,
        minIncrement: 25,
        durationMinutes: 60
    },
    {
        title: 'Bose Ultra Soundbar',
        description: 'Immersive sound with Dolby Atmos. Stunning vocals and deep bass for your home theater.',
        imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 799,
        minIncrement: 30,
        durationMinutes: 90
    },
    {
        title: 'Leica Q3 Camera',
        description: 'Full-frame sensor with 60MP resolution and a legendary fixed 28mm lens.',
        imageUrl: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 5995,
        minIncrement: 200,
        durationMinutes: 300
    },
    {
        title: 'Dyson Zone Headphones',
        description: 'High-fidelity audio with active noise cancellation and air purification.',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 699,
        minIncrement: 25,
        durationMinutes: 60
    },
    {
        title: 'Samsung Fold 5',
        description: 'Unlock a massive screen and master multitasking. The future of smartphones.',
        imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ec696e520b?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 1799,
        minIncrement: 50,
        durationMinutes: 120
    },
    {
        title: 'Huion Kamvas Pro 19',
        description: '4K pen display for professional digital artists and designers.',
        imageUrl: 'https://images.unsplash.com/photo-1542546068979-b6affb46ea8f?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 1099,
        minIncrement: 40,
        durationMinutes: 90
    },
    {
        title: 'Alienware m18 Laptop',
        description: 'Desktop-level performance in a gaming laptop. 18-inch display, RTX 4090.',
        imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop',
        category: 'Electronics',
        startingBid: 3299,
        minIncrement: 100,
        durationMinutes: 180
    },

    // Fashion (10)
    {
        title: 'Gucci Horsebit Bag',
        description: 'Classic leather shoulder bag with gold-tone hardware. Timeless Italian elegance.',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 2800,
        minIncrement: 100,
        durationMinutes: 1440
    },
    {
        title: 'Rolex Day-Date 40',
        description: '18ct Everose gold with an olive green dial. The ultimate prestige watch.',
        imageUrl: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 38000,
        minIncrement: 500,
        durationMinutes: 2880
    },
    {
        title: 'Prada Re-Nylon Jacket',
        description: 'Sustainable luxury. Minimalist black jacket with the signature triangle logo.',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 1250,
        minIncrement: 50,
        durationMinutes: 720
    },
    {
        title: 'Louis Vuitton Belt',
        description: 'Monogram Eclipse canvas. A staple for any luxury wardrobe.',
        imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb8ec973d?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 550,
        minIncrement: 20,
        durationMinutes: 30
    },
    {
        title: 'Saint Laurent Boots',
        description: 'Black suede Wyatt Chelsea boots. Sleek silhouette with a stacked heel.',
        imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 995,
        minIncrement: 40,
        durationMinutes: 120
    },
    {
        title: 'Dior Saddle Bag',
        description: 'Blue Dior Oblique jacquard. A unique and iconic fashion piece.',
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 3200,
        minIncrement: 150,
        durationMinutes: 1440
    },
    {
        title: 'Balenciaga Sneakers',
        description: 'Speed 2.0 recycled knit trainers. Comfortable and futuristic.',
        imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 850,
        minIncrement: 30,
        durationMinutes: 90
    },
    {
        title: 'Fendi Baguette',
        description: 'Yellow leather bag with FF motif. A bold statement of luxury.',
        imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 2400,
        minIncrement: 100,
        durationMinutes: 360
    },
    {
        title: 'Burberry Scarve',
        description: 'Classic check cashmere scarf. Soft, warm, and instantly recognizable.',
        imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 450,
        minIncrement: 20,
        durationMinutes: 60
    },
    {
        title: 'Givenchy Hoodie',
        description: 'Distressed effect logo hoodie. Urban luxury at its finest.',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion',
        startingBid: 890,
        minIncrement: 40,
        durationMinutes: 120
    },

    // Collectibles (10)
    {
        title: 'Signed Michael Jordan Jersey',
        description: 'A rare authenticated Chicago Bulls jersey signed by the GOAT himself.',
        imageUrl: 'https://images.unsplash.com/photo-1546515866-ce7820750ae5?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 12000,
        minIncrement: 500,
        durationMinutes: 1440
    },
    {
        title: '1964 Beatles Autograph',
        description: 'Fully signed page from their first US tour. Includes certificate of authenticity.',
        imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 8500,
        minIncrement: 250,
        durationMinutes: 2880
    },
    {
        title: 'Vintage Star Wars Figure',
        description: 'MINT condition Boba Fett in original Kenner packaging from 1979.',
        imageUrl: 'https://images.unsplash.com/photo-1594465919760-441fe5ad08bc?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 4500,
        minIncrement: 100,
        durationMinutes: 720
    },
    {
        title: 'Rare Pokémon TCG Pack',
        description: 'Unopened 1st Edition Base Set booster pack. Potential for a Charizard!',
        imageUrl: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 2200,
        minIncrement: 100,
        durationMinutes: 300
    },
    {
        title: 'Signed Astronaut Photo',
        description: 'Buzz Aldrin standing on the Moon. Personal signature with dedication.',
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 1400,
        minIncrement: 50,
        durationMinutes: 120
    },
    {
        title: 'Antique Samurai Sword',
        description: 'Authentic 18th-century Katana. Refined craftsmanship with traditional mountings.',
        imageUrl: 'https://images.unsplash.com/photo-1589131808232-f61aa965aa30?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 9500,
        minIncrement: 300,
        durationMinutes: 2880
    },
    {
        title: 'Original Marvel Sketch',
        description: 'Hand-drawn ink sketch of Spider-Man by an original creative artist.',
        imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 3200,
        minIncrement: 100,
        durationMinutes: 180
    },
    {
        title: 'Game-Worn NFL Helmet',
        description: 'Worn by a Super Bowl winning quarterback during the championship game.',
        imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 6500,
        minIncrement: 200,
        durationMinutes: 720
    },
    {
        title: 'Vintage Typewriter',
        description: 'Hermes 3000 in baby blue. The preferred tool of legendary novelists.',
        imageUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 1200,
        minIncrement: 50,
        durationMinutes: 60
    },
    {
        title: 'NASA Flight Suit',
        description: 'Authentic training suit used during the Space Shuttle era.',
        imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop',
        category: 'Collectibles',
        startingBid: 4800,
        minIncrement: 200,
        durationMinutes: 1440
    },

    // Art (10)
    {
        title: 'Surrealist Oil Painting',
        description: 'Original canvas exploring the intersection of dreams and reality.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 4500,
        minIncrement: 200,
        durationMinutes: 2880
    },
    {
        title: 'Bronze Modern Sculpture',
        description: 'Fluid geometric form in solid bronze. Signed by the sculptor.',
        imageUrl: 'https://images.unsplash.com/photo-1544535830-9df3f56fff6a?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 3200,
        minIncrement: 150,
        durationMinutes: 1440
    },
    {
        title: 'Large Abstract Triptych',
        description: 'Three massive panels with bold colors and heavy texture.',
        imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 7800,
        minIncrement: 300,
        durationMinutes: 2880
    },
    {
        title: 'Landscape Photography',
        description: 'Limited edition archival print of the Northern Lights.',
        imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 850,
        minIncrement: 40,
        durationMinutes: 120
    },
    {
        title: 'Minimalist Charcoal Sketch',
        description: 'Original study of shadow and light on textured paper.',
        imageUrl: 'https://images.unsplash.com/photo-1515405299443-f71bb7680795?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 1100,
        minIncrement: 50,
        durationMinutes: 60
    },
    {
        title: 'Hand-Crafted Ceramic Vase',
        description: 'Raku-fired vessel with unique crackle glaze and copper accents.',
        imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 650,
        minIncrement: 30,
        durationMinutes: 90
    },
    {
        title: 'Digital Glitch Art Print',
        description: 'High-resolution physical print of a generative digital masterwork.',
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 400,
        minIncrement: 20,
        durationMinutes: 45
    },
    {
        title: 'Pop Art Screenprint',
        description: 'Vibrant multi-layer print celebrating modern icon culture.',
        imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 1500,
        minIncrement: 75,
        durationMinutes: 180
    },
    {
        title: 'Architectural Model',
        description: 'Beautifully detailed model of a futuristic sustainable skyscraper.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 2200,
        minIncrement: 100,
        durationMinutes: 300
    },
    {
        title: 'Murano Glass Chandelier',
        description: 'Authentic Venetian glasswork with delicate floral details.',
        imageUrl: 'https://images.unsplash.com/photo-1623151834241-1e9d1502476b?q=80&w=800&auto=format&fit=crop',
        category: 'Art',
        startingBid: 14500,
        minIncrement: 500,
        durationMinutes: 1440
    },

    // Sports (10)
    {
        title: 'Signed Messi Boots',
        description: 'Authentic Adidas f50 boots signed by the World Cup champion.',
        imageUrl: 'https://images.unsplash.com/photo-1552668693-d07c8e5bc651?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 3500,
        minIncrement: 150,
        durationMinutes: 1440
    },
    {
        title: 'Tom Brady Signed Ball',
        description: 'Official NFL game ball signed by the 7-time Super Bowl winner.',
        imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 2800,
        minIncrement: 100,
        durationMinutes: 720
    },
    {
        title: 'Signed Federer Racket',
        description: 'The Wilson Pro Staff used in a legendary tournament final.',
        imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4fa13?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 4200,
        minIncrement: 200,
        durationMinutes: 1440
    },
    {
        title: 'NBA Finals Used Net',
        description: 'Framed piece of the net from an iconic championship decider.',
        imageUrl: 'https://images.unsplash.com/photo-1546515866-ce7820750ae5?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 1200,
        minIncrement: 50,
        durationMinutes: 120
    },
    {
        title: 'Signed Lewis Hamilton Suit',
        description: 'Autographed racing suit from his record-breaking season.',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 9500,
        minIncrement: 400,
        durationMinutes: 2880
    },
    {
        title: 'Pelé Signed Brazil Shirt',
        description: 'Classic yellow #10 shirt signed by the king of football.',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 5800,
        minIncrement: 250,
        durationMinutes: 1440
    },
    {
        title: 'Olympic Gold Medal Ribbon',
        description: 'A rare collectible from a historic Summer Olympics ceremony.',
        imageUrl: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 900,
        minIncrement: 40,
        durationMinutes: 60
    },
    {
        title: 'Signed Derek Jeter Bat',
        description: 'Game-model bat signed by the legendary Yankees captain.',
        imageUrl: 'https://images.unsplash.com/photo-1508344928928-71657adc7211?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 2400,
        minIncrement: 100,
        durationMinutes: 180
    },
    {
        title: 'Tiger Woods Victory Photo',
        description: 'Iconic Masters victory celebration, hand-signed by Tiger.',
        imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 1800,
        minIncrement: 75,
        durationMinutes: 120
    },
    {
        title: 'Kyrie Irving Signed Sneakers',
        description: 'Custom game-ready signature shoes with personal dedication.',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
        category: 'Sports',
        startingBid: 1100,
        minIncrement: 50,
        durationMinutes: 60
    },

    // Home (10)
    {
        title: 'Authentic Eames Lounge',
        description: 'The iconic mid-century modern design in walnut and black leather.',
        imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 5200,
        minIncrement: 200,
        durationMinutes: 1440
    },
    {
        title: 'Dyson Airwrap Multi-styler',
        description: 'The viral hair styling tool with all original attachments.',
        imageUrl: 'https://images.unsplash.com/photo-1620331311520-246422ff83f9?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 450,
        minIncrement: 20,
        durationMinutes: 30
    },
    {
        title: 'Le Creuset Dutch Oven',
        description: '7.25 qt Signature Round in limited edition Deep Teal.',
        imageUrl: 'https://images.unsplash.com/photo-1584269601115-3975058097b7?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 320,
        minIncrement: 15,
        durationMinutes: 60
    },
    {
        title: 'KitchenAid Pro 600',
        description: '6-Quart Bowl-Lift Stand Mixer in Empire Red. Professional grade.',
        imageUrl: 'https://images.unsplash.com/photo-1594910413528-9430d8bb89d5?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 499,
        minIncrement: 20,
        durationMinutes: 45
    },
    {
        title: 'Herman Miller Embody',
        description: 'The flagship ergonomic office chair designed for ultimate comfort.',
        imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 1800,
        minIncrement: 80,
        durationMinutes: 120
    },
    {
        title: 'Nest Learning Thermostat',
        description: 'Third-generation smart climate control for your connected home.',
        imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 199,
        minIncrement: 10,
        durationMinutes: 30
    },
    {
        title: 'Philips Hue Starter Kit',
        description: 'Transform your room with smart lighting. Hub and 4 premium bulbs.',
        imageUrl: 'https://images.unsplash.com/photo-1550985543-f47f38aee65e?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 180,
        minIncrement: 10,
        durationMinutes: 45
    },
    {
        title: 'AeroGarden Farm 24XL',
        description: 'Large scale indoor hydroponic system for fresh herbs and vegetables.',
        imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 750,
        minIncrement: 30,
        durationMinutes: 90
    },
    {
        title: 'Smeg Retro Refrigerator',
        description: 'The iconic 50s-style FAB28 in Pastel Blue. Pure vintage charm.',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 2200,
        minIncrement: 100,
        durationMinutes: 180
    },
    {
        title: 'Viking 7 Series Range',
        description: 'The apex of residential cooking technology. 36-inch dual fuel.',
        imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
        category: 'Home',
        startingBid: 11000,
        minIncrement: 500,
        durationMinutes: 1440
    },

    // Automotive (10)
    {
        title: 'Custom BBS LM Wheels',
        description: 'Forged 2-piece set in Diamond Silver. Perfect fitment for elite sedans.',
        imageUrl: 'https://images.unsplash.com/photo-1550345332-dfa91638ae76?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 4800,
        minIncrement: 200,
        durationMinutes: 720
    },
    {
        title: 'Akrapovič Slip-On Exhaust',
        description: 'High-grade titanium construction for unrivaled sound and performance.',
        imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 3200,
        minIncrement: 100,
        durationMinutes: 180
    },
    {
        title: 'Recaro Podium Seat',
        description: 'CFRP carbon fiber shell, FIA approved, street legal luxury racing seat.',
        imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 2900,
        minIncrement: 100,
        durationMinutes: 90
    },
    {
        title: 'Ohlins TTX Suspension',
        description: 'Professional motorsport-grade coilovers for ultimate handling.',
        imageUrl: 'https://images.unsplash.com/photo-1486006396193-47106858e75a?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 5500,
        minIncrement: 250,
        durationMinutes: 120
    },
    {
        title: 'Brembo Carbon Ceramics',
        description: 'The pinnacle of braking technology. Complete kit with calipers.',
        imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 12000,
        minIncrement: 500,
        durationMinutes: 360
    },
    {
        title: 'HRE Performance S101',
        description: 'Custom 3-piece wheels. Iconic design found on the world\'s fastest cars.',
        imageUrl: 'https://images.unsplash.com/photo-1588653906294-f2ca6bdfd110?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 8500,
        minIncrement: 300,
        durationMinutes: 1440
    },
    {
        title: 'Vorsteiner Carbon Lip',
        description: 'Aero-optimized front lip in high-gloss autoclave carbon fiber.',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 1950,
        minIncrement: 50,
        durationMinutes: 60
    },
    {
        title: 'Motul 300V Race Detail Kit',
        description: 'Full suite of fluids and professional detailing products from Motul.',
        imageUrl: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 450,
        minIncrement: 20,
        durationMinutes: 30
    },
    {
        title: 'Rare Porsche Poster',
        description: 'Original 1970s dealership promotional art, preserved and framed.',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 850,
        minIncrement: 40,
        durationMinutes: 120
    },
    {
        title: 'MoTeC M150 ECU',
        description: 'The definitive engine management system for professional racing.',
        imageUrl: 'https://images.unsplash.com/photo-1593121925328-369cc8459c08?q=80&w=800&auto=format&fit=crop',
        category: 'Automotive',
        startingBid: 4200,
        minIncrement: 200,
        durationMinutes: 180
    },

    // Other (10)
    {
        title: 'Zero-G Flight Voucher',
        description: 'Experience weightlessness in a specially modified Boeing 727.',
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 6500,
        minIncrement: 300,
        durationMinutes: 1440
    },
    {
        title: 'Maldives Overwater stays',
        description: 'Luxury 5-night voucher for an iconic overwater villa resort.',
        imageUrl: 'https://images.unsplash.com/photo-1506929113614-bb48ac494f52?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 8500,
        minIncrement: 500,
        durationMinutes: 2880
    },
    {
        title: 'Private Jet One-Way Leg',
        description: 'Coast-to-coast US flight in a Gulfstream G650 for up to 8 guests.',
        imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a75c3?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 15000,
        minIncrement: 1000,
        durationMinutes: 1440
    },
    {
        title: 'Custom Wine Cellar Tour',
        description: 'VIP access and tasting at three historic Bordeaux estates.',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 3200,
        minIncrement: 150,
        durationMinutes: 720
    },
    {
        title: 'Signed Limited Edition Book',
        description: 'Autographed copy of a modern literary masterpiece, leather-bound.',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 750,
        minIncrement: 40,
        durationMinutes: 120
    },
    {
        title: 'Gourmet Chef Experience',
        description: 'Private 8-course dinner prepared in your home by a triple-starred chef.',
        imageUrl: 'https://images.unsplash.com/photo-1550966841-3ee7adac1668?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 4000,
        minIncrement: 200,
        durationMinutes: 180
    },
    {
        title: 'Bonsai Masterpiece',
        description: 'A 65-year-old Juniper Bonsai in a traditional ceramic pot.',
        imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 2200,
        minIncrement: 100,
        durationMinutes: 90
    },
    {
        title: 'Antique Globe 1910',
        description: 'Replogle standing floor globe with genuine brass meridian.',
        imageUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 1400,
        minIncrement: 50,
        durationMinutes: 120
    },
    {
        title: 'Pro DJ Gear Set',
        description: 'Two Pioneer CDJ-3000s and a DJM-V10 mixer. Industry standard.',
        imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 8500,
        minIncrement: 400,
        durationMinutes: 180
    },
    {
        title: 'Hand-Made Custom Surfboard',
        description: 'Shaped by a Hawaiian legend. High-performance design with resin tint.',
        imageUrl: 'https://images.unsplash.com/photo-1502680399482-027478c9509d?q=80&w=800&auto=format&fit=crop',
        category: 'Other',
        startingBid: 1800,
        minIncrement: 75,
        durationMinutes: 60
    }
];

async function seed() {
    try {
        console.log('--- Starting Final Seed Process ---');

        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bidblitz');
        console.log('✓ MongoDB Connected');

        const adminEmail = 'admin@bidblitz.com';
        let admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = await User.create({
                username: 'SystemAdmin',
                email: adminEmail,
                password: hashedPassword,
                balance: 1000000
            });
            console.log('✓ Admin user created');
        }

        await Auction.deleteMany({});
        console.log('✓ Old auctions cleared');

        const now = new Date();
        const auctionPromises = products.map(p => {
            const endTime = new Date(now.getTime() + p.durationMinutes * 60000);
            return Auction.create({
                ...p,
                currentBid: p.startingBid,
                startTime: now,
                endTime,
                status: 'active',
                createdBy: admin?._id
            });
        });

        await Promise.all(auctionPromises);
        console.log(`✓ successfully seeded ${products.length} products with new image links`);

        console.log('--- Seed Process Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
