const { useState, useEffect, useRef, useCallback } = React;

// ─── DATA ─────────────────────────────────────────────────────────────────────
// 50 real named species (hand-curated)
const REAL_FISH = [
  { id:"goliath_grouper", name:"Goliath Grouper", rarity:"legendary", color:"#8B6914", belly:"#D4A853", fin:"#5C4A0A", gill:"#7A1010", minW:200,maxW:800,minL:48,maxL:96, difficulty:5, value:8, body:"chunky" },
  { id:"red_snapper",     name:"Red Snapper",     rarity:"common",    color:"#C0392B", belly:"#FF8080", fin:"#8B1A1A", gill:"#6B0000", minW:2,  maxW:35, minL:12,maxL:28, difficulty:2, value:2, body:"oval" },
  { id:"tarpon",          name:"Tarpon",          rarity:"rare",      color:"#B0BEC5", belly:"#ECEFF1", fin:"#6D7E88", gill:"#4A5560", minW:60, maxW:280,minL:36,maxL:72, difficulty:4, value:3, body:"torpedo" },
  { id:"mahi_mahi",       name:"Mahi-Mahi",       rarity:"uncommon",  color:"#27AE60", belly:"#F1C40F", fin:"#1A7A45", gill:"#0D5C33", minW:5,  maxW:65, minL:18,maxL:42, difficulty:3, value:3, body:"torpedo" },
  { id:"sailfish",        name:"Sailfish",        rarity:"epic",      color:"#1565C0", belly:"#4A90D9", fin:"#0D3B7A", gill:"#061D3A", minW:80, maxW:220,minL:60,maxL:96, difficulty:5, value:5, body:"billfish" },
  { id:"flounder",        name:"Flounder",        rarity:"common",    color:"#8D6E47", belly:"#C4A882", fin:"#5D4037", gill:"#3E2723", minW:1,  maxW:12, minL:10,maxL:24, difficulty:1, value:1, body:"flat" },
  { id:"blue_marlin",     name:"Blue Marlin",     rarity:"legendary", color:"#1A3A6B", belly:"#A5C4E0", fin:"#0D2244", gill:"#08172E", minW:200,maxW:1400,minL:80,maxL:160,difficulty:5, value:9, body:"billfish" },
  { id:"bluefin_tuna",    name:"Bluefin Tuna",    rarity:"epic",      color:"#2C3E60", belly:"#C0C8D0", fin:"#FFD700", gill:"#1A2438", minW:100,maxW:900,minL:60,maxL:120,difficulty:5, value:7, body:"torpedo" },
  { id:"yellowfin_tuna",  name:"Yellowfin Tuna",  rarity:"rare",      color:"#2C4A6B", belly:"#E0D060", fin:"#FFD700", gill:"#1A2E44", minW:30, maxW:400,minL:40,maxL:90, difficulty:4, value:5, body:"torpedo" },
  { id:"wahoo",           name:"Wahoo",           rarity:"rare",      color:"#37474F", belly:"#B0BEC5", fin:"#263238", gill:"#1A2327", minW:15, maxW:180,minL:40,maxL:96, difficulty:4, value:4, body:"torpedo" },
  { id:"king_mackerel",   name:"King Mackerel",   rarity:"uncommon",  color:"#546E7A", belly:"#CFD8DC", fin:"#37474F", gill:"#263238", minW:10, maxW:90, minL:24,maxL:60, difficulty:3, value:3, body:"torpedo" },
  { id:"barracuda",       name:"Barracuda",       rarity:"uncommon",  color:"#78909C", belly:"#ECEFF1", fin:"#455A64", gill:"#37474F", minW:5,  maxW:100,minL:24,maxL:66, difficulty:4, value:3, body:"torpedo" },
  { id:"cobia",           name:"Cobia",           rarity:"rare",      color:"#5D4037", belly:"#D7CCC8", fin:"#3E2723", gill:"#2A1A10", minW:15, maxW:130,minL:30,maxL:78, difficulty:4, value:4, body:"torpedo" },
  { id:"snook",           name:"Snook",           rarity:"uncommon",  color:"#A0A878", belly:"#E8E0C0", fin:"#7A8050", gill:"#5A6038", minW:3,  maxW:50, minL:18,maxL:48, difficulty:3, value:3, body:"oval" },
  { id:"redfish",         name:"Red Drum",        rarity:"common",    color:"#C25E2A", belly:"#F0C898", fin:"#8B3A12", gill:"#6B2A08", minW:2,  maxW:90, minL:18,maxL:54, difficulty:3, value:2, body:"oval" },
  { id:"black_drum",      name:"Black Drum",      rarity:"common",    color:"#4A4A52", belly:"#B0B0B8", fin:"#2A2A30", gill:"#1A1A20", minW:5,  maxW:90, minL:18,maxL:54, difficulty:3, value:2, body:"chunky" },
  { id:"sheepshead",      name:"Sheepshead",      rarity:"common",    color:"#8A8A70", belly:"#D8D8C0", fin:"#5A5A48", gill:"#3A3A28", minW:2,  maxW:20, minL:12,maxL:30, difficulty:2, value:2, body:"oval" },
  { id:"permit",          name:"Permit",          rarity:"rare",      color:"#B8C0C8", belly:"#F0F4F8", fin:"#788088", gill:"#4A5258", minW:5,  maxW:60, minL:18,maxL:48, difficulty:4, value:4, body:"oval" },
  { id:"bonefish",        name:"Bonefish",        rarity:"rare",      color:"#C0C8D0", belly:"#F4F8FC", fin:"#90989F", gill:"#5A6268", minW:2,  maxW:18, minL:18,maxL:36, difficulty:4, value:3, body:"torpedo" },
  { id:"amberjack",       name:"Amberjack",       rarity:"uncommon",  color:"#9A8050", belly:"#E0D0A0", fin:"#6A5530", gill:"#4A3818", minW:10, maxW:180,minL:24,maxL:72, difficulty:4, value:3, body:"torpedo" },
  { id:"grouper_gag",     name:"Gag Grouper",     rarity:"uncommon",  color:"#6B5D4A", belly:"#C0B098", fin:"#4A4030", gill:"#2E2618", minW:5,  maxW:80, minL:18,maxL:54, difficulty:4, value:3, body:"chunky" },
  { id:"black_grouper",   name:"Black Grouper",   rarity:"rare",      color:"#3A3530", belly:"#9A9088", fin:"#252220", gill:"#15120F", minW:10, maxW:180,minL:24,maxL:60, difficulty:4, value:4, body:"chunky" },
  { id:"mangrove_snapper",name:"Mangrove Snapper",rarity:"common",   color:"#8B4A3A", belly:"#D8A088", fin:"#6B2A1A", gill:"#4A1A0A", minW:1,  maxW:18, minL:10,maxL:30, difficulty:2, value:2, body:"oval" },
  { id:"mutton_snapper",  name:"Mutton Snapper",  rarity:"uncommon",  color:"#B05A4A", belly:"#F0B0A0", fin:"#8B3A2A", gill:"#6B2A1A", minW:3,  maxW:35, minL:14,maxL:36, difficulty:3, value:3, body:"oval" },
  { id:"yellowtail",      name:"Yellowtail Snapper",rarity:"common", color:"#5A7A9A", belly:"#E0E8C0", fin:"#FFD700", gill:"#3A4A5A", minW:1,  maxW:12, minL:10,maxL:30, difficulty:2, value:2, body:"torpedo" },
  { id:"pompano",         name:"Florida Pompano", rarity:"uncommon",  color:"#C0C8B0", belly:"#F8F0D0", fin:"#909878", gill:"#5A6048", minW:1,  maxW:10, minL:10,maxL:26, difficulty:3, value:3, body:"oval" },
  { id:"triggerfish",     name:"Gray Triggerfish",rarity:"common",   color:"#7A7068", belly:"#C0B8B0", fin:"#5A5048", gill:"#3A3028", minW:1,  maxW:13, minL:10,maxL:28, difficulty:2, value:2, body:"oval" },
  { id:"hogfish",         name:"Hogfish",         rarity:"uncommon",  color:"#D88080", belly:"#F8D0C8", fin:"#B05050", gill:"#8B3030", minW:2,  maxW:25, minL:12,maxL:36, difficulty:3, value:3, body:"oval" },
  { id:"lionfish",        name:"Lionfish",        rarity:"rare",      color:"#B03A2A", belly:"#F0D0B0", fin:"#8B1A0A", gill:"#6B0A00", minW:1,  maxW:3,  minL:8, maxL:18, difficulty:3, value:4, body:"spiny", edible:false },
  { id:"tilapia",         name:"Tilapia",         rarity:"common",    color:"#8A9088", belly:"#D0D8C8", fin:"#5A6058", gill:"#3A4038", minW:1,  maxW:10, minL:8, maxL:24, difficulty:1, value:1, body:"oval" },
  { id:"largemouth_bass", name:"Largemouth Bass", rarity:"common",    color:"#4A6B3A", belly:"#D0D8A0", fin:"#2E4A20", gill:"#1A2E10", minW:1,  maxW:22, minL:10,maxL:30, difficulty:2, value:2, body:"oval" },
  { id:"smallmouth_bass", name:"Smallmouth Bass", rarity:"common",    color:"#7A6B4A", belly:"#D8C8A0", fin:"#5A4A30", gill:"#3A2E18", minW:1,  maxW:12, minL:10,maxL:27, difficulty:2, value:2, body:"oval" },
  { id:"striped_bass",    name:"Striped Bass",    rarity:"uncommon",  color:"#5A6878", belly:"#D8E0E8", fin:"#3A4858", gill:"#1A2838", minW:3,  maxW:80, minL:18,maxL:54, difficulty:3, value:3, body:"torpedo" },
  { id:"catfish",         name:"Channel Catfish", rarity:"common",    color:"#5A5448", belly:"#C0B8A8", fin:"#3A3428", gill:"#1A1408", minW:1,  maxW:55, minL:12,maxL:50, difficulty:2, value:1, body:"chunky" },
  { id:"walleye",         name:"Walleye",         rarity:"uncommon",  color:"#8A8050", belly:"#D8D0A0", fin:"#5A5030", gill:"#3A3018", minW:1,  maxW:25, minL:12,maxL:36, difficulty:3, value:3, body:"torpedo" },
  { id:"northern_pike",   name:"Northern Pike",   rarity:"uncommon",  color:"#5A6B4A", belly:"#C8D0A8", fin:"#3A4A30", gill:"#1A2E18", minW:2,  maxW:55, minL:18,maxL:60, difficulty:3, value:3, body:"torpedo" },
  { id:"muskie",          name:"Muskellunge",     rarity:"rare",      color:"#6B7050", belly:"#C8D0B0", fin:"#4A5030", gill:"#2E3018", minW:5,  maxW:70, minL:24,maxL:72, difficulty:4, value:4, body:"torpedo" },
  { id:"rainbow_trout",   name:"Rainbow Trout",   rarity:"common",    color:"#7A9098", belly:"#F0D0D8", fin:"#5A7078", gill:"#E08090", minW:1,  maxW:15, minL:10,maxL:30, difficulty:2, value:2, body:"torpedo" },
  { id:"brown_trout",     name:"Brown Trout",     rarity:"common",    color:"#8A6B4A", belly:"#E0C8A0", fin:"#5A4530", gill:"#3A2818", minW:1,  maxW:25, minL:10,maxL:36, difficulty:2, value:2, body:"torpedo" },
  { id:"salmon",          name:"Atlantic Salmon", rarity:"uncommon",  color:"#A06858", belly:"#F0C8B8", fin:"#7A4838", gill:"#5A2818", minW:5,  maxW:55, minL:20,maxL:54, difficulty:3, value:4, body:"torpedo" },
  { id:"crappie",         name:"Crappie",         rarity:"common",    color:"#8A9088", belly:"#D8DCD0", fin:"#5A6058", gill:"#3A4038", minW:1,  maxW:5,  minL:8, maxL:20, difficulty:1, value:1, body:"oval" },
  { id:"bluegill",        name:"Bluegill",        rarity:"common",    color:"#4A6878", belly:"#E0C860", fin:"#2E4858", gill:"#1A2838", minW:1,  maxW:3,  minL:6, maxL:16, difficulty:1, value:1, body:"oval" },
  { id:"swordfish",       name:"Swordfish",       rarity:"epic",      color:"#3A4A5A", belly:"#C0C8D0", fin:"#1A2A3A", gill:"#0A1A2A", minW:50, maxW:1100,minL:60,maxL:177,difficulty:5, value:7, body:"billfish" },
  { id:"white_marlin",    name:"White Marlin",    rarity:"epic",      color:"#2C5A7B", belly:"#D0E0F0", fin:"#1A3A5A", gill:"#0A2238", minW:40, maxW:180,minL:60,maxL:110,difficulty:5, value:6, body:"billfish" },
  { id:"mako_shark",      name:"Mako Shark",      rarity:"legendary", color:"#3A5068", belly:"#D8E0E8", fin:"#1A3048", gill:"#0A1828", minW:130,maxW:1200,minL:60,maxL:160,difficulty:5, value:8, body:"shark" },
  { id:"blacktip_shark",  name:"Blacktip Shark",  rarity:"epic",      color:"#5A6878", belly:"#E0E8F0", fin:"#1A2838", gill:"#0A1828", minW:40, maxW:270,minL:48,maxL:100,difficulty:5, value:5, body:"shark" },
  { id:"hammerhead",      name:"Hammerhead Shark",rarity:"legendary", color:"#6A7888", belly:"#D8E0E8", fin:"#3A4858", gill:"#1A2838", minW:100,maxW:1000,minL:72,maxL:240,difficulty:5, value:8, body:"shark" },
  { id:"stingray",        name:"Southern Stingray",rarity:"uncommon", color:"#6B5D4A", belly:"#C0B0A0", fin:"#4A4030", gill:"#2E2618", minW:10, maxW:200,minL:24,maxL:78, difficulty:3, value:3, body:"flat" },
  { id:"grunt",           name:"White Grunt",     rarity:"common",    color:"#8A8068", belly:"#D8D0B8", fin:"#5A5040", gill:"#3A3028", minW:1,  maxW:5,  minL:8, maxL:18, difficulty:1, value:1, body:"oval" },
  { id:"porgy",           name:"Porgy",           rarity:"common",    color:"#9A9088", belly:"#E0D8C8", fin:"#6A6058", gill:"#4A4038", minW:1,  maxW:8,  minL:8, maxL:22, difficulty:1, value:1, body:"oval" },
];

// Procedural generator to reach 200 total fish
const FISH_PREFIXES = ["Spotted","Golden","Silver","Striped","Banded","Crimson","Azure","Emerald","Royal","Giant","Dwarf","Spiny","Painted","Electric","Ghost","Shadow","Coral","Reef","Deep","Tropical","Arctic","Sunset","Midnight","Ruby","Jade","Bronze","Copper","Pearl","Onyx","Scarlet","Cobalt","Amber","Ivory","Obsidian","Tiger","Zebra","Leopard","Phantom","Glass","Neon"];
const FISH_TYPES = ["Snapper","Grouper","Jack","Bass","Wrasse","Tang","Perch","Bream","Drum","Croaker","Goby","Blenny","Damsel","Angelfish","Butterflyfish","Parrotfish","Surgeonfish","Triggerfish","Filefish","Pufferfish","Boxfish","Cardinalfish","Squirrelfish","Hawkfish","Dottyback","Anthias","Basslet","Hamlet","Chromis","Sergeant","Rockfish","Scorpionfish","Lizardfish","Flagfish","Pipefish","Seahorse","Dragonet","Mudskipper","Killifish","Rasbora"];
const BODY_TYPES = ["oval","torpedo","chunky","flat","spiny"];
const RARITIES = ["common","common","common","uncommon","uncommon","rare","epic","legendary"];

function hslToHex(h, s, l) {
  l /= 100; const a = s * Math.min(l, 1 - l) / 100;
  const f = function(n){ var k=(n+h/30)%12; var c=l-a*Math.max(Math.min(k-3,9-k,1),-1); return Math.round(255*c).toString(16).padStart(2,"0"); };
  return "#" + f(0) + f(8) + f(4);
}

function generateFish() {
  var all = REAL_FISH.slice();
  var seed = 12345;
  function rand(){ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
  var usedNames = {};
  for (var i = 0; i < REAL_FISH.length; i++) usedNames[REAL_FISH[i].name] = true;
  var idx = 0;
  while (all.length < 200) {
    var prefix = FISH_PREFIXES[Math.floor(rand()*FISH_PREFIXES.length)];
    var type   = FISH_TYPES[Math.floor(rand()*FISH_TYPES.length)];
    var name = prefix + " " + type;
    if (usedNames[name]) { idx++; continue; }
    usedNames[name] = true;
    var hue = Math.floor(rand()*360);
    var rarity = RARITIES[Math.floor(rand()*RARITIES.length)];
    var rarMult = rarity==="legendary"?8:rarity==="epic"?5:rarity==="rare"?3:rarity==="uncommon"?2:1;
    var sizeBase = rarity==="legendary"?Math.floor(rand()*400+100):rarity==="epic"?Math.floor(rand()*150+40):rarity==="rare"?Math.floor(rand()*60+15):Math.floor(rand()*20+1);
    all.push({
      id: "gen_" + idx,
      name: name,
      rarity: rarity,
      color: hslToHex(hue, 55, 45),
      belly: hslToHex(hue, 40, 78),
      fin:   hslToHex(hue, 60, 30),
      gill:  hslToHex((hue+10)%360, 70, 22),
      minW: Math.max(1, Math.floor(sizeBase*0.4)),
      maxW: sizeBase,
      minL: Math.max(6, Math.floor(sizeBase*0.3)+6),
      maxL: Math.floor(sizeBase*0.5)+20,
      difficulty: rarity==="legendary"?5:rarity==="epic"?5:rarity==="rare"?4:rarity==="uncommon"?3:rand()>0.5?2:1,
      value: rarMult,
      body: BODY_TYPES[Math.floor(rand()*BODY_TYPES.length)],
      edible: !(type==="Pufferfish"||type==="Scorpionfish"||type==="Boxfish"),
    });
    idx++;
  }
  return all;
}

const FISH = generateFish();
const LOCATIONS = [
  { id:"dock",     name:"Harbor Dock",   fish:["flounder","red_snapper"] },
  { id:"pier",     name:"Old Pier",      fish:["flounder","red_snapper","tarpon"] },
  { id:"reef",     name:"Coral Reef",    fish:["red_snapper","goliath_grouper","mahi_mahi"] },
  { id:"offshore", name:"Deep Blue",     fish:["sailfish","mahi_mahi","tarpon"] },
  { id:"inlet",    name:"Inlet Channel", fish:["tarpon","red_snapper","flounder"] },
];
const BOATS = [
  { id:"skiff",       name:"Flats Skiff",     price:0,     hull:"#D6CFC0", accent:"#8D6E47", trim:"#5D4037", type:"skiff",       speed:5,  rooms:["deck"] },
  { id:"jonboat",     name:"Jon Boat",        price:2000,  hull:"#4E7A3A", accent:"#2E5A20", trim:"#1B3A12", type:"jonboat",     speed:5,  rooms:["deck"] },
  { id:"center",      name:"Center Console",  price:5000,  hull:"#E8EEF2", accent:"#1565C0", trim:"#0D47A1", type:"center",      speed:7,  rooms:["deck","cabin"] },
  { id:"bay_boat",    name:"Bay Boat",        price:12000, hull:"#2E5A8A", accent:"#90CAF9", trim:"#FFD54F", type:"bay",         speed:8,  rooms:["deck","cabin"] },
  { id:"pontoon",     name:"Pontoon Party",   price:18000, hull:"#B0BEC5", accent:"#43A047", trim:"#FF7043", type:"pontoon",     speed:6,  rooms:["deck","cabin"] },
  { id:"houseboat",   name:"Houseboat",       price:25000, hull:"#EDE0CB", accent:"#8D6E47", trim:"#5D4037", type:"houseboat",   speed:6,  rooms:["engine_room","kitchen","living_room","bedroom","deck","cabin"] },
  { id:"trawler",     name:"Trawler",         price:32000, hull:"#37474F", accent:"#90A4AE", trim:"#F9A825", type:"trawler",     speed:7,  rooms:["engine_room","kitchen","bedroom","deck","cabin"] },
  { id:"sportfisher", name:"Sport Fisher",    price:40000, hull:"#FFFFFF", accent:"#1565C0", trim:"#37474F", type:"sportfisher", speed:9,  rooms:["engine_room","kitchen","bedroom","deck","cabin"] },
  { id:"catamaran",   name:"Catamaran",       price:60000, hull:"#ECEFF1", accent:"#00ACC1", trim:"#006064", type:"catamaran",   speed:10, rooms:["engine_room","kitchen","living_room","bedroom","deck","cabin"] },
  { id:"speedboat",   name:"Cigarette Speedboat", price:85000, hull:"#D32F2F", accent:"#FFFFFF", trim:"#B71C1C", type:"speedboat", speed:14, rooms:["deck","cabin"] },
  { id:"yacht",       name:"Luxury Yacht",    price:120000,hull:"#F5F5F5", accent:"#FFD700", trim:"#1A237E", type:"yacht",       speed:12, rooms:["engine_room","kitchen","living_room","bedroom","deck","cabin"] },
];
const RODS = [
  { id:"basic",    name:"Cane Pole",       power:1, price:0 },
  { id:"spinning", name:"Spinning Rod",    power:2, price:200 },
  { id:"baitcast", name:"Baitcasting Rod", power:3, price:500 },
  { id:"heavy",    name:"Offshore Rod",    power:5, price:1200 },
];

const LURES = [
  { id:"shrimp",     name:"Shrimp",       color:"#FFB3A7", bonus:1, desc:"Works everywhere" },
  { id:"silver",     name:"Silver Spoon", color:"#E0E0E0", bonus:2, desc:"Tarpon love these" },
  { id:"popper",     name:"Popper",       color:"#FF5722", bonus:1, desc:"Top water action" },
  { id:"jig_white",  name:"White Jig",    color:"#FAFAFA", bonus:2, desc:"All-round workhorse" },
  { id:"jig_pink",   name:"Pink Jig",     color:"#F48FB1", bonus:1, desc:"Snapper favorite" },
  { id:"rapala",     name:"Rapala Minnow",color:"#42A5F5", bonus:3, desc:"Deep runner" },
  { id:"bucktail",   name:"Bucktail",     color:"#A5D6A7", bonus:2, desc:"Flounder killer" },
];
const BAITS = [
  { id:"goggle_eye",  name:"Goggle Eye",   color:"#FFD54F", bonus:4, desc:"Premium live bait — best for big fish" },
  { id:"pilchard",    name:"Pilchard",     color:"#90CAF9", bonus:3, desc:"Schooling bait, very effective" },
  { id:"mullet",      name:"Mullet",       color:"#BCAAA4", bonus:3, desc:"Big chunks for big fish" },
  { id:"pinfish",     name:"Pinfish",      color:"#80CBC4", bonus:2, desc:"Hardy live bait" },
  { id:"sardine",     name:"Sardine",      color:"#B0BEC5", bonus:2, desc:"Cut or live" },
  { id:"shrimp_live", name:"Live Shrimp",  color:"#FFCC80", bonus:2, desc:"Universal live bait" },
  { id:"crab",        name:"Blue Crab",    color:"#64B5F6", bonus:3, desc:"Grouper go crazy for crab" },
  { id:"worm",        name:"Sea Worm",     color:"#EF9A9A", bonus:1, desc:"Flounder bait" },
  { id:"squid",       name:"Squid",        color:"#CE93D8", bonus:2, desc:"Cut squid, always works" },
  { id:"anchovy",     name:"Anchovy",      color:"#A5D6A7", bonus:1, desc:"Small bait for small fish" },
  { id:"greenback",   name:"Greenback",    color:"#C5E1A5", bonus:3, desc:"Offshore magic" },
];

const RARITY_COLOR = { common:"#78909C", uncommon:"#43A047", rare:"#1976D2", epic:"#7B1FA2", legendary:"#F57F17" };
const ROOM_NAMES   = { deck:"Open Deck", cabin:"Captain's Bridge", kitchen:"Galley Kitchen", bedroom:"Sleeping Cabin", living_room:"Saloon", engine_room:"Engine Room" };
// On land the same rooms get ordinary house names.
const LAND_ROOM_NAMES = { deck:"Front Porch", kitchen:"Kitchen", bedroom:"Bedroom", living_room:"Living Room" };
// Homes you can live in on dry land — buy one, then live on land instead of your boat.
const LAND_HOMES = [
  { id:"tent",    name:"Beach Tent",       price:0,     rooms:["deck"] },
  { id:"shack",   name:"Fishing Shack",    price:3000,  rooms:["living_room","bedroom","deck"] },
  { id:"cottage", name:"Marina Cottage",   price:15000, rooms:["living_room","kitchen","bedroom","deck"] },
  { id:"villa",   name:"Beachfront Villa", price:75000, rooms:["living_room","kitchen","bedroom","deck"] },
];

// Fish restaurant preparation styles — each multiplies the fish's value
const PREP_STYLES = [
  { id:"grilled",   name:"Grilled",        mult:2.0, desc:"Simple and classic over open flame" },
  { id:"fried",     name:"Fish & Chips",   mult:2.2, desc:"Golden battered and deep fried" },
  { id:"blackened", name:"Blackened",      mult:2.4, desc:"Cajun spiced and seared dark" },
  { id:"tacos",     name:"Fish Tacos",     mult:2.5, desc:"Fresh with slaw and lime" },
  { id:"ceviche",   name:"Ceviche",        mult:2.6, desc:"Cured in citrus, no heat" },
  { id:"seared",    name:"Pan-Seared",     mult:2.3, desc:"Crispy skin, buttery finish" },
  { id:"smoked",    name:"Smoked",         mult:2.8, desc:"Slow smoked over hickory" },
  { id:"chowder",   name:"Fish Chowder",   mult:1.8, desc:"Hearty and creamy soup" },
  { id:"sashimi",   name:"Sashimi",        mult:3.0, desc:"Thin raw slices, premium grade" },
  { id:"sushi",     name:"Sushi Roll",     mult:3.2, desc:"Rolled with rice and nori" },
];

// Premium lures/baits sold only at shops (added to your tackle when bought)
const SHOP_LURES = [
  { id:"sp_glow",   name:"Glow Eel",      color:"#B2FF59", bonus:4, desc:"Premium night lure", price:300 },
  { id:"sp_holo",   name:"Holographic Spoon", color:"#80DEEA", bonus:4, desc:"Flashes like a baitfish", price:350 },
  { id:"sp_diver",  name:"Deep Diver Pro", color:"#1565C0", bonus:5, desc:"Reaches the deepest fish", price:500 },
];
const SHOP_BAITS = [
  { id:"sb_live_eye", name:"Jumbo Goggle Eye", color:"#FFE082", bonus:5, desc:"The ultimate live bait", price:250 },
  { id:"sb_bloodworm",name:"Blood Worm",       color:"#E53935", bonus:4, desc:"Irresistible to big fish", price:200 },
];

// Gift cards — buy them, then resell from your Inventory for a profit. Rarer = worth more.
const GIFT_CARDS = [
  { id:"gc_bait",   name:"Bait Shop Gift Card",  rarity:"common",    color:"#43A047", price:50,   sell:90 },
  { id:"gc_diner",  name:"Diner Gift Card",       rarity:"uncommon",  color:"#E65100", price:120,  sell:240 },
  { id:"gc_tackle", name:"Tackle Gift Card",      rarity:"rare",      color:"#1565C0", price:300,  sell:650 },
  { id:"gc_yacht",  name:"Yacht Club Gift Card",  rarity:"epic",      color:"#7B1FA2", price:700,  sell:1800 },
  { id:"gc_gold",   name:"Golden Sea Gift Card",  rarity:"legendary", color:"#F57F17", price:1500, sell:5000 },
];

// Shops you can drive to. x,y are positions on the 1000x1000 water map.
const SHOPS = [
  { id:"bait1",   name:"Hook & Line Bait",     type:"bait",       lx:-360, color:"#43A047", keeper:"Sal",      greet:"Welcome to Hook & Line! Freshest bait on the coast." },
  { id:"tackle1", name:"Big Game Tackle",      type:"tackle",     lx:-300, color:"#1565C0", keeper:"Marina",   greet:"Hey there, angler. Looking to upgrade your gear?" },
  { id:"rest1",   name:"The Salty Galley",     type:"restaurant", lx:-240, color:"#E65100", keeper:"Chef Tony",greet:"Bring me a fresh catch and I'll cook it any way you like!" },
  { id:"rest2",   name:"Reef Sushi Bar",       type:"restaurant", lx:-180, color:"#AD1457", keeper:"Kenji",    greet:"Irasshaimase! The freshest fish becomes the finest sushi." },
  { id:"market1", name:"Bayside Supermarket",  type:"supermarket",lx:-110, color:"#00897B", keeper:"Greta",    greet:"Welcome to Bayside Supermarket! Everything you need under one roof." },
  { id:"makeup1", name:"Island Makeup & Style",type:"makeup",     lx:-40,  color:"#EC407A", keeper:"Coco",     greet:"Darling! Let's get you looking fabulous." },
  { id:"church1", name:"Seaside Chapel",        type:"church",     lx:40,   color:"#9575CD", keeper:"Pastor Paul",greet:"Welcome, friend. Come in, rest, and find some peace." },
  { id:"gen1",    name:"Marina General Store", type:"general",    lx:110,  color:"#6D4C41", keeper:"Hank",     greet:"Got a little bit of everything in here. Look around." },
  { id:"tackle2", name:"Captain's Outfitters", type:"tackle",     lx:180,  color:"#0D47A1", keeper:"Dale",     greet:"Outfittin' captains for thirty years. What'll it be?" },
  { id:"rest3",   name:"Dockside Diner",       type:"restaurant", lx:240,  color:"#D84315", keeper:"Rosa",     greet:"Sit down, sugar. We'll fry up whatever you caught." },
  { id:"repair1", name:"Rusty's Repair Yard",  type:"repair",     lx:300,  color:"#546E7A", keeper:"Rusty",    greet:"Engine runnin' hot? I'll get her cooled down right." },
  { id:"cafe1",   name:"Seaside Coffee",       type:"general",    lx:360,  color:"#8D6E63", keeper:"Mara",     greet:"Morning! Fresh coffee to start your fishing day." },
  { id:"jewel1",  name:"Pearl Jewelry",        type:"general",    lx:420,  color:"#26A69A", keeper:"Opal",     greet:"Pearls from these very waters. Treat yourself." },
];
const SKIN  = ["#FDDBB4","#F5C6A0","#E8A87C","#C68642","#8D5524","#4A2912"];
const SHIRT = ["#2C3E50","#E74C3C","#27AE60","#3498DB","#F39C12","#8E44AD"];
const PANTS = ["#2C3E50","#795548","#37474F","#1565C0","#4E342E","#212121","#5D4037","#00695C","#455A64","#7B1FA2"];
const HATC  = ["#8B0000","#1A237E","#2E7D32","#4A3728","#DDDDDD"];
const HAIRC = ["#2C1A0A","#4A2C12","#6E4218","#A8741A","#D9C27A","#1A1A1A","#6E1A0A","#9A9A9A","#E8E8E8","#C0392B","#5E35B1","#00838F"];

// Lighten/darken a hex color by an amount (for hair/fabric shading).
function shadeHex(hex, amt){
  var h=(hex||"#000").replace("#",""); if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  function cl(v){ return Math.max(0,Math.min(255,v)); }
  var r=cl(parseInt(h.slice(0,2),16)+amt), g=cl(parseInt(h.slice(2,4),16)+amt), b=cl(parseInt(h.slice(4,6),16)+amt);
  function hx(x){ return x.toString(16).padStart(2,"0"); }
  return "#"+hx(r)+hx(g)+hx(b);
}

// Hairstyles. Each: {n:name, len:0-5, bangs:0 none/1 straight/2 side/3 center,
// tie:special, tex:0 straight/1 wavy/2 curly, vol:width}. Girls have 41, boys 21.
function H(n,len,bangs,tie,tex,vol){ return { n:n, len:len, bangs:bangs, tie:tie||"", tex:tex||0, vol:vol||1 }; }
const HAIR_GIRL = [
  H("Long Straight",5,0,"",0,1.0), H("Long Center-Part",5,3,"",0,1.05), H("Long Wavy",5,0,"",1,1.1),
  H("Voluminous Curls",5,0,"",2,1.3), H("Long Curly",5,3,"",2,1.2), H("Long with Bangs",5,1,"",0,1.05),
  H("Side-Swept Long",5,2,"",1,1.05), H("Shoulder Length",4,0,"",0,1.0), H("Shoulder Wavy",4,2,"",1,1.05),
  H("Beach Waves",4,3,"",1,1.15), H("Bob",3,0,"",0,1.0), H("Bob with Bangs",3,1,"",0,1.0),
  H("Angled Bob",3,2,"",0,0.95), H("Wavy Bob",3,0,"",1,1.05), H("Long Bob (Lob)",4,3,"",0,1.0),
  H("Pixie",2,2,"",0,0.9), H("Pixie with Bangs",2,1,"",0,0.9), H("Ponytail",3,1,"pony",0,1.0),
  H("High Ponytail",2,1,"pony",0,1.0), H("Side Ponytail",3,2,"sidepony",0,1.0), H("Long Ponytail",5,0,"pony",1,1.05),
  H("Pigtails",3,1,"pigtails",0,1.0), H("Long Pigtails",5,1,"pigtails",0,1.05), H("Space Buns",2,1,"spacebuns",0,1.0),
  H("Single Braid",5,0,"braid",0,1.0), H("Side Braid",5,2,"sidebraid",1,1.05), H("Twin Braids",4,1,"pigtails",0,1.0),
  H("Crown Braid",2,0,"halfup",0,1.0), H("Bun",2,0,"bun",0,1.0), H("High Bun",2,1,"highbun",0,1.0),
  H("Low Bun",3,3,"bun",0,1.0), H("Messy Bun",2,2,"highbun",1,1.05), H("Top Knot",2,0,"topknot",0,1.0),
  H("Half-Up",4,3,"halfup",1,1.1), H("Afro",2,0,"afro",2,1.3), H("Afro Puff",2,0,"topknot",2,1.2),
  H("Hime Cut",5,1,"",0,1.1), H("Layered Long",5,2,"",1,1.1), H("Curtain Bangs",5,3,"",1,1.05),
  H("Sleek Straight",5,3,"",0,0.95), H("Wavy Lob",4,0,"",1,1.05),
];
const HAIR_BOY = [
  H("Buzz Cut",1,0,"",0,1.0), H("Crew Cut",1,1,"",0,1.0), H("Short Side Part",2,2,"comb",0,1.0),
  H("Spiky",2,0,"spiky",0,1.0), H("Faux Hawk",2,0,"fauxhawk",0,1.0), H("Mohawk",1,0,"mohawk",0,1.0),
  H("Caesar",2,1,"",0,1.0), H("Comb Over",2,2,"comb",0,1.0), H("Quiff",2,0,"quiff",0,1.0),
  H("Pompadour",2,0,"pomp",0,1.0), H("Slick Back",2,0,"slick",0,1.0), H("Curly Short",2,0,"",2,1.05),
  H("Afro",2,0,"afro",2,1.25), H("Man Bun",3,0,"manbun",0,1.0), H("Top Knot",3,0,"topknot",0,1.0),
  H("Short Dreads",2,0,"dreads",2,1.05), H("Fringe",2,1,"",0,1.0), H("Messy Short",2,2,"spiky",1,1.05),
  H("Flat Top",2,0,"flattop",0,1.0), H("Bald",0,0,"bald",0,1.0), H("Shoulder Length",4,3,"",1,1.05),
];

// Pants/legwear styles. Each: {n, cut:pants/shorts/skirt, len, wid, acc}. Girls 30, boys 29.
function P(n,cut,len,wid,acc){ return { n:n, cut:cut, len:len, wid:wid, acc:acc||"" }; }
const PANTS_GIRL = [
  P("Skinny Jeans","pants","ankle","skinny",""), P("Straight Jeans","pants","ankle","straight",""),
  P("Bootcut Jeans","pants","ankle","boot",""), P("Flare Jeans","pants","ankle","flare",""),
  P("Wide-Leg Pants","pants","ankle","wide",""), P("Mom Jeans","pants","ankle","straight","cuff"),
  P("Ripped Jeans","pants","ankle","skinny","rip"), P("Capri Pants","pants","capri","straight",""),
  P("Leggings","pants","ankle","skinny","track"), P("Yoga Pants","pants","ankle","flare","track"),
  P("Joggers","pants","ankle","straight","cuff"), P("Cargo Pants","pants","ankle","wide","cargo"),
  P("Denim Shorts","shorts","mini","straight",""), P("Athletic Shorts","shorts","knee","wide","track"),
  P("Bermuda Shorts","shorts","knee","straight",""), P("Mini Skirt","skirt","mini","straight",""),
  P("Pleated Skirt","skirt","knee","wide","pleat"), P("A-Line Skirt","skirt","knee","flare",""),
  P("Maxi Skirt","skirt","maxi","wide",""), P("Pencil Skirt","skirt","pencil","skinny",""),
  P("Culottes","pants","capri","wide",""), P("Palazzo Pants","pants","ankle","flare",""),
  P("Overalls","pants","ankle","straight","overall"), P("Cropped Pants","pants","crop","straight",""),
  P("Bell Bottoms","pants","ankle","flare","flare"), P("Track Pants","pants","ankle","straight","track"),
  P("Linen Pants","pants","ankle","wide",""), P("Skort","skirt","mini","straight",""),
  P("Tights","pants","ankle","skinny",""), P("Wide Capris","pants","capri","wide",""),
];
const PANTS_BOY = [
  P("Straight Jeans","pants","ankle","straight",""), P("Skinny Jeans","pants","ankle","skinny",""),
  P("Slim Jeans","pants","ankle","skinny","cuff"), P("Relaxed Jeans","pants","ankle","wide",""),
  P("Ripped Jeans","pants","ankle","straight","rip"), P("Bootcut Jeans","pants","ankle","boot",""),
  P("Cargo Pants","pants","ankle","wide","cargo"), P("Cargo Shorts","shorts","knee","wide","cargo"),
  P("Chinos","pants","ankle","straight",""), P("Khakis","pants","ankle","straight","cuff"),
  P("Joggers","pants","ankle","straight","cuff"), P("Sweatpants","pants","ankle","wide","track"),
  P("Track Pants","pants","ankle","straight","track"), P("Athletic Shorts","shorts","knee","wide","track"),
  P("Basketball Shorts","shorts","knee","wide",""), P("Denim Shorts","shorts","knee","straight",""),
  P("Bermuda Shorts","shorts","knee","straight","cuff"), P("Board Shorts","shorts","knee","wide",""),
  P("Dress Pants","pants","ankle","straight",""), P("Corduroy Pants","pants","ankle","straight","pleat"),
  P("Overalls","pants","ankle","straight","overall"), P("Carpenter Jeans","pants","ankle","wide","cargo"),
  P("Cuffed Jeans","pants","ankle","straight","cuff"), P("Linen Pants","pants","ankle","wide",""),
  P("Capri Pants","pants","capri","straight",""), P("Camo Pants","pants","ankle","wide","camo"),
  P("Pleated Trousers","pants","ankle","straight","pleat"), P("Wide-Leg Pants","pants","ankle","wide",""),
  P("Cropped Pants","pants","crop","straight",""),
];
function hairListFor(g){ return g==="girl" ? HAIR_GIRL : HAIR_BOY; }
function pantsListFor(g){ return g==="girl" ? PANTS_GIRL : PANTS_BOY; }
function curHairStyle(cfg){ var l=hairListFor(cfg.gender||"boy"); return l[Math.min(cfg.hairStyle||0, l.length-1)]; }
function curPantsStyle(cfg){ var l=pantsListFor(cfg.gender||"boy"); return l[Math.min(cfg.pantsStyle||0, l.length-1)]; }

// Seashells you can find on the sand. Rarer shells are far less common and sell
// for much more. "shape" drives how the little shell is drawn.
const SEASHELLS = [
  { id:"scallop",  name:"Scallop Shell",   rarity:"common",    color:"#E8C8A0", sell:8,   shape:"fan" },
  { id:"clam",     name:"Clam Shell",      rarity:"common",    color:"#D8C0B0", sell:11,  shape:"fan" },
  { id:"cockle",   name:"Cockle Shell",    rarity:"common",    color:"#E0CABF", sell:14,  shape:"fan" },
  { id:"auger",    name:"Auger Shell",     rarity:"uncommon",  color:"#C8A878", sell:26,  shape:"spiral" },
  { id:"olive",    name:"Olive Shell",     rarity:"uncommon",  color:"#B89A6A", sell:34,  shape:"spiral" },
  { id:"whelk",    name:"Whelk Shell",     rarity:"uncommon",  color:"#CDBBA0", sell:40,  shape:"spiral" },
  { id:"murex",    name:"Murex Shell",     rarity:"rare",      color:"#D8B0C0", sell:75,  shape:"spiral" },
  { id:"conch",    name:"Queen Conch",     rarity:"rare",      color:"#F0B090", sell:95,  shape:"conch" },
  { id:"nautilus", name:"Nautilus Shell",  rarity:"epic",      color:"#EDE0D0", sell:210, shape:"spiral" },
  { id:"junonia",  name:"Junonia",         rarity:"epic",      color:"#E8D8B0", sell:300, shape:"spiral" },
  { id:"goldcowrie",name:"Golden Cowrie",  rarity:"legendary", color:"#FFD56A", sell:650, shape:"conch" },
];
// Weighted pick — commons turn up constantly, legendaries almost never.
const SHELL_WEIGHT = { common:46, uncommon:24, rare:11, epic:4, legendary:1 };
function pickShell() {
  var pool = [];
  for (var i=0;i<SEASHELLS.length;i++){ var w=SHELL_WEIGHT[SEASHELLS[i].rarity]||1; for (var k=0;k<w;k++) pool.push(SEASHELLS[i]); }
  return pool[Math.floor(Math.random()*pool.length)];
}

// Questions you can ask the staff, with each keeper-type's own answers.
const SHOP_QA = {
  bait:      [["What's biting today?","The grouper are thick on the reef right now. Drop a live crab and hold on tight!"],["What's your freshest bait?","Just got a bucket of goggle eyes in this morning — premium stuff for the big ones."],["Any tips for a beginner?","Keep your hook sharp and your drag loose. Patience catches more than speed."]],
  tackle:    [["Which rod for big fish?","For offshore monsters you want the heavy Offshore Rod — it won't snap on a marlin."],["Do lures really matter?","Absolutely. Match the hatch — shiny spoons for tarpon, jigs for snapper."],["What's new in stock?","Got some holographic spoons that flash like a wounded baitfish. Deadly."]],
  supermarket:[["Where's the ice?","Back cooler, grab a bag before you head out — keeps your catch fresh all day."],["Any deals today?","The gift cards are the smart buy — flip 'em later for a tidy profit."],["You sell snacks?","Aisle two. A captain's gotta eat out there!"]],
  general:   [["What sells best here?","Folks love the souvenir mugs, but the gift cards are where the money's at."],["Got any local pearls?","Now and then. Keep beachcombing — the sea gives up treasures to the patient."],["Just looking around.","Take your time, friend. Holler if you need anything."]],
  makeup:    [["What style suits me?","A bold shirt and a sharp hat, darling — you'll turn heads on the boardwalk!"],["Got new colors?","Fresh shades just in. Try something daring this season!"],["Any tips?","Confidence is the best look there is. The rest is just color."]],
  restaurant:[["What's your specialty?","Whatever you reel in, I'll make it sing. Bring me your best catch!"],["How does this work?","Hand me a fish from your hold and pick a style — I cook it and pay you for it."],["What pays the most?","Sushi and sashimi from a fresh, rare fish. Quality on the plate, coins in your pocket."]],
  church:    [["Can I rest here?","Of course. Sit, breathe, let the tide of worry roll out for a while."],["Got any wisdom?","The sea rewards the patient and humbles the proud. Fish kindly, friend."],["Why a chapel by the docks?","Sailors have always needed a place to give thanks for a safe return."]],
  repair:    [["My engine overheats.","Don't run her wide open for too long — and come see me when the temp gauge climbs."],["Can you fix anything?","If it's got an engine and a hull, I can patch it. What's she doing?"],["Any maintenance tips?","Rinse the salt off after every trip. Salt's the silent killer of a good motor."]],
};

// ─── FISH SVG ─────────────────────────────────────────────────────────────────
function FishSVG({ fish, W=100 }) {
  const H=W*0.56, cx=W*.42, cy=H*.50, id=fish.id+"_"+W;
  const body = fish.body || "oval";
  // Body proportions vary by type
  let rx=W*.30, ry=H*.36, tailScale=1, finScale=1;
  if (body==="torpedo")  { rx=W*.34; ry=H*.26; tailScale=1.1; }
  else if (body==="chunky") { rx=W*.28; ry=H*.42; finScale=1.2; }
  else if (body==="flat")    { rx=W*.32; ry=H*.46; tailScale=.7; }
  else if (body==="billfish"){ rx=W*.30; ry=H*.20; tailScale=1.2; }
  else if (body==="spiny")   { rx=W*.27; ry=H*.38; finScale=1.4; }
  else if (body==="shark")   { rx=W*.36; ry=H*.30; tailScale=1.3; }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible",display:"block"}}>
      <defs>
        <radialGradient id={`bg${id}`} cx="38%" cy="38%" r="62%"><stop offset="0%" stopColor={fish.color}/><stop offset="100%" stopColor={fish.fin}/></radialGradient>
        <radialGradient id={`bl${id}`} cx="50%" cy="65%" r="50%"><stop offset="0%" stopColor={fish.belly} stopOpacity=".85"/><stop offset="100%" stopColor={fish.belly} stopOpacity="0"/></radialGradient>
      </defs>
      {/* Bill for billfish */}
      {body==="billfish" && <polygon points={`${cx-rx*.9},${cy} ${cx-rx*2.0},${cy-2} ${cx-rx*2.0},${cy+2}`} fill={fish.fin}/>}
      {/* Tail */}
      <polygon points={`${cx+rx*.85},${cy} ${cx+rx*.85+W*.18*tailScale},${cy-H*.36*tailScale} ${cx+rx*.85+W*.10},${cy} ${cx+rx*.85+W*.18*tailScale},${cy+H*.36*tailScale}`} fill={fish.fin} opacity=".9"/>
      {/* Body */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#bg${id})`}/>
      <ellipse cx={cx} cy={cy+ry*.28} rx={rx*.72} ry={ry*.48} fill={`url(#bl${id})`}/>
      {/* Lateral line */}
      <path d={`M ${cx-rx*.55},${cy-ry*.08} Q ${cx+rx*.1},${cy-ry*.05} ${cx+rx*.65},${cy+ry*.04}`} stroke="rgba(0,0,0,.18)" strokeWidth="1.2" fill="none" strokeDasharray="4,3"/>
      {/* Dorsal fin(s) */}
      {body==="spiny"
        ? [0,1,2,3,4].map(function(si){ return <polygon key={si} points={`${cx-rx*.4+si*rx*.3},${cy-ry} ${cx-rx*.35+si*rx*.3},${cy-ry*1.8} ${cx-rx*.25+si*rx*.3},${cy-ry}`} fill={fish.fin} opacity=".85"/>; })
        : <polygon points={`${cx-rx*.15},${cy-ry} ${cx-rx*.05},${cy-ry*(1.62*finScale)} ${cx+rx*.40},${cy-ry*(1.35*finScale)} ${cx+rx*.52},${cy-ry}`} fill={fish.fin} opacity=".88"/>}
      {/* Pelvic + anal fins (underside) */}
      {body!=="billfish" && body!=="shark" && <polygon points={`${cx-rx*.10},${cy+ry*.82} ${cx-rx*.30},${cy+ry*1.42} ${cx+rx*.10},${cy+ry*.92}`} fill={fish.fin} opacity=".74"/>}
      {body!=="billfish" && body!=="shark" && <polygon points={`${cx+rx*.30},${cy+ry*.80} ${cx+rx*.18},${cy+ry*1.30} ${cx+rx*.50},${cy+ry*.88}`} fill={fish.fin} opacity=".68"/>}
      {/* Pectoral fin */}
      <ellipse cx={cx-rx*.22} cy={cy+ry*.22} rx={rx*.20} ry={ry*.38} fill={fish.fin} opacity=".72" transform={`rotate(-22,${cx-rx*.22},${cy+ry*.22})`}/>
      {/* Gill cover (operculum) + three raked gill slits */}
      <path d={`M ${cx-rx*.52},${cy-ry*.52} Q ${cx-rx*.70},${cy} ${cx-rx*.52},${cy+ry*.52}`} stroke="rgba(0,0,0,.32)" strokeWidth="2" fill="none"/>
      <path d={`M ${cx-rx*.46},${cy-ry*.48} Q ${cx-rx*.62},${cy} ${cx-rx*.46},${cy+ry*.48}`} stroke={fish.gill} strokeWidth="1.4" fill="none" opacity=".7"/>
      <path d={`M ${cx-rx*.40},${cy-ry*.42} Q ${cx-rx*.54},${cy} ${cx-rx*.40},${cy+ry*.42}`} stroke={fish.gill} strokeWidth="1.1" fill="none" opacity=".5"/>
      <ellipse cx={cx-rx*.50} cy={cy} rx={3} ry={ry*.30} fill={fish.gill} opacity=".5"/>
      {/* Mouth */}
      <path d={`M ${cx-rx*.92},${cy+ry*.10} Q ${cx-rx*.70},${cy+ry*.26} ${cx-rx*.55},${cy+ry*.20}`} stroke="rgba(0,0,0,.45)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      {/* Eye */}
      <circle cx={cx-rx*.68} cy={cy-ry*.18} r={ry*.18} fill="#111"/>
      <circle cx={cx-rx*.68} cy={cy-ry*.18} r={ry*.18} fill="none" stroke={fish.belly} strokeWidth=".8" opacity=".6"/>
      <circle cx={cx-rx*.66} cy={cy-ry*.22} r={ry*.045} fill="rgba(255,255,255,.85)"/>
    </svg>
  );
}

// ─── BOAT SVG (distinct exterior for each boat type) ─────────────────────────
function BoatSVG({ boat, W=200 }) {
  const H = W * 0.6;
  const t = boat.type;
  const hull = boat.hull, accent = boat.accent, trim = boat.trim;
  return (
    <svg width={W} height={H} viewBox="0 0 200 120" style={{ display: "block", width: W, height: "auto" }}>
      <defs>
        <linearGradient id={"sea_"+boat.id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4A90D9"/><stop offset="100%" stopColor="#1565C0"/></linearGradient>
        <linearGradient id={"hull_"+boat.id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={hull}/><stop offset="100%" stopColor={trim}/></linearGradient>
      </defs>
      {/* Water */}
      <rect x="0" y="86" width="200" height="34" fill={"url(#sea_"+boat.id+")"} />
      {[0,1,2,3].map(function(i){ return <path key={i} d={"M "+(i*55)+" 96 Q "+(i*55+14)+" 92 "+(i*55+28)+" 96"} stroke="rgba(255,255,255,.25)" strokeWidth="1.5" fill="none"/>; })}

      {/* SKIFF — small flat boat */}
      {t==="skiff" && <g>
        <path d="M 30 86 L 40 70 L 160 70 L 172 86 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        <rect x="46" y="62" width="110" height="9" rx="2" fill={accent} opacity=".5"/>
        <rect x="92" y="50" width="5" height="20" fill={trim}/>
        <line x1="94" y1="50" x2="120" y2="56" stroke={trim} strokeWidth="1.5"/>
        <rect x="60" y="64" width="14" height="6" rx="2" fill={trim}/>
      </g>}

      {/* CENTER CONSOLE — open boat with console + T-top */}
      {t==="center" && <g>
        <path d="M 24 88 L 36 66 L 166 66 L 178 88 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        <rect x="40" y="58" width="122" height="9" rx="2" fill={accent} opacity=".4"/>
        {/* console */}
        <rect x="90" y="44" width="26" height="24" rx="3" fill={accent}/>
        {/* T-top */}
        <rect x="84" y="28" width="40" height="5" rx="2" fill={trim}/>
        <line x1="92" y1="33" x2="92" y2="46" stroke={trim} strokeWidth="2.5"/>
        <line x1="116" y1="33" x2="116" y2="46" stroke={trim} strokeWidth="2.5"/>
        {/* rod holders */}
        <line x1="130" y1="60" x2="138" y2="40" stroke={trim} strokeWidth="1.5"/>
        <line x1="136" y1="60" x2="146" y2="42" stroke={trim} strokeWidth="1.5"/>
      </g>}

      {/* BAY BOAT — sleek low-profile with raised platform */}
      {t==="bay" && <g>
        <path d="M 20 88 L 30 64 L 172 64 L 184 88 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        <rect x="34" y="56" width="134" height="9" rx="2" fill={accent} opacity=".5"/>
        {/* poling platform at back */}
        <rect x="160" y="48" width="22" height="3" fill={trim}/>
        <line x1="164" y1="51" x2="164" y2="64" stroke={trim} strokeWidth="1.5"/>
        <line x1="178" y1="51" x2="178" y2="64" stroke={trim} strokeWidth="1.5"/>
        {/* console */}
        <rect x="78" y="46" width="22" height="20" rx="3" fill={accent}/>
        <rect x="82" y="40" width="14" height="6" rx="2" fill={trim}/>
        {/* trolling motor front */}
        <line x1="28" y1="60" x2="22" y2="74" stroke={trim} strokeWidth="2"/>
      </g>}

      {/* SPORT FISHER — big offshore with tuna tower */}
      {t==="sportfisher" && <g>
        <path d="M 14 90 L 26 60 L 178 60 L 190 90 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        {/* blue stripe */}
        <path d="M 16 84 L 188 84 L 186 88 L 18 88 Z" fill={accent}/>
        {/* cabin */}
        <rect x="40" y="40" width="70" height="22" rx="3" fill="#ECEFF1" stroke={trim} strokeWidth="1"/>
        {[46,58,70,82,94].map(function(x){ return <rect key={x} x={x} y="44" width="8" height="10" rx="1" fill={accent} opacity=".6"/>; })}
        {/* tuna tower */}
        <rect x="58" y="16" width="34" height="4" rx="1" fill={trim}/>
        <line x1="62" y1="20" x2="58" y2="40" stroke={trim} strokeWidth="2"/>
        <line x1="88" y1="20" x2="92" y2="40" stroke={trim} strokeWidth="2"/>
        <line x1="75" y1="16" x2="75" y2="8" stroke={trim} strokeWidth="1.5"/>
        {/* outriggers */}
        <line x1="110" y1="58" x2="150" y2="20" stroke={trim} strokeWidth="1.5"/>
        <line x1="110" y1="58" x2="70" y2="22" stroke={trim} strokeWidth="1.5"/>
      </g>}

      {/* HOUSEBOAT — wide flat with house structure */}
      {t==="houseboat" && <g>
        <path d="M 18 90 L 22 76 L 182 76 L 186 90 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        {/* house body 2 stories */}
        <rect x="30" y="44" width="140" height="32" rx="2" fill="#EDE0CB" stroke={trim} strokeWidth="1"/>
        <rect x="44" y="24" width="100" height="20" rx="2" fill="#E0D0B0" stroke={trim} strokeWidth="1"/>
        {/* roof */}
        <rect x="40" y="20" width="108" height="5" rx="2" fill={accent}/>
        {/* windows */}
        {[38,58,78,98,118,138].map(function(x){ return <rect key={x} x={x} y="50" width="12" height="12" rx="1" fill="#87CEEB" stroke={trim} strokeWidth=".5"/>; })}
        {[52,72,92,112,132].map(function(x){ return <rect key={x} x={x} y="28" width="10" height="10" rx="1" fill="#87CEEB"/>; })}
        {/* door */}
        <rect x="96" y="62" width="10" height="14" rx="1" fill={trim}/>
        {/* railing top */}
        <line x1="44" y1="24" x2="144" y2="24" stroke={trim} strokeWidth="1"/>
      </g>}

      {/* YACHT — large sleek multi-deck luxury */}
      {t==="yacht" && <g>
        <path d="M 8 92 L 20 62 L 184 62 L 196 92 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        {/* gold waterline stripe */}
        <path d="M 10 86 L 194 86 L 192 90 L 12 90 Z" fill={accent}/>
        {/* lower deck cabin */}
        <rect x="34" y="44" width="120" height="18" rx="3" fill="#F5F5F5" stroke={trim} strokeWidth="1"/>
        {[40,54,68,82,96,110,124,138].map(function(x){ return <rect key={x} x={x} y="48" width="9" height="9" rx="1" fill="#1A237E" opacity=".7"/>; })}
        {/* upper deck */}
        <rect x="50" y="28" width="80" height="16" rx="3" fill="#FAFAFA" stroke={trim} strokeWidth="1"/>
        {[56,70,84,98,112].map(function(x){ return <rect key={x} x={x} y="31" width="9" height="9" rx="1" fill="#1A237E" opacity=".6"/>; })}
        {/* flybridge */}
        <rect x="64" y="16" width="44" height="12" rx="3" fill="#FFFFFF" stroke={trim} strokeWidth="1"/>
        {/* radar mast */}
        <line x1="86" y1="16" x2="86" y2="6" stroke={trim} strokeWidth="1.5"/>
        <circle cx="86" cy="6" r="3" fill={accent}/>
        <rect x="80" y="9" width="12" height="3" rx="1" fill={trim}/>
        {/* gold trim accents */}
        <line x1="34" y1="44" x2="154" y2="44" stroke={accent} strokeWidth="1"/>
      </g>}

      {t==="jonboat" && <g>
        {/* flat utility boat */}
        <path d="M 24 84 L 30 66 L 174 66 L 180 84 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        <rect x="40" y="60" width="120" height="7" fill={accent} opacity=".8"/>
        {/* bench seats */}
        <rect x="60" y="58" width="20" height="9" rx="1" fill={trim}/>
        <rect x="120" y="58" width="20" height="9" rx="1" fill={trim}/>
        {/* small outboard */}
        <rect x="178" y="62" width="8" height="16" rx="2" fill="#37474F"/>
      </g>}

      {t==="pontoon" && <g>
        {/* two pontoon tubes */}
        <rect x="16" y="80" width="172" height="10" rx="5" fill={accent}/>
        <rect x="16" y="68" width="172" height="10" rx="5" fill={accent} opacity=".85"/>
        {/* flat deck */}
        <rect x="24" y="54" width="156" height="14" rx="2" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1"/>
        {/* bimini top */}
        <rect x="60" y="30" width="84" height="6" rx="3" fill={trim}/>
        <line x1="64" y1="36" x2="64" y2="54" stroke={trim} strokeWidth="2"/>
        <line x1="140" y1="36" x2="140" y2="54" stroke={trim} strokeWidth="2"/>
        {/* railing */}
        {[30,50,70,90,110,130,150,170].map(function(x){ return <line key={x} x1={x} y1="48" x2={x} y2="54" stroke="#fff" strokeWidth="1.5"/>; })}
      </g>}

      {t==="trawler" && <g>
        {/* sturdy displacement hull */}
        <path d="M 12 90 L 24 60 L 184 60 L 192 90 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        <rect x="14" y="84" width="178" height="4" fill={accent}/>
        {/* tall wheelhouse */}
        <rect x="44" y="34" width="60" height="26" rx="2" fill="#455A64" stroke={trim} strokeWidth="1"/>
        {[50,66,82,96].map(function(x){ return <rect key={x} x={x} y="38" width="10" height="10" rx="1" fill="#90CAF9" opacity=".8"/>; })}
        {/* mast + boom (trawler net arm) */}
        <line x1="120" y1="60" x2="120" y2="20" stroke={trim} strokeWidth="2.5"/>
        <line x1="120" y1="28" x2="170" y2="50" stroke={trim} strokeWidth="2"/>
        <circle cx="120" cy="20" r="3" fill={accent}/>
      </g>}

      {t==="catamaran" && <g>
        {/* twin hulls */}
        <path d="M 14 88 L 24 70 L 70 70 L 64 88 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        <path d="M 136 88 L 130 70 L 176 70 L 186 88 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        {/* bridge deck spanning both */}
        <rect x="50" y="56" width="100" height="16" rx="3" fill={accent} stroke={trim} strokeWidth="1"/>
        {/* cabin */}
        <rect x="74" y="40" width="52" height="16" rx="3" fill="#ECEFF1" stroke={trim} strokeWidth="1"/>
        {[80,94,108].map(function(x){ return <rect key={x} x={x} y="43" width="9" height="9" rx="1" fill="#006064" opacity=".7"/>; })}
        {/* mast */}
        <line x1="100" y1="40" x2="100" y2="14" stroke={trim} strokeWidth="2"/>
      </g>}

      {t==="speedboat" && <g>
        {/* long sleek go-fast hull */}
        <path d="M 10 84 L 40 70 L 180 72 L 196 82 L 40 86 Z" fill={"url(#hull_"+boat.id+")"} stroke={trim} strokeWidth="1.5"/>
        {/* racing stripe */}
        <path d="M 14 80 L 188 78 L 188 81 L 16 83 Z" fill={accent}/>
        {/* low cockpit */}
        <path d="M 60 70 L 76 60 L 120 60 L 128 70 Z" fill="#263238" stroke={trim} strokeWidth="1"/>
        <path d="M 78 62 L 116 62 L 120 68 L 74 68 Z" fill="#90CAF9" opacity=".7"/>
        {/* number on hull */}
        <text x="150" y="80" fontSize="9" fontWeight="bold" fill={accent}>7</text>
      </g>}
    </svg>
  );
}

// ─── CHARACTER SVG (detailed, proportional) ───────────────────────────────────
// Hair is split into parts so it layers correctly:
//   part "fall"     – long hair that hangs down the BACK (drawn behind the body)
//   part "top"      – crown, bangs, ties/buns/braids (drawn on top, front view)
//   part "backfull" – full back-of-head hair for the rotated rear view
function Hair({ cfg, W, H, cx, part }) {
  const p = curHairStyle(cfg);
  const col = cfg.hairColor || "#2C1A0A";
  const hi = shadeHex(col, 26), lo = shadeHex(col, -26);
  const headCy = H*.17, hrx = W*.30, hry = H*.13, top = H*.035;
  const vol = p.vol || 1;
  const t = p.tie;
  const fall = p.len>=5 ? H*.52 : p.len===4 ? H*.38 : p.len===3 ? H*.30 : 0;

  // The long mane that hangs down the back. Used behind the body (front view)
  // and on top of the back (rear view).
  function fallEls(key) {
    const e = [];
    if (p.tie==="bald" || fall<=0) return e;
    const ow = hrx*1.30*vol, bw = (p.tex===2) ? hrx*1.15*vol : hrx*1.0*vol;
    e.push(<path key={key+"L"} d={`M ${cx-hrx*1.0},${headCy-hry*.2} Q ${cx-ow},${(headCy+fall)/2} ${cx-bw},${fall} Q ${cx},${fall+H*.02} ${cx+bw},${fall} Q ${cx+ow},${(headCy+fall)/2} ${cx+hrx*1.0},${headCy-hry*.2} Q ${cx},${headCy+hry*.4} ${cx-hrx*1.0},${headCy-hry*.2} Z`} fill={col}/>);
    e.push(<path key={key+"sh"} d={`M ${cx},${headCy} Q ${cx-bw*.55},${(headCy+fall)/2} ${cx-bw*.4},${fall} L ${cx+bw*.4},${fall} Q ${cx+bw*.55},${(headCy+fall)/2} ${cx},${headCy} Z`} fill={lo} opacity=".55"/>);
    if (p.tex>=1) for (let w=0; w<5; w++){ e.push(<circle key={key+"wv"+w} cx={cx-bw + (w*(2*bw)/4)} cy={fall} r={p.tex===2?W*.075:W*.055} fill={p.tex===2?col:hi} opacity=".9"/>); }
    return e;
  }

  if (part === "fall") return <g>{fallEls("f")}</g>;

  if (part === "backfull") {
    const e = [];
    if (p.tie==="bald") return <g/>;
    e.push.apply(e, fallEls("bf"));
    // full hair cap covering the whole back of the head (no face shows)
    e.push(<ellipse key="cap" cx={cx} cy={headCy-hry*.06} rx={hrx*1.06*vol} ry={hry*1.05} fill={col}/>);
    e.push(<ellipse key="caphi" cx={cx-hrx*.3} cy={headCy-hry*.3} rx={hrx*.4} ry={hry*.4} fill={hi} opacity=".4"/>);
    if (t==="afro") { e.length=0; e.push(<circle key="afb" cx={cx} cy={headCy-hry*.3} r={hrx*1.4*vol} fill={col}/>); for (let a=0;a<14;a++){ const ang=a/14*Math.PI*2; e.push(<circle key={"afp"+a} cx={cx+Math.cos(ang)*hrx*1.25*vol} cy={headCy-hry*.3+Math.sin(ang)*hrx*1.25*vol} r={hrx*.34} fill={a%2?hi:col}/>); } }
    if (t==="pony"||t==="sidepony") e.push(<path key="pn" d={`M ${cx},${top} Q ${cx+hrx*.4},${headCy+H*.16} ${cx},${headCy+H*.34}`} stroke={col} strokeWidth={W*.18} fill="none" strokeLinecap="round"/>);
    if (t==="pigtails") [-1,1].forEach(function(s){ e.push(<path key={"pgb"+s} d={`M ${cx+s*hrx*.8},${headCy} Q ${cx+s*hrx*1.3},${headCy+H*.12} ${cx+s*hrx*1.0},${headCy+H*.30}`} stroke={col} strokeWidth={W*.15} fill="none" strokeLinecap="round"/>); });
    if (t==="braid"||t==="sidebraid") for (let k=0;k<6;k++){ e.push(<ellipse key={"bbr"+k} cx={cx} cy={headCy+H*.04+k*H*.075} rx={W*.11} ry={W*.06} fill={k%2?hi:col}/>); }
    if (t==="bun"||t==="highbun"||t==="topknot"||t==="manbun") e.push(<circle key="bbun" cx={cx} cy={top+H*.0} r={W*.16} fill={col}/>);
    if (t==="spacebuns") [-1,1].forEach(function(s){ e.push(<circle key={"bsb"+s} cx={cx+s*hrx*.85} cy={top+H*.01} r={W*.13} fill={col}/>); });
    return <g>{e}</g>;
  }

  // part === "top": crown + bangs + ties on the front-facing head
  const els = [];
  if (p.tie === "bald") return <g><ellipse cx={cx} cy={headCy-hry*.55} rx={hrx*.5} ry={hry*.25} fill="rgba(255,255,255,.06)"/></g>;
  els.push(<path key="crown" d={`M ${cx-hrx*1.04},${headCy-hry*.05} Q ${cx-hrx*1.06},${top} ${cx},${top-H*.012} Q ${cx+hrx*1.06},${top} ${cx+hrx*1.04},${headCy-hry*.05} Q ${cx},${headCy-hry*.5} ${cx-hrx*1.04},${headCy-hry*.05} Z`} fill={col}/>);
  els.push(<ellipse key="crownhi" cx={cx-hrx*.4} cy={top+H*.02} rx={hrx*.34} ry={hry*.26} fill={hi} opacity=".5"/>);
  if (p.tie==="afro") {
    els.length = 0;
    els.push(<circle key="afro" cx={cx} cy={headCy-hry*.35} r={hrx*1.35*vol} fill={col}/>);
    for (let a=0;a<14;a++){ const ang=a/14*Math.PI*2; els.push(<circle key={"ap"+a} cx={cx+Math.cos(ang)*hrx*1.2*vol} cy={headCy-hry*.35+Math.sin(ang)*hrx*1.2*vol} r={hrx*.34} fill={a%2?hi:col}/>); }
  }
  if (p.bangs===1) els.push(<path key="bang" d={`M ${cx-hrx*.95},${headCy-hry*.35} Q ${cx},${headCy+hry*.28} ${cx+hrx*.95},${headCy-hry*.35} L ${cx+hrx*.95},${headCy-hry*.65} L ${cx-hrx*.95},${headCy-hry*.65} Z`} fill={col}/>);
  else if (p.bangs===2) els.push(<path key="bang" d={`M ${cx-hrx*1.0},${headCy-hry*.55} Q ${cx-hrx*.2},${headCy+hry*.05} ${cx+hrx*.98},${headCy-hry*.2} L ${cx+hrx*.98},${headCy-hry*.7} L ${cx-hrx*1.0},${headCy-hry*.7} Z`} fill={col}/>);
  else if (p.bangs===3) { els.push(<path key="bangL" d={`M ${cx},${headCy-hry*.7} Q ${cx-hrx*.7},${headCy-hry*.2} ${cx-hrx*.98},${headCy+hry*.05} L ${cx-hrx*.98},${headCy-hry*.7} Z`} fill={col}/>); els.push(<path key="bangR" d={`M ${cx},${headCy-hry*.7} Q ${cx+hrx*.7},${headCy-hry*.2} ${cx+hrx*.98},${headCy+hry*.05} L ${cx+hrx*.98},${headCy-hry*.7} Z`} fill={col}/>); }
  if (t==="pony" || t==="sidepony") { const px = t==="sidepony"? cx+hrx*.95 : cx; els.push(<ellipse key="ptie" cx={px} cy={t==="sidepony"?headCy:top+H*.02} rx={W*.05} ry={W*.05} fill={lo}/>); }
  if (t==="spacebuns") { [-1,1].forEach(function(s){ els.push(<circle key={"sb"+s} cx={cx+s*hrx*.85} cy={top+H*.01} r={W*.13} fill={col}/>); els.push(<circle key={"sbh"+s} cx={cx+s*hrx*.85} cy={top+H*.01} r={W*.13} fill="none" stroke={lo} strokeWidth="1.5"/>); }); }
  if (t==="bun" || t==="highbun" || t==="topknot" || t==="manbun") { const by = (t==="bun")? top+H*.0 : top-H*.02; els.push(<circle key="bun" cx={cx} cy={by} r={W*.16} fill={col}/>); els.push(<ellipse key="bunh" cx={cx-W*.05} cy={by-W*.04} rx={W*.07} ry={W*.05} fill={hi} opacity=".5"/>); if(t==="manbun"){ els.push(<circle key="mbring" cx={cx} cy={by} r={W*.16} fill="none" stroke={lo} strokeWidth="2"/>); } }
  if (t==="halfup") { els.push(<path key="hu" d={`M ${cx-hrx*.9},${headCy-hry*.2} Q ${cx},${top} ${cx+hrx*.9},${headCy-hry*.2}`} stroke={lo} strokeWidth={W*.05} fill="none"/>); els.push(<circle key="hub" cx={cx} cy={top+H*.01} r={W*.07} fill={col}/>); }
  if (t==="mohawk") els.push(<path key="moh" d={`M ${cx-W*.06},${headCy-hry*.2} L ${cx-W*.10},${top-H*.03} L ${cx+W*.10},${top-H*.03} L ${cx+W*.06},${headCy-hry*.2} Z`} fill={col}/>);
  if (t==="fauxhawk") els.push(<path key="fh" d={`M ${cx-W*.09},${top+H*.01} Q ${cx},${top-H*.04} ${cx+W*.09},${top+H*.01} L ${cx+W*.05},${top+H*.03} L ${cx-W*.05},${top+H*.03} Z`} fill={hi}/>);
  if (t==="spiky") { for (let k=0;k<7;k++){ const sx=cx-hrx*.9 + k*(hrx*1.8/6); els.push(<polygon key={"sp"+k} points={`${sx-W*.04},${top+H*.02} ${sx},${top-H*.04} ${sx+W*.04},${top+H*.02}`} fill={col}/>); } }
  if (t==="quiff" || t==="pomp") els.push(<path key="qf" d={`M ${cx-hrx*.95},${headCy-hry*.45} Q ${cx-hrx*.3},${top-H*.05} ${cx+hrx*.4},${headCy-hry*.5} L ${cx+hrx*.4},${headCy-hry*.2} L ${cx-hrx*.95},${headCy-hry*.2} Z`} fill={hi}/>);
  if (t==="flattop") els.push(<rect key="ft" x={cx-hrx*1.0} y={top-H*.01} width={hrx*2.0} height={hry*.5} fill={col}/>);
  if (t==="dreads") { for (let k=0;k<7;k++){ const dx=cx-hrx*.95 + k*(hrx*1.9/6); els.push(<rect key={"dr"+k} x={dx-W*.02} y={top} width={W*.04} height={H*.10} rx={W*.02} fill={k%2?hi:col}/>); } }
  if (t==="slick" || t==="comb") els.push(<path key="sk" d={`M ${cx-hrx*1.0},${headCy-hry*.55} Q ${cx},${headCy-hry*.85} ${cx+hrx*1.0},${headCy-hry*.45}`} stroke={lo} strokeWidth={W*.02} fill="none"/>);
  return <g>{els}</g>;
}

// Draws the chosen pants/shorts/skirt over bare skin legs, with cut/length/
// width and accents (rips, cargo pockets, cuffs, overall straps, camo, pleats).
function LegsLayer({ cfg, W, H, cx }) {
  const p = curPantsStyle(cfg);
  const fab = cfg.pants || "#37474F";
  const fabHi = shadeHex(fab, 22), fabLo = shadeHex(fab, -28), skin = cfg.skin || "#F5C6A0";
  const thighTop = H*.52, hipY = H*.50, ankleY = H*.92;
  const els = [];
  // bare legs underneath (so shorts/skirts reveal skin)
  els.push(<rect key="skL" x={cx-W*.24} y={thighTop} width={W*.20} height={ankleY-thighTop} rx={W*.05} fill={skin}/>);
  els.push(<rect key="skR" x={cx+W*.04} y={thighTop} width={W*.20} height={ankleY-thighTop} rx={W*.05} fill={skin}/>);

  function bottomY(){ if(p.cut==="shorts"){ return p.len==="mini"? H*.66 : H*.71; } if(p.cut==="skirt"){ return p.len==="maxi"? H*.90 : p.len==="pencil"? H*.84 : H*.70; } return p.len==="capri"? H*.80 : p.len==="crop"? H*.84 : ankleY; }
  function botHalf(){ switch(p.wid){ case "skinny": return W*.085; case "wide": return W*.135; case "flare": return W*.16; case "boot": return W*.12; default: return W*.105; } }
  const bY = bottomY(), bh = botHalf(), th = W*.11;

  if (p.cut==="skirt") {
    const sw = p.wid==="flare"? W*.40 : p.wid==="skinny"? W*.24 : W*.34;
    els.push(<path key="skirt" d={`M ${cx-W*.30},${hipY} L ${cx+W*.30},${hipY} L ${cx+sw},${bY} L ${cx-sw},${bY} Z`} fill={fab}/>);
    els.push(<path key="skirtHi" d={`M ${cx-W*.30},${hipY} L ${cx-W*.06},${hipY} L ${cx-sw*.5},${bY} L ${cx-sw},${bY} Z`} fill={fabHi} opacity=".35"/>);
    if (p.acc==="pleat") { for (let k=0;k<7;k++){ const fx=cx-sw + k*(2*sw/6); els.push(<line key={"pl"+k} x1={cx-W*.26+k*(W*.52/6)} y1={hipY} x2={fx} y2={bY} stroke={fabLo} strokeWidth="1.4" opacity=".7"/>); } }
    els.push(<rect key="hem" x={cx-sw} y={bY-H*.012} width={sw*2} height={H*.012} fill={fabLo}/>);
  } else {
    [-1,1].forEach(function(s){
      const xc = cx + s*W*.145;
      els.push(<polygon key={"leg"+s} points={`${xc-th},${thighTop} ${xc+th},${thighTop} ${xc+bh},${bY} ${xc-bh},${bY}`} fill={fab}/>);
      if (s<0) els.push(<polygon key="legHi" points={`${xc-th},${thighTop} ${xc-th*.3},${thighTop} ${xc-bh*.3},${bY} ${xc-bh},${bY}`} fill={fabHi} opacity=".35"/>);
      if (p.acc==="rip") { els.push(<rect key={"rip"+s} x={xc-th*.7} y={H*.70} width={th*1.4} height={H*.02} fill={skin}/>); }
      if (p.acc==="cargo") { els.push(<rect key={"cg"+s} x={xc + (s<0? -bh : bh*.2)} y={H*.62} width={W*.06} height={H*.06} rx={W*.01} fill={fabLo}/>); }
      if (p.acc==="cuff") { els.push(<rect key={"cf"+s} x={xc-bh} y={bY-H*.022} width={bh*2} height={H*.022} fill={fabLo}/>); }
      if (p.acc==="track") { els.push(<line key={"tk"+s} x1={xc+ (s<0?-th*.7:th*.7)} y1={thighTop} x2={xc+(s<0?-bh*.7:bh*.7)} y2={bY} stroke="#fff" strokeWidth="2" opacity=".7"/>); }
      if (p.acc==="pleat") { els.push(<line key={"pp"+s} x1={xc} y1={thighTop} x2={xc} y2={bY} stroke={fabLo} strokeWidth="1.4" opacity=".7"/>); }
      if (p.acc==="camo") { for (let c=0;c<5;c++){ els.push(<ellipse key={"cm"+s+c} cx={xc-th*.5+Math.random()*th} cy={thighTop+ (c+0.5)*((bY-thighTop)/5)} rx={W*.03} ry={W*.025} fill={shadeHex(fab, c%2?-40:30)} opacity=".8"/>); } }
    });
  }
  // belt for trousers/shorts
  if (p.cut!=="skirt") { els.push(<rect key="belt" x={cx-W*.28} y={H*.50} width={W*.56} height={H*.03} rx={W*.01} fill="#5D4037"/>); els.push(<rect key="buck" x={cx-W*.04} y={H*.485} width={W*.08} height={H*.04} rx={W*.01} fill="#FFD54F"/>); }
  // overall straps over the torso
  if (p.acc==="overall") { [-1,1].forEach(function(s){ els.push(<rect key={"ov"+s} x={cx+s*W*.16-W*.03} y={H*.33} width={W*.06} height={H*.19} fill={fab}/>); }); els.push(<rect key="bib" x={cx-W*.14} y={H*.42} width={W*.28} height={H*.10} rx={W*.02} fill={fab}/>); }
  return <g>{els}</g>;
}

function CharSVG({ cfg, size=90, facing="front" }) {
  const W=size, H=size*2.6;
  const cx=W/2;
  const back = facing === "back";
  const hatted = cfg.hat && cfg.hat !== "none";
  // For boys, a hat tucks away ALL the hair (none pokes out).
  const hideHair = hatted && cfg.gender === "boy";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible",display:"block"}}>
      {/* Shadow */}
      <ellipse cx={cx} cy={H-.5} rx={W*.38} ry={5} fill="rgba(0,0,0,.18)"/>
      {/* Long hair that hangs down the BACK is drawn behind the body (front view only) */}
      {!back && !hideHair && <Hair cfg={cfg} W={W} H={H} cx={cx} part="fall"/>}
      {/* Shoes */}
      <ellipse cx={cx-W*.16} cy={H*0.945} rx={W*.18} ry={W*.08} fill="#1A1A1A"/>
      <ellipse cx={cx+W*.16} cy={H*0.945} rx={W*.18} ry={W*.08} fill="#1A1A1A"/>
      {/* Legs + chosen pants/shorts/skirt style */}
      <LegsLayer cfg={cfg} W={W} H={H} cx={cx}/>
      {/* Torso */}
      <rect x={cx-W*.28} y={H*.32} width={W*.56} height={H*.21} rx={W*.07} fill={cfg.shirt}/>
      {/* Shirt shading */}
      <rect x={cx-W*.28} y={H*.32} width={W*.18} height={H*.21} rx={W*.07} fill="rgba(255,255,255,.08)"/>
      {/* Collar (front only) */}
      {!back && <polygon points={`${cx-W*.06},${H*.32} ${cx},${H*.38} ${cx+W*.06},${H*.32}`} fill="rgba(255,255,255,.15)"/>}
      {/* Left arm */}
      <rect x={cx-W*.46} y={H*.33} width={W*.20} height={H*.30} rx={W*.06} fill={cfg.skin}/>
      <ellipse cx={cx-W*.36} cy={H*.63} rx={W*.09} ry={W*.07} fill={cfg.skin}/>
      {/* Right arm */}
      <rect x={cx+W*.26} y={H*.33} width={W*.20} height={H*.30} rx={W*.06} fill={cfg.skin}/>
      <ellipse cx={cx+W*.36} cy={H*.63} rx={W*.09} ry={W*.07} fill={cfg.skin}/>
      {/* Neck */}
      <rect x={cx-W*.09} y={H*.23} width={W*.18} height={H*.11} rx={W*.05} fill={cfg.skin}/>
      {/* Head */}
      <ellipse cx={cx} cy={H*.17} rx={W*.30} ry={H*.13} fill={cfg.skin}/>
      {/* Ears */}
      <ellipse cx={cx-W*.28} cy={H*.17} rx={W*.06} ry={W*.08} fill={cfg.skin}/>
      <ellipse cx={cx+W*.28} cy={H*.17} rx={W*.06} ry={W*.08} fill={cfg.skin}/>
      {/* Hair on the head (tucked away under a hat for boys) */}
      {!hideHair && (back ? <Hair cfg={cfg} W={W} H={H} cx={cx} part="backfull"/> : <Hair cfg={cfg} W={W} H={H} cx={cx} part="top"/>)}
      {/* Hat — crown covers the top of the head so it hides the hair underneath */}
      {cfg.hat==="cap"&&<>
        <path d={`M ${cx-W*.31},${H*.165} Q ${cx-W*.33},${H*.02} ${cx},${H*.012} Q ${cx+W*.33},${H*.02} ${cx+W*.31},${H*.165} Q ${cx},${H*.10} ${cx-W*.31},${H*.165} Z`} fill={cfg.hatColor}/>
        <ellipse cx={cx} cy={H*.07} rx={W*.12} ry={H*.04} fill="rgba(255,255,255,.12)"/>
        {!back && <ellipse cx={cx+W*.16} cy={H*.135} rx={W*.30} ry={H*.03} fill={shadeHex(cfg.hatColor,-14)}/>}
        {!back && <circle cx={cx} cy={H*.045} r={W*.025} fill={shadeHex(cfg.hatColor,-22)}/>}
      </>}
      {cfg.hat==="wide"&&<>
        <path d={`M ${cx-W*.28},${H*.13} Q ${cx-W*.30},${H*.0} ${cx},${H*-.01} Q ${cx+W*.30},${H*.0} ${cx+W*.28},${H*.13} Q ${cx},${H*.07} ${cx-W*.28},${H*.13} Z`} fill={cfg.hatColor}/>
        <ellipse cx={cx} cy={H*.145} rx={W*.50} ry={H*.045} fill={shadeHex(cfg.hatColor,-12)}/>
        <ellipse cx={cx} cy={H*.135} rx={W*.30} ry={H*.03} fill={cfg.hatColor}/>
        <rect x={cx-W*.30} y={H*.115} width={W*.60} height={H*.018} fill={shadeHex(cfg.hatColor,-30)}/>
      </>}
      {cfg.hat==="captain"&&<>
        <path d={`M ${cx-W*.30},${H*.10} Q ${cx-W*.31},${H*.02} ${cx},${H*.018} Q ${cx+W*.31},${H*.02} ${cx+W*.30},${H*.10} L ${cx+W*.30},${H*.10} L ${cx-W*.30},${H*.10} Z`} fill="#1A237E"/>
        <rect x={cx-W*.31} y={H*.095} width={W*.62} height={H*.045} rx={W*.01} fill="#0D1657"/>
        {!back && <rect x={cx-W*.10} y={H*.10} width={W*.20} height={H*.035} fill="#FFD700"/>}
        {!back && <ellipse cx={cx} cy={H*.055} rx={W*.06} ry={W*.045} fill="#FFD700"/>}
        {!back && <ellipse cx={cx+W*.18} cy={H*.155} rx={W*.20} ry={H*.022} fill="#0D1657"/>}
      </>}
      {/* Face (front only) */}
      {!back && <>
        <ellipse cx={cx-W*.10} cy={H*.165} rx={W*.065} ry={W*.05} fill="white"/>
        <ellipse cx={cx+W*.10} cy={H*.165} rx={W*.065} ry={W*.05} fill="white"/>
        <circle cx={cx-W*.09} cy={H*.167} r={W*.035} fill="#222"/>
        <circle cx={cx+W*.11} cy={H*.167} r={W*.035} fill="#222"/>
        <circle cx={cx-W*.075} cy={H*.158} r={W*.012} fill="white"/>
        <circle cx={cx+W*.125} cy={H*.158} r={W*.012} fill="white"/>
        <ellipse cx={cx} cy={H*.19} rx={W*.03} ry={W*.02} fill="rgba(0,0,0,.12)"/>
        <path d={`M ${cx-W*.08},${H*.21} Q ${cx},${H*.225} ${cx+W*.08},${H*.21}`} stroke="#444" strokeWidth={W*.025} fill="none" strokeLinecap="round"/>
      </>}
    </svg>
  );
}

// A character you can spin by dragging. Turning it like a turntable: the avatar
// foreshortens (scaleX = cos angle) and, once you pass the side, swaps to the
// back view — revealing long hair flowing down the back.
function RotatableChar({ cfg, size=70 }) {
  const [angle, setAngle] = useState(0);
  const st = useRef({ drag:false, last:0 });
  const W = size, H = size*2.6;
  function down(e){ e.preventDefault(); st.current.drag=true; st.current.last=e.clientX; try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(_){} }
  function move(e){ if(!st.current.drag) return; e.preventDefault(); const dx=e.clientX-st.current.last; st.current.last=e.clientX; setAngle(a=>a+dx*1.2); }
  function up(e){ st.current.drag=false; try{ e.currentTarget.releasePointerCapture(e.pointerId); }catch(_){} }
  const a = ((angle % 360) + 360) % 360;
  const rad = a * Math.PI/180;
  const showBack = a > 90 && a < 270;
  // Foreshorten toward the edges, but keep real body depth so the side view
  // isn't paper-thin — width never drops below ~55% of the front.
  const sx = 0.55 + 0.45*Math.abs(Math.cos(rad));
  const label = (a<=45||a>=315) ? "Front" : (a>=135&&a<=225) ? "Back" : "Side";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
           style={{ width:W, height:H, touchAction:"none", cursor:"grab", userSelect:"none", display:"flex", justifyContent:"center" }}>
        <div style={{ transform:`scaleX(${sx})`, transformOrigin:"center", transition: st.current.drag ? "none" : "transform .12s linear" }}>
          <CharSVG cfg={cfg} size={size} facing={showBack ? "back" : "front"}/>
        </div>
      </div>
      <div style={{ fontSize:9, color:"#607D8B", letterSpacing:1 }}>← DRAG TO SPIN · {label} →</div>
    </div>
  );
}

// ─── 3D CHARACTER (Three.js) — reflects the chosen look, spins by dragging ────
function build3DCharacter(cfg) {
  const g = new THREE.Group();
  const skin = hexToNum(cfg.skin || "#F5C6A0");
  const shirt = hexToNum(cfg.shirt || "#2C3E50");
  const pants = hexToNum(cfg.pants || "#37474F");
  const hairC = hexToNum(cfg.hairColor || "#2C1A0A");
  const skinMat = new THREE.MeshPhongMaterial({ color: skin });
  const shirtMat = new THREE.MeshPhongMaterial({ color: shirt });
  const pantsMat = new THREE.MeshPhongMaterial({ color: pants });
  const hairMat = new THREE.MeshPhongMaterial({ color: hairC, shininess: 12 });
  const hs = curHairStyle(cfg), hp = curPantsStyle(cfg);
  const hatted = cfg.hat && cfg.hat !== "none";
  const hideHair = hatted && cfg.gender === "boy";

  function box(w,h,d,mat,x,y,z){ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat); m.position.set(x,y,z); g.add(m); return m; }

  // feet
  [-1,1].forEach(function(s){ box(0.5,0.26,0.95, new THREE.MeshPhongMaterial({color:0x1c1c1c}), s*0.30, 0.13, 0.12); });

  // legs / pants / skirt
  const legW = hp.wid==="skinny"?0.42 : hp.wid==="wide"||hp.wid==="flare"?0.62 : 0.5;
  if (hp.cut==="skirt") {
    [-1,1].forEach(function(s){ box(0.42,1.5,0.42, skinMat, s*0.28, 0.95, 0); });
    const rad = hp.wid==="flare"?1.15 : hp.wid==="skinny"?0.7 : 0.95;
    const sk = new THREE.Mesh(new THREE.ConeGeometry(rad, 1.4, 18), pantsMat);
    sk.position.set(0, 1.05, 0); g.add(sk);
  } else if (hp.cut==="shorts") {
    [-1,1].forEach(function(s){ box(legW,0.75,0.52, pantsMat, s*0.28, 1.32, 0); box(0.42,0.75,0.42, skinMat, s*0.28, 0.57, 0); });
  } else {
    const botY = hp.len==="capri"?0.65 : hp.len==="crop"?0.5 : 0.2;
    [-1,1].forEach(function(s){ const h=1.7-botY; box(legW,h,0.52, pantsMat, s*0.28, botY + h/2, 0); });
    if (hp.len==="capri"||hp.len==="crop") [-1,1].forEach(function(s){ box(0.42, botY, 0.42, skinMat, s*0.28, botY/2, 0); });
  }

  // torso (girls a touch narrower), arms, neck
  const torsoW = cfg.gender==="girl" ? 1.0 : 1.15;
  box(torsoW,1.35,0.62, shirtMat, 0, 2.4, 0);
  [-1,1].forEach(function(s){ box(0.3,1.4,0.34, skinMat, s*(torsoW/2+0.18), 2.45, 0); });
  box(0.34,0.3,0.34, skinMat, 0, 3.15, 0);

  // head + eyes
  const headY = 3.7;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 16), skinMat); head.position.set(0,headY,0); g.add(head);
  [-1,1].forEach(function(s){ const w=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,8), new THREE.MeshPhongMaterial({color:0xffffff})); w.position.set(s*0.17, headY+0.05, 0.44); g.add(w); const e=new THREE.Mesh(new THREE.SphereGeometry(0.05,8,8), new THREE.MeshPhongMaterial({color:0x111111})); e.position.set(s*0.17, headY+0.05, 0.49); g.add(e); });
  // ears
  [-1,1].forEach(function(s){ const ear=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8), skinMat); ear.position.set(s*0.48, headY, 0); g.add(ear); });

  // hair
  if (!hideHair && hs.tie!=="bald") {
    const len = hs.len, tie = hs.tie, vol = hs.vol||1;
    if (tie==="afro") {
      const af=new THREE.Mesh(new THREE.SphereGeometry(0.78*vol,16,14), hairMat); af.position.set(0,headY+0.18,-0.02); g.add(af);
    } else {
      // crown cap covering top + back of the head (face stays clear)
      const cap=new THREE.Mesh(new THREE.SphereGeometry(0.54,18,14), hairMat); cap.scale.set(1.04,1.0,1.06); cap.position.set(0, headY+0.12, -0.06); g.add(cap);
      // back-of-head fill so there's no bald patch behind
      const bk=new THREE.Mesh(new THREE.SphereGeometry(0.5,16,12), hairMat); bk.scale.set(1.02,1.0,0.7); bk.position.set(0, headY, -0.22); g.add(bk);
    }
    // long mane down the back
    if (len>=4 && tie!=="afro") {
      const maneLen = len>=5 ? 2.4 : 1.5;
      const mane=new THREE.Mesh(new THREE.BoxGeometry(0.95*vol, maneLen, 0.28), hairMat);
      mane.position.set(0, headY-0.2 - maneLen/2 + 0.35, -0.42); g.add(mane);
      // rounded bottom
      const tip=new THREE.Mesh(new THREE.CylinderGeometry(0.47*vol,0.36*vol,0.3,12), hairMat); tip.position.set(0, headY-0.2-maneLen+0.35, -0.42); g.add(tip);
    }
    // ties
    if (tie==="bun"||tie==="highbun"||tie==="topknot"||tie==="manbun") { const b=new THREE.Mesh(new THREE.SphereGeometry(0.26,12,12), hairMat); b.position.set(0, headY+0.55, tie==="bun"?-0.2:-0.05); g.add(b); }
    if (tie==="pony"||tie==="sidepony") { const pcyl=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.18,1.3,10), hairMat); pcyl.position.set(tie==="sidepony"?0.4:0, headY-0.2, -0.4); pcyl.rotation.x=0.25; g.add(pcyl); }
    if (tie==="pigtails") [-1,1].forEach(function(s){ const pg=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.16,1.0,10), hairMat); pg.position.set(s*0.55, headY-0.35, -0.15); pg.rotation.z=s*0.2; g.add(pg); });
    if (tie==="spacebuns") [-1,1].forEach(function(s){ const sb=new THREE.Mesh(new THREE.SphereGeometry(0.2,10,10), hairMat); sb.position.set(s*0.45, headY+0.5, -0.05); g.add(sb); });
    if (tie==="spiky") for(let k=0;k<6;k++){ const sp=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.4,6), hairMat); sp.position.set(-0.3+k*0.12, headY+0.55, -0.05); g.add(sp); }
    if (tie==="mohawk") { const mh=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.5,0.9), hairMat); mh.position.set(0, headY+0.55, -0.05); g.add(mh); }
    if (tie==="braid"||tie==="sidebraid") for(let k=0;k<5;k++){ const br=new THREE.Mesh(new THREE.SphereGeometry(0.17,10,10), hairMat); br.position.set(0, headY-0.1-k*0.32, -0.45); g.add(br); }
  }

  // hat (covers the head)
  if (hatted) {
    const hatC = hexToNum(cfg.hatColor || "#8B0000");
    const hatMat = new THREE.MeshPhongMaterial({ color: hatC });
    if (cfg.hat==="cap") {
      const dome=new THREE.Mesh(new THREE.SphereGeometry(0.58,18,12,0,Math.PI*2,0,Math.PI/2), hatMat); dome.position.set(0, headY+0.16, -0.02); g.add(dome);
      const brim=new THREE.Mesh(new THREE.BoxGeometry(0.95,0.08,0.55), hatMat); brim.position.set(0, headY+0.18, 0.5); g.add(brim);
    } else if (cfg.hat==="wide") {
      const dome=new THREE.Mesh(new THREE.SphereGeometry(0.55,18,12,0,Math.PI*2,0,Math.PI/2), hatMat); dome.position.set(0, headY+0.18, 0); g.add(dome);
      const brim=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.15,0.07,24), hatMat); brim.position.set(0, headY+0.2, 0); g.add(brim);
    } else if (cfg.hat==="captain") {
      const navy=new THREE.MeshPhongMaterial({color:0x1A237E});
      const crown=new THREE.Mesh(new THREE.CylinderGeometry(0.56,0.56,0.4,20), navy); crown.position.set(0, headY+0.35, 0); g.add(crown);
      const top=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.6,0.06,20), navy); top.position.set(0, headY+0.56, 0); g.add(top);
      const brim=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.07,0.7), navy); brim.position.set(0, headY+0.16, 0.45); g.add(brim);
      const em=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,10), new THREE.MeshPhongMaterial({color:0xFFD700})); em.position.set(0, headY+0.3, 0.55); g.add(em);
    }
  }
  return g;
}

function Char3D({ cfg, width=160, height=300 }) {
  const mount = useRef(null);
  const refs = useRef({});
  const rot = useRef({ y: 0.5, drag: false, last: 0 });
  useEffect(function(){
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0D1B2A);
    const camera = new THREE.PerspectiveCamera(42, width/height, 0.1, 100);
    camera.position.set(0, 2.2, 8.6); camera.lookAt(0, 2.0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    if (mount.current) mount.current.appendChild(renderer.domElement);
    renderer.domElement.style.pointerEvents = "none";
    const key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(4,7,7); scene.add(key);
    const fill = new THREE.DirectionalLight(0x8FB3D9, 0.5); fill.position.set(-5,3,-4); scene.add(fill);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    refs.current = { scene: scene, camera: camera, renderer: renderer, charG: null };
    let raf;
    (function animate(){ raf = requestAnimationFrame(animate); if(!rot.current.drag) rot.current.y += 0.005; if(refs.current.charG) refs.current.charG.rotation.y = rot.current.y; renderer.render(scene, camera); })();
    return function(){ cancelAnimationFrame(raf); renderer.dispose(); if(renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); };
  }, []);
  // rebuild when the look changes
  useEffect(function(){
    const r = refs.current; if(!r.scene) return;
    if (r.charG) { r.scene.remove(r.charG); r.charG.traverse(function(o){ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); }); }
    const cg = build3DCharacter(cfg); cg.position.y = -0.1; r.charG = cg; r.scene.add(cg);
  }, [cfg]);
  function down(e){ rot.current.drag=true; rot.current.last=e.clientX; try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(_){} }
  function move(e){ if(!rot.current.drag) return; const dx=e.clientX-rot.current.last; rot.current.last=e.clientX; rot.current.y += dx*0.01; }
  function up(e){ rot.current.drag=false; try{ e.currentTarget.releasePointerCapture(e.pointerId); }catch(_){} }
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} style={{ width:width, height:height, touchAction:"none", cursor:"grab", borderRadius:10, overflow:"hidden", background:"#0D1B2A" }}>
        <div ref={mount} style={{ width:width, height:height }}/>
      </div>
      <div style={{ fontSize:9, color:"#607D8B", letterSpacing:1 }}>← DRAG TO SPIN (3D) →</div>
    </div>
  );
}


// ─── PHONE SYSTEM ─────────────────────────────────────────────────────────────

const PHONE_CASES = [
  { id:"default",   name:"Black",        style:{ background:"#1A1A1A",border:"2px solid #333" } },
  { id:"ocean",     name:"Ocean Blue",   style:{ background:"linear-gradient(160deg,#0D47A1,#1565C0,#29B6F6)",border:"2px solid #1565C0" } },
  { id:"coral",     name:"Coral Reef",   style:{ background:"linear-gradient(160deg,#FF6B6B,#FF8E53,#FFA07A)",border:"2px solid #FF5722" } },
  { id:"forest",    name:"Deep Forest",  style:{ background:"linear-gradient(160deg,#1B5E20,#2E7D32,#43A047)",border:"2px solid #2E7D32" } },
  { id:"sunset",    name:"Sunset",       style:{ background:"linear-gradient(160deg,#FF6F00,#F57F17,#E91E63)",border:"2px solid #E91E63" } },
  { id:"galaxy",    name:"Galaxy",       style:{ background:"linear-gradient(160deg,#0A0A2A,#1A0A3A,#2A0A5A)",border:"2px solid #7B1FA2" } },
  { id:"marble",    name:"White Marble", style:{ background:"linear-gradient(135deg,#F5F5F5,#E0E0E0,#BDBDBD)",border:"2px solid #9E9E9E" } },
  { id:"flowers",   name:"Flowers",      style:{ background:"linear-gradient(135deg,#F48FB1,#CE93D8,#FFCC80)",border:"2px solid #E91E63" } },
  { id:"rocks",     name:"Rocky Stone",  style:{ background:"linear-gradient(135deg,#546E7A,#455A64,#607D8B)",border:"2px solid #37474F" } },
  { id:"gold",      name:"Gold",         style:{ background:"linear-gradient(135deg,#FFD700,#FFA000,#FF6F00)",border:"2px solid #FF8F00" } },
  { id:"camo",      name:"Camo",         style:{ background:"linear-gradient(135deg,#33691E,#558B2F,#827717)",border:"2px solid #558B2F" } },
];

const AI_REPLIES = {
  "Captain Dave": [
    "Hey! Yeah I got a good bite going this morning. Tarpon were jumping all around the inlet at dawn.",
    "Water temp is perfect right now — 81 degrees. The reef fish are stacked up deep.",
    "I would head out to the reef if you can. Big goliath grouper were spotted yesterday.",
    "Wind is dying down this afternoon. Perfect time to get offshore.",
    "You should try a live goggle eye on a 5/0 circle hook. That is what I have been using.",
  ],
  "Mom": [
    "Sweetie are you eating enough out there? Make sure you are cooking those fish properly!",
    "Your father says hi. He wants to know if you caught anything big yet.",
    "The weather looks a little rough. Please stay safe on that boat honey.",
    "Call me when you get back to the dock. I worry about you out there alone.",
    "I made your favorite fish chowder recipe. I will send it to you!",
  ],
  "Jake": [
    "BRO that goliath grouper you tagged yesterday is going viral on FishGram! 2000 likes already!",
    "Dude I am heading out to the reef tomorrow. You in? I got fresh pilchards from the bait shop.",
    "That snapper bite has been insane lately. You have to get out there.",
    "Check the tides before you go out. Outgoing tide has been best this week.",
    "Heard there was a big cobia spotted near the buoy yesterday. Get out there!",
  ],
  "Bait Shop": [
    "We just got in fresh goggle eyes this morning. Come in before they sell out — they go fast!",
    "We have live pilchards, pinfish, and shrimp in stock today. Plenty available.",
    "Offshore bite is great right now. We recommend live baits for the grouper.",
    "New shipment of tackle just arrived. Lots of good jigs and rigs in stock.",
    "We are open 5am to 6pm today. Come on in and we will set you up right.",
  ],
};

function CallScreen(props) {
  var contactName = props.contactName;
  var darkMode = props.darkMode;
  var onEnd = props.onEnd;

  var phaseState     = useState("ringing");
  var phase          = phaseState[0];
  var setPhase       = phaseState[1];
  var ringState      = useState(10);
  var ringTimer      = ringState[0];
  var setRingTimer   = ringState[1];
  var transcriptState= useState([]);
  var transcript     = transcriptState[0];
  var setTranscript  = transcriptState[1];
  var typingState    = useState(false);
  var aiTyping       = typingState[0];
  var setAiTyping    = typingState[1];
  var mutedState     = useState(false);
  var muted          = mutedState[0];
  var setMuted       = mutedState[1];
  var speakerState   = useState(true);
  var speaker        = speakerState[0];
  var setSpeaker     = speakerState[1];
  var listenState    = useState(false);
  var listening      = listenState[0];
  var setListening   = listenState[1];
  var voiceState     = useState("");
  var voiceLabel     = voiceState[0];
  var setVoiceLabel  = voiceState[1];
  var timeState      = useState(0);
  var callTime       = timeState[0];
  var setCallTime    = timeState[1];
  var inputState     = useState("");
  var textInput      = inputState[0];
  var setTextInput   = inputState[1];

  var endRef       = useRef(null);
  var recognRef    = useRef(null);
  var callTimerRef = useRef(null);
  var ringRef      = useRef(null);
  var bg = darkMode ? "#111" : "#F0F0F0";

  var PERSONAS = {
    "Captain Dave": "You are Captain Dave, a veteran fishing guide who has fished the Florida coast for 30 years. Speak casually and enthusiastically. Give specific practical fishing tips in 2-3 sentences.",
    "Mom": "You are a caring mom. You worry about safety on the water but are supportive. Keep responses warm and motherly, 2 sentences max.",
    "Jake": "You are Jake, an enthusiastic fishing buddy who is always hyped. Use casual bro-speak. Give fun fishing advice in 2 sentences.",
    "Bait Shop": "You are the owner of a bait shop on the Florida coast. Give expert, specific bait and tackle advice to help customers catch fish. 2-3 sentences, helpful and knowledgeable."
  };

  function fmt(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function speak(text) {
    if (!speaker || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var utt = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();
    var preferred = null;
    for (var vi = 0; vi < voices.length; vi++) {
      var nm = voices[vi].name.toLowerCase();
      if (contactName === "Mom") {
        if (nm.indexOf("female") >= 0 || nm.indexOf("samantha") >= 0 || nm.indexOf("karen") >= 0) { preferred = voices[vi]; break; }
      } else {
        if (nm.indexOf("male") >= 0 || nm.indexOf("daniel") >= 0 || nm.indexOf("alex") >= 0) { preferred = voices[vi]; break; }
      }
    }
    if (!preferred && voices.length > 0) preferred = voices[0];
    if (preferred) utt.voice = preferred;
    utt.rate = 0.95;
    utt.pitch = contactName === "Mom" ? 1.2 : 0.9;
    utt.volume = 1.0;
    window.speechSynthesis.speak(utt);
  }

  function askAI(userMessage) {
    setAiTyping(true);
    var systemPrompt = PERSONAS[contactName] || "You are a helpful fishing contact. Give short practical answers in 2 sentences.";
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }]
      })
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      var reply = (data.content && data.content[0] && data.content[0].text) || "Sorry, I didn't catch that, say it again?";
      setTranscript(function (t) { return t.concat([{ from: contactName, text: reply }]); });
      speak(reply);
      setAiTyping(false);
    }).catch(function () {
      var fallback = "Sorry, I'm losing signal out here, try again!";
      setTranscript(function (t) { return t.concat([{ from: contactName, text: fallback }]); });
      speak(fallback);
      setAiTyping(false);
    });
  }

  function startListening() {
    if (muted || listening) return;
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceLabel("Voice not supported, use text below"); return; }
    var recog = new SR();
    recognRef.current = recog;
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = "en-US";
    recog.onstart = function () { setListening(true); setVoiceLabel("Listening..."); };
    recog.onresult = function (e) {
      var interim = "";
      for (var ri = 0; ri < e.results.length; ri++) { interim += e.results[ri][0].transcript; }
      setVoiceLabel(interim);
      var last = e.results[e.results.length - 1];
      if (last.isFinal) {
        var finalText = last[0].transcript.trim();
        setTranscript(function (t) { return t.concat([{ from: "You", text: finalText }]); });
        setVoiceLabel("");
        setListening(false);
        window.speechSynthesis.cancel();
        askAI(finalText);
      }
    };
    recog.onerror = function () { setListening(false); setVoiceLabel("Couldn't hear, tap mic again"); };
    recog.onend = function () { setListening(false); };
    recog.start();
  }

  function stopListening() {
    if (recognRef.current) recognRef.current.stop();
    setListening(false);
    setVoiceLabel("");
  }

  function sendText() {
    if (!textInput.trim() || aiTyping) return;
    var msg = textInput.trim();
    setTextInput("");
    setTranscript(function (t) { return t.concat([{ from: "You", text: msg }]); });
    window.speechSynthesis.cancel();
    askAI(msg);
  }

  useEffect(function () {
    if (phase !== "ringing") return;
    ringRef.current = setInterval(function () {
      setRingTimer(function (t) {
        if (t <= 1) {
          clearInterval(ringRef.current);
          setPhase("active");
          var greeting = "Thank you for calling the Bait Shop! How can I help you today?";
          if (contactName === "Captain Dave") greeting = "Hey there! Captain Dave speaking. What can I do for you today?";
          else if (contactName === "Mom") greeting = "Hello sweetheart! Are you being safe out there on the water?";
          else if (contactName === "Jake") greeting = "Yo! Jake here. What is up, are you catching anything?";
          setTranscript([{ from: contactName, text: greeting }]);
          setTimeout(function () { speak(greeting); }, 400);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return function () { clearInterval(ringRef.current); };
  }, [phase]);

  useEffect(function () {
    if (phase !== "active") return;
    callTimerRef.current = setInterval(function () { setCallTime(function (t) { return t + 1; }); }, 1000);
    return function () { clearInterval(callTimerRef.current); };
  }, [phase]);

  useEffect(function () {
    return function () {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognRef.current) recognRef.current.stop();
      clearInterval(ringRef.current);
      clearInterval(callTimerRef.current);
    };
  }, []);

  useEffect(function () {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [transcript, aiTyping]);

  function hangUp() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognRef.current) recognRef.current.stop();
    setPhase("ended");
    setTimeout(onEnd, 700);
  }

  // ENDED
  if (phase === "ended") {
    return (
      <div style={{ background: bg, minHeight: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, gap: 12 }}>
        <div style={{ fontSize: 14, color: "#888", fontFamily: "Georgia" }}>Call ended, {fmt(callTime)}</div>
        <button onClick={onEnd} style={{ background: "#1565C0", color: "white", border: "none", borderRadius: 20, padding: "10px 28px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia" }}>Back</button>
      </div>
    );
  }

  // RINGING
  if (phase === "ringing") {
    return (
      <div style={{ background: "linear-gradient(160deg,#1A1A2E,#16213E)", minHeight: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", border: "2px solid rgba(67,160,71,.4)", animation: "ringPulse 1.2s ease-out infinite" }} />
          <div style={{ position: "absolute", width: 90, height: 90, borderRadius: "50%", border: "2px solid rgba(67,160,71,.6)", animation: "ringPulse 1.2s ease-out infinite" }} />
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#43A047,#2E7D32)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(67,160,71,.4)" }}>
            <span style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>{contactName.charAt(0)}</span>
          </div>
        </div>
        <div style={{ color: "white", fontSize: 18, fontFamily: "Georgia", fontWeight: "bold" }}>{contactName}</div>
        <div style={{ color: "rgba(255,255,255,.65)", fontSize: 13 }}>Ringing... picks up in {ringTimer}s</div>
        <button onClick={hangUp} style={{ marginTop: 16, background: "#F44336", color: "white", border: "none", borderRadius: 30, padding: "14px 40px", cursor: "pointer", fontSize: 15, boxShadow: "0 4px 16px rgba(244,67,54,.4)" }}>End Call</button>
      </div>
    );
  }

  // ACTIVE
  return (
    <div style={{ background: bg, minHeight: 460, display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg,#1B5E20,#2E7D32)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{contactName.charAt(0)}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia" }}>{contactName}</div>
          <div style={{ color: "rgba(255,255,255,.7)", fontSize: 11 }}>{fmt(callTime)} - {muted ? "Muted" : "Active"}</div>
        </div>
        {aiTyping ? (
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {[1, 2, 3, 4, 3, 2, 1].map(function (h, i) {
              return <div key={i} style={{ width: 3, height: h * 5, background: "#A5D6A7", borderRadius: 2, animation: "soundBar 0.5s ease-in-out infinite alternate" }} />;
            })}
          </div>
        ) : null}
      </div>

      <div style={{ flex: 1, padding: "10px 12px", overflowY: "auto", maxHeight: 230, display: "flex", flexDirection: "column", gap: 8 }}>
        {transcript.length === 0 ? (
          <div style={{ color: "#888", fontSize: 12, textAlign: "center", padding: "20px 0", fontFamily: "Georgia" }}>Tap the mic and speak, or type below</div>
        ) : null}
        {transcript.map(function (m, i) {
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "You" ? "flex-end" : "flex-start" }}>
              <div style={{ fontSize: 9, color: "#888", marginBottom: 2, fontFamily: "Georgia" }}>{m.from}</div>
              <div style={{ background: m.from === "You" ? "#1565C0" : (darkMode ? "#2A2A2A" : "#E8F5E9"), borderRadius: 14, padding: "8px 12px", maxWidth: "86%" }}>
                <div style={{ fontSize: 12, color: m.from === "You" ? "white" : (darkMode ? "#DDD" : "#1A1A1A"), lineHeight: 1.5 }}>{m.text}</div>
              </div>
            </div>
          );
        })}
        {aiTyping ? (
          <div style={{ alignSelf: "flex-start" }}>
            <div style={{ background: darkMode ? "#2A2A2A" : "#E8F5E9", borderRadius: 14, padding: "10px 14px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map(function (i) { return <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50", animation: "dot 0.7s ease-in-out infinite" }} />; })}
            </div>
          </div>
        ) : null}
        {voiceLabel ? (
          <div style={{ alignSelf: "flex-end", background: "rgba(21,101,192,.15)", borderRadius: 12, padding: "6px 12px", border: "1px dashed #1565C0" }}>
            <div style={{ fontSize: 11, color: "#1565C0", fontStyle: "italic" }}>{voiceLabel}</div>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div style={{ borderTop: "1px solid " + (darkMode ? "#333" : "#E0E0E0"), padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={textInput} onChange={function (e) { setTextInput(e.target.value); }}
            onKeyDown={function (e) { if (e.key === "Enter") sendText(); }}
            placeholder={muted ? "Unmute to speak" : "Type your question..."}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 20, border: "1px solid " + (darkMode ? "#444" : "#DDD"), fontSize: 12, fontFamily: "Georgia", outline: "none", background: darkMode ? "#222" : "#FFF", color: darkMode ? "#EEE" : "#222" }} />
          <button onClick={sendText} disabled={aiTyping || !textInput.trim()} style={{ background: aiTyping ? "#555" : "#1565C0", color: "white", border: "none", borderRadius: 20, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontFamily: "Georgia" }}>Send</button>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <button
              onPointerDown={function (e) { e.preventDefault(); if (!muted) startListening(); }}
              onPointerUp={function (e) { e.preventDefault(); stopListening(); }}
              onPointerLeave={function (e) { e.preventDefault(); stopListening(); }}
              style={{ width: 56, height: 56, borderRadius: "50%", background: listening ? "#E65100" : muted ? "#555" : "#43A047", border: listening ? "3px solid #FFD54F" : "3px solid transparent", cursor: muted ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none" }}>
              <span style={{ color: "white", fontSize: 11, fontWeight: "bold", fontFamily: "Georgia" }}>{muted ? "OFF" : "MIC"}</span>
            </button>
            <div style={{ fontSize: 9, color: "#888" }}>{listening ? "Speaking" : "Hold mic"}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <button onClick={function () { setMuted(function (m) { return !m; }); if (listening) stopListening(); }}
              style={{ width: 48, height: 48, borderRadius: "50%", background: muted ? "#F44336" : (darkMode ? "#2A2A2A" : "#EEE"), border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: muted ? "white" : "#607D8B", fontSize: 9, fontWeight: "bold" }}>MUTE</span>
            </button>
            <div style={{ fontSize: 9, color: muted ? "#F44336" : "#888" }}>{muted ? "Unmute" : "Mute"}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <button onClick={function () { setSpeaker(function (s) { if (s && window.speechSynthesis) window.speechSynthesis.cancel(); return !s; }); }}
              style={{ width: 48, height: 48, borderRadius: "50%", background: speaker ? "#1565C0" : (darkMode ? "#2A2A2A" : "#EEE"), border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: speaker ? "white" : "#607D8B", fontSize: 9, fontWeight: "bold" }}>SPKR</span>
            </button>
            <div style={{ fontSize: 9, color: speaker ? "#1565C0" : "#888" }}>{speaker ? "On" : "Off"}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <button onClick={hangUp} style={{ width: 56, height: 56, borderRadius: "50%", background: "#F44336", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 9, fontWeight: "bold" }}>END</span>
            </button>
            <div style={{ fontSize: 9, color: "#F44336" }}>End</div>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 10, color: "#90A4AE" }}>
          {muted ? "You are muted" : listening ? "Listening, release to send" : "Hold mic to talk, or type and send"}
        </div>
      </div>
    </div>
  );
}


function AppPhone({ contacts, darkMode, onCall }) {
  const bg = darkMode ? "#1A1A1A" : "#F5F5F5";
  return (
    <div style={{ background: bg, minHeight: 460 }}>
      <div style={{ background: "#1E88E5", padding: "12px 14px" }}>
        <span style={{ color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia" }}>Phone</span>
      </div>
      <div style={{ padding: 12, maxHeight: 400, overflowY: "auto" }}>
        {contacts.map((c, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 4px", borderBottom: `1px solid ${darkMode ? "#333" : "#EEE"}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1565C0,#0D47A1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>{c.name[0]}</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: "bold", color: darkMode ? "#EEE" : "#222" }}>{c.name}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{c.num}</div>
              </div>
            </div>
            <button onClick={() => onCall(c.name)} style={{ background: "#43A047", color: "white", border: "none", borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 11 }}>Call</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppMessages({ contacts, messages, setMessages, darkMode }) {
  const [activeDM, setActiveDM] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const timeStr = new Date().getHours() + ":" + String(new Date().getMinutes()).padStart(2, "0");
  const bg = darkMode ? "#1A1A1A" : "#F5F5F5";
  return (
    <div style={{ background: bg, minHeight: 460 }}>
      <div style={{ background: "#43A047", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        {activeDM && <button onClick={() => setActiveDM(null)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18 }}>{"<"}</button>}
        <span style={{ color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia" }}>{activeDM || "Messages"}</span>
      </div>
      <div style={{ padding: 12, maxHeight: 390, overflowY: "auto" }}>
        {!activeDM ? contacts.map((c, i) => (
          <div key={i} onClick={() => setActiveDM(c.name)} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 8px", borderBottom: `1px solid ${darkMode ? "#333" : "rgba(0,0,0,.07)"}`, cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#1565C0,#0D47A1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>{c.name[0]}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: darkMode ? "#EEE" : "#222" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{(function(){ var m = messages.find(function(m){ return m.from === c.name; }); return m && m.text ? m.text.slice(0,30) : "..."; })()}</div>
            </div>
          </div>
        )) : (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {messages.filter(m => m.from === activeDM || m.to === activeDM).map((m, i) => (
                <div key={i} style={{ alignSelf: m.from === "You" ? "flex-end" : "flex-start", background: m.from === "You" ? "#1565C0" : (darkMode ? "#2A2A2A" : "#E8F5E9"), borderRadius: 12, padding: "8px 12px", maxWidth: "80%" }}>
                  <div style={{ fontSize: 12, color: m.from === "You" ? "white" : (darkMode ? "#DDD" : "#222") }}>{m.text}</div>
                  <div style={{ fontSize: 10, color: m.from === "You" ? "rgba(255,255,255,.6)" : "#888", marginTop: 2 }}>{m.time}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Message..." style={{ flex: 1, padding: "8px 10px", borderRadius: 20, border: "1px solid #DDD", fontSize: 12, fontFamily: "Georgia", outline: "none", background: darkMode ? "#222" : "#FFF", color: darkMode ? "#EEE" : "#222" }} />
              <button onClick={() => { if (newMsg.trim()) { setMessages(ms => ms.concat([{ from: "You", to: activeDM, text: newMsg, time: timeStr }])); setNewMsg(""); } }} style={{ background: "#43A047", color: "white", border: "none", borderRadius: 20, padding: "8px 14px", cursor: "pointer", fontSize: 12 }}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppSocial({ feed, likedPosts, setLikedPosts, darkMode }) {
  const bg = darkMode ? "#111" : "#FFF";
  return (
    <div style={{ background: bg, minHeight: 460 }}>
      <div style={{ background: "#E91E63", padding: "12px 14px" }}>
        <span style={{ color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia" }}>FishGram</span>
      </div>
      <div style={{ padding: 12, maxHeight: 390, overflowY: "auto" }}>
        {feed.map((post, i) => (
          <div key={i} style={{ background: darkMode ? "#1A1A1A" : "#FFF", borderRadius: 10, padding: 12, marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,.1)" }}>
            <div style={{ fontSize: 12, fontWeight: "bold", color: "#E91E63", marginBottom: 4 }}>{post.user}</div>
            <div style={{ height: 80, background: "linear-gradient(135deg,#E3F2FD,#BBDEFB)", borderRadius: 8, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FishSVG fish={FISH[i % FISH.length]} W={90} />
            </div>
            <div style={{ fontSize: 12, color: darkMode ? "#DDD" : "#222", marginBottom: 8 }}>{post.post}</div>
            <button onClick={() => setLikedPosts(lp => lp.includes(i) ? lp.filter(x => x !== i) : lp.concat([i]))} style={{ background: likedPosts.includes(i) ? "#E91E63" : "transparent", color: likedPosts.includes(i) ? "white" : "#E91E63", border: "1px solid #E91E63", borderRadius: 20, padding: "4px 12px", cursor: "pointer", fontSize: 11 }}>
              {likedPosts.includes(i) ? "Liked" : "Like"} {post.likes + (likedPosts.includes(i) ? 1 : 0)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppSettings({ settings, setSettings, darkMode, onCaseChange, phoneCase }) {
  const bg = darkMode ? "#1A1A1A" : "#F5F5F5";
  return (
    <div style={{ background: bg, minHeight: 460 }}>
      <div style={{ background: "#607D8B", padding: "12px 14px" }}>
        <span style={{ color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia" }}>Settings</span>
      </div>
      <div style={{ padding: 12, maxHeight: 390, overflowY: "auto" }}>
        {[{ label: "Wi-Fi", key: "wifi" }, { label: "Bluetooth", key: "bluetooth" }, { label: "Sound", key: "sound" }, { label: "Dark Mode", key: "darkMode" }].map(s => (
          <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 4px", borderBottom: `1px solid ${darkMode ? "#333" : "rgba(0,0,0,.07)"}` }}>
            <span style={{ fontSize: 13, color: darkMode ? "#EEE" : "#222", fontFamily: "Georgia" }}>{s.label}</span>
            <div onClick={() => setSettings(ss => ({ ...ss, [s.key]: !ss[s.key] }))} style={{ width: 44, height: 24, borderRadius: 12, background: settings[s.key] ? "#43A047" : "#CCC", position: "relative", cursor: "pointer", transition: "background .2s" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", position: "absolute", top: 2, left: settings[s.key] ? 22 : 2, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
            </div>
          </div>
        ))}
        <div style={{ padding: "12px 4px", borderBottom: `1px solid ${darkMode ? "#333" : "rgba(0,0,0,.07)"}` }}>
          <div style={{ fontSize: 13, color: darkMode ? "#EEE" : "#222", marginBottom: 6, fontFamily: "Georgia" }}>Brightness: {settings.brightness}%</div>
          <input type="range" min={10} max={100} value={settings.brightness} onChange={e => setSettings(s => ({ ...s, brightness: +e.target.value }))} style={{ width: "100%" }} />
        </div>
        <div style={{ padding: "12px 4px" }}>
          <div style={{ fontSize: 13, color: darkMode ? "#EEE" : "#222", fontFamily: "Georgia", marginBottom: 10, fontWeight: "bold" }}>Phone Case</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PHONE_CASES.map(c => (
              <div key={c.id} onClick={() => onCaseChange(c.id)} style={{ cursor: "pointer", textAlign: "center" }}>
                <div style={{ width: 36, height: 56, borderRadius: 8, ...c.style, border: phoneCase === c.id ? "3px solid #FFD54F" : c.style.border, boxSizing: "border-box", boxShadow: phoneCase === c.id ? "0 0 10px rgba(255,213,79,.5)" : "none" }} />
                <div style={{ fontSize: 8, color: darkMode ? "#AAA" : "#666", marginTop: 3 }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppSnake({ darkMode }) {
  const [snakeBody, setSnakeBody] = useState([[5, 5], [4, 5], [3, 5]]);
  const [food,      setFood]      = useState([8, 8]);
  const [score,     setScore]     = useState(0);
  const [running,   setRunning]   = useState(false);
  const dirRef = useRef("right");
  const GRID = 14, CELL = 18;
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setSnakeBody(body => {
        var head = [body[0][0], body[0][1]];
        const d = dirRef.current;
        if (d === "right") head[0] += 1;
        if (d === "left")  head[0] -= 1;
        if (d === "down")  head[1] += 1;
        if (d === "up")    head[1] -= 1;
        if (head[0] < 0 || head[0] >= GRID || head[1] < 0 || head[1] >= GRID || body.slice(0, -1).some(s => s[0] === head[0] && s[1] === head[1])) {
          setRunning(false); return body;
        }
        let nb = [head, ...body];
        setFood(f => {
          if (head[0] === f[0] && head[1] === f[1]) {
            setScore(s => s + 1);
            return [Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)];
          }
          nb = nb.slice(0, -1); return f;
        });
        return nb;
      });
    }, 200);
    return () => clearInterval(iv);
  }, [running]);
  const ctrl = (d) => { const opp = { right: "left", left: "right", up: "down", down: "up" }; if (d !== opp[dirRef.current]) dirRef.current = d; };
  const restart = () => { setSnakeBody([[5, 5], [4, 5], [3, 5]]); setFood([8, 8]); setScore(0); dirRef.current = "right"; setRunning(true); };
  return (
    <div style={{ background: darkMode ? "#111" : "#F5F5F5", minHeight: 460 }}>
      <div style={{ background: "#FF6F00", padding: "12px 14px" }}><span style={{ color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia" }}>Snake</span></div>
      <div style={{ padding: 12, textAlign: "center" }}>
        <div style={{ color: "#4CAF50", fontSize: 14, fontFamily: "Georgia", marginBottom: 8 }}>Score: {score}</div>
        <div style={{ display: "inline-block", border: "2px solid #333", borderRadius: 4, background: "#111", lineHeight: 0 }}>
          {Array.from({ length: GRID }, (_, row) => (
            <div key={row} style={{ display: "flex" }}>
              {Array.from({ length: GRID }, (_, col) => {
                const isHead = snakeBody[0][0] === col && snakeBody[0][1] === row;
                const isBody = snakeBody.slice(1).some(s => s[0] === col && s[1] === row);
                const isFood = food[0] === col && food[1] === row;
                return <div key={col} style={{ width: CELL, height: CELL, background: isHead ? "#76FF03" : isBody ? "#4CAF50" : isFood ? "#FF5722" : "#111", borderRadius: isHead ? 3 : 0 }} />;
              })}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          {!running
            ? <button onClick={restart} style={{ background: "#4CAF50", color: "white", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 12, fontFamily: "Georgia" }}>{score > 0 ? "Restart" : "Start"}</button>
            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, width: 130, margin: "8px auto 0" }}>
                <div /><button onClick={() => ctrl("up")} style={{ background: "#333", color: "white", border: "none", borderRadius: 6, padding: 8, cursor: "pointer" }}>Up</button><div />
                <button onClick={() => ctrl("left")} style={{ background: "#333", color: "white", border: "none", borderRadius: 6, padding: 8, cursor: "pointer" }}>L</button>
                <button onClick={() => ctrl("down")} style={{ background: "#333", color: "white", border: "none", borderRadius: 6, padding: 8, cursor: "pointer" }}>Dn</button>
                <button onClick={() => ctrl("right")} style={{ background: "#333", color: "white", border: "none", borderRadius: 6, padding: 8, cursor: "pointer" }}>R</button>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

function AppFlappy({ darkMode }) {
  const [birdY,   setBirdY]   = useState(150);
  const [pipes,   setPipes]   = useState([{ x: 260, gap: 120 }]);
  const [score,   setScore]   = useState(0);
  const [running, setRunning] = useState(false);
  const bYRef = useRef(150), velRef = useRef(0), pipesRef = useRef([{ x: 260, gap: 120 }]);
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      velRef.current = Math.min(velRef.current + 0.8, 8);
      bYRef.current = Math.max(0, Math.min(258, bYRef.current + velRef.current));
      setBirdY(bYRef.current);
      pipesRef.current = pipesRef.current.map(p => ({ ...p, x: p.x - 3 })).filter(p => p.x > -20);
      if (!pipesRef.current.length || pipesRef.current[pipesRef.current.length - 1].x < 150)
        pipesRef.current = pipesRef.current.concat([{ x: 260, gap: 50 + Math.random() * 110 }]);
      setPipes(pipesRef.current.slice());
      for (var _pi=0;_pi<pipesRef.current.length;_pi++) { var p=pipesRef.current[_pi];
        if (60 > p.x && 60 < p.x + 28 && (bYRef.current < p.gap || bYRef.current > p.gap + 80)) { setRunning(false); return; }
      }
      if (bYRef.current >= 258) { setRunning(false); return; }
      setScore(s => s + 1);
    }, 33);
    return () => clearInterval(iv);
  }, [running]);
  const flap = () => {
    if (!running) { bYRef.current = 150; velRef.current = 0; pipesRef.current = [{ x: 260, gap: 120 }]; setScore(0); setBirdY(150); setPipes([{ x: 260, gap: 120 }]); setRunning(true); }
    else velRef.current = -5;
  };
  return (
    <div style={{ background: darkMode ? "#111" : "#F5F5F5", minHeight: 460 }}>
      <div style={{ background: "#7B1FA2", padding: "12px 14px" }}><span style={{ color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia" }}>Flappy Fish</span></div>
      <div style={{ padding: 12, textAlign: "center" }}>
        <div style={{ color: "#FFD54F", fontSize: 14, fontFamily: "Georgia", marginBottom: 6 }}>Score: {Math.floor(score / 10)}</div>
        <div style={{ position: "relative", width: 260, height: 280, background: "linear-gradient(180deg,#0D47A1,#1565C0)", borderRadius: 8, overflow: "hidden", margin: "0 auto", cursor: "pointer" }} onClick={flap}>
          <div style={{ position: "absolute", left: 50, top: birdY, width: 22, height: 14, background: "#FFD54F", borderRadius: "50% 50% 50% 30%", border: "2px solid #F57F17" }} />
          {pipes.map((p, i) => (
            <div key={i}>
              <div style={{ position: "absolute", left: p.x, top: 0, width: 28, height: p.gap, background: "#2E7D32", borderRadius: "0 0 4px 4px", borderBottom: "4px solid #1B5E20" }} />
              <div style={{ position: "absolute", left: p.x, top: p.gap + 80, width: 28, height: 300, background: "#2E7D32", borderRadius: "4px 4px 0 0", borderTop: "4px solid #1B5E20" }} />
            </div>
          ))}
          {!running && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)", color: "white", fontSize: 13, fontFamily: "Georgia", flexDirection: "column", gap: 8 }}>
            <div>{score > 0 ? "Game Over" : "Flappy Fish"}</div>
            <div style={{ fontSize: 11, color: "#FFD54F" }}>Tap to {score > 0 ? "retry" : "start"}</div>
          </div>}
        </div>
      </div>
    </div>
  );
}

function AppCamera({ darkMode }) {
  return (
    <div style={{ background: darkMode ? "#000" : "#F5F5F5", minHeight: 460 }}>
      <div style={{ background: "#37474F", padding: "12px 14px" }}><span style={{ color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia" }}>Camera</span></div>
      <div style={{ padding: 12 }}>
        <div style={{ background: "linear-gradient(160deg,#1565C0,#0D47A1)", height: 200, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ color: "rgba(255,255,255,.4)", fontSize: 13, fontFamily: "Georgia" }}>Camera viewfinder</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <button style={{ width: 56, height: 56, borderRadius: "50%", background: "white", border: "4px solid #CCC", cursor: "pointer" }} />
          <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>Capture your catch</div>
        </div>
      </div>
    </div>
  );
}

function AppWeather({ darkMode }) {
  const bg = darkMode ? "#1A1A1A" : "#E3F2FD";
  return (
    <div style={{ background: bg, minHeight: 460 }}>
      <div style={{ background: "#0288D1", padding: "12px 14px" }}><span style={{ color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia" }}>Weather</span></div>
      <div style={{ padding: 12, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#1565C0", fontFamily: "Georgia", fontWeight: "bold", marginBottom: 4 }}>Gulf of Mexico</div>
        <div style={{ fontSize: 52, fontWeight: "200", color: "#0D47A1", marginBottom: 4 }}>82°</div>
        <div style={{ fontSize: 14, color: "#1565C0", marginBottom: 16 }}>Partly Cloudy</div>
        {[["Wind", "12 mph SE"], ["Humidity", "78%"], ["Visibility", "10 mi"], ["Water Temp", "81 F"], ["Tide", "Incoming 2.1 ft"], ["UV Index", "9 Very High"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 4px", borderBottom: "1px solid rgba(21,101,192,.15)" }}>
            <span style={{ fontSize: 12, color: "#607D8B", fontFamily: "Georgia" }}>{k}</span>
            <span style={{ fontSize: 12, fontWeight: "bold", color: "#1565C0" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PHONE SETUP (first-time wizard) ─────────────────────────────────────────
// ─── FACE CAMERA (real camera + face presence detection) ─────────────────────
// mode: "enroll" captures a face signature; "verify" compares to saved signature
function FaceCamera({ mode, savedSignature, onResult, onCancel }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef    = useRef(null);
  const [status, setStatus]   = useState("starting"); // starting | no_camera | ready | scanning | success | fail
  const [message, setMessage] = useState("Starting camera...");
  const [progress, setProgress] = useState(0);

  // Analyze the center region of the video to detect a face presence
  // Returns { present, signature } where signature is brightness/color stats
  const analyzeFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return null;
    const ctx = canvas.getContext("2d");
    const W = 64, H = 64;
    canvas.width = W; canvas.height = H;
    // Draw center square of video into small canvas
    const vw = video.videoWidth, vh = video.videoHeight;
    const size = Math.min(vw, vh);
    const sx = (vw - size) / 2, sy = (vh - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, W, H);
    let data;
    try { data = ctx.getImageData(0, 0, W, H).data; } catch (e) { return null; }
    // Compute brightness, and a coarse 4x4 grid of average brightness as signature
    let total = 0, count = 0;
    const grid = [];
    for (let gy = 0; gy < 4; gy++) {
      for (let gx = 0; gx < 4; gx++) {
        let gsum = 0, gcount = 0;
        for (let py = gy*16; py < gy*16+16; py++) {
          for (let px = gx*16; px < gx*16+16; px++) {
            const idx = (py*W + px) * 4;
            const b = (data[idx] + data[idx+1] + data[idx+2]) / 3;
            gsum += b; gcount++;
            total += b; count++;
          }
        }
        grid.push(gsum / gcount);
      }
    }
    const avgBright = total / count;
    // Variance across grid (a face has structure → higher variance than blank wall/dark)
    let variance = 0;
    for (let i = 0; i < grid.length; i++) variance += Math.pow(grid[i] - avgBright, 2);
    variance = variance / grid.length;
    // Face present heuristic: enough light AND enough structural variance
    const present = avgBright > 35 && avgBright < 245 && variance > 80;
    return { present, signature: grid, avgBright: avgBright, variance: variance };
  };

  // Compare two signatures → similarity 0..1
  const compareSignatures = (a, b) => {
    if (!a || !b || a.length !== b.length) return 0;
    // Normalize both, then compute mean absolute difference
    const norm = (arr) => { const mx = Math.max.apply(null, arr) || 1; return arr.map(v => v / mx); };
    const na = norm(a), nb = norm(b);
    let diff = 0;
    for (let i = 0; i < na.length; i++) diff += Math.abs(na[i] - nb[i]);
    diff = diff / na.length;
    return Math.max(0, 1 - diff * 2.2); // scale so reasonable matches > .6
  };

  useEffect(() => {
    let active = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setStatus("ready");
        setMessage(mode === "enroll" ? "Position your face in the circle" : "Look at the camera to unlock");
      })
      .catch(() => {
        if (active) { setStatus("no_camera"); setMessage("Camera not available. Check permissions."); }
      });
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [mode]);

  const runScan = () => {
    setStatus("scanning");
    setProgress(0);
    let frames = 0;
    let validFrames = 0;
    let bestSignature = null;
    let noFaceFrames = 0;
    const loop = () => {
      frames++;
      const result = analyzeFrame();
      if (result) {
        if (result.present) {
          validFrames++;
          noFaceFrames = 0;
          bestSignature = result.signature;
          setMessage(mode === "enroll" ? "Hold still... capturing" : "Scanning your face...");
        } else {
          noFaceFrames++;
          if (result.avgBright <= 35) setMessage("Too dark — find better light");
          else setMessage("Move your face closer to the screen");
        }
      }
      setProgress(Math.min(100, (frames / 50) * 100));
      if (frames < 50) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        // Done scanning - need enough valid (face-present) frames
        if (validFrames < 15) {
          setStatus("fail");
          setMessage("No face detected — move closer and try again");
          setTimeout(() => onResult({ success: false, reason: "no_face" }), 1400);
          return;
        }
        if (mode === "enroll") {
          setStatus("success");
          setMessage("Face ID saved!");
          setTimeout(() => onResult({ success: true, signature: bestSignature }), 1200);
        } else {
          const sim = compareSignatures(bestSignature, savedSignature);
          if (sim >= 0.55) {
            setStatus("success");
            setMessage("Face recognized!");
            setTimeout(() => onResult({ success: true, signature: bestSignature }), 1200);
          } else {
            setStatus("fail");
            setMessage("Face not recognized");
            setTimeout(() => onResult({ success: false, reason: "no_match" }), 1400);
          }
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const ringColor = status === "success" ? "#4CAF50" : status === "fail" ? "#F44336" : status === "scanning" ? "#FFD54F" : "rgba(255,255,255,.5)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "10px 0" }}>
      {/* Camera circle */}
      <div style={{ width: 180, height: 180, borderRadius: "50%", overflow: "hidden", border: `4px solid ${ringColor}`, position: "relative", background: "#000", boxShadow: status === "scanning" ? "0 0 24px rgba(255,213,79,.5)" : "none" }}>
        <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {/* Scan ring overlay */}
        {status === "scanning" && (
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: "absolute", top: 0, left: 0 }}>
            <circle cx="90" cy="90" r="84" fill="none" stroke="#FFD54F" strokeWidth="3" strokeDasharray={`${progress * 5.27} 999`} transform={"rotate(-90 90 90)"} opacity=".9" />
          </svg>
        )}
        {status === "success" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(76,175,80,.25)" }}>
            <svg width={70} height={70} viewBox="0 0 70 70"><circle cx={35} cy={35} r={31} fill="none" stroke="#4CAF50" strokeWidth={4}/><path d="M 19 35 L 30 47 L 52 23" stroke="#4CAF50" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        )}
        {status === "fail" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(244,67,54,.25)" }}>
            <svg width={60} height={60} viewBox="0 0 60 60"><circle cx={30} cy={30} r={26} fill="none" stroke="#F44336" strokeWidth={4}/><path d="M 20 20 L 40 40 M 40 20 L 20 40" stroke="#F44336" strokeWidth={4} strokeLinecap="round"/></svg>
          </div>
        )}
      </div>
      <div style={{ color: status === "fail" ? "#FF5252" : status === "success" ? "#81C784" : "rgba(255,255,255,.85)", fontSize: 13, fontFamily: "Georgia", textAlign: "center", minHeight: 18 }}>{message}</div>
      {status === "ready" && (
        <button onClick={runScan} style={{ background: "#FFD54F", color: "#1A1A1A", border: "none", borderRadius: 24, padding: "11px 30px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia", fontWeight: "bold" }}>
          {mode === "enroll" ? "Capture Face" : "Scan Face"}
        </button>
      )}
      {status === "no_camera" && (
        <button onClick={onCancel} style={{ background: "#607D8B", color: "white", border: "none", borderRadius: 24, padding: "10px 26px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia" }}>Back</button>
      )}
      {(status === "ready" || status === "scanning") && (
        <button onClick={onCancel} style={{ background: "none", border: "none", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 11 }}>Cancel</button>
      )}
    </div>
  );
}

function PhoneSetup({ onComplete }) {
  const [step, setStep] = useState("pin"); // pin | face | case | done
  const [pin, setPin] = useState([]);
  const [confirmPin, setConfirmPin] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [faceDone, setFaceDone] = useState(false);
  const [selectedCase, setSelectedCase] = useState("default");
  const [faceSig, setFaceSig] = useState(null);

  const dialPin = (d) => {
    if (!confirming) {
      const next = pin.concat([d]);
      setPin(next);
      if (next.length === 4) setTimeout(() => setConfirming(true), 400);
    } else {
      const next = confirmPin.concat([d]);
      setConfirmPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next.join("") === pin.join("")) setStep("face");
          else { setConfirmPin([]); }
        }, 400);
      }
    }
  };


  const currentPin = confirming ? confirmPin : pin;

  if (step === "pin") return (
    <div style={{ background: "linear-gradient(160deg,#0D47A1,#1565C0)", minHeight: 520, display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px 20px" }}>
      <div style={{ color: "white", fontSize: 17, fontFamily: "Georgia", marginBottom: 4, fontWeight: "bold" }}>Set Your Passcode</div>
      <div style={{ color: "rgba(255,255,255,.7)", fontSize: 12, marginBottom: 20, textAlign: "center" }}>
        {!confirming ? "Choose a 4-digit passcode" : "Confirm your passcode"}
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {[0, 1, 2, 3].map(i => <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: currentPin.length > i ? "#FFD54F" : "rgba(255,255,255,.3)", border: "2px solid rgba(255,255,255,.5)", transition: "background .15s" }} />)}
      </div>
      {confirming && confirmPin.length === 4 && confirmPin.join("") !== pin.join("") &&
        <div style={{ color: "#FF5252", fontSize: 12, marginBottom: 8 }}>Passcodes do not match — try again</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, width: "100%" }}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(d => (
          <button key={d} onClick={() => d !== "*" && d !== "#" && dialPin(d)} style={{ padding: "12px 0", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, color: "white", fontSize: 20, cursor: d === "*" || d === "#" ? "default" : "pointer", fontFamily: "Georgia" }}>{d}</button>
        ))}
      </div>
      <button onClick={() => { if (confirming) { setConfirmPin([]); } else { setPin([]); } }} style={{ marginTop: 12, background: "none", border: "none", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 12 }}>Clear</button>
    </div>
  );

  if (step === "face") return (
    <div style={{ background: "linear-gradient(160deg,#1A1A2E,#16213E)", minHeight: 520, display: "flex", flexDirection: "column", alignItems: "center", padding: "26px 20px 20px" }}>
      <div style={{ color: "white", fontSize: 17, fontFamily: "Georgia", marginBottom: 4, fontWeight: "bold" }}>Set Up Face ID</div>
      <div style={{ color: "rgba(255,255,255,.65)", fontSize: 12, marginBottom: 16, textAlign: "center" }}>Look at the camera to register your face</div>
      {!faceDone ? (
        <FaceCamera
          mode="enroll"
          onResult={(r) => { if (r.success) { setFaceSig(r.signature); setFaceDone(true); } }}
          onCancel={() => setStep("case")}
        />
      ) : (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <svg width={80} height={80} viewBox="0 0 80 80" style={{ marginBottom: 12 }}><circle cx={40} cy={40} r={36} fill="none" stroke="#4CAF50" strokeWidth={3}/><path d="M 24 40 L 34 52 L 56 28" stroke="#4CAF50" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div style={{ color: "#4CAF50", fontSize: 15, fontFamily: "Georgia", marginBottom: 16 }}>Face ID saved!</div>
          <button onClick={() => setStep("case")} style={{ background: "#4CAF50", color: "white", border: "none", borderRadius: 24, padding: "12px 32px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia" }}>Continue</button>
        </div>
      )}
      {!faceDone && <button onClick={() => setStep("case")} style={{ marginTop: 14, background: "none", border: "none", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 11 }}>Skip Face ID</button>}
    </div>
  );

  if (step === "case") return (
    <div style={{ background: "#1A1A2E", minHeight: 520, padding: "24px 16px" }}>
      <div style={{ color: "white", fontSize: 17, fontFamily: "Georgia", marginBottom: 4, fontWeight: "bold", textAlign: "center" }}>Choose Your Phone Case</div>
      <div style={{ color: "rgba(255,255,255,.6)", fontSize: 12, marginBottom: 20, textAlign: "center" }}>Pick a style for your phone</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 24 }}>
        {PHONE_CASES.map(c => (
          <div key={c.id} onClick={() => setSelectedCase(c.id)} style={{ cursor: "pointer", textAlign: "center" }}>
            <div style={{ width: 46, height: 72, borderRadius: 10, ...c.style, border: selectedCase === c.id ? "3px solid #FFD54F" : c.style.border, boxSizing: "border-box", boxShadow: selectedCase === c.id ? "0 0 14px rgba(255,213,79,.6)" : "0 2px 8px rgba(0,0,0,.4)" }} />
            <div style={{ fontSize: 9, color: selectedCase === c.id ? "#FFD54F" : "rgba(255,255,255,.55)", marginTop: 4 }}>{c.name}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <button onClick={() => onComplete({ pin: pin.join(""), faceSetup: faceDone, faceSignature: faceSig, phoneCase: selectedCase })} style={{ background: "linear-gradient(135deg,#FFD54F,#FF8F00)", color: "#1A1A1A", border: "none", borderRadius: 24, padding: "13px 40px", cursor: "pointer", fontSize: 15, fontFamily: "Georgia", fontWeight: "bold", boxShadow: "0 4px 16px rgba(255,213,79,.4)" }}>
          Start Using Phone
        </button>
      </div>
    </div>
  );

  return null;
}

// ─── MAIN PHONE COMPONENT ─────────────────────────────────────────────────────
function Phone({ cfg, onClose, phoneData, setPhoneData }) {
  const [passcode,   setPasscode]   = useState([]);
  const [wrongPin,   setWrongPin]   = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [lockedOut,  setLockedOut]  = useState(false);
  const [lockTimer,  setLockTimer]  = useState(60);
  const [appOpen,    setAppOpen]    = useState(null);
  const [calling,    setCalling]    = useState(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [faceFailed, setFaceFailed] = useState(0);
  const [showSavedPin, setShowSavedPin] = useState(false);
  const [messages,   setMessages]   = useState([
    { from: "Captain Dave", text: "Any luck out there?",        time: "9:14 AM" },
    { from: "Mom",          text: "Be safe on the water honey", time: "8:02 AM" },
    { from: "Jake",         text: "Nice catch on the gram!",    time: "7:45 AM" },
  ]);
  const [feed]        = useState([
    { user: "@jakefishes",  post: "Just landed a 40lb tarpon at the inlet!", likes: 142 },
    { user: "@reefdiver",   post: "Water temp 82F at the reef. Grouper stacked.", likes: 87 },
    { user: "@captdave",    post: "Heading offshore at 5am. Who is in?", likes: 203 },
    { user: "@floridafish", post: "New personal best red snapper — 28 in.", likes: 315 },
  ]);
  const [likedPosts,  setLikedPosts]  = useState([]);
  const [settings,    setSettings]    = useState({ wifi: true, bluetooth: false, brightness: 70, sound: true, darkMode: false });
  const faceRef = useRef(null);

  const contacts = [
    { name: "Captain Dave", num: "(305) 555-0192" },
    { name: "Mom",          num: "(305) 555-0144" },
    { name: "Jake",         num: "(786) 555-0371" },
    { name: "Bait Shop",    num: "(305) 555-0288" },
  ];

  const locked   = !phoneData.unlocked;
  const PIN      = phoneData.pin || "1234";
  const DM       = settings.darkMode;
  const caseData = PHONE_CASES.find(c => c.id === (phoneData.phoneCase || "default")) || PHONE_CASES[0];

  const now      = new Date();
  const timeStr  = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");

  // Lockout countdown
  useEffect(() => {
    if (!lockedOut) return;
    const iv = setInterval(() => {
      setLockTimer(t => {
        if (t <= 1) { clearInterval(iv); setLockedOut(false); setWrongCount(0); setLockTimer(60); return 60; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [lockedOut]);

  const dialDigit = (d) => {
    if (lockedOut) return;
    const next = passcode.concat([d]);
    setPasscode(next);
    if (next.length === 4) {
      if (next.join("") === PIN) {
        setPhoneData(pd => ({ ...pd, unlocked: true }));
        setPasscode([]); setWrongPin(false); setWrongCount(0);
      } else {
        const newWrong = wrongCount + 1;
        setWrongCount(newWrong);
        setWrongPin(true);
        setTimeout(() => { setPasscode([]); setWrongPin(false); }, 800);
        if (newWrong >= 3) setLockedOut(true);
      }
    }
  };


  const phoneShell = { width: 300, borderRadius: 36, padding: "10px 10px 20px", boxShadow: "0 24px 60px rgba(0,0,0,.7)", margin: "0 auto", position: "relative", ...caseData.style };
  const notch = (
    <div style={{ width: 90, height: 22, background: "rgba(0,0,0,.8)", borderRadius: 12, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#333" }} />
      <div style={{ width: 40, height: 6, borderRadius: 4, background: "#2A2A2A" }} />
    </div>
  );
  const screenWrap = { borderRadius: 28, overflow: "hidden", minHeight: 480, background: DM ? "#000" : "#F0F0F0" };

  // Forgot password / Face ID screen
  if (forgotMode) return (
    <div style={phoneShell}>
      {notch}
      <div style={{ ...screenWrap, background: "linear-gradient(160deg,#1A1A2E,#16213E)", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" }}>
        <div style={{ color: "white", fontSize: 16, fontFamily: "Georgia", fontWeight: "bold", marginBottom: 4 }}>Face ID Recovery</div>
        <div style={{ color: "rgba(255,255,255,.65)", fontSize: 11, marginBottom: 14, textAlign: "center" }}>
          {lockedOut ? "Locked out" : faceFailed > 0 ? `${3 - faceFailed} attempts remaining` : "Verify your face to see your passcode"}
        </div>
        {lockedOut ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ color: "#F44336", fontSize: 40, fontWeight: "bold", marginBottom: 8 }}>{lockTimer}s</div>
            <div style={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>Too many failed scans — locked</div>
          </div>
        ) : showSavedPin ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <svg width={70} height={70} viewBox="0 0 70 70" style={{ marginBottom: 12 }}><circle cx={35} cy={35} r={31} fill="none" stroke="#4CAF50" strokeWidth={4}/><path d="M 19 35 L 30 47 L 52 23" stroke="#4CAF50" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ color: "#4CAF50", fontSize: 14, marginBottom: 10 }}>Face recognized</div>
            <div style={{ color: "white", fontSize: 14, marginBottom: 18 }}>Your passcode is:<br/><span style={{ color: "#FFD54F", fontWeight: "bold", fontSize: 30, letterSpacing: 4 }}>{PIN}</span></div>
            <button onClick={() => { setForgotMode(false); setShowSavedPin(false); setFaceFailed(0); }} style={{ background: "#1565C0", color: "white", border: "none", borderRadius: 20, padding: "10px 26px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia" }}>Back to Lock Screen</button>
          </div>
        ) : !phoneData.faceSignature ? (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, lineHeight: 1.6 }}>No Face ID was set up on this phone, so passcode recovery is not available.</div>
            <button onClick={() => setForgotMode(false)} style={{ marginTop: 18, background: "#607D8B", color: "white", border: "none", borderRadius: 20, padding: "10px 26px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia" }}>Back</button>
          </div>
        ) : (
          <FaceCamera
            mode="verify"
            savedSignature={phoneData.faceSignature}
            onResult={(r) => {
              if (r.success) {
                setShowSavedPin(true);
                setFaceFailed(0);
              } else {
                const nf = faceFailed + 1;
                setFaceFailed(nf);
                if (nf >= 3) { setLockedOut(true); }
              }
            }}
            onCancel={() => { setForgotMode(false); setFaceFailed(0); }}
          />
        )}
      </div>
      <button onClick={onClose} style={{ marginTop: 10, width: "100%", padding: "8px", background: "rgba(0,0,0,.3)", border: "none", borderRadius: 12, color: "#AAA", cursor: "pointer", fontSize: 12, fontFamily: "Georgia" }}>Put away</button>
    </div>
  );

  // Lock screen
  if (locked) return (
    <div style={phoneShell}>
      {notch}
      <div style={{ ...screenWrap, background: "linear-gradient(160deg,#0D47A1,#1565C0)", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 16px" }}>
        <div style={{ fontSize: 38, fontWeight: "200", color: "white", letterSpacing: 2, marginBottom: 2 }}>{timeStr}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginBottom: 16 }}>{lockedOut ? `Locked ${lockTimer}s` : wrongCount > 0 ? `${3 - wrongCount} attempts left` : "Enter passcode"}</div>
        <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
          {[0, 1, 2, 3].map(i => <div key={i} style={{ width: 15, height: 15, borderRadius: "50%", background: passcode.length > i ? (wrongPin ? "#F44336" : "#FFD54F") : "rgba(255,255,255,.3)", border: "2px solid rgba(255,255,255,.5)", transition: "background .15s" }} />)}
        </div>
        {wrongPin && <div style={{ color: "#F44336", fontSize: 11, marginBottom: 6 }}>{wrongCount >= 3 ? "Too many attempts — locked for 1 minute" : "Wrong passcode"}</div>}
        {lockedOut ? (
          <div style={{ color: "#FF5252", fontSize: 32, fontWeight: "bold", margin: "20px 0" }}>{lockTimer}s</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, width: "100%" }}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(d => (
              <button key={d} onClick={() => d !== "*" && d !== "#" && dialDigit(d)} style={{ padding: "11px 0", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 11, color: "white", fontSize: 19, cursor: d === "*" || d === "#" ? "default" : "pointer", fontFamily: "Georgia" }}>{d}</button>
            ))}
          </div>
        )}
        <button onClick={() => setForgotMode(true)} style={{ marginTop: 12, background: "none", border: "none", color: "rgba(255,255,255,.55)", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}>Forgot passcode?</button>
        {!phoneData.faceSetup && <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4 }}>Set up Face ID in phone setup for recovery</div>}
      </div>
      <button onClick={onClose} style={{ marginTop: 10, width: "100%", padding: "8px", background: "rgba(0,0,0,.3)", border: "none", borderRadius: 12, color: "#AAA", cursor: "pointer", fontSize: 12, fontFamily: "Georgia" }}>Put away</button>
    </div>
  );

  // Active call overlay
  if (calling) return (
    <div style={phoneShell}>
      {notch}
      <div style={screenWrap}>
        <CallScreen contactName={calling} darkMode={DM} onEnd={() => setCalling(null)} />
      </div>
      <button onClick={onClose} style={{ marginTop: 10, width: "100%", padding: "8px", background: "rgba(0,0,0,.3)", border: "none", borderRadius: 12, color: "#AAA", cursor: "pointer", fontSize: 12, fontFamily: "Georgia" }}>Put away</button>
    </div>
  );

  // App open
  if (appOpen) return (
    <div style={phoneShell}>
      {notch}
      <div style={screenWrap}>
        {appOpen === "messages" && <AppMessages contacts={contacts} messages={messages} setMessages={setMessages} darkMode={DM} />}
        {appOpen === "phone"    && <AppPhone contacts={contacts} darkMode={DM} onCall={c => { setAppOpen(null); setCalling(c); }} />}
        {appOpen === "social"   && <AppSocial feed={feed} likedPosts={likedPosts} setLikedPosts={setLikedPosts} darkMode={DM} />}
        {appOpen === "settings" && <AppSettings settings={settings} setSettings={setSettings} darkMode={DM} phoneCase={phoneData.phoneCase || "default"} onCaseChange={id => setPhoneData(pd => ({ ...pd, phoneCase: id }))} />}
        {appOpen === "snake"    && <AppSnake darkMode={DM} />}
        {appOpen === "flappy"   && <AppFlappy darkMode={DM} />}
        {appOpen === "camera"   && <AppCamera darkMode={DM} />}
        {appOpen === "weather"  && <AppWeather darkMode={DM} />}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => setAppOpen(null)} style={{ flex: 1, padding: "8px", background: "rgba(0,0,0,.3)", border: "none", borderRadius: 12, color: "#AAA", cursor: "pointer", fontSize: 12, fontFamily: "Georgia" }}>Home</button>
        <button onClick={onClose} style={{ flex: 1, padding: "8px", background: "rgba(0,0,0,.3)", border: "none", borderRadius: 12, color: "#AAA", cursor: "pointer", fontSize: 12, fontFamily: "Georgia" }}>Put away</button>
      </div>
    </div>
  );

  // Home screen
  const apps = [
    { id: "messages", label: "Messages", bg: "linear-gradient(135deg,#43A047,#2E7D32)",  icon: "MSG"  },
    { id: "phone",    label: "Phone",    bg: "linear-gradient(135deg,#1E88E5,#1565C0)",  icon: "CALL" },
    { id: "social",   label: "FishGram", bg: "linear-gradient(135deg,#E91E63,#AD1457)",  icon: "FG"   },
    { id: "settings", label: "Settings", bg: "linear-gradient(135deg,#607D8B,#37474F)",  icon: "SET"  },
    { id: "snake",    label: "Snake",    bg: "linear-gradient(135deg,#FF6F00,#E65100)",  icon: "SNK"  },
    { id: "flappy",   label: "Flappy",   bg: "linear-gradient(135deg,#7B1FA2,#4A148C)",  icon: "FLY"  },
    { id: "camera",   label: "Camera",   bg: "linear-gradient(135deg,#37474F,#263238)",  icon: "CAM"  },
    { id: "weather",  label: "Weather",  bg: "linear-gradient(135deg,#0288D1,#01579B)",  icon: "WTH"  },
  ];
  return (
    <div style={phoneShell}>
      {notch}
      <div style={{ ...screenWrap, background: DM ? "#111" : "linear-gradient(160deg,#1565C0,#0D47A1)" }}>
        <div style={{ padding: "14px 16px 10px" }}>
          <div style={{ color: "white", fontSize: 30, fontWeight: "200", letterSpacing: 1, marginBottom: 2 }}>{timeStr}</div>
          <div style={{ color: "rgba(255,255,255,.6)", fontSize: 11, marginBottom: 16 }}>Goliath Grouper</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {apps.map(app => (
              <div key={app.id} onClick={() => setAppOpen(app.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: app.bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,.4)", border: "1px solid rgba(255,255,255,.1)" }}>
                  <span style={{ color: "white", fontSize: 11, fontWeight: "bold", fontFamily: "Georgia" }}>{app.icon}</span>
                </div>
                <span style={{ color: "white", fontSize: 10, textShadow: "0 1px 3px rgba(0,0,0,.5)" }}>{app.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Dock */}
        <div style={{ margin: "12px 12px 10px", background: "rgba(255,255,255,.12)", borderRadius: 20, padding: 10, display: "flex", justifyContent: "space-around" }}>
          {[{ id: "messages", bg: "#43A047", icon: "MSG" }, { id: "phone", bg: "#1E88E5", icon: "CALL" }, { id: "social", bg: "#E91E63", icon: "FG" }, { id: "settings", bg: "#607D8B", icon: "SET" }].map(a => (
            <div key={a.id} onClick={() => setAppOpen(a.id)} style={{ width: 44, height: 44, borderRadius: 12, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>{a.icon}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onClose} style={{ marginTop: 10, width: "100%", padding: "8px", background: "rgba(0,0,0,.3)", border: "none", borderRadius: 12, color: "#AAA", cursor: "pointer", fontSize: 12, fontFamily: "Georgia" }}>Put away</button>
    </div>
  );
}


// ─── FIRST-PERSON FISHING VIEW ────────────────────────────────────────────────
// ─── HELPER: build a 3D fish model from a fish data object ───────────────────
function hexToNum(h) {
  if (typeof h === "number") return h;
  if (!h) return 0x888888;
  return parseInt(h.replace("#", ""), 16);
}

function build3DFish(fish) {
  var group = new THREE.Group();
  var col = hexToNum(fish.color);
  var bel = hexToNum(fish.belly);
  var finCol = hexToNum(fish.fin || fish.color);
  var gillCol = hexToNum(fish.gill || fish.fin || "#5A1010");
  var body = fish.body || "oval";
  var bodyMat = new THREE.MeshPhongMaterial({ color: col, shininess: 60 });
  var bellyMat = new THREE.MeshPhongMaterial({ color: bel, shininess: 40 });
  var finMat = new THREE.MeshPhongMaterial({ color: finCol, shininess: 30, side: THREE.DoubleSide, transparent: true, opacity: 0.92 });
  var gillMat = new THREE.MeshPhongMaterial({ color: gillCol, shininess: 10, side: THREE.DoubleSide });

  var L = 1.3, fat = 0.55, wide = 0.32, tailSize = 0.5;
  if (body === "torpedo") { L = 1.7; fat = 0.42; }
  else if (body === "chunky") { L = 1.1; fat = 0.7; }
  else if (body === "flat") { L = 1.2; fat = 0.7; wide = 0.18; }
  else if (body === "billfish") { L = 2.0; fat = 0.38; }
  else if (body === "spiny") { L = 1.0; fat = 0.6; }
  else if (body === "shark") { L = 2.0; fat = 0.5; tailSize = 0.7; }

  var bodyM = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 16), bodyMat);
  bodyM.scale.set(L, fat, wide);
  group.add(bodyM);
  var bellyM = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), bellyMat);
  bellyM.scale.set(L * 0.95, fat * 0.7, wide * 0.95);
  bellyM.position.y = -0.12;
  group.add(bellyM);

  var tail = new THREE.Mesh(new THREE.ConeGeometry(0.3 * (tailSize / 0.5), tailSize, 12), finMat);
  tail.rotation.z = Math.PI / 2;
  tail.position.x = -L * 0.5;
  tail.scale.set(1, 1, 0.4);
  group.add(tail);

  if (body === "spiny") {
    for (var si = 0; si < 5; si++) {
      var spine = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.5, 6), finMat);
      spine.position.set(-0.2 + si * 0.15, 0.35, 0);
      group.add(spine);
    }
  } else {
    var dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 8), finMat);
    dorsal.position.set(L * 0.05, 0.32, 0);
    dorsal.scale.set(1.6, 1, 0.3);
    group.add(dorsal);
  }

  // ── Gills: a curved operculum (gill plate) plus three gill slits on each side ──
  var gillX = L * 0.24;            // gill plate sits just behind the head
  var halfW = 0.45 * wide;
  if (body !== "billfish") {
    for (var gs = 0; gs < 2; gs++) {
      var side = gs === 0 ? 1 : -1;
      // gill plate (operculum) — a slim curved panel flush to the body
      var plate = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), gillMat);
      plate.scale.set(0.18 * fat / 0.55, fat * 0.9, wide * 0.55);
      plate.position.set(gillX, 0.02, side * halfW * 0.55);
      group.add(plate);
      // three dark gill slits raked back from the plate
      for (var sl = 0; sl < 3; sl++) {
        var slit = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.012, 4, 8, Math.PI * 0.9), gillMat);
        slit.position.set(gillX + sl * 0.05 - 0.04, 0.0, side * halfW * 0.62);
        slit.rotation.y = side * Math.PI / 2;
        slit.rotation.x = -Math.PI / 2;
        slit.scale.set(1, fat / 0.55, 1);
        group.add(slit);
      }
    }
  }

  // ── Pectoral fins: one on each side, just behind the gills, swept back ──
  if (body !== "shark" && body !== "billfish") {
    for (var pf = 0; pf < 2; pf++) {
      var pside = pf === 0 ? 1 : -1;
      var pec = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.34, 7), finMat);
      pec.position.set(L * 0.16, -0.1, pside * halfW * 0.85);
      pec.scale.set(0.5, 1, 0.18);
      pec.rotation.z = Math.PI / 2.4;
      pec.rotation.y = pside * -0.5;
      group.add(pec);
    }
  } else if (body === "shark") {
    for (var sf = 0; sf < 2; sf++) {
      var sfside = sf === 0 ? 1 : -1;
      var sfin = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 6), finMat);
      sfin.position.set(L * 0.05, -0.16, sfside * halfW * 1.0);
      sfin.scale.set(0.5, 1, 0.2);
      sfin.rotation.z = Math.PI / 2.2;
      sfin.rotation.y = sfside * -0.7;
      group.add(sfin);
    }
  }

  // ── Pelvic + anal fins on the underside for a fuller silhouette ──
  if (body !== "billfish" && body !== "shark") {
    var pelvic = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 6), finMat);
    pelvic.position.set(-L * 0.05, -0.28 * fat / 0.55 - 0.04, 0);
    pelvic.scale.set(1.2, 1, 0.25);
    group.add(pelvic);
    var anal = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.26, 6), finMat);
    anal.position.set(-L * 0.26, -0.27 * fat / 0.55 - 0.02, 0);
    anal.scale.set(1.3, 1, 0.25);
    group.add(anal);
  }

  // ── Mouth: a thin dark seam at the snout ──
  var mouth = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 4, 10, Math.PI), new THREE.MeshPhongMaterial({ color: 0x1a0e0e, shininess: 5 }));
  mouth.position.set(L * 0.45, -0.05, 0);
  mouth.rotation.y = Math.PI / 2;
  mouth.scale.set(1, 0.5, wide * 2.2);
  group.add(mouth);

  var eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshPhongMaterial({ color: 0xffffff }));
  eyeW.position.set(L * 0.42, 0.1, 0.16); group.add(eyeW);
  var eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), new THREE.MeshPhongMaterial({ color: 0x111111 }));
  eye.position.set(L * 0.45, 0.1, 0.2); group.add(eye);
  // mirror the eye onto the far side so the fish reads from both flanks
  var eyeW2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshPhongMaterial({ color: 0xffffff }));
  eyeW2.position.set(L * 0.42, 0.1, -0.16); group.add(eyeW2);
  var eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), new THREE.MeshPhongMaterial({ color: 0x111111 }));
  eye2.position.set(L * 0.45, 0.1, -0.2); group.add(eye2);

  if (body === "billfish") {
    var bill = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.9, 8), finMat);
    bill.rotation.z = -Math.PI / 2;
    bill.position.x = L * 0.6;
    group.add(bill);
  }
  return group;
}

// ─── 3D FIRST-PERSON FISHING VIEW (Three.js) ────────────────────────────────
function FishingView({ fstate, caughtF, cfg, bait, lure, time, reelPct }) {
  const mountRef = useRef(null);
  const objs = useRef({});
  const stateRef = useRef({ fstate: "idle", caughtF: null, castT: 0, fishRise: 0, fishMesh: null });

  // keep latest props in a ref for the animation loop
  useEffect(function () {
    var prev = stateRef.current.fstate;
    stateRef.current.fstate = fstate;
    stateRef.current.caughtF = caughtF;
    stateRef.current.reelPct = reelPct;
    if (fstate === "casting" && prev !== "casting") stateRef.current.castT = 0;
    if (fstate === "caught" && prev !== "caught") {
      stateRef.current.fishRise = 0;
      var o = objs.current;
      if (o.scene) {
        if (stateRef.current.fishMesh) o.scene.remove(stateRef.current.fishMesh);
        if (caughtF) {
          var m = build3DFish(caughtF);
          m.position.set(0, 0, -22);
          o.scene.add(m);
          stateRef.current.fishMesh = m;
        }
      }
    }
    if (fstate !== "caught" && stateRef.current.fishMesh && objs.current.scene) {
      objs.current.scene.remove(stateRef.current.fishMesh);
      stateRef.current.fishMesh = null;
    }
  }, [fstate, caughtF, reelPct]);

  useEffect(function () {
    var mount = mountRef.current;
    if (!mount) return;
    var width = mount.clientWidth || 640;
    var height = 300;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x9DC8E8, 35, 120);

    var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500);
    camera.position.set(0, 4.5, 9);
    camera.lookAt(0, 1.5, -20);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.display = "block";

    var sun = new THREE.DirectionalLight(0xfff4e0, 1.3);
    sun.position.set(20, 40, -10); scene.add(sun);
    scene.add(new THREE.AmbientLight(0x88aacc, 0.7));

    var sunMesh = new THREE.Mesh(new THREE.SphereGeometry(6, 24, 24), new THREE.MeshBasicMaterial({ color: 0xFFF2B0 }));
    sunMesh.position.set(30, 32, -85); scene.add(sunMesh);
    var sunGlow = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 24), new THREE.MeshBasicMaterial({ color: 0xFFE680, transparent: true, opacity: 0.25 }));
    sunGlow.position.copy(sunMesh.position); scene.add(sunGlow);

    var cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    for (var ci = 0; ci < 6; ci++) {
      var cloud = new THREE.Group();
      for (var cb = 0; cb < 4; cb++) {
        var puff = new THREE.Mesh(new THREE.SphereGeometry(3 + Math.random() * 2, 10, 8), cloudMat);
        puff.position.set(cb * 4 - 6, Math.random() * 2, 0); puff.scale.y = 0.6;
        cloud.add(puff);
      }
      cloud.position.set(-60 + Math.random() * 120, 26 + Math.random() * 12, -65 - Math.random() * 25);
      scene.add(cloud);
    }

    var oceanGeo = new THREE.PlaneGeometry(400, 400, 70, 70);
    oceanGeo.rotateX(-Math.PI / 2);
    var oceanMat = new THREE.MeshPhongMaterial({ color: 0x1565C0, shininess: 90, transparent: true, opacity: 0.95 });
    var ocean = new THREE.Mesh(oceanGeo, oceanMat); scene.add(ocean);

    // Boat deck (uses shirt color is too odd; wood deck)
    var deck = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 6), new THREE.MeshPhongMaterial({ color: 0x9C6B3F }));
    deck.position.set(0, 2.0, 10.5); scene.add(deck);
    var railMat = new THREE.MeshPhongMaterial({ color: 0xECEFF1 });
    var rail = new THREE.Mesh(new THREE.BoxGeometry(8, 0.18, 0.18), railMat);
    rail.position.set(0, 3.1, 7.6); scene.add(rail);
    [-3.7, 0, 3.7].forEach(function (px) {
      var post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8), railMat);
      post.position.set(px, 2.6, 7.6); scene.add(post);
    });

    // Rod + reel attached to camera
    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 7, 8), new THREE.MeshPhongMaterial({ color: 0x3E2723 }));
    rod.position.set(1.6, -1.2, -2.5); rod.rotation.set(-0.5, 0, -0.25); camera.add(rod);
    var reelM = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.25, 12), new THREE.MeshPhongMaterial({ color: 0x555555 }));
    reelM.position.set(1.5, -1.7, -1.2); reelM.rotation.z = Math.PI / 2; camera.add(reelM);
    scene.add(camera);
    var rodTip = new THREE.Vector3();

    var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
    scene.add(line);

    var bobber = new THREE.Group();
    var bt = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 12), new THREE.MeshPhongMaterial({ color: 0xF44336 }));
    var bb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 12), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    bt.position.y = 0.18; bb.position.y = -0.18; bobber.add(bt); bobber.add(bb);
    bobber.position.set(0, 0, -22); bobber.visible = false; scene.add(bobber);

    var ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.7, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.1, -22); ring.visible = false; scene.add(ring);

    objs.current = { scene: scene, camera: camera, renderer: renderer, ocean: ocean, bobber: bobber, line: line, ring: ring, rod: rod, rodTip: rodTip, sunGlow: sunGlow };

    function onResize() {
      if (!mount) return;
      var w = mount.clientWidth || 640;
      camera.aspect = w / height; camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    }
    window.addEventListener("resize", onResize);

    var clock = new THREE.Clock();
    var rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      var st = stateRef.current;

      var pos = ocean.geometry.attributes.position;
      for (var i = 0; i < pos.count; i++) {
        var x = pos.getX(i), z = pos.getZ(i);
        pos.setY(i, Math.sin(x * 0.12 + t * 1.1) * 0.5 + Math.cos(z * 0.15 + t * 0.9) * 0.5 + Math.sin((x + z) * 0.08 + t * 0.6) * 0.3);
      }
      pos.needsUpdate = true;

      camera.position.y = 4.5 + Math.sin(t * 0.8) * 0.12;
      camera.rotation.z = Math.sin(t * 0.5) * 0.006;
      sunGlow.material.opacity = 0.22 + Math.sin(t * 1.5) * 0.05;

      rod.updateMatrixWorld();
      rodTip.set(0, 3.5, 0); rodTip.applyMatrix4(rod.matrixWorld);

      var fs = st.fstate;
      if (fs === "casting") {
        st.castT += 0.04;
        var ct = Math.min(1, st.castT);
        bobber.visible = true; bobber.position.x = 0;
        bobber.position.z = 10 + (-22 - 10) * ct;
        bobber.position.y = Math.sin(ct * Math.PI) * 4 + 0.2;
        ring.visible = false;
      } else if (fs === "waiting" || fs === "biting" || fs === "reeling") {
        bobber.visible = true; bobber.position.x = 0;
        if (fs === "biting") {
          bobber.position.z = -22;
          bobber.position.y = -0.3 + Math.sin(t * 18) * 0.35;
          ring.visible = true; ring.position.set(0, 0.1, -22); ring.scale.setScalar(1 + Math.sin(t * 10) * 0.3);
        } else if (fs === "reeling") {
          // Pull the bobber/fish in toward the boat as reel progress climbs (0..100 -> far..near)
          var rp = Math.max(0, Math.min(100, st.reelPct || 0));
          var zNear = 2, zFar = -22;
          bobber.position.z = zFar + (zNear - zFar) * (rp / 100);
          bobber.position.y = 0.1 + Math.sin(t * 12) * 0.3; // fighting splashes
          ring.visible = true;
          ring.position.set(0, 0.1, bobber.position.z);
          ring.scale.setScalar(1 + Math.sin(t * 9) * 0.25);
        } else {
          bobber.position.z = -22;
          bobber.position.y = 0.2 + Math.sin(t * 2.5) * 0.25; ring.visible = false;
        }
      } else {
        bobber.visible = false; ring.visible = false;
      }

      if (bobber.visible) {
        var lp = line.geometry.attributes.position;
        lp.setXYZ(0, rodTip.x, rodTip.y, rodTip.z);
        lp.setXYZ(1, bobber.position.x, bobber.position.y, bobber.position.z);
        lp.needsUpdate = true; line.visible = true;
      } else { line.visible = false; }

      if (st.fishMesh && fs === "caught") {
        st.fishRise += 0.02;
        var rt = Math.min(1, st.fishRise);
        st.fishMesh.position.z = -22 + (4 - (-22)) * rt;
        st.fishMesh.position.y = Math.sin(rt * Math.PI) * 5 + 1;
        st.fishMesh.rotation.y = t * 1.5;
        st.fishMesh.rotation.z = Math.sin(t * 3) * 0.3;
      }

      renderer.render(scene, camera);
    }
    animate();

    return function () {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100%", height: 300, borderRadius: 14, overflow: "hidden", display: "block" }}>
      {/* Bait/lure label overlay */}
      {(bait || lure) && (
        <div style={{ position: "absolute", margin: 8, padding: "4px 10px", background: "rgba(0,0,0,.5)", borderRadius: 8, pointerEvents: "none" }}>
          <span style={{ fontSize: 10, color: "#FFD54F", fontFamily: "Georgia" }}>Using: {bait ? bait.name : lure ? lure.name : ""}</span>
        </div>
      )}
    </div>
  );
}

// ─── TACKLE MODAL ─────────────────────────────────────────────────────────────
function TackleModal({ mode, selectedBait, selectedLure, onSelectBait, onSelectLure, onClose }) {
  const [tab, setTab] = useState(mode==="lure"?"lures":"bait");
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#0D1B2A",width:"100%",maxWidth:640,borderRadius:"20px 20px 0 0",padding:"16px 14px 24px",border:"1px solid #1E3A5A",maxHeight:"75vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:16,fontWeight:"bold",color:"#FFD54F",fontFamily:"Georgia"}}>Tackle Selection</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#90CAF9",cursor:"pointer",fontSize:18}}>X</button>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {["bait","lures"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"8px",background:tab===t?"#1565C0":"#142030",color:tab===t?"#FFD54F":"#90CAF9",border:`1px solid ${tab===t?"#FFD54F":"#1E3A5A"}`,borderRadius:10,cursor:"pointer",fontSize:12,fontFamily:"Georgia"}}>
              {t==="bait"?"Bait Bucket":"Lure Box"}
            </button>
          ))}
        </div>
        {tab==="bait" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{fontSize:11,color:"#90CAF9",marginBottom:1}}>Pick up a bait from the bucket. You can only carry a bait OR a lure, not both.</div>
            <div style={{fontSize:10,color:"#FFD54F",marginBottom:4}}>Double-click the bait you're holding to put it back.</div>
            {BAITS.map(b=>{
              const isSel = selectedBait && selectedBait.id===b.id;
              return (
              <div key={b.id} onClick={()=>{ if(!isSel){onSelectBait(b);onClose();} }} onDoubleClick={()=>{ if(isSel){onSelectBait(b);} }} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:isSel?"rgba(21,101,192,.25)":"rgba(255,255,255,.04)",borderRadius:10,border:`1px solid ${isSel?"#FFD54F":"#1E3A5A"}`,cursor:"pointer",transition:"all .15s"}}>
                {/* Fish bait icon */}
                <div style={{width:36,height:36,borderRadius:"50%",background:`radial-gradient(circle,${b.color},${b.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 8px ${b.color}55`}}>
                  <svg width={24} height={14} viewBox="0 0 24 14">
                    <ellipse cx={11} cy={7} rx={9} ry={5} fill={b.color}/>
                    <polygon points="20,7 24,3 24,11" fill={b.color} opacity=".8"/>
                    <circle cx={4} cy={5} r={2} fill="#111"/>
                    <circle cx={3.5} cy={4.5} r={.7} fill="white"/>
                  </svg>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:"bold",color:isSel?"#FFD54F":"#EEE"}}>{b.name}</div>
                  <div style={{fontSize:11,color:"#90CAF9"}}>{b.desc}</div>
                </div>
                <div style={{background:"rgba(76,175,80,.2)",border:"1px solid #4CAF50",borderRadius:8,padding:"2px 8px",fontSize:10,color:"#4CAF50"}}>+{b.bonus} power</div>
                {isSel && <div style={{color:"#FFD54F",fontSize:10,fontWeight:"bold",textAlign:"center"}}>Holding<br/>(2x-click to drop)</div>}
              </div>
            );})}
          </div>
        )}
        {tab==="lures" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{fontSize:11,color:"#90CAF9",marginBottom:1}}>Choose a lure from the box. You can only carry a bait OR a lure, not both.</div>
            <div style={{fontSize:10,color:"#FFD54F",marginBottom:4}}>Double-click the lure you're holding to put it back.</div>
            {LURES.map(l=>{
              const isSel = selectedLure && selectedLure.id===l.id;
              return (
              <div key={l.id} onClick={()=>{ if(!isSel){onSelectLure(l);onClose();} }} onDoubleClick={()=>{ if(isSel){onSelectLure(l);} }} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:isSel?"rgba(21,101,192,.25)":"rgba(255,255,255,.04)",borderRadius:10,border:`1px solid ${isSel?"#FFD54F":"#1E3A5A"}`,cursor:"pointer",transition:"all .15s"}}>
                {/* Lure icon */}
                <div style={{width:36,height:36,borderRadius:8,background:`linear-gradient(135deg,${l.color},${l.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 2px 8px ${l.color}55`}}>
                  <svg width={28} height={12} viewBox="0 0 28 12">
                    <ellipse cx={12} cy={6} rx={10} ry={4.5} fill={l.color}/>
                    <circle cx={4} cy={5} r={1.8} fill="#111"/>
                    <path d="M 22,6 Q 26,3 27,6 Q 26,9 22,6" stroke="#666" strokeWidth={1} fill="none"/>
                    <line x1={22} y1={6} x2={27} y2={9} stroke="#888" strokeWidth={.8}/>
                    <line x1={27} y1={6} x2={27} y2={10} stroke="#888" strokeWidth={1}/>
                  </svg>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:"bold",color:isSel?"#FFD54F":"#EEE"}}>{l.name}</div>
                  <div style={{fontSize:11,color:"#90CAF9"}}>{l.desc}</div>
                </div>
                <div style={{background:"rgba(76,175,80,.2)",border:"1px solid #4CAF50",borderRadius:8,padding:"2px 8px",fontSize:10,color:"#4CAF50"}}>+{l.bonus} power</div>
                {isSel && <div style={{color:"#FFD54F",fontSize:10,fontWeight:"bold",textAlign:"center"}}>Rigged<br/>(2x-click to drop)</div>}
              </div>
            );})}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOM VIEW (first-person, no emojis) ─────────────────────────────────────
function RoomFP({ room, rs, onAction, time }) {
  const W=640, H=360;
  const TapBox = ({ x,y,w,h,action,children,label }) => (
    <g onClick={()=>onAction(action)} style={{cursor:"pointer"}}>
      {children}
      <rect x={x-3} y={y-3} width={w+6} height={h+6} rx={5} fill="none" stroke="#FFD54F" strokeWidth={1.4} strokeDasharray="5,4" opacity=".55"/>
      {label&&<text x={x+w/2} y={y+h+15} textAnchor="middle" fontSize={9} fill="#FFD54F" fontFamily="Georgia" opacity=".8">{label}</text>}
    </g>
  );
  const Tap = ({ cx,cy,r=26,action,children,label }) => (
    <g onClick={()=>onAction(action)} style={{cursor:"pointer"}}>
      {children}
      <circle cx={cx} cy={cy} r={r+5} fill="none" stroke="#FFD54F" strokeWidth={1.4} strokeDasharray="5,4" opacity=".55"/>
      {label&&<text x={cx} y={cy+r+16} textAnchor="middle" fontSize={9} fill="#FFD54F" fontFamily="Georgia" opacity=".8">{label}</text>}
    </g>
  );

  if (room === "deck") {
    const sunX = 500+Math.sin(time*.0004)*22;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#061221"/><stop offset="42%" stopColor="#0D47A1"/><stop offset="100%" stopColor="#1976D2"/></linearGradient>
          <linearGradient id="dsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1565C0"/><stop offset="100%" stopColor="#0A3D8F"/></linearGradient>
          <linearGradient id="dfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A1887F"/><stop offset="100%" stopColor="#5D4037"/></linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#dsky)"/>
        <circle cx={sunX} cy={55} r={65} fill="#FFD54F" opacity=".1"/>
        <circle cx={sunX} cy={55} r={32} fill="#FFD54F" opacity=".9"/>
        <circle cx={sunX} cy={55} r={24} fill="#FFECB3"/>
        {[[55,30,.7,160],[200,22,.55,130],[390,34,.7,190],[540,18,.6,120]].map(([x,y,o,cw],i)=>(
          <g key={i} opacity={o}><ellipse cx={x} cy={y} rx={cw*.44} ry={14} fill="white"/><ellipse cx={x+cw*.2} cy={y+5} rx={cw*.28} ry={11} fill="rgba(255,255,255,.9)"/></g>
        ))}
        <rect x={0} y={192} width={W} height={5} fill="rgba(255,255,255,.14)"/>
        <rect x={0} y={197} width={W} height={H-197} fill="url(#dsea)"/>
        {[207,220,234,250].map((wy,i)=>Array.from({length:8},(_,j)=><path key={`${i}${j}`} d={`M ${j*85+i*10} ${wy} Q ${j*85+i*10+22} ${wy-5} ${j*85+i*10+43} ${wy}`} stroke={`rgba(255,255,255,${.16-i*.02})`} strokeWidth={1.3} fill="none"/>))}
        <rect x={0} y={278} width={W} height={H-278} fill="url(#dfloor)"/>
        {Array.from({length:11},(_,i)=><line key={i} x1={i*62} y1={278} x2={i*62} y2={H} stroke="rgba(0,0,0,.16)" strokeWidth={2}/>)}
        <rect x={0} y={270} width={W} height={8} fill="rgba(255,255,255,.88)"/>
        {Array.from({length:16},(_,i)=><rect key={i} x={i*42+2} y={248} width={4} height={24} rx={2} fill="rgba(255,255,255,.75)"/>)}

        {/* Life ring */}
        <TapBox x={14} y={222} w={44} h={44} action="lifering" label={rs.liferingThrown?"Pull in":"Throw"}>
          <circle cx={36} cy={244} r={20} fill="none" stroke="#F44336" strokeWidth={8}/>
          <circle cx={36} cy={244} r={20} fill="none" stroke="white" strokeWidth={8} strokeDasharray="20,20" strokeDashoffset="10"/>
          {rs.liferingThrown&&<line x1={36} y1={264} x2={52} y2={310} stroke="#F44336" strokeWidth={2} strokeDasharray="3,3"/>}
        </TapBox>

        {/* Tackle box */}
        <TapBox x={90} y={286} w={120} h={62} action="tacklebox" label={rs.tackleboxOpen?"Close":"Open"}>
          <rect x={90} y={286} width={120} height={62} rx={7} fill="#BF360C"/>
          <rect x={92} y={288} width={116} height={58} rx={6} fill="#E64A19"/>
          <rect x={90} y={286} width={120} height={8} rx={7} fill="#FF5722"/>
          <rect x={142} y={344} width={16} height={6} rx={3} fill="#FFD54F"/>
          <path d="M 125,286 Q 150,270 175,286" stroke="#BF360C" strokeWidth={4} fill="none" strokeLinecap="round"/>
          <text x={150} y={324} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,.8)" fontFamily="Georgia" fontWeight="bold">TACKLE</text>
          {rs.tackleboxOpen&&<>
            <rect x={90} y={228} width={120} height={62} rx={7} fill="#BF360C"/>
            <rect x={93} y={230} width={114} height={58} rx={5} fill="#E64A19"/>
            {[0,1,2,3,4].map(i=><line key={i} x1={106+i*22} y1={231} x2={106+i*22} y2={286} stroke="rgba(0,0,0,.3)" strokeWidth={1.2}/>)}
            {LURES.slice(0,5).map((l,i)=><ellipse key={i} cx={103+i*22} cy={255} rx={9} ry={4} fill={l.color} opacity=".9"/>)}
            {[100,118,136,154].map((lx,i)=><ellipse key={i} cx={lx} cy={272} rx={5} ry={7} fill="#607D8B" opacity=".9"/>)}
          </>}
        </TapBox>

        {/* Bait bucket */}
        <TapBox x={238} y={280} w={72} h={78} action="baitbucket" label={rs.baitbucketOpen?"Close":"Open"}>
          <path d={`M 242,358 L 235,310 L 308,310 L 302,358 Z`} fill="#0D47A1" stroke="#1565C0" strokeWidth={2}/>
          <ellipse cx={271} cy={310} rx={36} ry={10} fill="#1565C0" stroke="#0D47A1" strokeWidth={2}/>
          <ellipse cx={271} cy={315} rx={30} ry={8} fill="#29B6F6" opacity=".8"/>
          <path d="M 238,308 Q 271,290 304,308" stroke="#90A4AE" strokeWidth={3} fill="none" strokeLinecap="round"/>
          {rs.baitbucketOpen&&<>
            <ellipse cx={271} cy={318} rx={26} ry={7} fill="#0288D1" opacity=".7"/>
            {BAITS.slice(0,4).map((b,i)=><ellipse key={i} cx={252+i*12} cy={322+i%2*5} rx={8} ry={3.5} fill={b.color} opacity=".9"/>)}
            <text x={271} y={302} textAnchor="middle" fontSize={8} fill="#FFD54F" fontFamily="Georgia">Live bait</text>
          </>}
          <text x={271} y={348} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,.75)" fontFamily="Georgia">BAIT</text>
        </TapBox>

        {/* Cooler */}
        <TapBox x={332} y={292} w={118} h={66} action="cooler" label={rs.coolerOpen?"Close":"Open"}>
          <rect x={332} y={292} width={118} height={66} rx={8} fill="#EEF2FF" stroke="#C5CAE9" strokeWidth={2}/>
          <rect x={332} y={292} width={118} height={16} rx={8} fill={rs.coolerOpen?"#7986CB":"#B0BEC5"}/>
          <rect x={374} y={348} width={34} height={7} rx={3} fill="#FFD54F"/>
          <rect x={334} y={312} width={7} height={24} rx={3} fill="#9FA8DA"/>
          <rect x={441} y={312} width={7} height={24} rx={3} fill="#9FA8DA"/>
          {rs.coolerOpen&&<>
            {[338,354,370,386,402,418].map((dx,i)=><polygon key={i} points={`${dx},302 ${dx+6},296 ${dx+12},302 ${dx+6},308`} fill="#E3F2FD" opacity=".9"/>)}
            <ellipse cx={391} cy={328} rx={42} ry={10} fill="#EF5350" opacity=".55"/>
          </>}
          <text x={391} y={334} textAnchor="middle" fontSize={9} fill={rs.coolerOpen?"white":"#607D8B"} fontFamily="Georgia">COOLER</text>
        </TapBox>

        {/* Fishing chair */}
        <TapBox x={475} y={238} w={82} h={110} action="fishingchair" label={rs.fishingchair?"Stand":"Sit"}>
          <line x1={486} y1={348} x2={481} y2={278} stroke="#795548" strokeWidth={5} strokeLinecap="round"/>
          <line x1={546} y1={348} x2={551} y2={278} stroke="#795548" strokeWidth={5} strokeLinecap="round"/>
          <rect x={473} y={272} width={82} height={14} rx={6} fill={rs.fishingchair?"#1565C0":"#1976D2"}/>
          <rect x={471} y={238} width={14} height={42} rx={5} fill="#795548"/>
          <rect x={553} y={272} width={18} height={8} rx={3} fill="#8D6E47"/>
          <circle cx={562} cy={271} r={7} fill="#8D6E47" stroke="#6D4C41" strokeWidth={1.5}/>
          {rs.fishingchair&&<><ellipse cx={514} cy={265} rx={18} ry={15} fill="#F5C6A0"/><rect x={498} y={276} width={32} height={20} rx={4} fill="#2C3E50"/></>}
        </TapBox>

        {/* Rod rack */}
        {[{x:438,c:"#5D4037"},{x:452,c:"#3E2723"},{x:466,c:"#4A2912"}].map(({x,c},i)=>(
          <g key={i} style={{pointerEvents:"none"}}>
            <line x1={x} y1={348} x2={x+7} y2={228} stroke={c} strokeWidth={3.5} strokeLinecap="round"/>
            <circle cx={x+3} cy={285} r={7} fill="#888" stroke="#555" strokeWidth={1.5}/>
            <line x1={x+7} y1={228} x2={x+7} y2={178} stroke="rgba(200,220,255,.35)" strokeWidth={1} strokeDasharray="3,4"/>
          </g>
        ))}

        {/* Net */}
        <TapBox x={592} y={234} w={44} h={76} action="fishnet" label={rs.fishnetDeployed?"Pull in":"Cast net"}>
          <rect x={610} y={233} width={6} height={32} rx={3} fill="#5D4037"/>
          <ellipse cx={614} cy={278} rx={22} ry={28} fill="none" stroke="#8D6E47" strokeWidth={3}/>
          {rs.fishnetDeployed
            ?<>{[0,1,2,3].map(i=><line key={i} x1={594} y1={268+i*10} x2={634} y2={268+i*10} stroke="#8D6E47" strokeWidth={1.2} opacity=".6"/>)}{[0,1,2,3,4].map(i=><line key={i} x1={594+i*10} y1={252} x2={594+i*10} y2={308} stroke="#8D6E47" strokeWidth={1.2} opacity=".6"/>)}</>
            :<>{[0,1,2].map(i=><line key={i} x1={596} y1={264+i*10} x2={632} y2={264+i*10} stroke="#A1887F" strokeWidth={1} opacity=".5"/>)}</>
          }
        </TapBox>

        <text x={W/2} y={H-4} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,.5)" fontFamily="Georgia">Tap any item to interact</text>
      </svg>
    );
  }

  if (room === "kitchen") return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="kwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF8E1"/><stop offset="100%" stopColor="#FFE082"/></linearGradient>
        <linearGradient id="kfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D7CCC8"/><stop offset="100%" stopColor="#A1887F"/></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#kwall)"/>
      {Array.from({length:17},(_,i)=>Array.from({length:6},(_,j)=><rect key={`t${i}${j}`} x={i*38+1} y={j*28+36} width={36} height={26} rx={2} fill={((i+j)%2===0)?"#FFECB3":"#FFD54F"} opacity=".42"/>))}
      <rect x={0} y={252} width={W} height={H-252} fill="url(#kfloor)"/>
      {Array.from({length:11},(_,i)=><line key={i} x1={i*62} y1={252} x2={i*62} y2={H} stroke="rgba(0,0,0,.1)" strokeWidth={2}/>)}
      <rect x={0} y={210} width={W} height={44} fill="#8D6E47"/>
      <rect x={0} y={210} width={W} height={9} fill="#BCAAA4"/>
      {[0,120,240].map((cx,i)=><g key={i}><rect x={cx+2} y={42} width={110} height={76} rx={4} fill="#8D6E47" stroke="#6D4C41" strokeWidth={1.5}/><rect x={cx+4} y={44} width={106} height={72} rx={3} fill="#795548"/><circle cx={cx+57} cy={106} r={5} fill="#FFD54F" stroke="#F57F17" strokeWidth={1}/><line x1={cx+57} y1={44} x2={cx+57} y2={118} stroke="rgba(0,0,0,.18)" strokeWidth={1}/></g>)}
      <circle cx={552} cy={126} r={64} fill="#87CEEB" stroke="#8D6E47" strokeWidth={10}/>
      <circle cx={552} cy={126} r={53} fill="#1565C0" opacity=".5"/>
      <line x1={552} y1={73} x2={552} y2={179} stroke="#8D6E47" strokeWidth={3}/>
      <line x1={499} y1={126} x2={605} y2={126} stroke="#8D6E47" strokeWidth={3}/>
      <TapBox x={8} y={148} w={170} h={66} action="stove" label={rs.stoveOn?"Off":"On"}>
        <rect x={8} y={148} width={170} height={70} rx={5} fill="#263238"/>
        {[[38,168],[88,168],[38,198],[88,198]].map(([bx,by],i)=><g key={i}><circle cx={bx} cy={by} r={17} fill="#1A1A1A" stroke="#455A64" strokeWidth={2}/><circle cx={bx} cy={by} r={10} fill={rs.stoveOn?"#FF5722":"#111"}/>{rs.stoveOn&&<><circle cx={bx} cy={by} r={6} fill="#FF9800" opacity=".9"/><circle cx={bx} cy={by} r={3} fill="#FFEB3B"/></>}</g>)}
        {rs.stoveOn&&rs.cookingFood&&<text x={38} y={155} textAnchor="middle" fontSize={11} fill="white">-fish-</text>}
      </TapBox>
      {rs.stoveOn&&<TapBox x={8} y={216} w={170} h={22} action="cook" label=""><rect x={8} y={216} width={170} height={22} rx={4} fill={rs.cookingFood?"#BF360C":"#455A64"}/><text x={93} y={231} textAnchor="middle" fontSize={10} fill="white" fontFamily="Georgia" fontWeight="bold">{rs.cookingFood?"Cooking...":"Cook fish"}</text></TapBox>}
      <TapBox x={200} y={158} w={150} h={56} action="tap" label={rs.tapOn?"Off":"On"}>
        <rect x={200} y={158} width={150} height={56} rx={5} fill="#78909C"/>
        <ellipse cx={275} cy={186} rx={52} ry={22} fill={rs.tapOn?"#B3E5FC":"#455A64"}/>
        {rs.tapOn&&<>{[0,1,2,3,4,5].map(i=><circle key={i} cx={275+Math.sin(i*.9)*5} cy={204+i*7} r={2.5} fill="#29B6F6" opacity=".75"/>)}</>}
        <rect x={267} y={143} width={16} height={20} rx={4} fill="#90A4AE"/>
        <rect x={259} y={150} width={32} height={8} rx={4} fill={rs.tapOn?"#29B6F6":"#B0BEC5"}/>
      </TapBox>
      <TapBox x={370} y={102} w={140} h={162} action="fridge" label={rs.fridgeOpen?"Close":"Open"}>
        <rect x={370} y={102} width={140} height={162} rx={8} fill="#ECEFF1" stroke="#B0BEC5" strokeWidth={2}/>
        <rect x={372} y={104} width={45} height={158} rx={6} fill="rgba(255,255,255,.22)"/>
        <rect x={370} y={102} width={140} height={98} rx={8} fill={rs.fridgeOpen?"#E3F2FD":"#ECEFF1"} stroke="#B0BEC5" strokeWidth={1.5}/>
        <rect x={370} y={198} width={140} height={66} rx={8} fill={rs.fridgeOpen?"#E8F5E9":"#ECEFF1"} stroke="#B0BEC5" strokeWidth={1.5}/>
        <line x1={370} y1={198} x2={510} y2={198} stroke="#B0BEC5" strokeWidth={2}/>
        <rect x={372} y={142} width={8} height={44} rx={4} fill="#90A4AE"/>
        <rect x={372} y={214} width={8} height={30} rx={4} fill="#90A4AE"/>
        {rs.fridgeOpen&&<>
          <ellipse cx={440} cy={110} rx={42} ry={8} fill="#FFF9C4" opacity=".85"/>
          {[374,394,414,434,454,474,494].map((dx,i)=><rect key={i} x={dx} y={116} width={16} height={20} rx={3} fill={["#90CAF9","#EF9A9A","#A5D6A7","#FFF59D","#CE93D8","#80DEEA","#FFCC80"][i]}/>)}
          <rect x={374} y={140} width={56} height={54} rx={3} fill="#EF9A9A" opacity=".85"/><text x={402} y={170} textAnchor="middle" fontSize={8} fill="#B71C1C">Fish</text>
          <rect x={434} y={140} width={56} height={54} rx={3} fill="#FFF59D" opacity=".85"/><text x={462} y={170} textAnchor="middle" fontSize={8} fill="#F57F17">Shrimp</text>
          {[374,396,418,440,462,484].map((gx,i)=><ellipse key={i} cx={gx+12} cy={218} rx={10} ry={7} fill={["#66BB6A","#FF7043","#FFEE58","#29B6F6","#AB47BC","#FF8A65"][i]} opacity=".85"/>)}
        </>}
        {!rs.fridgeOpen&&<text x={440} y={184} textAnchor="middle" fontSize={11} fill="#90A4AE" fontFamily="Georgia">Tap to open</text>}
      </TapBox>
      <TapBox x={530} y={132} w={62} h={68} action="microwave" label={rs.microwaveOn?"Done!":"Use"}>
        <rect x={530} y={132} width={62} height={68} rx={5} fill="#263238" stroke="#455A64" strokeWidth={1.5}/>
        <rect x={532} y={134} width={40} height={64} rx={4} fill={rs.microwaveOn?"#1B2A1B":"#1A1A1A"}/>
        {rs.microwaveOn&&<><ellipse cx={552} cy={166} rx={14} ry={14} fill="none" stroke="#4CAF50" strokeWidth={1}/><text x={552} y={170} textAnchor="middle" fontSize={9} fill="#4CAF50">fish</text></>}
        {[0,1,2].map(i=>[0,1,2].map(j=><rect key={`${i}${j}`} x={576+j*14} y={136+i*14} width={11} height={11} rx={2} fill="#37474F"/>))}
        <rect x={576} y={179} width={40} height={8} rx={2} fill={rs.microwaveOn?"#4CAF50":"#37474F"}/>
      </TapBox>
      <TapBox x={530} y={215} w={62} h={46} action="coffee" label={rs.coffeeOn?"Brewing":"Coffee"}>
        <rect x={530} y={215} width={62} height={46} rx={5} fill="#1A1A1A"/>
        <rect x={534} y={218} width={34} height={36} rx={3} fill={rs.coffeeOn?"#3E2723":"#111"}/>
        <ellipse cx={551} cy={257} rx={20} ry={6} fill="#3E2723"/>
        {rs.coffeeOn&&<>{[0,1,2].map(i=><ellipse key={i} cx={551} cy={248-i*9} rx={5+i*2} ry={3} fill="#795548" opacity={.5-i*.1}/>)}</>}
        <circle cx={578} cy={225} r={7} fill={rs.coffeeOn?"#FF5722":"#333"} stroke="#555" strokeWidth={1.2}/>
      </TapBox>
    </svg>
  );

  if (room === "bedroom") return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="bwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={rs.lightsOn?"#E8EAF6":"#1A1C2A"}/><stop offset="100%" stopColor={rs.lightsOn?"#C5CAE9":"#0D0F1A"}/></linearGradient>
        <linearGradient id="bfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={rs.lightsOn?"#C5CAE9":"#1A1C2E"}/><stop offset="100%" stopColor={rs.lightsOn?"#9FA8DA":"#0A0C1A"}/></linearGradient>
        <radialGradient id="lamp_glow" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#FFF9C4" stopOpacity={rs.lightsOn ? .45 : 0}/><stop offset="100%" stopColor="#FFF9C4" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bwall)"/>
      <rect x={0} y={275} width={W} height={H-275} fill="url(#bfloor)"/>
      {Array.from({length:11},(_,i)=><line key={i} x1={i*62} y1={275} x2={i*62} y2={H} stroke={`rgba(0,0,0,.${rs.lightsOn?10:5})`} strokeWidth={2}/>)}
      <rect x={0} y={0} width={W} height={H} fill="url(#lamp_glow)"/>
      <Tap cx={320} cy={18} r={26} action="lights" label={rs.lightsOn?"Lights off":"Lights on"}>
        <rect x={294} y={0} width={52} height={12} rx={4} fill="#DDD"/>
        <ellipse cx={320} cy={18} rx={24} ry={12} fill={rs.lightsOn?"#FFD54F":"#444"} opacity=".95"/>
        {rs.lightsOn&&<ellipse cx={320} cy={26} rx={130} ry={70} fill="#FFF9C4" opacity=".11"/>}
      </Tap>
      <rect x={222} y={22} width={92} height={68} rx={4} fill={rs.lightsOn?"#87CEEB":"#1A2A3A"} stroke="#78909C" strokeWidth={2}/>
      <line x1={268} y1={22} x2={268} y2={90} stroke="#78909C" strokeWidth={2}/>
      <line x1={222} y1={56} x2={314} y2={56} stroke="#78909C" strokeWidth={2}/>
      <TapBox x={10} y={162} w={108} h={132} action="dresser" label={rs.dresserOpen?"Close":"Drawers"}>
        <rect x={10} y={162} width={108} height={132} rx={6} fill={rs.lightsOn?"#5C6BC0":"#2A2E4A"} stroke={rs.lightsOn?"#3949AB":"#1A1D35"} strokeWidth={2}/>
        {[178,212,246,280].map((dy,i)=><g key={i}><rect x={14} y={dy} width={100} height={24} rx={3} fill={rs.lightsOn?"#3949AB":"#1A1D35"}/><circle cx={64} cy={dy+12} r={4} fill="#FFD54F" opacity=".8"/>{rs.dresserOpen&&i===0&&<><rect x={18} y={dy+2} width={40} height={18} rx={2} fill="#90CAF9" opacity=".7"/><rect x={60} y={dy+2} width={40} height={18} rx={2} fill="#EF9A9A" opacity=".7"/></>}</g>)}
        <rect x={20} y={92} width={88} height={68} rx={4} fill={rs.lightsOn?"#B3E5FC":"#1A2A3A"} stroke="#90A4AE" strokeWidth={2}/>
        {rs.lightsOn&&<rect x={24} y={96} width={22} height={60} rx={3} fill="rgba(255,255,255,.18)"/>}
      </TapBox>
      <TapBox x={136} y={185} w={308} h={148} action="bed" label={rs.inBed?"Get up":"Lie down"}>
        <rect x={136} y={185} width={308} height={148} rx={14} fill={rs.lightsOn?"#5C6BC0":"#2A2E4A"}/>
        <rect x={142} y={191} width={296} height={138} rx={12} fill={rs.inBed?(rs.lightsOn?"#BBDEFB":"#1A2A4A"):(rs.lightsOn?"#E8EAF6":"#1E2030")}/>
        {rs.inBed&&<rect x={142} y={238} width={296} height={91} rx={12} fill={rs.lightsOn?"#1565C0":"#0A1628"} opacity=".82"/>}
        <rect x={148} y={195} width={96} height={38} rx={14} fill={rs.inBed?(rs.lightsOn?"#90CAF9":"#1A3A6A"):(rs.lightsOn?"#C5CAE9":"#1A1E30")}/>
        <rect x={254} y={195} width={96} height={38} rx={14} fill={rs.inBed?(rs.lightsOn?"#90CAF9":"#1A3A6A"):(rs.lightsOn?"#C5CAE9":"#1A1E30")}/>
        <rect x={136} y={185} width={308} height={30} rx={14} fill={rs.lightsOn?"#3949AB":"#1A1D35"}/>
        {rs.inBed&&<><ellipse cx={210} cy={224} rx={26} ry={20} fill="#F5C6A0"/><ellipse cx={210} cy={212} rx={18} ry={13} fill="#5D4037"/><circle cx={202} cy={226} r={3.5} fill="#111"/><circle cx={218} cy={226} r={3.5} fill="#111"/></>}
        <rect x={136} y={325} width={308} height={8} rx={5} fill={rs.lightsOn?"#3949AB":"#1A1D35"}/>
      </TapBox>
      <TapBox x={460} y={228} w={94} h={108} action="nightlamp" label={rs.nightLampOn?"Lamp off":"Lamp on"}>
        <rect x={460} y={268} width={94} height={68} rx={6} fill={rs.lightsOn?"#8D6E47":"#3E2723"}/>
        <rect x={464} y={272} width={86} height={60} rx={4} fill={rs.lightsOn?"#A0877A":"#4E342E"}/>
        <rect x={488} y={244} width={22} height={28} rx={3} fill="#DDD"/>
        <polygon points={`468,244 510,244 502,222 476,222`} fill={rs.nightLampOn?"#FFD54F":"#CCC"} opacity={rs.nightLampOn?1:.6}/>
        {rs.nightLampOn&&<ellipse cx={489} cy={246} rx={42} ry={26} fill="#FFF9C4" opacity=".22"/>}
        <circle cx={475} cy={298} r={13} fill={rs.lightsOn?"#37474F":"#1A1A1A"} stroke="#607D8B" strokeWidth={2}/>
        <text x={475} y={303} textAnchor="middle" fontSize={9} fill="#4CAF50" fontFamily="Georgia">6:42</text>
      </TapBox>
      <TapBox x={540} y={82} w={94} h={148} action="curtains" label={rs.curtainsOpen?"Close":"Open"}>
        <rect x={540} y={82} width={94} height={148} rx={4} fill={rs.curtainsOpen?(rs.lightsOn?"#87CEEB":"#0A1628"):"#3E2723"} stroke="#5D4037" strokeWidth={4}/>
        {rs.curtainsOpen&&<><circle cx={580} cy={114} r={22} fill="#FFD54F" opacity=".65"/><rect x={540} y={188} width={94} height={42} fill="#1565C0" opacity=".45"/></>}
        <line x1={587} y1={82} x2={587} y2={230} stroke="#5D4037" strokeWidth={3}/>
        <line x1={540} y1={156} x2={634} y2={156} stroke="#5D4037" strokeWidth={3}/>
        <rect x={540} y={82} width={rs.curtainsOpen?18:46} height={148} rx={3} fill="#4A148C" opacity=".85"/>
        <rect x={rs.curtainsOpen?616:588} y={82} width={rs.curtainsOpen?18:46} height={148} rx={3} fill="#4A148C" opacity=".85"/>
      </TapBox>
    </svg>
  );

  if (room === "living_room") return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="lwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF3E0"/><stop offset="100%" stopColor="#FFE0B2"/></linearGradient>
        <linearGradient id="lfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D7CCC8"/><stop offset="100%" stopColor="#A1887F"/></linearGradient>
        <radialGradient id="tv_glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4A90D9" stopOpacity={rs.tvOn ? .38 : 0}/><stop offset="100%" stopColor="#4A90D9" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#lwall)"/>
      <rect x={0} y={226} width={W} height={14} fill="#BCAAA4"/>
      <rect x={0} y={240} width={W} height={H-240} fill="url(#lfloor)"/>
      {Array.from({length:11},(_,i)=><line key={i} x1={i*62} y1={240} x2={i*62} y2={H} stroke="rgba(0,0,0,.09)" strokeWidth={2}/>)}
      <rect x={0} y={0} width={W} height={H} fill="url(#tv_glow)"/>
      <ellipse cx={270} cy={330} rx={230} ry={56} fill="#FF8A65" opacity=".28"/>
      <TapBox x={170} y={28} w={260} h={170} action="tv" label={rs.tvOn?"Power off":"Power on"}>
        <rect x={165} y={24} width={270} height={180} rx={8} fill="#111"/>
        <rect x={170} y={28} width={260} height={170} rx={5} fill={rs.tvOn?"#0D3060":"#0A0A0A"}/>
        {rs.tvOn&&<>
          <text x={300} y={96} textAnchor="middle" fontSize={16} fill="#FFF" fontFamily="Georgia" fontWeight="bold">Fishing Channel</text>
          <text x={300} y={116} textAnchor="middle" fontSize={11} fill="#90CAF9">LIVE: Gulf Coast Tournament</text>
          <rect x={170} y={165} width={260} height={33} fill="rgba(0,0,0,.5)"/>
          <text x={182} y={185} fontSize={9} fill="#FF5722">REC</text>
          <text x={300} y={185} textAnchor="middle" fontSize={9} fill="#4CAF50">Ch 47 — HD</text>
          <text x={424} y={185} textAnchor="end" fontSize={9} fill="#FFF">{new Date().getHours()}:{String(new Date().getMinutes()).padStart(2,"0")}</text>
        </>}
        {!rs.tvOn&&<text x={300} y={118} textAnchor="middle" fontSize={13} fill="#333">TV Off</text>}
        <rect x={255} y={204} width={90} height={10} rx={4} fill="#555"/>
      </TapBox>
      <Tap cx={58} cy={198} r={28} action="lamp" label={rs.lampOn?"Off":"On"}>
        <line x1={58} y1={H} x2={58} y2={198} stroke="#555" strokeWidth={4}/>
        <ellipse cx={58} cy={198} rx={30} ry={13} fill={rs.lampOn?"#FFD54F":"#555"}/>
        {rs.lampOn&&<ellipse cx={58} cy={214} rx={72} ry={48} fill="#FFF9C4" opacity=".18"/>}
      </Tap>
      <TapBox x={24} y={248} w={368} h={96} action="sit" label={rs.sitting?"Stand":"Sit"}>
        <rect x={24} y={248} width={368} height={96} rx={14} fill="#8D6E47"/>
        <rect x={24} y={248} width={368} height={34} rx={14} fill="#A1887F"/>
        <rect x={24} y={248} width={28} height={96} rx={10} fill="#795548"/>
        <rect x={364} y={248} width={28} height={96} rx={10} fill="#795548"/>
        {[58,166,274].map((cx,i)=><rect key={i} x={cx} y={255} width={96} height={38} rx={8} fill="#6D4C41"/>)}
        {rs.sitting&&<><ellipse cx={190} cy={243} rx={24} ry={19} fill="#F5C6A0"/><rect x={168} y={256} width={44} height={32} rx={6} fill="#2C3E50"/></>}
      </TapBox>
      <TapBox x={412} y={268} w={136} h={60} action="coffeetable" label="">
        <rect x={412} y={268} width={136} height={60} rx={6} fill="#6D4C41"/>
        <rect x={416} y={264} width={128} height={8} rx={4} fill="#8D6E47"/>
        <TapBox x={418} y={245} w={34} h={20} action="tv" label=""><rect x={418} y={245} width={34} height={20} rx={4} fill={rs.tvOn?"#263238":"#37474F"}/><circle cx={426} cy={255} r={4} fill={rs.tvOn?"#4CAF50":"#607D8B"}/><text x={438} y={259} fontSize={7} fill="#90A4AE">TV</text></TapBox>
        <g style={{pointerEvents:"none"}}><rect x={464} y={247} width={22} height={26} rx={4} fill="#29B6F6" opacity=".8"/><ellipse cx={475} cy={247} rx={11} ry={4} fill="#0288D1"/></g>
      </TapBox>
      <circle cx={584} cy={128} r={66} fill="#87CEEB" stroke="#8D6E47" strokeWidth={10}/>
      <circle cx={570} cy={112} r={20} fill="#FFD54F" opacity=".55"/>
      <rect x={522} y={178} width={120} height={30} fill="#1565C0" opacity=".42"/>
      <line x1={584} y1={72} x2={584} y2={184} stroke="#8D6E47" strokeWidth={3}/>
      <line x1={528} y1={128} x2={640} y2={128} stroke="#8D6E47" strokeWidth={3}/>
    </svg>
  );

  if (room === "engine_room") return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="ewall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECEFF1"/><stop offset="100%" stopColor="#CFD8DC"/></linearGradient>
        <radialGradient id="eng_g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FF5722" stopOpacity={rs.engineOn ? .32 : 0}/><stop offset="100%" stopColor="#FF5722" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ewall)"/>
      <rect x={0} y={278} width={W} height={H-278} fill="#B0BEC5"/>
      {Array.from({length:11},(_,i)=><line key={i} x1={i*62} y1={278} x2={i*62} y2={H} stroke="rgba(0,0,0,.09)" strokeWidth={2}/>)}
      {rs.engineOn&&<rect x={0} y={0} width={W} height={H} fill="url(#eng_g)"/>}
      <rect x={50} y={70} width={340} height={192} rx={12} fill="#455A64"/>
      <rect x={58} y={78} width={324} height={176} rx={10} fill="#37474F"/>
      {[72,122,172,222,272,322].map((ex,i)=><g key={i}><rect x={ex} y={62} width={38} height={60} rx={5} fill="#263238"/><rect x={ex+2} y={64} width={34} height={54} rx={4} fill={rs.engineOn?"#2E3B22":"#1A1A1A"}/>{rs.engineOn&&<><rect x={ex+4} y={66} width={30} height={12} rx={2} fill="#FF5722" opacity={.52+i*.05}/><circle cx={ex+19} cy={67} r={7} fill="#FF9800" opacity=".78"/></>}<rect x={ex+15} y={52} width={8} height={16} rx={2} fill="#546E7A"/></g>)}
      <rect x={58} y={162} width={324} height={42} rx={6} fill="#546E7A"/>
      {Array.from({length:7},(_,i)=><circle key={i} cx={70+i*46} cy={183} r={7} fill="#607D8B" stroke="#455A64" strokeWidth={1.5}/>)}
      <Tap cx={514} cy={175} r={78} action="engine" label={rs.engineOn?"Kill engine":"Start"}>
        <circle cx={514} cy={175} r={84} fill="#1A1A1A" stroke="#455A64" strokeWidth={4}/>
        <circle cx={514} cy={175} r={74} fill="#263238"/>
        <circle cx={514} cy={175} r={54} fill={rs.engineOn?"#1B2A1B":"#1A1A1A"}/>
        {rs.engineOn&&<><circle cx={514} cy={175} r={30} fill="#FF5722" opacity=".8"/><circle cx={514} cy={175} r={17} fill="#FF9800"/><circle cx={514} cy={175} r={9} fill="#FFEB3B"/></>}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=><line key={a} x1={514+54*Math.cos(a*Math.PI/180)} y1={175+54*Math.sin(a*Math.PI/180)} x2={514+72*Math.cos(a*Math.PI/180)} y2={175+72*Math.sin(a*Math.PI/180)} stroke="#607D8B" strokeWidth={3.5}/>)}
        <text x={514} y={180} textAnchor="middle" fontSize={12} fill={rs.engineOn?"#FFEB3B":"#90A4AE"} fontFamily="Georgia" fontWeight="bold">{rs.engineOn?"RUNNING":"TAP START"}</text>
      </Tap>
      <rect x={8} y={58} width={46} height={236} rx={5} fill="#37474F" stroke="#455A64" strokeWidth={1.5}/>
      {[{cy:94,l:"RPM"},{cy:140,l:"OIL"},{cy:186,l:"TEMP"},{cy:232,l:"VOLT"}].map(({cy,l},i)=><g key={i}><circle cx={31} cy={cy} r={17} fill="#263238" stroke="#607D8B" strokeWidth={2}/><circle cx={31} cy={cy} r={11} fill={rs.engineOn?"#1B5E20":"#111"}/>{rs.engineOn&&<circle cx={31} cy={cy} r={6} fill="#4CAF50" opacity=".9"/>}<text x={31} y={cy+30} textAnchor="middle" fontSize={7} fill="#90A4AE">{l}</text></g>)}
      <circle cx={514} cy={300} r={18} fill={rs.engineOn?"#4CAF50":"#F44336"}/>
      <text x={514} y={328} textAnchor="middle" fontSize={10} fill={rs.engineOn?"#4CAF50":"#F44336"} fontFamily="Georgia" fontWeight="bold">{rs.engineOn?"RUNNING":"STOPPED"}</text>
      {rs.engineOn&&[0,1,2,3,4].map(i=><circle key={i} cx={460+i*22} cy={48-i*20} r={14+i*8} fill="#B0BEC5" opacity={.22-i*.04}/>)}
    </svg>
  );

  if (room === "cabin") return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="cawall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#263238"/><stop offset="100%" stopColor="#1A2327"/></linearGradient>
        <linearGradient id="cafloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#37474F"/><stop offset="100%" stopColor="#263238"/></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#cawall)"/>
      <rect x={0} y={308} width={W} height={H-308} fill="url(#cafloor)"/>
      {Array.from({length:11},(_,i)=><line key={i} x1={i*62} y1={308} x2={i*62} y2={H} stroke="rgba(255,255,255,.04)" strokeWidth={2}/>)}
      <path d="M 18,10 L 622,10 L 602,186 L 38,186 Z" fill={rs.engineOn?"#0D2444":"#050E1A"} stroke="#546E7A" strokeWidth={4}/>
      <line x1={38} y1={184} x2={602} y2={184} stroke="#546E7A" strokeWidth={3}/>
      <line x1={320} y1={10} x2={320} y2={186} stroke="#546E7A" strokeWidth={3}/>
      {rs.engineOn&&<><path d="M 18,10 L 622,10 L 602,186 L 38,186 Z" fill="#0D47A1" opacity=".58"/><path d="M 38,148 Q 320,126 602,148 L 602,186 L 38,186 Z" fill="#1565C0" opacity=".8"/>{[0,1,2,3].map(i=><path key={i} d={`M ${56+i*136},172 Q ${124+i*136},163 ${192+i*136},172`} stroke="rgba(255,255,255,.22)" strokeWidth={2} fill="none"/>)}<circle cx={320} cy={52} r={30} fill="#FFD54F" opacity=".65"/></>}
      <rect x={0} y={186} width={W} height={124} fill="#2C3A40"/>
      <rect x={0} y={186} width={W} height={10} fill="#37474F"/>
      {[{gx:72,l:"SPEED",v:rs.engineOn?"12 kts":"0"},{gx:190,l:"DEPTH",v:"48 ft"},{gx:308,l:"HEAD",v:"N 42"},{gx:426,l:"FUEL",v:"82%"},{gx:544,l:"RPM",v:rs.engineOn?"2400":"0"}].map(({gx,l,v},i)=><g key={i}><circle cx={gx} cy={232} r={28} fill="#1A1A1A" stroke="#607D8B" strokeWidth={2}/><circle cx={gx} cy={232} r={20} fill={rs.engineOn?"#1B2A1B":"#111"}/><line x1={gx} y1={232} x2={gx+16*Math.cos(-1.0+i*.32)} y2={232+16*Math.sin(-1.0+i*.32)} stroke={rs.engineOn?"#4CAF50":"#607D8B"} strokeWidth={2.5} strokeLinecap="round"/><text x={gx} y={270} textAnchor="middle" fontSize={7.5} fill="#90A4AE">{l}</text><text x={gx} y={280} textAnchor="middle" fontSize={7.5} fill={rs.engineOn?"#4CAF50":"#607D8B"}>{v}</text></g>)}
      <Tap cx={320} cy={345} r={44} action="steer" label="Steer">
        <circle cx={320} cy={345} r={50} fill="#1A1A1A" opacity=".45"/>
        <circle cx={320} cy={345} r={44} fill="#3E2723" stroke="#8D6E47" strokeWidth={4}/>
        <circle cx={320} cy={345} r={28} fill="#2A1A0A"/>
        <circle cx={320} cy={345} r={9} fill="#8D6E47"/>
        {[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={320+28*Math.cos((a+(rs.steerAngle||0))*Math.PI/180)} y1={345+28*Math.sin((a+(rs.steerAngle||0))*Math.PI/180)} x2={320+42*Math.cos((a+(rs.steerAngle||0))*Math.PI/180)} y2={345+42*Math.sin((a+(rs.steerAngle||0))*Math.PI/180)} stroke="#8D6E47" strokeWidth={4.5} strokeLinecap="round"/>)}
      </Tap>
      <Tap cx={148} cy={348} r={38} action="radar" label={rs.radarOn?"Off":"Radar"}>
        <circle cx={148} cy={348} r={42} fill="rgba(0,255,0,.02)"/>
        <circle cx={148} cy={348} r={38} fill="#0A1F0A" stroke="#2E7D32" strokeWidth={2.5}/>
        <circle cx={148} cy={348} r={26} fill="none" stroke="#1B5E20" strokeWidth={1}/>
        <circle cx={148} cy={348} r={13} fill="none" stroke="#1B5E20" strokeWidth={1}/>
        <line x1={148} y1={310} x2={148} y2={386} stroke="#1B5E20" strokeWidth={1} opacity=".5"/>
        <line x1={110} y1={348} x2={186} y2={348} stroke="#1B5E20" strokeWidth={1} opacity=".5"/>
        {rs.radarOn&&<><line x1={148} y1={348} x2={148+34*Math.cos(-.7)} y2={348+34*Math.sin(-.7)} stroke="#4CAF50" strokeWidth={2.5} strokeLinecap="round" opacity=".9"/><circle cx={134} cy={333} r={3.5} fill="#4CAF50" opacity=".9"/><circle cx={166} cy={360} r={2.5} fill="#4CAF50" opacity=".7"/></>}
      </Tap>
      <TapBox x={462} y={312} w={82} h={56} action="radio" label={rs.radioOn?"Off":"Radio"}>
        <rect x={462} y={312} width={82} height={56} rx={5} fill="#1A1A1A" stroke="#37474F" strokeWidth={1.5}/>
        {[0,1,2,3,4].map(i=><line key={i} x1={466} y1={320+i*7} x2={510} y2={320+i*7} stroke="#2A2A2A" strokeWidth={1.5}/>)}
        <circle cx={530} cy={330} r={10} fill="#37474F" stroke="#607D8B" strokeWidth={1.5}/>
        <circle cx={530} cy={330} r={6} fill={rs.radioOn?"#4CAF50":"#1A1A1A"}/>
        <circle cx={530} cy={352} r={7} fill={rs.radioOn?"#F44336":"#222"}/>
        <text x={490} y={374} textAnchor="middle" fontSize={8} fill={rs.radioOn?"#4CAF50":"#607D8B"} fontFamily="Georgia">{rs.radioOn?"Ch 16 OPEN":"VHF RADIO"}</text>
      </TapBox>
      <rect x={0} y={0} width={W} height={13} fill="rgba(0,0,0,.65)"/>
      <circle cx={14} cy={6.5} r={4} fill={rs.engineOn?"#4CAF50":"#F44336"}/>
      <text x={22} y={11} fontSize={8} fill={rs.engineOn?"#4CAF50":"#F44336"} fontFamily="Georgia">{rs.engineOn?"ENG ON":"ENG OFF"}</text>
      <circle cx={98} cy={6.5} r={4} fill={rs.radarOn?"#4CAF50":"#607D8B"}/>
      <text x={106} y={11} fontSize={8} fill={rs.radarOn?"#4CAF50":"#607D8B"} fontFamily="Georgia">RADAR</text>
      <circle cx={174} cy={6.5} r={4} fill={rs.radioOn?"#4CAF50":"#607D8B"}/>
      <text x={182} y={11} fontSize={8} fill={rs.radioOn?"#4CAF50":"#607D8B"} fontFamily="Georgia">RADIO</text>
    </svg>
  );

  return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><rect width={W} height={H} fill="#1A2A3A"/><text x={W/2} y={H/2} textAnchor="middle" fill="#607D8B" fontSize={14} fontFamily="Georgia">{ROOM_NAMES[room]||room}</text></svg>;
}

// ─── KNOT MINIGAME: tie the boat to the dock cleat by drawing loops ──────────
// Drag in circles around the cleat. Every full loop wraps the rope once; after
// enough wraps the line is secured and you can step onto the dock.
function KnotMinigame({ onDone, onCancel }) {
  const NEED = 3;
  const boxRef = useRef(null);
  const st = useRef({ dragging:false, last:0, accum:0 });
  const [wraps, setWraps] = useState(0);
  const [trail, setTrail] = useState([]);

  function angleAt(clientX, clientY) {
    var r = boxRef.current.getBoundingClientRect();
    var cx = r.left + r.width/2, cy = r.top + r.height*0.52;
    return { a: Math.atan2(clientY - cy, clientX - cx), nx:(clientX-r.left)/r.width, ny:(clientY-r.top)/r.height };
  }
  function down(e){ e.preventDefault(); var p=angleAt(e.clientX,e.clientY); st.current.dragging=true; st.current.last=p.a; }
  function move(e){
    if(!st.current.dragging) return;
    e.preventDefault();
    var p = angleAt(e.clientX, e.clientY);
    var d = p.a - st.current.last;
    while (d >  Math.PI) d -= Math.PI*2;
    while (d < -Math.PI) d += Math.PI*2;
    st.current.accum += d; st.current.last = p.a;
    var w = Math.min(NEED, Math.floor(Math.abs(st.current.accum) / (Math.PI*2)));
    if (w !== wraps) setWraps(w);
    setTrail(function(t){ var nt=t.concat([{x:p.nx,y:p.ny}]); return nt.slice(-26); });
  }
  function up(e){ if(e) e.preventDefault(); st.current.dragging=false; }

  var done = wraps >= NEED;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.86)", zIndex:180, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#0D1B2A", borderRadius:18, padding:18, border:"1px solid #1E3A5A", width:"min(420px,92vw)", textAlign:"center", fontFamily:"Georgia" }}>
        <div style={{ fontSize:17, fontWeight:"bold", color:"#FFD54F", marginBottom:4 }}>Tie Off to the Cleat</div>
        <div style={{ fontSize:12, color:"#90CAF9", marginBottom:10 }}>Drag in circles around the cleat to wrap the rope. {NEED} loops secures her.</div>
        <div
          ref={boxRef}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
          style={{ position:"relative", width:"100%", height:240, background:"radial-gradient(circle at 50% 55%,#15314f,#0A1A2A)", borderRadius:14, border:"1px solid #1E3A5A", touchAction:"none", cursor:"grab", overflow:"hidden" }}
        >
          <svg width="100%" height="100%" viewBox="0 0 300 240" style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
            {/* dock plank */}
            <rect x="0" y="150" width="300" height="90" fill="#7A552F"/>
            <rect x="0" y="150" width="300" height="6" fill="#5D4023"/>
            {/* the cleat (horn) */}
            <rect x="138" y="120" width="24" height="34" rx="5" fill="#9AA3AA"/>
            <rect x="120" y="112" width="60" height="14" rx="7" fill="#B7C0C7"/>
            <circle cx="126" cy="119" r="5" fill="#7C868D"/>
            <circle cx="174" cy="119" r="5" fill="#7C868D"/>
            {/* rope wraps drawn as you loop */}
            {[0,1,2].map(function(i){
              return i < wraps ? <ellipse key={i} cx="150" cy="125" rx={30+i*7} ry={16+i*5} fill="none" stroke="#D9B779" strokeWidth="4" opacity="0.92"/> : null;
            })}
            {/* live drag trail */}
            {trail.length>1 && <polyline points={trail.map(function(p){return (p.x*300)+","+(p.y*240);}).join(" ")} fill="none" stroke="#FFD54F" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>}
          </svg>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, margin:"12px 0" }}>
          {[0,1,2].map(function(i){ return <div key={i} style={{ width:42, height:8, borderRadius:4, background: i<wraps ? "#FFD54F" : "#1E3A5A" }}/>; })}
        </div>
        <div style={{ fontSize:13, color: done?"#81C784":"#90CAF9", marginBottom:12 }}>{done ? "Cleat hitch secured!" : ("Wraps: " + wraps + " / " + NEED)}</div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"11px", background:"#142030", color:"#90CAF9", border:"1px solid #1E3A5A", borderRadius:10, cursor:"pointer", fontFamily:"Georgia", fontSize:13 }}>Cast Off (cancel)</button>
          <button onClick={function(){ if(done) onDone(); }} disabled={!done} style={{ flex:2, padding:"11px", background: done?"linear-gradient(135deg,#2E7D32,#43A047)":"#1A2E44", color:"#fff", border:"none", borderRadius:10, cursor: done?"pointer":"not-allowed", fontFamily:"Georgia", fontSize:14, fontWeight:"bold", opacity: done?1:0.5 }}>Step onto the Dock</button>
        </div>
      </div>
    </div>
  );
}

// ─── DRIVE + WALK (Three.js): drive boat on water, dock, walk on land to shops ─
function DriveMap({ boat, cfg, onEnter, onCollect }) {
  const mountRef = useRef(null);
  const objs = useRef({});
  // mode: "boat" or "walk"
  const driveR = useRef({ mode:"boat", x:0, z:260, heading:0, speed:0, temp:20, overheated:false, throttle:false, reverse:false, turn:0, wx:0, wz:-20 });
  const [hud, setHud] = useState({ mph:0, temp:20, overheated:false, mode:"boat" });
  const [nearShop, setNearShop] = useState(null);
  const [nearDock, setNearDock] = useState(false);
  const [docking, setDocking] = useState(false);       // knot minigame open
  const [shellToast, setShellToast] = useState(null);   // "Found a ... shell!"
  const collectRef = useRef(onCollect);
  collectRef.current = onCollect;
  const boatSpeed = (boat && boat.speed) ? boat.speed : 6;

  // Decide which shops are open (once per mount). ~75% open.
  const openMap = useRef(null);
  if (!openMap.current) {
    var om = {};
    for (var oi = 0; oi < SHOPS.length; oi++) { om[SHOPS[oi].id] = Math.random() < 0.75; }
    openMap.current = om;
  }

  useEffect(function () {
    var mount = mountRef.current;
    if (!mount) return;
    var width = mount.clientWidth || 640;
    var height = 340;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0xBcd8ec, 120, 520);

    var camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 1200);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.display = "block";

    var sun = new THREE.DirectionalLight(0xfff4e0, 1.3);
    sun.position.set(60, 90, 40); scene.add(sun);
    scene.add(new THREE.AmbientLight(0x99bbdd, 0.7));
    var sunMesh = new THREE.Mesh(new THREE.SphereGeometry(18, 24, 24), new THREE.MeshBasicMaterial({ color: 0xFFF2B0 }));
    sunMesh.position.set(-160, 90, -340); scene.add(sunMesh);

    // WATER (south, z > 0)
    var oceanGeo = new THREE.PlaneGeometry(2400, 1600, 50, 30);
    oceanGeo.rotateX(-Math.PI / 2);
    var oceanMat = new THREE.MeshPhongMaterial({ color: 0x1565C0, shininess: 80, transparent: true, opacity: 0.96 });
    var ocean = new THREE.Mesh(oceanGeo, oceanMat); ocean.position.set(0, 0, 400); scene.add(ocean);

    // LAND (north, z < 0) — a big sandy/grassy ground
    var land = new THREE.Mesh(new THREE.BoxGeometry(2400, 4, 1200), new THREE.MeshPhongMaterial({ color: 0xC8B27E }));
    land.position.set(0, 0, -620); scene.add(land);
    var grass = new THREE.Mesh(new THREE.BoxGeometry(2400, 4.5, 900), new THREE.MeshPhongMaterial({ color: 0x6BA84F }));
    grass.position.set(0, 0.2, -760); scene.add(grass);
    // a sidewalk strip along the shops
    var walk = new THREE.Mesh(new THREE.BoxGeometry(1100, 5, 60), new THREE.MeshPhongMaterial({ color: 0xBDBDBD }));
    walk.position.set(0, 0.3, -120); scene.add(walk);

    // DOCK / PIER from land into water
    var dock = new THREE.Mesh(new THREE.BoxGeometry(20, 4, 160), new THREE.MeshPhongMaterial({ color: 0x9C6B3F }));
    dock.position.set(0, 1, 80); scene.add(dock);
    for (var dp = 0; dp < 5; dp++) {
      var pl = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 8), new THREE.MeshPhongMaterial({ color: 0x6D4C41 }));
      pl.position.set(11, -1, 10 + dp * 35); scene.add(pl);
      var pr = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 8), new THREE.MeshPhongMaterial({ color: 0x6D4C41 }));
      pr.position.set(-11, -1, 10 + dp * 35); scene.add(pr);
    }

    // SHOP BUILDINGS on land
    var shopMeshes = [];
    for (var i = 0; i < SHOPS.length; i++) {
      var sh = SHOPS[i];
      var g = new THREE.Group();
      var c = parseInt((sh.color || "#888888").replace("#", ""), 16);
      var isOpen = openMap.current[sh.id];
      var church = (sh.type === "church");
      var bw = church ? 34 : 40, bh = church ? 26 : 22, bd = 30;
      var building = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), new THREE.MeshPhongMaterial({ color: c }));
      building.position.y = bh/2 + 2; g.add(building);
      // roof
      var roof = new THREE.Mesh(new THREE.ConeGeometry(church ? 4 : 30, church ? 30 : 14, 4), new THREE.MeshPhongMaterial({ color: church ? 0x9575CD : 0x5D4037 }));
      if (church) { roof.position.y = bh + 18; } else { roof.position.y = bh + 9; roof.rotation.y = Math.PI/4; }
      g.add(roof);
      if (church) {
        // steeple cross
        var cv = new THREE.Mesh(new THREE.BoxGeometry(1.4, 7, 1.4), new THREE.MeshPhongMaterial({ color: 0xFFD700 }));
        cv.position.y = bh + 36; g.add(cv);
        var ch = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 1.4), new THREE.MeshPhongMaterial({ color: 0xFFD700 }));
        ch.position.y = bh + 34; g.add(ch);
      }
      // door
      var door = new THREE.Mesh(new THREE.BoxGeometry(8, 13, 1), new THREE.MeshPhongMaterial({ color: isOpen ? 0x4E342E : 0x2A2A2A }));
      door.position.set(0, 8.5, bd/2 + 2); g.add(door);
      // windows
      var winMat = new THREE.MeshPhongMaterial({ color: isOpen ? 0xFFF3B0 : 0x37474F });
      var w1 = new THREE.Mesh(new THREE.BoxGeometry(7,7,1), winMat); w1.position.set(-13, 14, bd/2+2); g.add(w1);
      var w2 = new THREE.Mesh(new THREE.BoxGeometry(7,7,1), winMat); w2.position.set(13, 14, bd/2+2); g.add(w2);
      g.position.set(sh.lx * 1.6, 0, -180);
      g.userData = { shop: sh };
      scene.add(g);
      shopMeshes.push(g);
    }

    // BOAT (reflects owned boat color/scale)
    var boatGroup = new THREE.Group();
    var hullColor = boat && boat.hull ? parseInt(boat.hull.replace("#",""),16) : 0xECEFF1;
    var accentColor = boat && boat.accent ? parseInt(boat.accent.replace("#",""),16) : 0x1565C0;
    var boatLen = boat ? (boat.type==="yacht"||boat.type==="catamaran"?20:boat.type==="speedboat"?18:boat.type==="houseboat"||boat.type==="trawler"?18:14) : 14;
    var deckB = new THREE.Mesh(new THREE.BoxGeometry(6, 1.6, boatLen), new THREE.MeshPhongMaterial({ color: hullColor }));
    deckB.position.y = 1.0; boatGroup.add(deckB);
    var bowB = new THREE.Mesh(new THREE.ConeGeometry(3, 6, 4), new THREE.MeshPhongMaterial({ color: hullColor }));
    bowB.rotation.x = Math.PI/2; bowB.position.set(0, 1.0, -boatLen/2 - 2); bowB.rotation.y = Math.PI/4; boatGroup.add(bowB);
    var cabB = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 5), new THREE.MeshPhongMaterial({ color: accentColor }));
    cabB.position.set(0, 3, 1); boatGroup.add(cabB);
    if (boat && (boat.type==="yacht"||boat.type==="sportfisher"||boat.type==="trawler")) {
      var tower = new THREE.Mesh(new THREE.BoxGeometry(2,4,2), new THREE.MeshPhongMaterial({ color: accentColor }));
      tower.position.set(0,6,1); boatGroup.add(tower);
    }

    // FIRST-PERSON HELM — the console, dashboard and steering wheel you see
    // ahead of you while piloting. Sits toward the bow (local -z is forward).
    var helm = new THREE.Group();
    var consoleMesh = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.6, 2.0), new THREE.MeshPhongMaterial({ color: accentColor }));
    consoleMesh.position.set(0, 3.3, -3.4); helm.add(consoleMesh);
    var dashTop = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.5, 2.4), new THREE.MeshPhongMaterial({ color: 0x0E1B2A }));
    dashTop.position.set(0, 4.7, -3.4); helm.add(dashTop);
    // two glowing gauges on the console face (face toward the captain, +z)
    var gaugeMat = new THREE.MeshBasicMaterial({ color: 0xFFD54F });
    var gL = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16), gaugeMat);
    gL.position.set(-1.4, 3.5, -2.39); helm.add(gL);
    var gR = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16), new THREE.MeshBasicMaterial({ color: 0x4CAF50 }));
    gR.position.set(1.4, 3.5, -2.39); helm.add(gR);
    // steering wheel: a tilted mount holding an inner spin group (rim + hub +
    // spokes) so the whole wheel visibly turns when you steer.
    var wheelMat = new THREE.MeshPhongMaterial({ color: 0x202327 });
    var wheelMount = new THREE.Group();
    wheelMount.position.set(0, 4.3, -2.5);
    wheelMount.rotation.x = Math.PI * 0.34;   // tilt the column back toward the captain
    var wheelSpin = new THREE.Group();         // this is what rotates as you steer
    var rim = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.16, 10, 24), wheelMat);
    wheelSpin.add(rim);
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.5, 12), new THREE.MeshPhongMaterial({ color: 0x3A3F45 }));
    hub.rotation.x = Math.PI / 2; wheelSpin.add(hub);
    for (var sp = 0; sp < 3; sp++) {
      var spoke = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.05, 0.12), wheelMat);
      spoke.rotation.z = sp * (Math.PI * 2 / 3);
      wheelSpin.add(spoke);
    }
    wheelMount.add(wheelSpin);
    helm.add(wheelMount);
    boatGroup.add(helm);
    var wheel = wheelSpin;
    scene.add(boatGroup);

    // WALKING CHARACTER (uses cfg colors)
    var charGroup = new THREE.Group();
    var skinC = cfg && cfg.skin ? parseInt(cfg.skin.replace("#",""),16) : 0xF5C6A0;
    var shirtC = cfg && cfg.shirt ? parseInt(cfg.shirt.replace("#",""),16) : 0x2C3E50;
    var pantsC = cfg && cfg.pants ? parseInt(cfg.pants.replace("#",""),16) : 0x37474F;
    var torso = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 1.6), new THREE.MeshPhongMaterial({ color: shirtC }));
    torso.position.y = 7; charGroup.add(torso);
    var head = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 12), new THREE.MeshPhongMaterial({ color: skinC }));
    head.position.y = 10.4; charGroup.add(head);
    var legL = new THREE.Mesh(new THREE.BoxGeometry(1.1, 4, 1.1), new THREE.MeshPhongMaterial({ color: pantsC }));
    legL.position.set(-0.8, 2.5, 0); charGroup.add(legL);
    var legR = new THREE.Mesh(new THREE.BoxGeometry(1.1, 4, 1.1), new THREE.MeshPhongMaterial({ color: pantsC }));
    legR.position.set(0.8, 2.5, 0); charGroup.add(legR);
    charGroup.visible = false;
    scene.add(charGroup);

    // SEASHELLS scattered on the sand. A fixed pool that respawns endlessly, so
    // you can keep beachcombing. Each gets a fresh random rarity when it respawns.
    var shellMeshes = [];
    function placeShell(obj) {
      var data = pickShell();
      obj.data = data; obj.collected = false; obj.respawnAt = 0;
      obj.dome.material.color.setHex(parseInt(data.color.replace("#",""), 16));
      var rare = (data.rarity === "epic" || data.rarity === "legendary");
      obj.mesh.position.set(Math.random()*1240 - 620, 1.4, Math.random()*150 - 92);
      obj.mesh.rotation.y = Math.random()*Math.PI*2;
      obj.mesh.scale.setScalar(rare ? 1.25 : 1);
      obj.mesh.visible = true;
    }
    for (var sh2 = 0; sh2 < 24; sh2++) {
      var sgrp = new THREE.Group();
      var dome = new THREE.Mesh(new THREE.SphereGeometry(1.5, 10, 8), new THREE.MeshPhongMaterial({ color: 0xE8C8A0, shininess: 60 }));
      dome.scale.set(1, 0.5, 1.25); sgrp.add(dome);
      var nub = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), dome.material);
      nub.position.set(0, 0.2, -1.1); sgrp.add(nub);
      scene.add(sgrp);
      var sobj = { mesh:sgrp, dome:dome };
      placeShell(sobj);
      shellMeshes.push(sobj);
    }

    objs.current = { scene:scene, camera:camera, renderer:renderer, ocean:ocean, boatGroup:boatGroup, charGroup:charGroup, legL:legL, legR:legR, wheel:wheel, shellMeshes:shellMeshes, placeShell:placeShell };

    function onResize() {
      if (!mount) return;
      var w = mount.clientWidth || 640;
      camera.aspect = w / height; camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    }
    window.addEventListener("resize", onResize);

    var clock = new THREE.Clock();
    var rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      var d = driveR.current;

      var pos = ocean.geometry.attributes.position;
      for (var k = 0; k < pos.count; k++) {
        var px = pos.getX(k), pz = pos.getZ(k);
        pos.setY(k, Math.sin(px * 0.04 + t) * 0.7 + Math.cos(pz * 0.05 + t * 0.8) * 0.7);
      }
      pos.needsUpdate = true;

      if (d.mode === "boat") {
        boatGroup.visible = true; charGroup.visible = false;
        boatGroup.position.set(d.x, 0.4 + Math.sin(t*0.9)*0.2, d.z);
        boatGroup.rotation.y = -d.heading;
        boatGroup.rotation.z = Math.sin(t*0.6)*0.03;
        // turn the wheel with your steering input
        if (objs.current.wheel) objs.current.wheel.rotation.z += ((d.turn * 0.9) - objs.current.wheel.rotation.z) * 0.2;
        // First-person: camera sits at the helm, set slightly behind the wheel,
        // looking forward over the console along the heading.
        var fpH = 6 + Math.sin(t*0.9)*0.2;
        var camX = d.x - Math.sin(d.heading) * 1.6;
        var camZ = d.z + Math.cos(d.heading) * 1.6;
        camera.position.set(camX, fpH, camZ);
        var lookX = d.x + Math.sin(d.heading) * 40;
        var lookZ = d.z - Math.cos(d.heading) * 40;
        camera.lookAt(lookX, 3.2, lookZ);
        camera.rotation.z = Math.sin(t*0.5)*0.01;
      } else {
        boatGroup.visible = true; charGroup.visible = true;
        boatGroup.position.set(0, 0.6, 70); boatGroup.rotation.set(0,0,0);
        charGroup.position.set(d.wx, 0, d.wz);
        charGroup.rotation.y = -d.heading;
        // simple walk leg swing
        var sw = Math.sin(t*8) * (Math.abs(d.speed) > 0.1 ? 0.6 : 0);
        if (objs.current.legL) objs.current.legL.rotation.x = sw;
        if (objs.current.legR) objs.current.legR.rotation.x = -sw;
        var cd = 26, cH = 18;
        camera.position.set(d.wx - Math.sin(d.heading)*cd, cH, d.wz + Math.cos(d.heading)*cd);
        camera.lookAt(d.wx, 6, d.wz);

        // bob the shells and check for pickups as you walk the sand
        var shells = objs.current.shellMeshes || [];
        for (var sI = 0; sI < shells.length; sI++) {
          var so = shells[sI];
          if (so.collected) {
            if (t > so.respawnAt) objs.current.placeShell(so);
            continue;
          }
          so.mesh.position.y = 1.4 + Math.sin(t*2 + sI)*0.15;
          var ddx = d.wx - so.mesh.position.x, ddz = d.wz - so.mesh.position.z;
          if (ddx*ddx + ddz*ddz < 196) { // within ~14 units
            so.collected = true; so.mesh.visible = false; so.respawnAt = t + 7 + Math.random()*7;
            if (collectRef.current) collectRef.current(so.data);
            setShellToast(so.data);
          }
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    return function () {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  // auto-dismiss the "found a shell" toast
  useEffect(function(){ if(!shellToast) return; var to=setTimeout(function(){ setShellToast(null); }, 1900); return function(){ clearTimeout(to); }; }, [shellToast]);

  // Physics + HUD
  useEffect(function () {
    var iv = setInterval(function () {
      var d = driveR.current;
      if (d.mode === "boat") {
        if (d.turn !== 0) d.heading += d.turn * 0.04;
        var maxS = boatSpeed;
        if (d.overheated) d.speed *= 0.95;
        else if (d.throttle) d.speed = Math.min(maxS, d.speed + 0.22);
        else if (d.reverse) d.speed = Math.max(-3, d.speed - 0.16);
        else d.speed *= 0.97;
        d.x += Math.sin(d.heading) * d.speed;
        d.z -= Math.cos(d.heading) * d.speed;
        // keep boat in water (z >= 40) and within map
        if (d.z < 40) { d.z = 40; d.speed *= 0.4; }
        if (d.z > 700) { d.z = 700; d.speed *= 0.4; }
        if (d.x < -1000) d.x = -1000; if (d.x > 1000) d.x = 1000;
        var hard = (d.throttle && Math.abs(d.speed) > maxS*0.6);
        if (d.overheated) { d.temp = Math.max(20, d.temp-0.5); if (d.temp<=45) d.overheated=false; }
        else if (hard) { d.temp = Math.min(100, d.temp+0.4); if (d.temp>=100) d.overheated=true; }
        else { d.temp = Math.max(20, d.temp-0.3); }
        // near dock end (0, ~45)
        var distDock = Math.sqrt(d.x*d.x + (d.z-45)*(d.z-45));
        setNearDock(distDock < 60);
        setNearShop(null);
        setHud({ mph: Math.round(Math.abs(d.speed)*5), temp: Math.round(d.temp), overheated:d.overheated, mode:"boat" });
      } else {
        // WALK mode
        if (d.turn !== 0) d.heading += d.turn * 0.05;
        if (d.throttle) d.speed = Math.min(2.2, d.speed + 0.2);
        else d.speed *= 0.8;
        d.wx += Math.sin(d.heading) * d.speed;
        d.wz -= Math.cos(d.heading) * d.speed;
        // bounds on land: x within shops area, z between dock(70) and back(-170)
        if (d.wx < -650) d.wx = -650; if (d.wx > 650) d.wx = 650;
        if (d.wz > 75) d.wz = 75; if (d.wz < -150) d.wz = -150;
        // near a shop door (shops at x=lx*1.6, z=-180+15(door front ~ -163); player walks at z about -120 sidewalk)
        var near = null, best = 60;
        for (var i = 0; i < SHOPS.length; i++) {
          var sx = SHOPS[i].lx * 1.6, sz = -163;
          var dd = Math.sqrt((sx-d.wx)*(sx-d.wx) + (sz-d.wz)*(sz-d.wz));
          if (dd < best) { best = dd; near = SHOPS[i]; }
        }
        setNearShop(near);
        // near boat to re-board (boat parked at 0,70)
        var distBoat = Math.sqrt(d.wx*d.wx + (d.wz-60)*(d.wz-60));
        setNearDock(distBoat < 45);
        setHud({ mph:0, temp: Math.round(d.temp), overheated:d.overheated, mode:"walk" });
      }
    }, 50);
    return function () { clearInterval(iv); };
  }, []);

  function press(key, val) { driveR.current[key] = val; }
  function goAshore() {
    var d = driveR.current;
    d.mode = "walk"; d.speed = 0; d.heading = Math.PI; d.wx = 0; d.wz = 40;
    setHud(function(h){ return Object.assign({}, h, { mode:"walk" }); });
  }
  function boardBoat() {
    var d = driveR.current;
    d.mode = "boat"; d.speed = 0; d.heading = Math.PI; d.x = 0; d.z = 120;
    setHud(function(h){ return Object.assign({}, h, { mode:"boat" }); });
  }

  var mph = hud.mph;
  var kmh = Math.round(mph * 1.60934);
  var tempColor = hud.overheated ? "#F44336" : hud.temp > 80 ? "#FF9800" : hud.temp > 55 ? "#FFD54F" : "#4CAF50";
  var isWalk = hud.mode === "walk";
  var ctrlBtn = { width:58, height:58, borderRadius:"50%", border:"1px solid #1E3A5A", background:"#142030", color:"#90CAF9", fontSize:13, fontFamily:"Georgia", cursor:"pointer", touchAction:"none", fontWeight:"bold" };
  var shopOpen = nearShop ? openMap.current[nearShop.id] : false;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {docking && <KnotMinigame onDone={function(){ setDocking(false); goAshore(); }} onCancel={function(){ setDocking(false); }} />}
      <div style={{ position:"relative", width:"100%", borderRadius:14, overflow:"hidden", border:"1px solid #1E3A5A", boxShadow:"0 4px 20px rgba(0,0,0,.4)" }}>
        <div ref={mountRef} style={{ width:"100%", height:340 }} />
        {shellToast && (
          <div style={{ position:"absolute", top:40, left:"50%", transform:"translateX(-50%)", background:"rgba(10,18,32,.92)", border:"1px solid "+RARITY_COLOR[shellToast.rarity], borderRadius:10, padding:"7px 14px", textAlign:"center", boxShadow:"0 4px 16px rgba(0,0,0,.5)" }}>
            <div style={{ fontSize:13, color:"#fff", fontWeight:"bold" }}>Found a {shellToast.name}!</div>
            <div style={{ fontSize:10, color:RARITY_COLOR[shellToast.rarity], textTransform:"uppercase", letterSpacing:1 }}>{shellToast.rarity} · sells for ${shellToast.sell}</div>
          </div>
        )}
        {!isWalk && (
          <div style={{ position:"absolute", bottom:8, left:8, background:"rgba(10,18,32,.78)", borderRadius:10, padding:"6px 14px", border:"1px solid rgba(255,255,255,.15)" }}>
            <div style={{ fontSize:24, color:"#FFD54F", fontWeight:"bold", lineHeight:1 }}>{mph} <span style={{fontSize:11,color:"#90CAF9"}}>MPH</span></div>
            <div style={{ fontSize:14, color:"#81C784" }}>{kmh} <span style={{fontSize:10,color:"#90CAF9"}}>KM/H</span></div>
          </div>
        )}
        {!isWalk && (
          <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(10,18,32,.78)", borderRadius:10, padding:"6px 10px", border:"1px solid rgba(255,255,255,.15)", width:96 }}>
            <div style={{ fontSize:9, color:"#90CAF9", marginBottom:3 }}>ENGINE TEMP</div>
            <div style={{ background:"#1A2E44", borderRadius:5, height:10, overflow:"hidden" }}>
              <div style={{ height:"100%", width:hud.temp+"%", background:tempColor, transition:"width .1s" }}/>
            </div>
            {hud.overheated && <div style={{ fontSize:9, color:"#F44336", fontWeight:"bold", marginTop:3 }}>OVERHEATED!</div>}
          </div>
        )}
        <div style={{ position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", background:"rgba(10,18,32,.7)", borderRadius:8, padding:"4px 12px", border:"1px solid rgba(255,255,255,.12)", fontSize:11, color:"#90CAF9" }}>
          {isWalk ? (nearShop ? (nearShop.name + (shopOpen ? "" : " (Closed)")) : "On the boardwalk") : (nearDock ? "Near the dock" : "On the water — " + boat.name)}
        </div>
      </div>

      {/* Action buttons: dock / enter / board */}
      {!isWalk && nearDock && (
        <button onClick={function(){ setDocking(true); }} style={{ padding:"12px", background:"linear-gradient(135deg,#2E7D32,#43A047)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontFamily:"Georgia", cursor:"pointer", fontWeight:"bold" }}>Dock & Tie Off</button>
      )}
      {isWalk && nearShop && (
        shopOpen
          ? <button onClick={function(){ onEnter(nearShop); }} style={{ padding:"12px", background:"linear-gradient(135deg,#1565C0,#1976D2)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontFamily:"Georgia", cursor:"pointer", fontWeight:"bold" }}>Enter {nearShop.name}</button>
          : <div style={{ padding:"12px", background:"#3A1A1A", color:"#FF8A80", borderRadius:12, fontSize:14, fontFamily:"Georgia", textAlign:"center", border:"1px solid #5A2A2A" }}>{nearShop.name} is closed right now. Come back later!</div>
      )}
      {isWalk && nearDock && (
        <button onClick={boardBoat} style={{ padding:"12px", background:"linear-gradient(135deg,#0D47A1,#1565C0)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontFamily:"Georgia", cursor:"pointer", fontWeight:"bold" }}>Board Your Boat</button>
      )}

      {/* Controls */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", gap:8 }}>
          <button onPointerDown={function(e){ e.preventDefault(); press("turn",-1); }} onPointerUp={function(e){ e.preventDefault(); press("turn",0); }} onPointerLeave={function(e){ e.preventDefault(); press("turn",0); }} style={ctrlBtn}>‹ L</button>
          <button onPointerDown={function(e){ e.preventDefault(); press("turn",1); }} onPointerUp={function(e){ e.preventDefault(); press("turn",0); }} onPointerLeave={function(e){ e.preventDefault(); press("turn",0); }} style={ctrlBtn}>R ›</button>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {!isWalk && <button onPointerDown={function(e){ e.preventDefault(); press("reverse",true); }} onPointerUp={function(e){ e.preventDefault(); press("reverse",false); }} onPointerLeave={function(e){ e.preventDefault(); press("reverse",false); }} style={Object.assign({}, ctrlBtn, { color:"#FFAB91" })}>REV</button>}
          {!isWalk && <button onPointerDown={function(e){ e.preventDefault(); driveR.current.speed = driveR.current.speed*0.6; }} style={Object.assign({}, ctrlBtn, { background:"#3A1A1A", color:"#FF8A80" })}>BRK</button>}
          <button onPointerDown={function(e){ e.preventDefault(); press("throttle",true); }} onPointerUp={function(e){ e.preventDefault(); press("throttle",false); }} onPointerLeave={function(e){ e.preventDefault(); press("throttle",false); }} style={Object.assign({}, ctrlBtn, { width:72, background:(!isWalk && hud.overheated)?"#5A1A1A":"linear-gradient(135deg,#1565C0,#1976D2)", color:"#fff", borderRadius:14 })}>{isWalk ? "WALK" : "GAS"}</button>
        </div>
      </div>
      <div style={{ textAlign:"center", fontSize:11, color:"#607D8B" }}>
        {isWalk ? "Walk the sand to pick up seashells, visit a shop, or return to the dock to board your boat." : "Drive to the dock, then Dock & Tie Off — wrap the rope to secure your boat and step ashore."}
      </div>
    </div>
  );
}


// ─── DRIVE MAP 2D (top-down: drive on water, dock, walk on land to shops) ─────
function DriveMap2D({ boat, cfg, onEnter }) {
  const d = useRef({ mode:"boat", x:500, y:460, heading:0, speed:0, temp:20, overheated:false, throttle:false, reverse:false, turn:0, wx:500, wy:250 });
  const [hud, setHud] = useState({ mph:0, temp:20, overheated:false, mode:"boat", x:500, y:460, heading:0, wx:500, wy:250 });
  const [nearShop, setNearShop] = useState(null);
  const [nearDock, setNearDock] = useState(false);
  const boatSpeed = (boat && boat.speed) ? boat.speed : 6;

  const openMap = useRef(null);
  if (!openMap.current) {
    var om = {};
    for (var oi = 0; oi < SHOPS.length; oi++) { om[SHOPS[oi].id] = Math.random() < 0.75; }
    openMap.current = om;
  }

  // shop screen positions along the land
  function shopPos(sh, idx) {
    var n = SHOPS.length;
    var sx = 70 + (idx / (n - 1)) * 860;
    return { x: sx, y: 120 };
  }

  useEffect(function () {
    var iv = setInterval(function () {
      var s = d.current;
      if (s.mode === "boat") {
        if (s.turn !== 0) s.heading += s.turn * 0.06;
        var maxS = boatSpeed;
        if (s.overheated) s.speed *= 0.95;
        else if (s.throttle) s.speed = Math.min(maxS, s.speed + 0.25);
        else if (s.reverse) s.speed = Math.max(-3, s.speed - 0.18);
        else s.speed *= 0.97;
        s.x += Math.sin(s.heading) * s.speed;
        s.y += Math.cos(s.heading) * s.speed; // +y is south (down)
        if (s.y < 250) { s.y = 250; s.speed *= 0.4; }
        if (s.y > 580) { s.y = 580; s.speed *= 0.4; }
        if (s.x < 20) { s.x = 20; s.speed *= 0.5; }
        if (s.x > 980) { s.x = 980; s.speed *= 0.5; }
        var hard = (s.throttle && Math.abs(s.speed) > maxS*0.6);
        if (s.overheated) { s.temp = Math.max(20, s.temp-0.5); if (s.temp<=45) s.overheated=false; }
        else if (hard) { s.temp = Math.min(100, s.temp+0.4); if (s.temp>=100) s.overheated=true; }
        else { s.temp = Math.max(20, s.temp-0.3); }
        var dd = Math.sqrt((s.x-500)*(s.x-500) + (s.y-345)*(s.y-345));
        setNearDock(dd < 55);
        setNearShop(null);
        setHud({ mph:Math.round(Math.abs(s.speed)*5), temp:Math.round(s.temp), overheated:s.overheated, mode:"boat", x:s.x, y:s.y, heading:s.heading, wx:s.wx, wy:s.wy });
      } else {
        if (s.turn !== 0) s.heading += s.turn * 0.08;
        if (s.throttle) s.speed = Math.min(3, s.speed + 0.3);
        else s.speed *= 0.8;
        s.wx += Math.sin(s.heading) * s.speed;
        s.wy += Math.cos(s.heading) * s.speed;
        if (s.wy < 20) s.wy = 20; if (s.wy > 250) s.wy = 250;
        if (s.wx < 30) s.wx = 30; if (s.wx > 970) s.wx = 970;
        var near = null, best = 70;
        for (var i = 0; i < SHOPS.length; i++) {
          var p = shopPos(SHOPS[i], i);
          var ds = Math.sqrt((p.x-s.wx)*(p.x-s.wx) + (p.y+30-s.wy)*(p.y+30-s.wy));
          if (ds < best) { best = ds; near = SHOPS[i]; }
        }
        setNearShop(near);
        var db = Math.sqrt((s.wx-500)*(s.wx-500) + (s.wy-250)*(s.wy-250));
        setNearDock(db < 45);
        setHud({ mph:0, temp:Math.round(s.temp), overheated:s.overheated, mode:"walk", x:s.x, y:s.y, heading:s.heading, wx:s.wx, wy:s.wy });
      }
    }, 50);
    return function () { clearInterval(iv); };
  }, []);

  function press(key, val) { d.current[key] = val; }
  function goAshore() { var s=d.current; s.mode="walk"; s.speed=0; s.heading=Math.PI; s.wx=500; s.wy=245; setHud(function(h){return Object.assign({},h,{mode:"walk"});}); }
  function boardBoat() { var s=d.current; s.mode="boat"; s.speed=0; s.heading=0; s.x=500; s.y=360; setHud(function(h){return Object.assign({},h,{mode:"boat"});}); }

  var mph = hud.mph, kmh = Math.round(mph*1.60934);
  var tempColor = hud.overheated ? "#F44336" : hud.temp>80?"#FF9800":hud.temp>55?"#FFD54F":"#4CAF50";
  var isWalk = hud.mode === "walk";
  var shopOpen = nearShop ? openMap.current[nearShop.id] : false;
  var ctrlBtn = { width:58, height:58, borderRadius:"50%", border:"1px solid #1E3A5A", background:"#142030", color:"#90CAF9", fontSize:13, fontFamily:"Georgia", cursor:"pointer", touchAction:"none", fontWeight:"bold" };
  var hullCol = boat && boat.hull ? boat.hull : "#ECEFF1";
  var accCol = boat && boat.accent ? boat.accent : "#1565C0";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ position:"relative", width:"100%", borderRadius:14, overflow:"hidden", border:"1px solid #1E3A5A", boxShadow:"0 4px 20px rgba(0,0,0,.4)" }}>
        <svg viewBox="0 0 1000 600" style={{ width:"100%", height:340, display:"block", background:"#1565C0" }}>
          {/* water */}
          <rect x="0" y="240" width="1000" height="360" fill="#1565C0"/>
          {[260,300,340,380,420,460,500,540,580].map(function(yy){ return <line key={yy} x1="0" y1={yy} x2="1000" y2={yy} stroke="rgba(255,255,255,.06)" strokeWidth="2"/>; })}
          {/* land */}
          <rect x="0" y="0" width="1000" height="240" fill="#6BA84F"/>
          <rect x="0" y="200" width="1000" height="44" fill="#C8B27E"/>
          {/* sidewalk */}
          <rect x="0" y="150" width="1000" height="30" fill="#BDBDBD"/>
          {/* dock */}
          <rect x="486" y="200" width="28" height="150" fill="#9C6B3F" stroke="#6D4C41" strokeWidth="2"/>
          {/* shops */}
          {SHOPS.map(function(sh, idx){
            var p = shopPos(sh, idx);
            var op = openMap.current[sh.id];
            var church = sh.type === "church";
            return (
              <g key={sh.id}>
                <rect x={p.x-28} y={p.y-34} width="56" height="64" rx="3" fill={sh.color} stroke="#222" strokeWidth="1.5"/>
                <polygon points={(p.x-32)+","+(p.y-34)+" "+(p.x)+","+(p.y-54)+" "+(p.x+32)+","+(p.y-34)} fill={church?"#9575CD":"#5D4037"}/>
                {church && <rect x={p.x-2} y={p.y-70} width="4" height="16" fill="#FFD700"/>}
                {church && <rect x={p.x-7} y={p.y-64} width="14" height="4" fill="#FFD700"/>}
                {/* door */}
                <rect x={p.x-7} y={p.y+8} width="14" height="22" fill={op?"#4E342E":"#2A2A2A"}/>
                {/* windows */}
                <rect x={p.x-22} y={p.y-22} width="13" height="13" fill={op?"#FFF3B0":"#37474F"}/>
                <rect x={p.x+9} y={p.y-22} width="13" height="13" fill={op?"#FFF3B0":"#37474F"}/>
                <text x={p.x} y={p.y+46} textAnchor="middle" fontSize="13" fill="#fff" stroke="#222" strokeWidth=".5" fontFamily="Georgia">{sh.name}</text>
                {!op && <text x={p.x} y={p.y-2} textAnchor="middle" fontSize="11" fill="#F44336" fontWeight="bold">CLOSED</text>}
              </g>
            );
          })}
          {/* boat */}
          {!isWalk && (
            <g transform={"translate("+hud.x+","+hud.y+") rotate("+(hud.heading*180/Math.PI)+")"}>
              <ellipse cx="0" cy="0" rx="11" ry="22" fill={hullCol} stroke="#1A1A1A" strokeWidth="1.5"/>
              <polygon points="0,-24 7,-8 -7,-8" fill={hullCol} stroke="#1A1A1A" strokeWidth="1.5"/>
              <rect x="-6" y="-3" width="12" height="11" rx="2" fill={accCol}/>
            </g>
          )}
          {/* parked boat while walking */}
          {isWalk && (
            <g transform="translate(500,330)">
              <ellipse cx="0" cy="0" rx="11" ry="22" fill={hullCol} stroke="#1A1A1A" strokeWidth="1.5"/>
              <rect x="-6" y="-3" width="12" height="11" rx="2" fill={accCol}/>
            </g>
          )}
          {/* walking character (top-down dot) */}
          {isWalk && (
            <g transform={"translate("+hud.wx+","+hud.wy+")"}>
              <circle cx="0" cy="0" r="9" fill={cfg && cfg.shirt ? cfg.shirt : "#2C3E50"} stroke="#fff" strokeWidth="1.5"/>
              <circle cx="0" cy="0" r="4" fill={cfg && cfg.skin ? cfg.skin : "#F5C6A0"}/>
            </g>
          )}
        </svg>

        {/* gauges */}
        {!isWalk && (
          <div style={{ position:"absolute", bottom:8, left:8, background:"rgba(10,18,32,.78)", borderRadius:10, padding:"6px 14px", border:"1px solid rgba(255,255,255,.15)" }}>
            <div style={{ fontSize:24, color:"#FFD54F", fontWeight:"bold", lineHeight:1 }}>{mph} <span style={{fontSize:11,color:"#90CAF9"}}>MPH</span></div>
            <div style={{ fontSize:14, color:"#81C784" }}>{kmh} <span style={{fontSize:10,color:"#90CAF9"}}>KM/H</span></div>
          </div>
        )}
        {!isWalk && (
          <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(10,18,32,.78)", borderRadius:10, padding:"6px 10px", border:"1px solid rgba(255,255,255,.15)", width:96 }}>
            <div style={{ fontSize:9, color:"#90CAF9", marginBottom:3 }}>ENGINE TEMP</div>
            <div style={{ background:"#1A2E44", borderRadius:5, height:10, overflow:"hidden" }}><div style={{ height:"100%", width:hud.temp+"%", background:tempColor, transition:"width .1s" }}/></div>
            {hud.overheated && <div style={{ fontSize:9, color:"#F44336", fontWeight:"bold", marginTop:3 }}>OVERHEATED!</div>}
          </div>
        )}
        <div style={{ position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", background:"rgba(10,18,32,.7)", borderRadius:8, padding:"4px 12px", border:"1px solid rgba(255,255,255,.12)", fontSize:11, color:"#90CAF9" }}>
          {isWalk ? (nearShop ? (nearShop.name + (shopOpen ? "" : " (Closed)")) : "On the boardwalk") : (nearDock ? "Near the dock" : "On the water — " + boat.name)}
        </div>
      </div>

      {!isWalk && nearDock && <button onClick={goAshore} style={{ padding:"12px", background:"linear-gradient(135deg,#2E7D32,#43A047)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontFamily:"Georgia", cursor:"pointer", fontWeight:"bold" }}>Dock & Go Ashore</button>}
      {isWalk && nearShop && (shopOpen
        ? <button onClick={function(){ onEnter(nearShop); }} style={{ padding:"12px", background:"linear-gradient(135deg,#1565C0,#1976D2)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontFamily:"Georgia", cursor:"pointer", fontWeight:"bold" }}>Enter {nearShop.name}</button>
        : <div style={{ padding:"12px", background:"#3A1A1A", color:"#FF8A80", borderRadius:12, fontSize:14, fontFamily:"Georgia", textAlign:"center", border:"1px solid #5A2A2A" }}>{nearShop.name} is closed right now. Come back later!</div>)}
      {isWalk && nearDock && <button onClick={boardBoat} style={{ padding:"12px", background:"linear-gradient(135deg,#0D47A1,#1565C0)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontFamily:"Georgia", cursor:"pointer", fontWeight:"bold" }}>Board Your Boat</button>}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", gap:8 }}>
          <button onPointerDown={function(e){ e.preventDefault(); press("turn",-1); }} onPointerUp={function(e){ e.preventDefault(); press("turn",0); }} onPointerLeave={function(e){ e.preventDefault(); press("turn",0); }} style={ctrlBtn}>‹ L</button>
          <button onPointerDown={function(e){ e.preventDefault(); press("turn",1); }} onPointerUp={function(e){ e.preventDefault(); press("turn",0); }} onPointerLeave={function(e){ e.preventDefault(); press("turn",0); }} style={ctrlBtn}>R ›</button>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {!isWalk && <button onPointerDown={function(e){ e.preventDefault(); press("reverse",true); }} onPointerUp={function(e){ e.preventDefault(); press("reverse",false); }} onPointerLeave={function(e){ e.preventDefault(); press("reverse",false); }} style={Object.assign({}, ctrlBtn, { color:"#FFAB91" })}>REV</button>}
          {!isWalk && <button onPointerDown={function(e){ e.preventDefault(); d.current.speed = d.current.speed*0.6; }} style={Object.assign({}, ctrlBtn, { background:"#3A1A1A", color:"#FF8A80" })}>BRK</button>}
          <button onPointerDown={function(e){ e.preventDefault(); press("throttle",true); }} onPointerUp={function(e){ e.preventDefault(); press("throttle",false); }} onPointerLeave={function(e){ e.preventDefault(); press("throttle",false); }} style={Object.assign({}, ctrlBtn, { width:72, background:(!isWalk && hud.overheated)?"#5A1A1A":"linear-gradient(135deg,#1565C0,#1976D2)", color:"#fff", borderRadius:14 })}>{isWalk ? "WALK" : "GAS"}</button>
        </div>
      </div>
      <div style={{ textAlign:"center", fontSize:11, color:"#607D8B" }}>{isWalk ? "Walk to a shop and enter. Return to the dock to board your boat." : "Drive to the dock, then Dock & Go Ashore to walk to the shops."}</div>
    </div>
  );
}

function ShopView({ shop, money, setMoney, inv, setInv, rodId, setRodId, ownedRods, setOwnedRods, boughtLures, setBoughtLures, boughtBaits, setBoughtBaits, cfg, setCfg, addGood, onLeave }) {
  const [said, setSaid]   = useState(shop.greet);
  const [pickFish, setPickFish] = useState(null);
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState(false);
  function say(t){ setSaid(t); }

  var isRetail = (shop.type==="bait" || shop.type==="tackle" || shop.type==="supermarket" || shop.type==="general" || shop.type==="makeup");

  // Resale value: always more than you paid, and rarer items pay much more
  function sellValue(price, rarity) {
    var mult = rarity==="legendary"?5:rarity==="epic"?4:rarity==="rare"?3:rarity==="uncommon"?2.2:1.6;
    return Math.round(price * mult);
  }

  // Build this shop's shelf items
  function getItems() {
    if (shop.type === "bait") {
      var arr = [];
      for (var i=0;i<SHOP_BAITS.length;i++){ var b=SHOP_BAITS[i]; arr.push({ id:b.id, name:b.name, price:b.price, kind:"bait", color:b.color, sub:"+"+b.bonus+" power", data:b }); }
      return arr;
    }
    if (shop.type === "tackle") {
      var out = [];
      for (var i=0;i<SHOP_LURES.length;i++){ var l=SHOP_LURES[i]; out.push({ id:l.id, name:l.name, price:l.price, kind:"lure", color:l.color, sub:"+"+l.bonus+" power", data:l }); }
      for (var r=0;r<RODS.length;r++){ if(RODS[r].price>0){ out.push({ id:RODS[r].id, name:RODS[r].name, price:RODS[r].price, kind:"rod", color:"#8D6E47", sub:"Power "+RODS[r].power+"/5", data:RODS[r] }); } }
      return out;
    }
    if (shop.type === "supermarket") {
      // [name, price, color, rarity] — regular goods sell back for what you paid
      var g = [["Bread",8,"#E0B97D","common"],["Milk",6,"#ECEFF1","common"],["Eggs",5,"#FFF8E1","common"],["Bananas",4,"#FDD835","common"],["Coffee",12,"#6D4C41","common"],["Ice Bag",10,"#B3E5FC","common"],["Snacks",7,"#FF8A65","common"],["Soda",5,"#EF5350","common"],["Sandwich",9,"#C5A572","common"],["Water Pack",6,"#81D4FA","common"]];
      var arr2 = g.map(function(it,ix){ return { id:"gro"+ix, name:it[0], price:it[1], kind:"good", color:it[2], sub:"Sells back for $"+it[1], rarity:it[3], sell:it[1], data:null }; });
      for (var c=0;c<GIFT_CARDS.length;c++){ var gc=GIFT_CARDS[c]; arr2.push({ id:gc.id, name:gc.name, price:gc.price, kind:"good", color:gc.color, sub:"Resells for $"+gc.sell, rarity:gc.rarity, sell:gc.sell, data:null }); }
      return arr2;
    }
    if (shop.type === "general") {
      var gg = [["Souvenir Mug",25,"#90CAF9","common"],["Postcard",10,"#FFCC80","common"],["Sun Hat",30,"#FFD54F","common"],["Sunscreen",15,"#FFAB91","common"],["Beach Towel",20,"#4DD0E1","common"],["Keychain",8,"#B39DDB","common"]];
      var out2 = gg.map(function(it,ix){ return { id:"gen"+ix, name:it[0], price:it[1], kind:"good", color:it[2], sub:"Sells back for $"+it[1], rarity:it[3], sell:it[1], data:null }; });
      for (var c2=0;c2<GIFT_CARDS.length;c2++){ var gc2=GIFT_CARDS[c2]; out2.push({ id:gc2.id, name:gc2.name, price:gc2.price, kind:"good", color:gc2.color, sub:"Resells for $"+gc2.sell, rarity:gc2.rarity, sell:gc2.sell, data:null }); }
      return out2;
    }
    if (shop.type === "makeup") {
      var prods = [];
      for (var s=0;s<SHIRT.length && s<6;s++){ prods.push({ id:"shirt"+s, name:"Shirt Color", price:50, kind:"shirt", color:SHIRT[s], sub:"Apply at checkout", data:SHIRT[s] }); }
      for (var h=0;h<HATC.length && h<6;h++){ prods.push({ id:"hat"+h, name:"Hat Color", price:50, kind:"hat", color:HATC[h], sub:"Apply at checkout", data:HATC[h] }); }
      return prods;
    }
    return [];
  }
  var items = getItems();

  function owned(it) {
    if (it.kind==="lure") return boughtLures.some(function(x){return x.id===it.id;});
    if (it.kind==="bait") return boughtBaits.some(function(x){return x.id===it.id;});
    if (it.kind==="rod") return ownedRods.indexOf(it.id) >= 0;
    return false;
  }
  function inCart(it){ return cart.some(function(x){ return x.cid === it.id; }); }

  function addToCart(it) {
    if (owned(it)) { say("You already own the " + it.name + "!"); return; }
    if (it.kind!=="good" && inCart(it)) { say("That's already in your cart."); return; }
    setCart(function(c){ return c.concat([{ cid:it.id, name:it.name, price:it.price, kind:it.kind, color:it.color, rarity:it.rarity, sell:it.sell, data:it.data, line:Date.now()+Math.random() }]); });
    say("Added " + it.name + " to your cart.");
  }
  function removeFromCart(line) { setCart(function(c){ return c.filter(function(x){ return x.line !== line; }); }); }
  function cartTotal(){ var t=0; for (var i=0;i<cart.length;i++) t+=cart[i].price; return t; }

  function payNow() {
    var total = cartTotal();
    if (money < total) { say("That comes to " + total.toLocaleString() + " coins — you don't have enough. Put a few things back?"); return; }
    setMoney(function(m){ return m - total; });
    for (var i=0;i<cart.length;i++) {
      var it = cart[i];
      if (it.kind==="lure") { setBoughtLures(function(a){ return a.some(function(x){return x.id===it.cid;}) ? a : a.concat([it.data]); }); }
      else if (it.kind==="bait") { setBoughtBaits(function(a){ return a.some(function(x){return x.id===it.cid;}) ? a : a.concat([it.data]); }); }
      else if (it.kind==="rod") { (function(id){ setOwnedRods(function(a){ return a.indexOf(id)>=0 ? a : a.concat([id]); }); })(it.cid); }
      else if (it.kind==="shirt") { (function(col){ setCfg(function(x){ return Object.assign({}, x, {shirt:col}); }); })(it.data); }
      else if (it.kind==="hat") { (function(col){ setCfg(function(x){ return Object.assign({}, x, {hatColor:col}); }); })(it.data); }
      else if (it.kind==="good") { (function(g){ addGood({ uid:Date.now()+Math.random(), name:g.name, rarity:g.rarity||"common", sell:g.sell||Math.round(g.price*0.8), color:g.color }); })(it); }
    }
    var n = cart.length;
    setCart([]); setCheckout(false);
    say("All done! " + n + " item" + (n===1?"":"s") + " for " + total.toLocaleString() + " coins. Thanks for shopping!");
  }

  function filletFish(fish, prep) {
    var payout = Math.round(fish.value * prep.mult);
    setMoney(function(m){ return m + payout; });
    setInv(function(arr){ var out=[],rm=false; for (var i=0;i<arr.length;i++){ if(!rm && arr[i].uid===fish.uid){ rm=true; continue; } out.push(arr[i]); } return out; });
    setPickFish(null);
    say("One " + prep.name + " " + fish.name + " coming up! Here's your " + payout.toLocaleString() + " coins. Delicious choice!");
  }

  // shelf room backdrop
  var roomBg = "linear-gradient(180deg,#243447 0%,#243447 52%,#3A2A1E 52%,#2A1E14 100%)";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.82)", zIndex:160, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onLeave}>
      <div style={{ background:"#0D1B2A", width:"100%", maxWidth:640, borderRadius:"20px 20px 0 0", padding:"16px 14px 24px", border:"1px solid #1E3A5A", maxHeight:"88vh", overflowY:"auto" }} onClick={function(e){ e.stopPropagation(); }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div>
            <div style={{ fontSize:17, fontWeight:"bold", color:shop.color, fontFamily:"Georgia" }}>{shop.name}</div>
            <div style={{ fontSize:11, color:"#90CAF9" }}>Shopkeeper: {shop.keeper}</div>
          </div>
          <button onClick={onLeave} style={{ background:"#142030", border:"1px solid #1E3A5A", color:"#90CAF9", cursor:"pointer", fontSize:12, borderRadius:8, padding:"6px 12px", fontFamily:"Georgia" }}>Leave</button>
        </div>

        {/* Keeper speech */}
        <div style={{ display:"flex", gap:12, marginBottom:12, alignItems:"flex-start" }}>
          <div style={{ width:46, height:46, borderRadius:"50%", background:"linear-gradient(135deg,"+shop.color+",#0D47A1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ color:"#fff", fontSize:19, fontWeight:"bold" }}>{shop.keeper.charAt(0)}</span>
          </div>
          <div style={{ flex:1, background:"rgba(255,255,255,.05)", borderRadius:12, padding:"10px 12px", border:"1px solid #1E3A5A" }}>
            <div style={{ fontSize:13, color:"#E3F2FD", lineHeight:1.5 }}>{said}</div>
          </div>
        </div>

        {/* Talk to the shopkeeper — ask a question, get an answer */}
        {(SHOP_QA[shop.type] && SHOP_QA[shop.type].length>0) && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, color:"#607D8B", letterSpacing:1, marginBottom:6 }}>ASK {shop.keeper.toUpperCase()} A QUESTION</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {SHOP_QA[shop.type].map(function(qa, qi){
                return (
                  <button key={qi} onClick={function(){ say(qa[1]); }} style={{ textAlign:"left", background:"#142030", border:"1px solid #1E3A5A", color:"#90CAF9", borderRadius:8, padding:"9px 12px", fontSize:12, cursor:"pointer", fontFamily:"Georgia" }}>
                    "{qa[0]}"
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ background:"rgba(255,213,79,.12)", border:"1px solid #FFD54F", borderRadius:8, padding:"4px 12px", fontSize:13, color:"#FFD54F", fontWeight:"bold" }}>Wallet: ${money.toLocaleString()}</div>
          {isRetail && !checkout && <div style={{ fontSize:11, color:"#81C784" }}>Cart: {cart.length} item{cart.length===1?"":"s"}</div>}
        </div>

        {/* ── RETAIL: walk-in shelf room with cart + self-checkout ── */}
        {isRetail && !checkout && (
          <div>
            {/* 3D-style shop room with shelves */}
            <div style={{ position:"relative", borderRadius:12, padding:"14px 10px", background:roomBg, border:"1px solid #1E3A5A", marginBottom:12, perspective:"600px" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", textAlign:"center", marginBottom:8, letterSpacing:1 }}>— WALK THE AISLES • TAP AN ITEM TO PICK IT UP —</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {items.map(function(it){
                  var own = owned(it);
                  var inc = inCart(it);
                  return (
                    <div key={it.id} onClick={function(){ if(!own) addToCart(it); }} style={{ position:"relative", background:"linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.03))", borderRadius:8, padding:"12px 10px 14px", borderBottom:"5px solid #5D4037", cursor: own?"default":"pointer", opacity: own?0.55:1, boxShadow:"0 4px 10px rgba(0,0,0,.3)" }}>
                      {/* price tag */}
                      <div style={{ position:"absolute", top:8, right:8, background:"#FFD54F", color:"#1A1A1A", fontSize:11, fontWeight:"bold", padding:"2px 8px", borderRadius:4, transform:"rotate(6deg)", boxShadow:"0 2px 4px rgba(0,0,0,.3)" }}>${it.price}</div>
                      <div style={{ width:40, height:40, borderRadius: it.kind==="rod"?6:"50%", background:it.color, margin:"0 auto 8px", boxShadow:"0 2px 8px "+it.color+"66", border:"2px solid rgba(255,255,255,.3)" }}/>
                      <div style={{ fontSize:13, fontWeight:"bold", color:"#fff", textAlign:"center" }}>{it.name}</div>
                      <div style={{ fontSize:10, color:"#B0BEC5", textAlign:"center", marginBottom:6 }}>{it.sub}</div>
                      <div style={{ textAlign:"center" }}>
                        {own ? <span style={{ fontSize:11, color:"#81C784", fontWeight:"bold" }}>Owned</span>
                          : inc ? <span style={{ fontSize:11, color:"#FFD54F", fontWeight:"bold" }}>In cart</span>
                          : <span style={{ fontSize:11, color:"#90CAF9" }}>Tap to add</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart preview */}
            {cart.length > 0 && (
              <div style={{ background:"rgba(255,255,255,.04)", borderRadius:10, padding:"10px 12px", marginBottom:10, border:"1px solid #1E3A5A" }}>
                <div style={{ fontSize:12, color:"#FFD54F", fontWeight:"bold", marginBottom:6 }}>Your Cart</div>
                {cart.map(function(c){
                  return (
                    <div key={c.line} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0" }}>
                      <span style={{ fontSize:12, color:"#E3F2FD" }}>{c.name}</span>
                      <span style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ fontSize:12, color:"#FFD54F" }}>${c.price}</span>
                        <button onClick={function(){ removeFromCart(c.line); }} style={{ background:"#3A1A1A", border:"none", color:"#FF8A80", borderRadius:6, padding:"2px 8px", fontSize:11, cursor:"pointer" }}>×</button>
                      </span>
                    </div>
                  );
                })}
                <div style={{ display:"flex", justifyContent:"space-between", borderTop:"1px solid #1E3A5A", marginTop:6, paddingTop:6 }}>
                  <span style={{ fontSize:13, color:"#fff", fontWeight:"bold" }}>Total</span>
                  <span style={{ fontSize:13, color:"#FFD54F", fontWeight:"bold" }}>${cartTotal().toLocaleString()}</span>
                </div>
              </div>
            )}

            <button onClick={function(){ if(cart.length===0){ say("Pick up a few items first, then head to self-checkout!"); } else { setCheckout(true); } }} style={{ width:"100%", padding:"13px", background: cart.length?"linear-gradient(135deg,#2E7D32,#43A047)":"#1A2E44", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontFamily:"Georgia", fontWeight:"bold", cursor:"pointer" }}>
              Go to Self-Checkout{cart.length?(" ("+cart.length+")"):""}
            </button>
          </div>
        )}

        {/* ── SELF-CHECKOUT ── */}
        {isRetail && checkout && (
          <div>
            <div style={{ background:"linear-gradient(180deg,#102840,#0A1A2A)", borderRadius:12, padding:"14px", border:"1px solid #1E3A5A", marginBottom:12 }}>
              <div style={{ textAlign:"center", fontSize:14, color:"#4CAF50", fontWeight:"bold", letterSpacing:1, marginBottom:4 }}>● SELF-CHECKOUT ●</div>
              <div style={{ textAlign:"center", fontSize:10, color:"#90CAF9", marginBottom:12 }}>Scan complete — review your items</div>
              {cart.length===0 ? <div style={{ textAlign:"center", color:"#607D8B", padding:14 }}>Nothing scanned.</div> : cart.map(function(c){
                return (
                  <div key={c.line} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px dashed rgba(255,255,255,.1)" }}>
                    <span style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ width:16, height:16, borderRadius:3, background:c.color, display:"inline-block" }}/>
                      <span style={{ fontSize:13, color:"#E3F2FD" }}>{c.name}</span>
                    </span>
                    <span style={{ fontSize:13, color:"#FFD54F", fontFamily:"monospace" }}>${c.price.toFixed(2)}</span>
                  </div>
                );
              })}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, paddingTop:8, borderTop:"2px solid #1E3A5A" }}>
                <span style={{ fontSize:15, color:"#fff", fontWeight:"bold" }}>TOTAL</span>
                <span style={{ fontSize:15, color:"#FFD54F", fontWeight:"bold", fontFamily:"monospace" }}>${cartTotal().toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={function(){ setCheckout(false); }} style={{ flex:1, padding:"13px", background:"#142030", color:"#90CAF9", border:"1px solid #1E3A5A", borderRadius:12, fontSize:14, fontFamily:"Georgia", cursor:"pointer" }}>‹ Keep Shopping</button>
              <button onClick={payNow} style={{ flex:2, padding:"13px", background:"linear-gradient(135deg,#2E7D32,#43A047)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontFamily:"Georgia", fontWeight:"bold", cursor:"pointer" }}>Pay ${cartTotal().toLocaleString()}</button>
            </div>
          </div>
        )}

        {/* ── RESTAURANT: fillet only edible fish ── */}
        {shop.type === "restaurant" && (
          <div>
            {!pickFish ? (
              <div>
                <div style={{ fontSize:12, color:"#FFD54F", marginBottom:8, fontFamily:"Georgia" }}>Pick a fish from your hold to prepare:</div>
                {inv.length === 0 ? (
                  <div style={{ textAlign:"center", color:"#607D8B", padding:20, background:"rgba(255,255,255,.03)", borderRadius:10 }}>Your hold is empty — go catch something first!</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {inv.map(function(f){
                      var safe = (f.edible !== false);
                      return (
                        <div key={f.uid} onClick={function(){ if(safe){ setPickFish(f); say("Ah, a fine " + f.name + "! How would you like it prepared?"); } else { say("Whoa — a " + f.name + " is poisonous! I can't fillet that, it's not safe to eat."); } }} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background: safe?"rgba(255,255,255,.04)":"rgba(244,67,54,.08)", borderRadius:10, border: safe?"1px solid #1E3A5A":"1px solid #5A2A2A", cursor:"pointer", opacity: safe?1:0.7 }}>
                          <div>
                            <div style={{ fontSize:13, fontWeight:"bold", color:RARITY_COLOR[f.rarity] }}>{f.name}</div>
                            <div style={{ fontSize:11, color:"#90CAF9" }}>{f.weight} lbs · base ${f.value}</div>
                          </div>
                          {safe ? <div style={{ color:"#90CAF9", fontSize:11 }}>Choose ›</div> : <div style={{ color:"#FF8A80", fontSize:10, fontWeight:"bold", textAlign:"right" }}>Poisonous<br/>Can't eat</div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ fontSize:12, color:"#FFD54F", fontFamily:"Georgia" }}>Fillet & cook your {pickFish.name}:</div>
                  <button onClick={function(){ setPickFish(null); }} style={{ background:"#142030", border:"1px solid #1E3A5A", color:"#90CAF9", borderRadius:8, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>‹ Back</button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {PREP_STYLES.map(function(p){
                    var payout = Math.round(pickFish.value * p.mult);
                    return (
                      <div key={p.id} onClick={function(){ filletFish(pickFish, p); }} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background:"rgba(255,255,255,.04)", borderRadius:10, border:"1px solid #1E3A5A", cursor:"pointer" }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:"bold", color:"#EEE" }}>{p.name}</div>
                          <div style={{ fontSize:11, color:"#90CAF9" }}>{p.desc}</div>
                        </div>
                        <div style={{ color:"#4CAF50", fontSize:14, fontWeight:"bold" }}>${payout.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── REPAIR ── */}
        {shop.type === "repair" && (
          <div style={{ textAlign:"center", padding:"10px 0" }}>
            <div style={{ fontSize:13, color:"#90CAF9", marginBottom:14 }}>Rusty can cool your engine right down and check it over. Free for regulars!</div>
            <button onClick={function(){ say("All cooled off and runnin' smooth. Drive safe out there!"); }} style={{ background:"linear-gradient(135deg,#2E7D32,#43A047)", color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, cursor:"pointer", fontFamily:"Georgia", fontWeight:"bold" }}>Cool the engine down</button>
          </div>
        )}

        {/* ── CHURCH ── */}
        {shop.type === "church" && (
          <div style={{ textAlign:"center", padding:"6px 0" }}>
            <div style={{ fontSize:13, color:"#B39DDB", marginBottom:14, lineHeight:1.6 }}>{shop.keeper} welcomes you into the Seaside Chapel. The candles flicker softly.</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button onClick={function(){ say("Out on the water, remember to be patient and kind. The fish will come. Bless you, friend."); }} style={{ background:"#142030", border:"1px solid #5E35B1", color:"#B39DDB", borderRadius:8, padding:"11px", fontSize:13, cursor:"pointer", fontFamily:"Georgia" }}>Talk with the Pastor</button>
              <button onClick={function(){ say("Take a moment of peace. Feel calm wash over you like a gentle tide."); }} style={{ background:"#142030", border:"1px solid #5E35B1", color:"#B39DDB", borderRadius:8, padding:"11px", fontSize:13, cursor:"pointer", fontFamily:"Georgia" }}>Sit and rest a while</button>
              <button onClick={function(){ if(money>=100){ setMoney(function(m){return m-100;}); say("Thank you for your generous donation. It helps the whole harbor community!"); } else { say("No need to give if you can't — kindness is free, friend."); } }} style={{ background:"#5E35B1", border:"none", color:"#fff", borderRadius:8, padding:"11px", fontSize:13, cursor:"pointer", fontFamily:"Georgia" }}>Donate — $100</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function App() {
  const [screen,  setScreen]  = useState("title");
  const [tab,     setTab]     = useState("fish");
  const [cfg,     setCfg]     = useState({ skin:SKIN[1], shirt:SHIRT[0], pants:PANTS[0], hat:"none", hatColor:HATC[0], name:"Angler", gender:"boy", hairStyle:2, hairColor:HAIRC[0], pantsStyle:0 });
  const [money,   setMoney]   = useState(10000000000);
  const [boatId,  setBoatId]  = useState("skiff");
  const [homeMode,   setHomeMode]   = useState("boat");   // "boat" = live on the water, "land" = live in a house
  const [landHomeId, setLandHomeId] = useState("tent");
  const [ownedHomes, setOwnedHomes] = useState(["tent"]);
  const [locId,   setLocId]   = useState("dock");
  const [rodId,   setRodId]   = useState("basic");
  const [inv,     setInv]     = useState([]);
  const [room,    setRoom]    = useState("deck");
  const [fstate,  setFstate]  = useState("idle");
  const [caughtF, setCaughtF] = useState(null);
  const [reelPct, setReelPct] = useState(0);
  const [msg,     setMsg]     = useState("Cast your line to start fishing");
  const [countdown, setCountdown] = useState(null);
  const [time,    setTime]    = useState(0);
  const [tackleOpen,  setTackleOpen]  = useState(false);
  const [tackleMode,  setTackleMode]  = useState("bait");
  const [selectedBait, setSelectedBait] = useState(null);
  const [selectedLure, setSelectedLure] = useState(null);
  const [activeShop, setActiveShop] = useState(null);
  const [drive3D, setDrive3D] = useState(true);
  const [goods, setGoods] = useState([]);
  const [fishSearch, setFishSearch] = useState("");
  const addGood = useCallback((g)=>{ setGoods(prev=>prev.concat([g])); },[]);
  // Collected seashells drop into the same Inventory as gift cards, so they're
  // sold the same way (double-click) and rarer shells pay more.
  const collectShell = useCallback((shell)=>{ setGoods(prev=>prev.concat([{ uid:Date.now()+Math.random(), name:shell.name, rarity:shell.rarity, sell:shell.sell, color:shell.color }])); },[]);
  const sellGood = useCallback((uid)=>{
    setGoods(prev=>{
      let val=0; const out=[];
      for(let i=0;i<prev.length;i++){ if(prev[i].uid===uid){ val=prev[i].sell; } else { out.push(prev[i]); } }
      if(val>0) setMoney(m=>m+val);
      return out;
    });
  },[]);
  const [ownedRods, setOwnedRods] = useState(["basic"]);
  const [boughtLures, setBoughtLures] = useState([]);
  const [boughtBaits, setBoughtBaits] = useState([]);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneData, setPhoneData] = useState(null); // null = not set up yet
  const [phoneSetupDone, setPhoneSetupDone] = useState(false);
  const [rs, setRs] = useState({
    lightsOn:true, nightLampOn:true, inBed:false, curtainsOpen:true, dresserOpen:false,
    stoveOn:false, fridgeOpen:false, tapOn:false, cookingFood:false, microwaveOn:false, coffeeOn:false,
    tvOn:false, sitting:false, lampOn:true,
    engineOn:false, radarOn:false, radioOn:false, steerAngle:0,
    tackleboxOpen:false, baitbucketOpen:false, coolerOpen:false, fishingchair:false, fishnetDeployed:false, liferingThrown:false,
  });

  const fstateRef = useRef("idle");
  const caughtRef = useRef(null);
  const reelRef   = useRef(0);
  const timerRef  = useRef(null);
  const escapeRef = useRef(null);
  const rafRef    = useRef(null);
  const rodRef    = useRef(RODS[0]);
  const locRef    = useRef(LOCATIONS[0]);
  const baitRef   = useRef(null);
  const lureRef   = useRef(null);

  const boat = BOATS.find(b=>b.id===boatId);
  const landHome = LAND_HOMES.find(h=>h.id===landHomeId) || LAND_HOMES[0];
  // Where you currently live decides which rooms you can walk through and what they're called.
  const dwellingRooms = homeMode==="land" ? landHome.rooms : boat.rooms;
  const roomLabel = (r)=> homeMode==="land" ? (LAND_ROOM_NAMES[r]||ROOM_NAMES[r]||r) : (ROOM_NAMES[r]||r);
  const loc  = LOCATIONS.find(l=>l.id===locId);
  const rod  = RODS.find(r=>r.id===rodId);
  rodRef.current = rod;
  locRef.current = loc;
  baitRef.current = selectedBait;
  lureRef.current = selectedLure;

  useEffect(()=>{
    // Slow tick (~8 fps) only for the 2D room animations. The 3D fishing view
    // runs its own internal clock, so we don't need a 60fps re-render of the whole app.
    const iv = setInterval(()=>{ setTime(t=>t+1); }, 120);
    return ()=>clearInterval(iv);
  },[]);

  const onAction = useCallback((action) => {
    if (action === "tacklebox") {
      setRs(s=>(Object.assign({}, s, {tackleboxOpen:!s.tackleboxOpen})));
      if (!rs.tackleboxOpen) { setTackleMode("lure"); setTackleOpen(true); }
      return;
    }
    if (action === "baitbucket") {
      setRs(s=>(Object.assign({}, s, {baitbucketOpen:!s.baitbucketOpen})));
      if (!rs.baitbucketOpen) { setTackleMode("bait"); setTackleOpen(true); }
      return;
    }
    setRs(s=>{
      switch(action){
        case "lights":       return Object.assign({}, s, {lightsOn:!s.lightsOn});
        case "nightlamp":    return Object.assign({}, s, {nightLampOn:!s.nightLampOn});
        case "bed":          return Object.assign({}, s, {inBed:!s.inBed});
        case "curtains":     return Object.assign({}, s, {curtainsOpen:!s.curtainsOpen});
        case "dresser":      return Object.assign({}, s, {dresserOpen:!s.dresserOpen});
        case "stove":        return Object.assign({}, s, {stoveOn:!s.stoveOn,cookingFood:!s.stoveOn?s.cookingFood:false});
        case "fridge":       return Object.assign({}, s, {fridgeOpen:!s.fridgeOpen});
        case "tap":          return Object.assign({}, s, {tapOn:!s.tapOn});
        case "cook":         return s.stoveOn?Object.assign({}, s, {cookingFood:!s.cookingFood}):s;
        case "microwave":    return Object.assign({}, s, {microwaveOn:!s.microwaveOn});
        case "coffee":       return Object.assign({}, s, {coffeeOn:!s.coffeeOn});
        case "tv":           return Object.assign({}, s, {tvOn:!s.tvOn});
        case "sit":          return Object.assign({}, s, {sitting:!s.sitting});
        case "lamp":         return Object.assign({}, s, {lampOn:!s.lampOn});
        case "engine":       return Object.assign({}, s, {engineOn:!s.engineOn});
        case "radar":        return Object.assign({}, s, {radarOn:!s.radarOn});
        case "radio":        return Object.assign({}, s, {radioOn:!s.radioOn});
        case "steer":        return Object.assign({}, s, {steerAngle:((s.steerAngle||0)+22.5)%360});
        case "cooler":       return Object.assign({}, s, {coolerOpen:!s.coolerOpen});
        case "fishingchair": return Object.assign({}, s, {fishingchair:!s.fishingchair});
        case "fishnet":      return Object.assign({}, s, {fishnetDeployed:!s.fishnetDeployed});
        case "lifering":     return Object.assign({}, s, {liferingThrown:!s.liferingThrown});
        case "coffeetable":  return s;
        default:             return s;
      }
    });
  },[rs.tackleboxOpen, rs.baitbucketOpen]);

  const fishEscapes = useCallback((reason)=>{
    clearTimeout(timerRef.current); clearInterval(escapeRef.current);
    fstateRef.current="lost"; setFstate("lost"); setMsg(reason); setCountdown(null);
    setTimeout(()=>{ fstateRef.current="idle"; setFstate("idle"); setMsg("Cast your line to start fishing"); reelRef.current=0; setReelPct(0); },2000);
  },[]);

  const castLine = useCallback(()=>{
    if(fstateRef.current!=="idle") return;
    if(!baitRef.current && !lureRef.current){ setMsg("Choose a bait or a lure first, then cast your line!"); return; }
    fstateRef.current="casting"; setFstate("casting"); setMsg("Line out... watching the bobber");
    timerRef.current=setTimeout(()=>{
      // 60% chance: named species for this location; 40% chance: any fish from the full pool
      let fish;
      if (Math.random() < 0.6) {
        const named=locRef.current.fish.map(id=>FISH.find(f=>f.id===id)).filter(Boolean);
        fish=named[Math.floor(Math.random()*named.length)];
      } else {
        fish=FISH[Math.floor(Math.random()*FISH.length)];
      }
      if(!fish) fish=FISH[0];
      caughtRef.current=fish; setCaughtF(fish);
      fstateRef.current="biting"; setFstate("biting");
      reelRef.current=0; setReelPct(0); setCountdown(3);
      setMsg(`${fish.name} is on the line! Reel in now!`);
      let secs=3;
      escapeRef.current=setInterval(()=>{
        if(fstateRef.current==="reeling"||fstateRef.current==="caught"||fstateRef.current==="lost"||fstateRef.current==="idle"){ clearInterval(escapeRef.current); return; }
        secs-=1; setCountdown(secs);
        if(secs<=0){ clearInterval(escapeRef.current); fishEscapes("Too slow — it got away!"); }
      },1000);
    },2000+Math.random()*3500);
  },[fishEscapes]);

  const doReel = useCallback(()=>{
    if(fstateRef.current!=="biting"&&fstateRef.current!=="reeling") return;
    if(fstateRef.current==="biting"){ clearInterval(escapeRef.current); setCountdown(null); fstateRef.current="reeling"; setFstate("reeling"); }
    const fish=caughtRef.current;
    const baitBonus=(baitRef.current && baitRef.current.bonus||0)+(lureRef.current && lureRef.current.bonus||0);
    reelRef.current=Math.max(-40,reelRef.current+rodRef.current.power*9+baitBonus-(fish && fish.difficulty||1)*1.5);
    setReelPct(reelRef.current);
    if(reelRef.current>=100){
      clearTimeout(timerRef.current); clearInterval(escapeRef.current);
      const w=Math.round(fish.minW+Math.random()*(fish.maxW-fish.minW));
      const l=Math.round(fish.minL+Math.random()*(fish.maxL-fish.minL));
      const v=Math.round(w*fish.value);
      setInv(i=>i.concat([Object.assign({}, fish, {weight:w,length:l,value:v,uid:Date.now()})]));
      fstateRef.current="caught"; setFstate("caught"); setCountdown(null);
      setMsg(`Caught a ${fish.name}! ${w} lbs, ${l} in — $${v}!`);
      timerRef.current=setTimeout(()=>{ fstateRef.current="idle"; setFstate("idle"); setMsg("Cast your line to start fishing"); reelRef.current=0; setReelPct(0); },3500);
    }
  },[]);

  useEffect(()=>{
    if(fstate!=="reeling") return;
    const iv=setInterval(()=>{
      const fish=caughtRef.current;
      reelRef.current-=(fish && fish.difficulty||1)*1.8; setReelPct(reelRef.current);
      if(reelRef.current<=-40){ clearInterval(iv); fishEscapes("Line went slack — it got away!"); }
    },200);
    return()=>clearInterval(iv);
  },[fstate,fishEscapes]);

  const sellAll=useCallback(()=>{
    const total=inv.reduce((s,f)=>s+f.value,0);
    setMoney(m=>m+total); setInv([]);
    setMsg(`Sold all fish for $${total.toLocaleString()}!`);
    setTimeout(()=>setMsg("Cast your line to start fishing"),2500);
  },[inv]);

  // ── SCREENS ───────────────────────────────────────────────────────────────
  if(screen==="title") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#061221 0%,#0D3060 45%,#1565C0 80%,#0A3D8F 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",position:"relative",overflow:"hidden"}}>
      <style>{"@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}@keyframes wv{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}@keyframes bite{0%,100%{transform:scale(1);box-shadow:0 0 0 rgba(230,81,0,0)}50%{transform:scale(1.04);box-shadow:0 0 28px rgba(230,81,0,.8)}}"}</style>
      {[0,1,2,3,4].map(i=><div key={i} style={{position:"absolute",bottom:i*26,left:0,right:0,height:32,background:`rgba(255,255,255,${.015+i*.012})`,borderRadius:"50% 50% 0 0",animation:`wv ${3+i*.5}s ease-in-out infinite alternate`,pointerEvents:"none"}}/>)}
      <div style={{opacity:.09,position:"absolute",bottom:55,pointerEvents:"none"}}><FishSVG fish={FISH[0]} W={320}/></div>
      <div style={{fontSize:11,letterSpacing:6,color:"#90CAF9",textTransform:"uppercase",marginBottom:10,animation:"shimmer 3s ease-in-out infinite",position:"relative",zIndex:5}}>First-Person Fishing Game</div>
      <h1 style={{fontSize:60,margin:"0 0 4px",color:"#FFF",textShadow:"0 6px 32px rgba(0,0,0,.6)",letterSpacing:3,position:"relative",zIndex:5}}>Goliath</h1>
      <h1 style={{fontSize:60,margin:"0 0 28px",color:"#FFD54F",textShadow:"0 6px 40px rgba(255,213,79,.6)",letterSpacing:3,animation:"floatY 3s ease-in-out infinite",position:"relative",zIndex:5}}>Grouper</h1>
      <p style={{color:"#90CAF9",maxWidth:300,textAlign:"center",lineHeight:1.9,marginBottom:44,fontSize:14,position:"relative",zIndex:5}}>Live on your boat or in a beach house. Fish first-person. Choose your bait. Use your phone.</p>
      <button onClick={()=>setScreen("character")} style={{background:"linear-gradient(135deg,#FFD54F,#FF8F00)",color:"#1A1A1A",border:"none",padding:"22px 0",fontSize:22,borderRadius:20,cursor:"pointer",fontFamily:"Georgia",letterSpacing:1,boxShadow:"0 8px 40px rgba(255,213,79,.6)",width:"min(340px,88vw)",display:"block",fontWeight:"bold",position:"relative",zIndex:10}}>
        Begin Your Journey
      </button>
    </div>
  );

  if(screen==="character") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0D1B2A,#1A2A3A)",color:"#EEE",display:"flex",flexDirection:"column",alignItems:"center",padding:24,gap:16,fontFamily:"Georgia,serif"}}>
      <h2 style={{color:"#FFD54F",margin:0}}>Create Your Angler</h2>
      <div style={{background:"linear-gradient(160deg,#142030,#1E3A5A)",borderRadius:16,padding:20,border:"1px solid #2A4A6A",width:"100%",maxWidth:540,boxShadow:"0 8px 32px rgba(0,0,0,.4)"}}>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
            <div style={{background:"#0D1B2A",borderRadius:14,padding:12,border:"1px solid #2A4A6A"}}>
              <Char3D cfg={cfg} width={150} height={290}/>
            </div>
            <input value={cfg.name} onChange={e=>setCfg(c=>(Object.assign({}, c, {name:e.target.value})))} style={{background:"#0D1B2A",border:"1px solid #2A4A6A",color:"#EEE",borderRadius:8,padding:"7px 12px",fontFamily:"Georgia",textAlign:"center",width:130,fontSize:14}} placeholder="Your name"/>
          </div>
          <div style={{flex:1,minWidth:200}}>
            {/* Gender — switches hair/pants style lists */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:"#90CAF9",letterSpacing:1,marginBottom:5}}>GENDER</div>
              <div style={{display:"flex",gap:8}}>
                {[["girl","Girl"],["boy","Boy"]].map(([g,label])=>(
                  <button key={g} onClick={()=>setCfg(c=>Object.assign({},c,{gender:g,hairStyle:0,pantsStyle:0}))} style={{flex:1,padding:"9px 0",background:cfg.gender===g?"linear-gradient(135deg,#FFD54F,#FF8F00)":"#0D1B2A",color:cfg.gender===g?"#1A1A1A":"#90CAF9",border:"1px solid #2A4A6A",borderRadius:9,cursor:"pointer",fontSize:14,fontFamily:"Georgia",fontWeight:"bold"}}>{label}</button>
                ))}
              </div>
            </div>
            {[{label:"Skin",key:"skin",opts:SKIN},{label:"Shirt",key:"shirt",opts:SHIRT},{label:"Pants Color",key:"pants",opts:PANTS},{label:"Hair Color",key:"hairColor",opts:HAIRC},{label:"Hat Color",key:"hatColor",opts:HATC}].map(row=>(
              <div key={row.key} style={{marginBottom:10}}>
                <div style={{fontSize:10,color:"#90CAF9",letterSpacing:1,marginBottom:5}}>{row.label.toUpperCase()}</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  {row.opts.map(c=><div key={c} onClick={()=>setCfg(x=>(Object.assign({}, x, {[row.key]:c})))} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",border:cfg[row.key]===c?"3px solid #FFD54F":"3px solid rgba(255,255,255,.1)",boxSizing:"border-box"}}/>)}
                </div>
              </div>
            ))}
            <div style={{marginBottom:4}}>
              <div style={{fontSize:10,color:"#90CAF9",letterSpacing:1,marginBottom:5}}>HAT</div>
              <div style={{display:"flex",gap:6}}>
                {["none","cap","wide","captain"].map(h=>(
                  <button key={h} onClick={()=>setCfg(c=>(Object.assign({}, c, {hat:h})))} style={{padding:"5px 9px",background:cfg.hat===h?"#FFD54F":"#0D1B2A",color:cfg.hat===h?"#111":"#90CAF9",border:"1px solid #2A4A6A",borderRadius:7,cursor:"pointer",fontSize:10,fontFamily:"Georgia"}}>{h==="none"?"Bare":h[0].toUpperCase()+h.slice(1)}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hairstyle picker */}
        <div style={{marginTop:16}}>
          <div style={{fontSize:10,color:"#90CAF9",letterSpacing:1,marginBottom:6}}>HAIRSTYLE — {hairListFor(cfg.gender).length} STYLES</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",maxHeight:108,overflowY:"auto",padding:"2px 2px 4px"}}>
            {hairListFor(cfg.gender).map((hs,i)=>(
              <button key={i} onClick={()=>setCfg(c=>Object.assign({},c,{hairStyle:i}))} style={{padding:"5px 9px",background:cfg.hairStyle===i?"linear-gradient(135deg,#1565C0,#1976D2)":"#0D1B2A",color:cfg.hairStyle===i?"#FFD54F":"#90CAF9",border:`1px solid ${cfg.hairStyle===i?"#FFD54F":"#2A4A6A"}`,borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:"Georgia",whiteSpace:"nowrap"}}>{i+1}. {hs.n}</button>
            ))}
          </div>
        </div>

        {/* Pants style picker */}
        <div style={{marginTop:12}}>
          <div style={{fontSize:10,color:"#90CAF9",letterSpacing:1,marginBottom:6}}>PANTS STYLE — {pantsListFor(cfg.gender).length} STYLES</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",maxHeight:108,overflowY:"auto",padding:"2px 2px 4px"}}>
            {pantsListFor(cfg.gender).map((ps,i)=>(
              <button key={i} onClick={()=>setCfg(c=>Object.assign({},c,{pantsStyle:i}))} style={{padding:"5px 9px",background:cfg.pantsStyle===i?"linear-gradient(135deg,#1565C0,#1976D2)":"#0D1B2A",color:cfg.pantsStyle===i?"#FFD54F":"#90CAF9",border:`1px solid ${cfg.pantsStyle===i?"#FFD54F":"#2A4A6A"}`,borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:"Georgia",whiteSpace:"nowrap"}}>{i+1}. {ps.n}</button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={()=>setScreen("game")} style={{background:"linear-gradient(135deg,#FFD54F,#FF8F00)",color:"#1A1A1A",border:"none",padding:"14px 0",fontSize:18,borderRadius:24,cursor:"pointer",fontFamily:"Georgia",letterSpacing:1,boxShadow:"0 6px 24px rgba(255,213,79,.5)",width:"min(320px,88vw)",fontWeight:"bold"}}>Start Fishing</button>
    </div>
  );

  // ── MAIN GAME ──────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#0A1220",fontFamily:"Georgia,serif",color:"#EEE",maxWidth:680,margin:"0 auto",display:"flex",flexDirection:"column"}}>
      <style>{"@keyframes bite{0%,100%{transform:scale(1)}50%{transform:scale(1.05);box-shadow:0 0 28px rgba(230,81,0,.9)}} @keyframes ringPulse{0%{transform:scale(1);opacity:1}100%{transform:scale(1.6);opacity:0}} @keyframes soundBar{0%{transform:scaleY(.4)}100%{transform:scaleY(1.4)}} @keyframes dot{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}"}</style>

      {/* Tackle modal */}
      {tackleOpen && <TackleModal mode={tackleMode} selectedBait={selectedBait} selectedLure={selectedLure} onSelectBait={b=>{ if(selectedBait&&selectedBait.id===b.id){setSelectedBait(null);baitRef.current=null;} else {setSelectedBait(b);baitRef.current=b;setSelectedLure(null);lureRef.current=null;} }} onSelectLure={l=>{ if(selectedLure&&selectedLure.id===l.id){setSelectedLure(null);lureRef.current=null;} else {setSelectedLure(l);lureRef.current=l;setSelectedBait(null);baitRef.current=null;} }} onClose={()=>setTackleOpen(false)}/>}

      {activeShop && <ShopView shop={activeShop} money={money} setMoney={setMoney} inv={inv} setInv={setInv} rodId={rodId} setRodId={setRodId} ownedRods={ownedRods} setOwnedRods={setOwnedRods} boughtLures={boughtLures} setBoughtLures={setBoughtLures} boughtBaits={boughtBaits} setBoughtBaits={setBoughtBaits} cfg={cfg} setCfg={setCfg} addGood={addGood} onLeave={()=>setActiveShop(null)}/>}

      {/* Phone modal */}
      {phoneOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setPhoneOpen(false)}>
          <div onClick={e=>e.stopPropagation()}>
            {!phoneData ? (
              // First time — run setup wizard
              <div style={{width:300,background:"#1A1A2E",borderRadius:36,padding:"10px 10px 16px",boxShadow:"0 24px 60px rgba(0,0,0,.7)",border:"2px solid #333",margin:"0 auto"}}>
                <div style={{width:90,height:22,background:"rgba(0,0,0,.8)",borderRadius:12,margin:"0 auto 8px"}}/>
                <div style={{borderRadius:28,overflow:"hidden"}}>
                  <PhoneSetup onComplete={(data)=>{ setPhoneData(Object.assign({}, data, {unlocked:false})); }}/>
                </div>
                <button onClick={()=>setPhoneOpen(false)} style={{marginTop:10,width:"100%",padding:"8px",background:"rgba(255,255,255,.08)",border:"none",borderRadius:12,color:"#AAA",cursor:"pointer",fontSize:12,fontFamily:"Georgia"}}>Put away</button>
              </div>
            ) : (
              <Phone cfg={cfg} onClose={()=>setPhoneOpen(false)} phoneData={phoneData} setPhoneData={setPhoneData}/>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{background:"linear-gradient(90deg,#0A1628,#122040)",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1E3A5A",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 12px rgba(0,0,0,.4)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:62,flexShrink:0}}><CharSVG cfg={cfg} size={36}/></div>
          <div>
            <div style={{fontSize:13,fontWeight:"bold",color:"#FFD54F"}}>{cfg.name}</div>
            <div style={{fontSize:10,color:"#90CAF9"}}>{loc.name} · {boat.name}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {/* Phone button */}
          <button onClick={()=>setPhoneOpen(true)} style={{background:"#1E3A5A",border:"1px solid #2A4A6A",borderRadius:10,padding:"6px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
            <svg width={18} height={18} viewBox="0 0 24 24"><rect x={4} y={1} width={16} height={22} rx={3} fill="none" stroke="#90CAF9" strokeWidth={2}/><rect x={9} y={3} width={6} height={2} rx={1} fill="#90CAF9"/><circle cx={12} cy={20} r={1.5} fill="#90CAF9"/></svg>
            <span style={{fontSize:8,color:"#90CAF9"}}>Phone</span>
          </button>
          <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#90CAF9"}}>WALLET</div><div style={{fontSize:15,color:"#FFD54F",fontWeight:"bold"}}>${money.toLocaleString()}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#90CAF9"}}>HOLD</div><div style={{fontSize:15,color:"#81C784",fontWeight:"bold"}}>{inv.length}</div></div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",background:"#0A1628",borderBottom:"1px solid #1E3A5A"}}>
        {[["fish","Cast"],["fishpedia","Fish"],["drive","Drive"],["boat","Boat"],["map","Map"],["gear","Gear"],["hold","Hold"],["items","Inventory"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"9px 0",background:tab===id?"#122030":"transparent",color:tab===id?"#FFD54F":"#607D8B",border:"none",cursor:"pointer",fontSize:10,fontFamily:"Georgia",borderBottom:tab===id?"2px solid #FFD54F":"2px solid transparent"}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{flex:1,padding:14,overflowY:"auto"}}>

        {tab==="fish" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{borderRadius:14,overflow:"hidden",border:"1px solid #1E3A5A",boxShadow:"0 4px 20px rgba(0,0,0,.4)",position:"relative"}}>
              <FishingView fstate={fstate} caughtF={caughtF} cfg={cfg} bait={selectedBait} lure={selectedLure} time={time} reelPct={reelPct}/>
            </div>

            {/* Tackle strip */}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setTackleMode("bait");setTackleOpen(true);}} style={{flex:1,padding:"10px",background:"#142030",border:`1px solid ${selectedBait?"#FFD54F":"#1E3A5A"}`,borderRadius:10,cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:10,color:"#90CAF9",marginBottom:2}}>BAIT</div>
                <div style={{fontSize:12,color:selectedBait?"#FFD54F":"#607D8B",fontFamily:"Georgia"}}>{selectedBait && selectedBait.name||"None — tap to pick"}</div>
              </button>
              <button onClick={()=>{setTackleMode("lure");setTackleOpen(true);}} style={{flex:1,padding:"10px",background:"#142030",border:`1px solid ${selectedLure?"#FFD54F":"#1E3A5A"}`,borderRadius:10,cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:10,color:"#90CAF9",marginBottom:2}}>LURE</div>
                <div style={{fontSize:12,color:selectedLure?"#FFD54F":"#607D8B",fontFamily:"Georgia"}}>{selectedLure && selectedLure.name||"None — tap to pick"}</div>
              </button>
            </div>

            {fstate==="caught"&&caughtF&&(
              <div style={{background:"linear-gradient(135deg,rgba(255,213,79,.12),rgba(255,143,0,.08))",border:"1px solid #FFD54F",borderRadius:12,padding:12,display:"flex",alignItems:"center",gap:14}}>
                <FishSVG fish={caughtF} W={90}/>
                <div>
                  <div style={{color:RARITY_COLOR[caughtF.rarity],fontWeight:"bold",fontSize:15}}>{caughtF.name}</div>
                  <div style={{color:"#90CAF9",fontSize:12,marginTop:2}}>{(inv[inv.length-1] ? inv[inv.length-1].weight : '')} lbs · {(inv[inv.length-1] ? inv[inv.length-1].length : '')} in</div>
                  <div style={{color:"#FFD54F",fontSize:14,marginTop:2,fontWeight:"bold"}}>${(inv[inv.length-1] ? inv[inv.length-1].value  : '')}</div>
                </div>
              </div>
            )}

            {fstate==="biting"&&(
              <div style={{display:"flex",alignItems:"center",gap:12,background:"rgba(230,81,0,.16)",borderRadius:12,padding:"10px 16px",border:"2px solid #E65100",animation:"bite .4s ease-in-out infinite"}}>
                <div>
                  <div style={{fontSize:15,color:"#FFF",fontWeight:"bold"}}>{caughtF && caughtF.name} is biting!</div>
                  <div style={{fontSize:11,color:"#90CAF9",marginTop:3}}>Tap Reel In fast or it escapes!</div>
                </div>
              </div>
            )}

            <div style={{background:"rgba(21,101,192,.12)",borderRadius:10,padding:"8px 12px",border:"1px solid rgba(21,101,192,.25)"}}>
              <div style={{fontSize:12,color:"#B0BEC5"}}>{msg}</div>
            </div>

            {(fstate==="biting"||fstate==="reeling")&&(
              <div>
                <div style={{fontSize:11,color:"#90CAF9",marginBottom:4}}>Reel tension — {caughtF && caughtF.name}</div>
                <div style={{background:"#1A2E44",borderRadius:6,height:16,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.max(0,reelPct)}%`,background:reelPct>60?"linear-gradient(90deg,#2E7D32,#4CAF50)":reelPct>25?"linear-gradient(90deg,#E65100,#FF9800)":"linear-gradient(90deg,#B71C1C,#F44336)",borderRadius:6,transition:"width .08s"}}/>
                </div>
              </div>
            )}

            <div style={{display:"flex",gap:10}}>
              <button onClick={castLine} disabled={fstate!=="idle"} style={{flex:1,padding:"15px",background:fstate==="idle"?"linear-gradient(135deg,#1565C0,#1976D2)":"#1A2E44",color:"#FFF",border:"none",borderRadius:12,fontSize:16,cursor:fstate==="idle"?"pointer":"not-allowed",fontFamily:"Georgia",opacity:fstate==="idle"?1:.4,boxShadow:fstate==="idle"?"0 4px 16px rgba(21,101,192,.4)":"none"}}>Cast Line</button>
              <button onClick={doReel} disabled={fstate!=="biting"&&fstate!=="reeling"} style={{flex:1,padding:"15px",background:(fstate==="biting"||fstate==="reeling")?"linear-gradient(135deg,#BF360C,#E65100)":"#1A2E44",color:"#FFF",border:"none",borderRadius:12,fontSize:16,cursor:(fstate==="biting"||fstate==="reeling")?"pointer":"not-allowed",fontFamily:"Georgia",opacity:(fstate==="biting"||fstate==="reeling")?1:.3,animation:fstate==="biting"?"bite .5s ease-in-out infinite":"none",boxShadow:(fstate==="biting"||fstate==="reeling")?"0 4px 16px rgba(230,81,0,.4)":"none"}}>Reel In!</button>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {loc.fish.map(fid=>{const f=FISH.find(x=>x.id===fid);return f?<div key={fid} style={{background:"rgba(255,255,255,.04)",borderRadius:8,padding:"4px 10px",border:`1px solid ${RARITY_COLOR[f.rarity]}55`,fontSize:11}}><span style={{color:RARITY_COLOR[f.rarity]}}>{f.name}</span><span style={{color:"#607D8B",marginLeft:5}}>{f.rarity}</span></div>:null;})}
            </div>
          </div>
        )}

        {tab==="drive" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:13,color:"#FFD54F",fontFamily:"Georgia"}}>Driving the {boat.name}</div>
              <div style={{display:"flex",gap:4,background:"#0D1B2A",borderRadius:10,padding:3,border:"1px solid #1E3A5A"}}>
                <button onClick={()=>setDrive3D(true)} style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"Georgia",fontSize:12,fontWeight:"bold",background:drive3D?"#1565C0":"transparent",color:drive3D?"#fff":"#607D8B"}}>First-Person</button>
                <button onClick={()=>setDrive3D(false)} style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"Georgia",fontSize:12,fontWeight:"bold",background:!drive3D?"#1565C0":"transparent",color:!drive3D?"#fff":"#607D8B"}}>Top-Down</button>
              </div>
            </div>
            {drive3D
              ? <DriveMap boat={boat} cfg={cfg} onEnter={(sh)=>setActiveShop(sh)} onCollect={collectShell}/>
              : <DriveMap2D boat={boat} cfg={cfg} onEnter={(sh)=>setActiveShop(sh)}/>}
          </div>
        )}

        {tab==="items" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontSize:14,color:"#FFD54F",fontFamily:"Georgia",fontWeight:"bold"}}>Your Inventory</div>
            <div style={{fontSize:11,color:"#90CAF9",lineHeight:1.5}}>Gift cards you buy and <b style={{color:"#FFD54F"}}>seashells you collect on the sand</b> show up here. <b style={{color:"#FFD54F"}}>Double-click an item to sell it</b> for coins — the rarer it is, the more money you get!</div>
            {goods.length===0 ? (
              <div style={{textAlign:"center",color:"#607D8B",padding:"30px 16px",background:"rgba(255,255,255,.03)",borderRadius:12,border:"1px solid #1E3A5A"}}>
                Your inventory is empty. Walk the sand to collect seashells, or buy a gift card at a shop — they'll appear here to sell.
              </div>
            ) : (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#90CAF9",marginBottom:6}}>
                  <span>{goods.length} item{goods.length===1?"":"s"}</span>
                  <span>Total value: ${goods.reduce((s,g)=>s+g.sell,0).toLocaleString()}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {goods.map((g)=>(
                    <div key={g.uid} onDoubleClick={()=>{ sellGood(g.uid); setMsg("Sold "+g.name+" for $"+g.sell.toLocaleString()+"!"); }} style={{position:"relative",background:"linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02))",borderRadius:10,padding:"12px 10px",border:`1px solid ${RARITY_COLOR[g.rarity]||"#1E3A5A"}`,cursor:"pointer"}}>
                      <div style={{width:38,height:38,borderRadius:8,background:g.color,margin:"0 auto 8px",border:"2px solid rgba(255,255,255,.3)",boxShadow:`0 2px 8px ${g.color}66`}}/>
                      <div style={{fontSize:12,fontWeight:"bold",color:"#fff",textAlign:"center"}}>{g.name}</div>
                      <div style={{fontSize:10,color:RARITY_COLOR[g.rarity]||"#90CAF9",textAlign:"center",textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{g.rarity}</div>
                      <div style={{fontSize:12,color:"#4CAF50",fontWeight:"bold",textAlign:"center",marginTop:4}}>Sell: ${g.sell.toLocaleString()}</div>
                      <div style={{fontSize:9,color:"#607D8B",textAlign:"center",marginTop:2}}>double-click to sell</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="boat" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* Live on the water or on dry land */}
            <div style={{display:"flex",gap:6,background:"#0D1B2A",borderRadius:12,padding:4,border:"1px solid #1E3A5A"}}>
              {[["boat","On the Boat",boat.name],["land","On Land",landHome.name]].map(([m,label,sub])=>(
                <button key={m} onClick={()=>{ setHomeMode(m); const rooms=(m==="land"?landHome.rooms:boat.rooms); if(rooms.indexOf(room)<0) setRoom(rooms[0]); }} style={{flex:1,padding:"8px 6px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"Georgia",background:homeMode===m?"linear-gradient(135deg,#1565C0,#1976D2)":"transparent",color:homeMode===m?"#FFD54F":"#607D8B"}}>
                  <div style={{fontSize:12,fontWeight:"bold"}}>{label}</div>
                  <div style={{fontSize:9,opacity:.85}}>{sub}</div>
                </button>
              ))}
            </div>
            <div style={{fontSize:10,color:"#607D8B",letterSpacing:1,marginBottom:2,textAlign:"center"}}>{homeMode==="land"?"YOUR HOUSE — tap a room to enter":"ROOMS — tap to enter"}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
              {dwellingRooms.map(r=>{
                const icons={deck:"[D]",cabin:"[C]",kitchen:"[K]",bedroom:"[B]",living_room:"[L]",engine_room:"[E]"};
                return (
                  <button key={r} onClick={()=>setRoom(r)} style={{padding:"9px 10px",background:room===r?"linear-gradient(135deg,#1565C0,#1976D2)":"#142030",border:`1px solid ${room===r?"#FFD54F":"#1E3A5A"}`,borderRadius:12,cursor:"pointer",color:room===r?"#FFD54F":"#90CAF9",fontFamily:"Georgia",display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:58}}>
                    <span style={{fontSize:14,fontWeight:"bold"}}>{icons[r]||"[?]"}</span>
                    <span style={{fontSize:8,whiteSpace:"nowrap"}}>{roomLabel(r)}</span>
                  </button>
                );
              })}
            </div>
            <div style={{borderRadius:14,overflow:"hidden",border:"1px solid #1E3A5A",boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>
              <RoomFP room={dwellingRooms.indexOf(room)<0?dwellingRooms[0]:room} rs={rs} onAction={onAction} time={time}/>
            </div>
            <div style={{background:"rgba(255,255,255,.04)",borderRadius:8,padding:"8px 12px",border:"1px solid #1E3A5A",fontSize:12,color:"#90CAF9",textAlign:"center"}}>{roomLabel(dwellingRooms.indexOf(room)<0?dwellingRooms[0]:room)} — Tap any item to interact</div>
          </div>
        )}

        {tab==="map" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {LOCATIONS.map(l=>(
              <div key={l.id} onClick={()=>setLocId(l.id)} style={{background:locId===l.id?"linear-gradient(135deg,#122030,#1E3A5A)":"rgba(255,255,255,.03)",borderRadius:12,padding:"12px 14px",border:`1px solid ${locId===l.id?"#FFD54F":"#1A2E44"}`,cursor:"pointer"}}>
                <div style={{fontWeight:"bold",color:locId===l.id?"#FFD54F":"#DDD",fontSize:13}}>{l.name}</div>
                <div style={{fontSize:11,color:"#90CAF9",marginTop:2}}>{l.fish.map(id=>(FISH.find(f=>f.id===id) ? FISH.find(f=>f.id===id).name : '')).join(" · ")}</div>
              </div>
            ))}
          </div>
        )}

        {tab==="fishpedia" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontSize:14,color:"#FFD54F",fontFamily:"Georgia",fontWeight:"bold"}}>Fish Guide</div>
            <input
              value={fishSearch}
              onChange={e=>setFishSearch(e.target.value)}
              placeholder="Search fish by name or rarity..."
              style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",borderRadius:10,border:"1px solid #1E3A5A",background:"#0D1B2A",color:"#E3F2FD",fontSize:13,fontFamily:"Georgia",outline:"none"}}
            />
            {(function(){
              var q = fishSearch.trim().toLowerCase();
              var list = q==="" ? FISH : FISH.filter(function(f){ return f.name.toLowerCase().indexOf(q)>=0 || f.rarity.toLowerCase().indexOf(q)>=0; });
              return (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{fontSize:11,color:"#90CAF9"}}>{q==="" ? ("All "+FISH.length+" kinds of fish you can catch. Rarer fish are worth more!") : (list.length+" fish match \""+fishSearch.trim()+"\"")}</div>
                  {list.length===0 ? (
                    <div style={{textAlign:"center",color:"#607D8B",padding:"24px 16px",background:"rgba(255,255,255,.03)",borderRadius:12,border:"1px solid #1E3A5A"}}>No fish found. Try another name or a rarity like "rare" or "legendary".</div>
                  ) : list.map(function(f){
                    return (
                      <div key={f.id} style={{background:"rgba(255,255,255,.03)",borderRadius:12,padding:12,border:`1px solid ${RARITY_COLOR[f.rarity]}33`,display:"flex",gap:12,alignItems:"center"}}>
                        <FishSVG fish={f} W={80}/>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:"bold",color:RARITY_COLOR[f.rarity],fontSize:13}}>{f.name}</div>
                          <div style={{fontSize:10,color:"#90CAF9",textTransform:"uppercase",letterSpacing:1}}>{f.rarity}{f.edible===false?" · poisonous":""}</div>
                          <div style={{fontSize:11,color:"#B0BEC5",marginTop:3}}>{f.minW}–{f.maxW} lbs · {f.minL}–{f.maxL} in</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {tab==="gear" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontSize:10,color:"#607D8B",letterSpacing:1,marginBottom:2}}>RODS</div>
            {RODS.map(r=>(
              <div key={r.id} style={{background:rodId===r.id?"linear-gradient(135deg,#122030,#1E3A5A)":"rgba(255,255,255,.03)",borderRadius:12,padding:"12px 14px",border:`1px solid ${rodId===r.id?"#FFD54F":"#1A2E44"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:"bold",color:rodId===r.id?"#FFD54F":"#DDD",fontSize:13}}>{r.name}</div>
                  <div style={{fontSize:11,color:"#90CAF9",marginTop:2}}>{"["+"|".repeat(r.power)+" ".repeat(5-r.power)+"]"} Power {r.power}/5</div>
                </div>
                {rodId===r.id?<div style={{color:"#FFD54F",fontSize:11}}>Equipped</div>:(
                  <button onClick={()=>{if(money>=r.price){setMoney(m=>m-r.price);setRodId(r.id);}}} disabled={money<r.price} style={{background:money>=r.price?"linear-gradient(135deg,#1565C0,#1976D2)":"#1A2E44",color:"#FFF",border:"none",padding:"7px 14px",borderRadius:9,cursor:money>=r.price?"pointer":"not-allowed",fontSize:12,fontFamily:"Georgia"}}>{r.price===0?"Free":"$"+r.price}</button>
                )}
              </div>
            ))}
            <div style={{fontSize:10,color:"#607D8B",letterSpacing:1,marginTop:8,marginBottom:6}}>BOATS — tap a boat to buy</div>
            {BOATS.map(b=>(
              <div key={b.id} style={{background:boatId===b.id?"linear-gradient(135deg,#122030,#1E3A5A)":"rgba(255,255,255,.03)",borderRadius:12,padding:"12px 14px",border:`1px solid ${boatId===b.id?"#FFD54F":"#1A2E44"}`,marginBottom:8}}>
                {/* Boat picture */}
                <div style={{background:"linear-gradient(160deg,#0A1628,#0D2444)",borderRadius:10,padding:"8px 0",display:"flex",justifyContent:"center",marginBottom:8,border:"1px solid #1A2E44"}}>
                  <BoatSVG boat={b} W={200}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:"bold",color:boatId===b.id?"#FFD54F":"#DDD",fontSize:14}}>{b.name}</div>
                    <div style={{fontSize:10,color:"#90CAF9",marginTop:2}}>{b.rooms.length} {b.rooms.length===1?"room":"rooms"} · {b.rooms.map(r=>ROOM_NAMES[r]).join(" · ")}</div>
                  </div>
                  {boatId===b.id?<div style={{color:"#FFD54F",fontSize:12,fontWeight:"bold",whiteSpace:"nowrap"}}>Owned</div>:(
                    <button onClick={()=>{if(money>=b.price){setMoney(m=>m-b.price);setBoatId(b.id);setRoom("deck");}}} disabled={money<b.price} style={{background:money>=b.price?"linear-gradient(135deg,#1565C0,#1976D2)":"#1A2E44",color:"#FFF",border:"none",padding:"8px 16px",borderRadius:9,cursor:money>=b.price?"pointer":"not-allowed",fontSize:12,fontFamily:"Georgia",whiteSpace:"nowrap",opacity:money>=b.price?1:.5}}>{b.price===0?"Free":"$"+b.price.toLocaleString()}</button>
                  )}
                </div>
              </div>
            ))}
            <div style={{fontSize:10,color:"#607D8B",letterSpacing:1,marginTop:8,marginBottom:6}}>LAND HOMES — buy a place to live on shore</div>
            {LAND_HOMES.map(h=>{
              const owned = ownedHomes.indexOf(h.id)>=0;
              const isCurrent = landHomeId===h.id;
              return (
              <div key={h.id} style={{background:isCurrent?"linear-gradient(135deg,#122030,#1E3A5A)":"rgba(255,255,255,.03)",borderRadius:12,padding:"12px 14px",border:`1px solid ${isCurrent?"#FFD54F":"#1A2E44"}`,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:"bold",color:isCurrent?"#FFD54F":"#DDD",fontSize:14}}>{h.name}</div>
                  <div style={{fontSize:10,color:"#90CAF9",marginTop:2}}>{h.rooms.length} {h.rooms.length===1?"room":"rooms"} · {h.rooms.map(r=>LAND_ROOM_NAMES[r]||r).join(" · ")}</div>
                </div>
                {owned ? (
                  isCurrent ? <div style={{color:"#FFD54F",fontSize:12,fontWeight:"bold",whiteSpace:"nowrap"}}>Living here</div>
                  : <button onClick={()=>{setLandHomeId(h.id);setHomeMode("land");setRoom(h.rooms[0]);}} style={{background:"linear-gradient(135deg,#1B5E20,#2E7D32)",color:"#FFF",border:"none",padding:"8px 16px",borderRadius:9,cursor:"pointer",fontSize:12,fontFamily:"Georgia",whiteSpace:"nowrap"}}>Move in</button>
                ) : (
                  <button onClick={()=>{if(money>=h.price){setMoney(m=>m-h.price);setOwnedHomes(o=>o.concat([h.id]));setLandHomeId(h.id);setHomeMode("land");setRoom(h.rooms[0]);}}} disabled={money<h.price} style={{background:money>=h.price?"linear-gradient(135deg,#1565C0,#1976D2)":"#1A2E44",color:"#FFF",border:"none",padding:"8px 16px",borderRadius:9,cursor:money>=h.price?"pointer":"not-allowed",fontSize:12,fontFamily:"Georgia",whiteSpace:"nowrap",opacity:money>=h.price?1:.5}}>{h.price===0?"Free":"$"+h.price.toLocaleString()}</button>
                )}
              </div>
              );
            })}
          </div>
        )}

        {tab==="hold" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{color:"#FFD54F",fontSize:14,fontWeight:"bold"}}>Fish Hold ({inv.length})</div>
              {inv.length>0&&<button onClick={sellAll} style={{background:"linear-gradient(135deg,#1B5E20,#2E7D32)",color:"#FFF",border:"none",padding:"8px 16px",borderRadius:9,cursor:"pointer",fontSize:13,fontFamily:"Georgia"}}>Sell All — ${inv.reduce((s,f)=>s+f.value,0).toLocaleString()}</button>}
            </div>
            {inv.length===0?(
              <div style={{textAlign:"center",color:"#607D8B",padding:32,background:"rgba(255,255,255,.02)",borderRadius:12,border:"1px dashed #1A2E44"}}>Your hold is empty. Go fishing!</div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {inv.map((f,i)=>(
                  <div key={f.uid||i} style={{background:"rgba(255,255,255,.03)",borderRadius:12,padding:"10px 14px",border:`1px solid ${RARITY_COLOR[f.rarity]}44`,display:"flex",alignItems:"center",gap:12}}>
                    <FishSVG fish={f} W={70}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:"bold",color:RARITY_COLOR[f.rarity]}}>{f.name}</div>
                      <div style={{fontSize:12,color:"#90CAF9"}}>{f.weight} lbs · {f.length} in</div>
                    </div>
                    <div style={{color:"#FFD54F",fontWeight:"bold",fontSize:15}}>${f.value}</div>
                  </div>
                ))}
                <div style={{background:"#122030",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",border:"1px solid #1E3A5A"}}>
                  <span style={{color:"#90CAF9"}}>Total value</span>
                  <span style={{color:"#FFD54F",fontWeight:"bold",fontSize:16}}>${inv.reduce((s,f)=>s+f.value,0).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const _root = ReactDOM.createRoot(document.getElementById("root"));
_root.render(React.createElement(App));
