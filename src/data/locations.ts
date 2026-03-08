import type { Location, House } from '../types';

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export const HOUSE_COLORS: Record<House, string> = {
  Lannister: '#c9a84c',
  Stark: '#7a9ab5',
  Targaryen: '#c0392b',
  Greyjoy: '#8899aa',
  Baratheon: '#e8a020',
  Martell: '#e07020',
  "Night's Watch": '#445566',
};

export const ALL_LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'Dubrovnik, Croatia',
    gotName: "King's Landing",
    description: 'Seat of the Iron Throne, capital of the Seven Kingdoms',
    lat: 42.6507, lng: 18.0944,
    gotX: 0.218, gotY: 0.568,
    house: 'Lannister',
    images: [pexels(2225439), pexels(3879071), pexels(2901209)],
  },
  {
    id: 2,
    name: 'Mdina, Malta',
    gotName: "King's Landing (S1)",
    description: 'The Silent City — ancient walled hilltop used in early seasons',
    lat: 35.8878, lng: 14.4025,
    gotX: 0.205, gotY: 0.550,
    house: 'Baratheon',
    images: [pexels(4388158), pexels(1486213), pexels(3889742)],
  },
  {
    id: 3,
    name: 'Thingvellir, Iceland',
    gotName: 'The Vale / Beyond the Wall',
    description: 'Volcanic rift valley standing in for the frozen North',
    lat: 64.2559, lng: -21.1295,
    gotX: 0.238, gotY: 0.450,
    house: 'Stark',
    images: [pexels(1633351), pexels(3641385), pexels(2108813)],
  },
  {
    id: 4,
    name: 'Ballintoy, Northern Ireland',
    gotName: 'The Iron Islands',
    description: 'Rugged basalt coast — seat of House Greyjoy',
    lat: 55.2408, lng: -6.3597,
    gotX: 0.068, gotY: 0.471,
    house: 'Greyjoy',
    images: [pexels(3800109), pexels(1738434), pexels(4916559)],
  },
  {
    id: 5,
    name: 'Seville, Spain',
    gotName: 'Dorne / Water Gardens',
    description: "The sun-drenched Alcázar — seat of House Martell",
    lat: 37.3826, lng: -5.9922,
    gotX: 0.175, gotY: 0.800,
    house: 'Martell',
    images: [pexels(1388030), pexels(3757144), pexels(4348349)],
  },
  {
    id: 6,
    name: 'Vatnajökull, Iceland',
    gotName: 'Beyond the Wall',
    description: "Europe's largest glacier — the eternal frozen wilderness",
    lat: 64.4, lng: -16.9,
    gotX: 0.152, gotY: 0.139,
    house: "Night's Watch",
    images: [pexels(1433052), pexels(3225528), pexels(3622614)],
  },
  {
    id: 7,
    name: 'Essaouira, Morocco',
    gotName: 'Astapor',
    description: 'Where Daenerys purchased the Unsullied',
    lat: 31.5085, lng: -9.7595,
    gotX: 0.555, gotY: 0.741,
    house: 'Targaryen',
    images: [pexels(2549018), pexels(3889740), pexels(1549168)],
  },
  {
    id: 8,
    name: 'Dark Hedges, N. Ireland',
    gotName: 'The Kingsroad',
    description: 'Eerie beech tunnel where Arya fled south',
    lat: 55.1167, lng: -6.35,
    gotX: 0.162, gotY: 0.384,
    house: 'Stark',
    images: [pexels(1563356), pexels(167699), pexels(38136)],
  },
];

export function pickRandom(n: number): Location[] {
  return [...ALL_LOCATIONS].sort(() => Math.random() - 0.5).slice(0, n);
}

// Quartermaester labeled map layer (source: quartermaester.info/ASoIaF-overlays.js)
export interface QuartermaesterMapLabel {
  key: string;
  name: string;
  lat: number;
  lng: number;
}

export const QUARTERMAESTER_LABELS: QuartermaesterMapLabel[] = [
  {
    "key": "Westwatch-by-the-Bridge",
    "name": "Westwatch-by-the-Bridge",
    "lat": 76.36226181822974,
    "lng": -117.685546875
  },
  {
    "key": "Shadow_Tower",
    "name": "Shadow Tower",
    "lat": 76.37261948220728,
    "lng": -116.54296875
  },
  {
    "key": "Sentinel_Stand",
    "name": "Sentinel Stand",
    "lat": 76.38296942847462,
    "lng": -115.13671875
  },
  {
    "key": "Greyguard",
    "name": "Greyguard",
    "lat": 76.31035754301745,
    "lng": -113.7744140625
  },
  {
    "key": "Stonedoor",
    "name": "Stonedoor",
    "lat": 76.42429214465984,
    "lng": -112.4560546875
  },
  {
    "key": "Hoarfrost_Hill",
    "name": "Hoarfrost Hill",
    "lat": 76.39331166244496,
    "lng": -111.533203125
  },
  {
    "key": "Icemark",
    "name": "Icemark",
    "lat": 76.37261948220728,
    "lng": -110.4345703125
  },
  {
    "key": "Nightfort",
    "name": "Nightfort",
    "lat": 76.33114246585924,
    "lng": -109.5556640625
  },
  {
    "key": "Deep_Lake",
    "name": "Deep Lake",
    "lat": 76.28954161916204,
    "lng": -108.8525390625
  },
  {
    "key": "Queensgate",
    "name": "Queensgate",
    "lat": 76.2791220182665,
    "lng": -107.8857421875
  },
  {
    "key": "Castle_Black",
    "name": "Castle Black",
    "lat": 76.26869465080624,
    "lng": -106.69921875
  },
  {
    "key": "Oakenshield_(Wall)",
    "name": "Oakensheild",
    "lat": 76.2059670431415,
    "lng": -105.732421875
  },
  {
    "key": "Woodswatch-by-the-Pool",
    "name": "Woodswatch-by-the-Pool",
    "lat": 76.18499546094715,
    "lng": -104.8974609375
  },
  {
    "key": "Sable_Hall",
    "name": "Sable Hall",
    "lat": 76.16399261609192,
    "lng": -103.7109375
  },
  {
    "key": "Rimegate",
    "name": "Rimegate",
    "lat": 76.1113484424047,
    "lng": -102.48046875
  },
  {
    "key": "Long_Barrow",
    "name": "Long Barrow",
    "lat": 76.12189296324114,
    "lng": -101.689453125
  },
  {
    "key": "Torches",
    "name": "Torches",
    "lat": 76.06909176390043,
    "lng": -100.810546875
  },
  {
    "key": "Greenguard",
    "name": "Greenguard",
    "lat": 76.03731657616542,
    "lng": -100.1513671875
  },
  {
    "key": "Eastwatch-by-the-Sea",
    "name": "Eastwatch-by-the-Sea",
    "lat": 76.1744979490871,
    "lng": -99.5361328125
  },
  {
    "key": "BWB_Hideout",
    "name": "Brotherhood Without Banners hideout",
    "lat": 25.24469595130604,
    "lng": -117.8173828125
  },
  {
    "key": "Inn_of_the_Kneeling_Man",
    "name": "Inn of the Kneeling Man",
    "lat": 25.00597265623918,
    "lng": -122.2998046875
  },
  {
    "key": "Lord_Harroway%27s_Town",
    "name": "Lord Harroway's Town",
    "lat": 23.03929774776972,
    "lng": -114.4775390625
  },
  {
    "key": "They_Lay_With_Lions",
    "name": "Inn (They Lay with Lions)",
    "lat": 23.40276490540795,
    "lng": -126.2548828125
  },
  {
    "key": "Unnamed_Village",
    "name": "Unnamed village",
    "lat": 22.59372606392931,
    "lng": -122.6953125
  },
  {
    "key": "Lychester_Keep",
    "name": "Lord Lychester's Keep",
    "lat": 21.94304553343818,
    "lng": -123.2666015625
  },
  {
    "key": "Lady_of_the_Leaves",
    "name": "Lady of the Leaves",
    "lat": 20.42701281425738,
    "lng": -125.4638671875
  },
  {
    "key": "Sallydance",
    "name": "Sallydance",
    "lat": 19.60119416126314,
    "lng": -124.892578125
  },
  {
    "key": "Goodbrook_Village",
    "name": "Lord Goodbrook's Village",
    "lat": 19.26966529650233,
    "lng": -123.046875
  },
  {
    "key": "Pennytree",
    "name": "Pennytree",
    "lat": 20.2209657795223,
    "lng": -119.794921875
  },
  {
    "key": "Old_Stone_Bridge",
    "name": "Old Stone Bridge Inn",
    "lat": 5.790896812871956,
    "lng": -100.810546875
  },
  {
    "key": "Lord_Hewett%27s_Town",
    "name": "Lord Hewett's Town",
    "lat": -21.0024710543567,
    "lng": -150.029296875
  },
  {
    "key": "Shandystone",
    "name": "Shandystone",
    "lat": -42.4558876419711,
    "lng": -92.197265625
  },
  {
    "key": "Fist_of_the_First_Men",
    "name": "Fist of the First Men",
    "lat": 78.27373665606689,
    "lng": -116.9311523437
  },
  {
    "key": "Craster%27s_Keep",
    "name": "Craster's Keep",
    "lat": 77.51837380541402,
    "lng": -111.5258789062
  },
  {
    "key": "Whitetree",
    "name": "Whitetree",
    "lat": 76.74543603597408,
    "lng": -109.5043945312
  },
  {
    "key": "Hardhome",
    "name": "Hardhome",
    "lat": 78.72061466471492,
    "lng": -97.15576171875
  },
  {
    "key": "Mole%27s_Town",
    "name": "Mole's Town",
    "lat": 76.00015573581683,
    "lng": -106.6918945312
  },
  {
    "key": "Queenscrown",
    "name": "Queenscrown",
    "lat": 75.2250649237144,
    "lng": -109.5043945312
  },
  {
    "key": "Last_Hearth",
    "name": "Last Hearth",
    "lat": 72.62025182357989,
    "lng": -104.6923828125
  },
  {
    "key": "Karhold",
    "name": "Karhold",
    "lat": 70.3335333600625,
    "lng": -88.1689453125
  },
  {
    "key": "Deepwood_Motte",
    "name": "Deepwood Motte",
    "lat": 70.18510275498964,
    "lng": -138.5302734375
  },
  {
    "key": "Dreadfort",
    "name": "Dreadfort",
    "lat": 67.42436394630637,
    "lng": -102.5830078125
  },
  {
    "key": "Tumbledown_Tower",
    "name": "Tumbledown Tower",
    "lat": 67.75939813204413,
    "lng": -124.8193359375
  },
  {
    "key": "Winterfell",
    "name": "Winterfell",
    "lat": 66.24916310923315,
    "lng": -123.3251953125
  },
  {
    "key": "Castle_Cerwyn",
    "name": "Castle Cerwyn",
    "lat": 65.38514722188854,
    "lng": -123.3251953125
  },
  {
    "key": "Hornwood",
    "name": "Hornwood",
    "lat": 63.52897054110277,
    "lng": -106.1865234375
  },
  {
    "key": "Stony_Shore",
    "name": "Stony Shore",
    "lat": 62.66405506888221,
    "lng": -160.01953125
  },
  {
    "key": "Torrhen%27s_Square",
    "name": "Torrhen's Square",
    "lat": 62.89521754488204,
    "lng": -133.9599609375
  },
  {
    "key": "Ramsgate",
    "name": "Ramsgate",
    "lat": 58.83649009392136,
    "lng": -97.6611328125
  },
  {
    "key": "Widow%27s_Watch",
    "name": "Widow's Watch",
    "lat": 57.72761921621492,
    "lng": -85.8837890625
  },
  {
    "key": "Barrowton",
    "name": "Barrowton",
    "lat": 57.58655886615978,
    "lng": -136.5966796875
  },
  {
    "key": "White_Harbor",
    "name": "White Harbor",
    "lat": 56.68037378950136,
    "lng": -114.0966796875
  },
  {
    "key": "Moat_Cailin",
    "name": "Moat Cailin",
    "lat": 53.87844040332883,
    "lng": -122.3583984375
  },
  {
    "key": "Oldcastle",
    "name": "Oldcastle",
    "lat": 51.75424007403352,
    "lng": -109.5263671875
  },
  {
    "key": "Flint%27s_Finger",
    "name": "Flint's Finger",
    "lat": 50.03597367219549,
    "lng": -148.7255859375
  },
  {
    "key": "Greywater_Watch",
    "name": "Greywater Watch",
    "lat": 46.10370875598025,
    "lng": -124.6435546875
  },
  {
    "key": "Execution_Holdfast",
    "name": "Execution Holdfast",
    "lat": 66.5482634621744,
    "lng": -122.6220703125
  },
  {
    "key": "Crofters%27_village",
    "name": "Crofters' village",
    "lat": 66.58321725728173,
    "lng": -125.15625
  },
  {
    "key": "Donella_Manderly",
    "name": "Donella Manderly",
    "lat": 65.09064558256851,
    "lng": -107.8564453125
  },
  {
    "key": "Sisterton",
    "name": "Sisterton",
    "lat": 49.35375571830993,
    "lng": -106.8896484375
  },
  {
    "key": "Coldwater_Burn",
    "name": "Coldwater Burn",
    "lat": 45.05800143539829,
    "lng": -95.0244140625
  },
  {
    "key": "House_Baelish",
    "name": "House Baelish",
    "lat": 43.16512263158295,
    "lng": -81.1376953125
  },
  {
    "key": "Snakewood",
    "name": "Snakewood",
    "lat": 41.80407814427234,
    "lng": -93.0908203125
  },
  {
    "key": "Longbow_Hall",
    "name": "Longbow Hall",
    "lat": 39.26628442213066,
    "lng": -86.9384765625
  },
  {
    "key": "Heart%27s_Home",
    "name": "Heart's Home",
    "lat": 36.70365959719456,
    "lng": -99.0673828125
  },
  {
    "key": "Strongsong",
    "name": "Strongsong",
    "lat": 36.84446074079564,
    "lng": -108.9111328125
  },
  {
    "key": "Old_Anchor",
    "name": "Old Anchor",
    "lat": 33.32134852669881,
    "lng": -87.7294921875
  },
  {
    "key": "Ironoaks",
    "name": "Ironoaks",
    "lat": 32.21280106801518,
    "lng": -92.1240234375
  },
  {
    "key": "Runestone",
    "name": "Runestone",
    "lat": 32.36140331527543,
    "lng": -83.0712890625
  },
  {
    "key": "Eyrie",
    "name": "Eyrie",
    "lat": 31.76553740948437,
    "lng": -102.4951171875
  },
  {
    "key": "Bloody_Gate",
    "name": "Bloody Gate",
    "lat": 29.87875534603797,
    "lng": -102.9345703125
  },
  {
    "key": "Redfort",
    "name": "Redfort",
    "lat": 27.33273513685914,
    "lng": -95.8154296875
  },
  {
    "key": "Gulltown",
    "name": "Gulltown",
    "lat": 29.42046034101313,
    "lng": -84.2138671875
  },
  {
    "key": "Wickenden",
    "name": "Wickenden",
    "lat": 20.83827780605893,
    "lng": -96.0791015625
  },
  {
    "key": "Palisade_Village",
    "name": "Palisade Village",
    "lat": 28.03319784767637,
    "lng": -111.9873046875
  },
  {
    "key": "Castle_Goodbrother",
    "name": "Castle Goodbrother",
    "lat": 31.93351676190369,
    "lng": -153.427734375
  },
  {
    "key": "Nagga%27s_Hill",
    "name": "Nagga's Hill",
    "lat": 31.37239910488052,
    "lng": -154.2626953125
  },
  {
    "key": "Ten_Towers",
    "name": "Ten Towers",
    "lat": 31.37239910488052,
    "lng": -144.462890625
  },
  {
    "key": "Hammerhorn",
    "name": "Hammerhorn",
    "lat": 30.46761410225785,
    "lng": -156.1962890625
  },
  {
    "key": "Pebbleton",
    "name": "Pebbleton",
    "lat": 29.55434512574826,
    "lng": -152.5927734375
  },
  {
    "key": "Pyke",
    "name": "Pyke",
    "lat": 27.74188463250708,
    "lng": -150.615234375
  },
  {
    "key": "Saltpans",
    "name": "Saltpans",
    "lat": 20.92039691397189,
    "lng": -105.4833984375
  },
  {
    "key": "Quiet_Isle",
    "name": "Quiet Isle",
    "lat": 20.28280869133005,
    "lng": -105.3295898437
  },
  {
    "key": "Maidenpool",
    "name": "Maidenpool",
    "lat": 17.64402202787272,
    "lng": -101.748046875
  },
  {
    "key": "Twins",
    "name": "Twins",
    "lat": 38.59970036588819,
    "lng": -128.73046875
  },
  {
    "key": "Seagard",
    "name": "Seagard",
    "lat": 35.19176696594739,
    "lng": -129.2578125
  },
  {
    "key": "Oldstones",
    "name": "Oldstones",
    "lat": 30.92107637538487,
    "lng": -126.4013671875
  },
  {
    "key": "Fairmarket",
    "name": "Fairmarket",
    "lat": 29.1713488509515,
    "lng": -122.578125
  },
  {
    "key": "Crossroads_Inn",
    "name": "Crossroads Inn",
    "lat": 23.42292845506525,
    "lng": -112.6904296875
  },
  {
    "key": "Riverrun",
    "name": "Riverrun",
    "lat": 22.28909641872304,
    "lng": -128.291015625
  },
  {
    "key": "Stone_Hedge",
    "name": "Stone Hedge",
    "lat": 22.08563990165032,
    "lng": -120.9521484375
  },
  {
    "key": "Darry",
    "name": "Darry",
    "lat": 21.84110474906504,
    "lng": -112.470703125
  },
  {
    "key": "Raventree_Hall",
    "name": "Raventree Hall",
    "lat": 19.91138351415555,
    "lng": -118.6669921875
  },
  {
    "key": "Stone_Mill",
    "name": "Stone Mill",
    "lat": 18.79191774423444,
    "lng": -128.73046875
  },
  {
    "key": "High_Heart",
    "name": "High Heart",
    "lat": 18.45876812001513,
    "lng": -124.6435546875
  },
  {
    "key": "Acorn_Hall",
    "name": "Acorn Hall",
    "lat": 16.8466051063963,
    "lng": -125.5224609375
  },
  {
    "key": "Harrenhal",
    "name": "Harrenhal",
    "lat": 18.25021997706559,
    "lng": -114.404296875
  },
  {
    "key": "Rushing_Falls",
    "name": "Rushing Falls",
    "lat": 16.53089842368169,
    "lng": -116.337890625
  },
  {
    "key": "Pinkmaiden_Castle",
    "name": "Pinkmaiden Castle",
    "lat": 15.47485740268724,
    "lng": -129.609375
  },
  {
    "key": "Wayfarer%27s_Rest",
    "name": "Wayfarer's Rest",
    "lat": 16.86763361680384,
    "lng": -133.4765625
  },
  {
    "key": "Wendish_Town",
    "name": "Wendish Town",
    "lat": 13.3896195917476,
    "lng": -131.279296875
  },
  {
    "key": "Mummer%27s_Ford",
    "name": "Mummer's Ford",
    "lat": 13.94472997492016,
    "lng": -130.6201171875
  },
  {
    "key": "Sherrer",
    "name": "Sherrer",
    "lat": 13.1757712244234,
    "lng": -130.5322265625
  },
  {
    "key": "Tumbler%27s_Falls",
    "name": "Tumbler's Falls",
    "lat": 12.4902136625333,
    "lng": -123.10546875
  },
  {
    "key": "Hollow_Hill",
    "name": "Hollow Hill",
    "lat": 11.2861607687526,
    "lng": -128.115234375
  },
  {
    "key": "Stoney_Sept",
    "name": "Stoney Sept",
    "lat": 9.817329187067783,
    "lng": -125.654296875
  },
  {
    "key": "Robbed_Sept",
    "name": "Robbed Sept",
    "lat": 13.02596592633353,
    "lng": -126.708984375
  },
  {
    "key": "Gods_Eye_Holdfast",
    "name": "Gods Eye Holdfast",
    "lat": 11.00590445965946,
    "lng": -114.7998046875
  },
  {
    "key": "Gods_Eye_Village",
    "name": "Gods Eye Village",
    "lat": 13.15437605541852,
    "lng": -111.5478515625
  },
  {
    "key": "Banefort",
    "name": "Banefort",
    "lat": 24.60706913770968,
    "lng": -147.36328125
  },
  {
    "key": "Nunn%27s_Deep",
    "name": "Nunn's Deep",
    "lat": 22.2280904167845,
    "lng": -141.9580078125
  },
  {
    "key": "The_Crag",
    "name": "The Crag",
    "lat": 19.80805412808858,
    "lng": -147.4072265625
  },
  {
    "key": "Pendric_Hills",
    "name": "Pendric Hills",
    "lat": 19.60119416126314,
    "lng": -144.375
  },
  {
    "key": "Ashemark",
    "name": "Ashemark",
    "lat": 16.8466051063963,
    "lng": -144.5068359375
  },
  {
    "key": "Castamere",
    "name": "Castamere",
    "lat": 15.66535418209328,
    "lng": -147.3193359375
  },
  {
    "key": "Faircastle",
    "name": "Faircastle",
    "lat": 14.30696949782578,
    "lng": -152.724609375
  },
  {
    "key": "Golden_Tooth",
    "name": "Golden Tooth",
    "lat": 14.17918614235418,
    "lng": -138.662109375
  },
  {
    "key": "Sarsfield",
    "name": "Sarsfield",
    "lat": 10.96276425638682,
    "lng": -145.166015625
  },
  {
    "key": "Oxcross",
    "name": "Oxcross",
    "lat": 9.145486056167277,
    "lng": -148.505859375
  },
  {
    "key": "Hornvale",
    "name": "Hornvale",
    "lat": 9.058702156392139,
    "lng": -137.0361328125
  },
  {
    "key": "Kayce",
    "name": "Kayce",
    "lat": 7.493196470122287,
    "lng": -156.767578125
  },
  {
    "key": "Feastfires",
    "name": "Feastfires",
    "lat": 5.397273407690917,
    "lng": -157.7783203125
  },
  {
    "key": "Casterly_Rock",
    "name": "Casterly Rock",
    "lat": 6.315298538330033,
    "lng": -151.3623046875
  },
  {
    "key": "Deep_Den",
    "name": "Deep Den",
    "lat": 5.572249801113911,
    "lng": -136.2451171875
  },
  {
    "key": "Tarbeck_Hall",
    "name": "Tarbeck Hall",
    "lat": 1.669685500986583,
    "lng": -152.63671875
  },
  {
    "key": "Clegane%27s_Keep",
    "name": "Clegane's Keep",
    "lat": 1.801460929468035,
    "lng": -144.4189453125
  },
  {
    "key": "Silverhill",
    "name": "Silverhill",
    "lat": 0.26367094433665,
    "lng": -138.3544921875
  },
  {
    "key": "Cornfield",
    "name": "Cornfield",
    "lat": -2.76747795109208,
    "lng": -146.8798828125
  },
  {
    "key": "Crakehall",
    "name": "Crakehall",
    "lat": -4.95961502469801,
    "lng": -154.5703125
  },
  {
    "key": "Dragonstone",
    "name": "Dragonstone",
    "lat": 13.19716452328198,
    "lng": -85.5322265625
  },
  {
    "key": "Dyre_Den",
    "name": "Dyre Den",
    "lat": 21.20745873048264,
    "lng": -87.158203125
  },
  {
    "key": "Whispers",
    "name": "Whispers",
    "lat": 18.52128332549627,
    "lng": -84.60937
  },
  {
    "key": "Rook%27s_Rest",
    "name": "Rook's Rest",
    "lat": 14.09395717783622,
    "lng": -94.27734375
  },
  {
    "key": "Antlers",
    "name": "Antlers",
    "lat": 14.22178862839758,
    "lng": -103.857421875
  },
  {
    "key": "Ivy_Inn",
    "name": "Ivy Inn",
    "lat": 10.22843726615594,
    "lng": -108.1201171875
  },
  {
    "key": "Sow%27s_Horn",
    "name": "Sow's Horn",
    "lat": 10.83330598364249,
    "lng": -106.7138671875
  },
  {
    "key": "Duskendale",
    "name": "Duskendale",
    "lat": 8.624472107633936,
    "lng": -98.8037109375
  },
  {
    "key": "Brindlewood",
    "name": "Brindlewood",
    "lat": 7.449624260197816,
    "lng": -107.548828125
  },
  {
    "key": "Stokeworth",
    "name": "Stokeworth",
    "lat": 5.747174076651375,
    "lng": -103.9453125
  },
  {
    "key": "Rosby",
    "name": "Rosby",
    "lat": 3.995780512963038,
    "lng": -102.4951171875
  },
  {
    "key": "Hayford",
    "name": "Hayford",
    "lat": 3.469557303061473,
    "lng": -106.9775390625
  },
  {
    "key": "King%27s_Landing",
    "name": "King's Landing",
    "lat": 1.318243056862013,
    "lng": -105.99609375
  },
  {
    "key": "Stonedance",
    "name": "Stonedance",
    "lat": 5.309766171943691,
    "lng": -86.015625
  },
  {
    "key": "Sharp_Point",
    "name": "Sharp Point",
    "lat": 8.320212289522944,
    "lng": -87.59765625
  },
  {
    "key": "Tumbleton",
    "name": "Tumbleton",
    "lat": -4.78446896657936,
    "lng": -114.7998046875
  },
  {
    "key": "Red_Lake",
    "name": "Red Lake",
    "lat": -8.14624282503438,
    "lng": -145.9130859375
  },
  {
    "key": "Goldengrove",
    "name": "Goldengrove",
    "lat": -10.9627642563868,
    "lng": -138.1787109375
  },
  {
    "key": "Bitterbridge",
    "name": "Bitterbridge",
    "lat": -11.049038346537,
    "lng": -124.0283203125
  },
  {
    "key": "Old_Oak",
    "name": "Old Oak",
    "lat": -14.519780046326,
    "lng": -151.494140625
  },
  {
    "key": "Longtable",
    "name": "Longtable",
    "lat": -14.6898813666187,
    "lng": -125.2587890625
  },
  {
    "key": "Grassy_Vale",
    "name": "Grassy Vale",
    "lat": -13.0687767343576,
    "lng": -113.4375
  },
  {
    "key": "Cider_Hall",
    "name": "Cider Hall",
    "lat": -18.6046013884552,
    "lng": -129.7412109375
  },
  {
    "key": "Ashford",
    "name": "Ashford",
    "lat": -20.5916521208291,
    "lng": -123.0615234375
  },
  {
    "key": "Highgarden",
    "name": "Highgarden",
    "lat": -23.966175871265,
    "lng": -138.3544921875
  },
  {
    "key": "Bandallon",
    "name": "Bandallon",
    "lat": -29.5352295629484,
    "lng": -154.833984375
  },
  {
    "key": "Brightwater_Keep",
    "name": "Brightwater Keep",
    "lat": -29.993002284551,
    "lng": -149.2529296875
  },
  {
    "key": "Horn_Hill",
    "name": "Horn Hill",
    "lat": -29.7262223193954,
    "lng": -138.0029296875
  },
  {
    "key": "Honeyholt",
    "name": "Honeyholt",
    "lat": -32.990235559651,
    "lng": -148.2861328125
  },
  {
    "key": "Oldtown",
    "name": "Oldtown",
    "lat": -36.6331620955865,
    "lng": -149.8681640625
  },
  {
    "key": "Blackcrown",
    "name": "Blackcrown",
    "lat": -38.7198047426423,
    "lng": -155.361328125
  },
  {
    "key": "Uplands",
    "name": "Uplands",
    "lat": -37.4050737501769,
    "lng": -141.474609375
  },
  {
    "key": "Three_Towers",
    "name": "Three Towers",
    "lat": -41.1124687891808,
    "lng": -152.8125
  },
  {
    "key": "Sunflower_Hall",
    "name": "Sunflower Hall",
    "lat": -45.7981695301726,
    "lng": -144.5068359375
  },
  {
    "key": "Haystack_Hall",
    "name": "Haystack Hall",
    "lat": -7.88514728342433,
    "lng": -91.7724609375
  },
  {
    "key": "Parchments",
    "name": "Parchments",
    "lat": -8.32021228952294,
    "lng": -85.751953125
  },
  {
    "key": "Bronzegate",
    "name": "Bronzegate",
    "lat": -8.7547947024356,
    "lng": -94.4970703125
  },
  {
    "key": "Fawnton",
    "name": "Fawnton",
    "lat": -10.3149192858131,
    "lng": -107.8125
  },
  {
    "key": "Felwood",
    "name": "Felwood",
    "lat": -12.1252642183315,
    "lng": -97.353515625
  },
  {
    "key": "Evenfall_Hall",
    "name": "Evenfall Hall",
    "lat": -12.7689464394559,
    "lng": -83.7744140625
  },
  {
    "key": "Storm%27s_End",
    "name": "Storm's End",
    "lat": -16.1724728083975,
    "lng": -91.8603515625
  },
  {
    "key": "Grandview",
    "name": "Grandview",
    "lat": -18.1458517716944,
    "lng": -101.2646484375
  },
  {
    "key": "Griffin%27s_Roost",
    "name": "Griffin's Roost",
    "lat": -18.4379246534743,
    "lng": -95.2880859375
  },
  {
    "key": "Summerhall",
    "name": "Summerhall",
    "lat": -20.0146454453413,
    "lng": -108.251953125
  },
  {
    "key": "Rain_House",
    "name": "Rain House",
    "lat": -21.1254976366062,
    "lng": -82.67578125
  },
  {
    "key": "Crow%27s_Nest",
    "name": "Crow's Nest",
    "lat": -22.0652780677658,
    "lng": -98.232421875
  },
  {
    "key": "Harvest_Hall",
    "name": "Harvest Hall",
    "lat": -21.9022779666686,
    "lng": -116.162109375
  },
  {
    "key": "Blackhaven",
    "name": "Blackhaven",
    "lat": -24.206889622398,
    "lng": -110.6689453125
  },
  {
    "key": "Stonehelm",
    "name": "Stonehelm",
    "lat": -25.5226146476232,
    "lng": -102.1875
  },
  {
    "key": "Mistwood",
    "name": "Mistwood",
    "lat": -27.5667214304097,
    "lng": -90.849609375
  },
  {
    "key": "Greenstone",
    "name": "Greenstone",
    "lat": -28.4976608329634,
    "lng": -83.6865234375
  },
  {
    "key": "Weeping_Tower",
    "name": "Weeping Tower",
    "lat": -30.2211018524859,
    "lng": -91.201171875
  },
  {
    "key": "Nightsong",
    "name": "Nightsong",
    "lat": -29.0753751795583,
    "lng": -127.1923828125
  },
  {
    "key": "Wyl_(Dorne)",
    "name": "Wyl (Dorne)",
    "lat": -29.1905328322945,
    "lng": -110.9765625
  },
  {
    "key": "Vulture%27s_Roost",
    "name": "Vulture's Roost",
    "lat": -30.9776090933486,
    "lng": -122.314453125
  },
  {
    "key": "Tower_of_Joy",
    "name": "Tower of Joy",
    "lat": -31.9521622380249,
    "lng": -124.2919921875
  },
  {
    "key": "Kingsgrave",
    "name": "Kingsgrave",
    "lat": -34.8138033171131,
    "lng": -124.3359375
  },
  {
    "key": "Blackmont",
    "name": "Blackmont",
    "lat": -36.7740924946419,
    "lng": -132.861328125
  },
  {
    "key": "High_Hermitage",
    "name": "High Hermitage",
    "lat": -38.9594087924542,
    "lng": -132.7294921875
  },
  {
    "key": "Starfall",
    "name": "Starfall",
    "lat": -41.3768085657023,
    "lng": -135.6298828125
  },
  {
    "key": "Sandstone",
    "name": "Sandstone",
    "lat": -44.9336963896946,
    "lng": -126.97265625
  },
  {
    "key": "Skyreach",
    "name": "Skyreach",
    "lat": -38.7540832757914,
    "lng": -125.0830078125
  },
  {
    "key": "Hellholt",
    "name": "Hellholt",
    "lat": -44.1822039577156,
    "lng": -117.0849609375
  },
  {
    "key": "Yronwood",
    "name": "Yronwood",
    "lat": -37.6490340215786,
    "lng": -114.4482421875
  },
  {
    "key": "Ghaston_Grey",
    "name": "Ghaston Grey",
    "lat": -35.3173663292378,
    "lng": -105
  },
  {
    "key": "Vaith",
    "name": "Vaith",
    "lat": -44.5904671813088,
    "lng": -100.8251953125
  },
  {
    "key": "Tor",
    "name": "Tor",
    "lat": -38.7540832757914,
    "lng": -99.8583984375
  },
  {
    "key": "Salt_Shore",
    "name": "Salt Shore",
    "lat": -46.8000594467872,
    "lng": -97.0458984375
  },
  {
    "key": "Godsgrace",
    "name": "Godsgrace",
    "lat": -42.4558876419716,
    "lng": -96.6943359375
  },
  {
    "key": "Ghost_Hill",
    "name": "Ghost Hill",
    "lat": -39.2662844221306,
    "lng": -87.5537109375
  },
  {
    "key": "Lemonwood",
    "name": "Lemonwood",
    "lat": -45.3367019099681,
    "lng": -86.9384765625
  },
  {
    "key": "Planky_Town",
    "name": "Planky Town",
    "lat": -44.0560116957852,
    "lng": -86.630859375
  },
  {
    "key": "Sunspear",
    "name": "Sunspear",
    "lat": -43.5803908556078,
    "lng": -84.5654296875
  },
  {
    "key": "Water_Gardens",
    "name": "Water Gardens",
    "lat": -42.9725015860259,
    "lng": -84.08203125
  },
  {
    "key": "Port_of_Ibben",
    "name": "Port of Ibben",
    "lat": 75.99483913802071,
    "lng": 8.466796875
  },
  {
    "key": "Braavos",
    "name": "Braavos",
    "lat": 43.929549935614595,
    "lng": -59.7802734375
  },
  {
    "key": "Lorath",
    "name": "Lorath",
    "lat": 39.774769485295494,
    "lng": -39.3896484375
  },
  {
    "key": "Tyrosh",
    "name": "Tyrosh",
    "lat": -26.70635985763348,
    "lng": -69.31640625
  },
  {
    "key": "Lys",
    "name": "Lys",
    "lat": -43.77109381775646,
    "lng": -56.9677734375
  },
  {
    "key": "Myr",
    "name": "Myr",
    "lat": -23.28171917559998,
    "lng": -49.189453125
  },
  {
    "key": "Pentos",
    "name": "Pentos",
    "lat": 4.083452772038656,
    "lng": -59.1650390625
  },
  {
    "key": "Ghoyan_Drohe",
    "name": "Ghoyan Drohe",
    "lat": 7.754537346539424,
    "lng": -43.828125
  },
  {
    "key": "Norvos",
    "name": "Norvos",
    "lat": 19.725342248057906,
    "lng": -31.34765625
  },
  {
    "key": "Qohor",
    "name": "Qohor",
    "lat": 4.477856485570624,
    "lng": -5.5078125
  },
  {
    "key": "Ar_Noy",
    "name": "Ar Noy",
    "lat": -3.864254615721357,
    "lng": -16.845703125
  },
  {
    "key": "Ny_Sar",
    "name": "Ny Sar",
    "lat": -1.054627942275836,
    "lng": -29.7216796875
  },
  {
    "key": "Sorrows",
    "name": "Sorrows",
    "lat": -20.79720143430695,
    "lng": -22.822265625
  },
  {
    "key": "Selhorys",
    "name": "Selhorys",
    "lat": -32.62087018318108,
    "lng": -19.9658203125
  },
  {
    "key": "Valysar",
    "name": "Valysar",
    "lat": -38.34165619279589,
    "lng": -20.2294921875
  },
  {
    "key": "Volon_Therys",
    "name": "Volon Therys",
    "lat": -41.60722821271713,
    "lng": -17.3291015625
  },
  {
    "key": "Sar_Mell",
    "name": "Sar Mell",
    "lat": -41.44272637767209,
    "lng": -15.52734375
  },
  {
    "key": "Volantis",
    "name": "Volantis",
    "lat": -44.37098696297168,
    "lng": -10.693359375
  },
  {
    "key": "Mantarys",
    "name": "Mantarys",
    "lat": -50.73645513701061,
    "lng": 39.31640625
  },
  {
    "key": "Bhorash",
    "name": "Bhorash",
    "lat": -46.86019101567022,
    "lng": 61.2451171875
  },
  {
    "key": "Oros",
    "name": "Oros",
    "lat": -64.79284777557429,
    "lng": 36.7236328125
  },
  {
    "key": "Tyria",
    "name": "Tyria",
    "lat": -67.05030412177983,
    "lng": 34.833984375
  },
  {
    "key": "Valyria",
    "name": "Valyria",
    "lat": -70.25945200030637,
    "lng": 32.4169921875
  },
  {
    "key": "Velos",
    "name": "Velos",
    "lat": -62.36999628130769,
    "lng": 56.89453125
  },
  {
    "key": "Ghozai",
    "name": "Ghozai",
    "lat": -58.83649009392134,
    "lng": 55.48828125
  },
  {
    "key": "Elyria",
    "name": "Elyria",
    "lat": -55.65279803318954,
    "lng": 43.9306640625
  },
  {
    "key": "Tolos",
    "name": "Tolos",
    "lat": -54.39335222384585,
    "lng": 49.3359375
  },
  {
    "key": "Meereen",
    "name": "Meereen",
    "lat": -45.49094569262728,
    "lng": 80.44921875
  },
  {
    "key": "Yunkai",
    "name": "Yunkai",
    "lat": -49.78126405817831,
    "lng": 75.4833984375
  },
  {
    "key": "Astapor",
    "name": "Astapor",
    "lat": -58.69977573144003,
    "lng": 71.7919921875
  },
  {
    "key": "Old_Ghis",
    "name": "Old Ghis",
    "lat": -66.6355557780326,
    "lng": 75.263671875
  },
  {
    "key": "New_Ghis",
    "name": "New Ghis",
    "lat": -71.92452773797694,
    "lng": 78.9990234375
  },
  {
    "key": "Vaes_Dothrak",
    "name": "Vaes Dothrak",
    "lat": -18.02052765785228,
    "lng": 71.8359375
  },
  {
    "key": "Lhazar",
    "name": "Lhazar",
    "lat": -38.27268853598092,
    "lng": 103.3447265625
  },
  {
    "key": "Vaes_Tolorro",
    "name": "Vaes Tolorro",
    "lat": -76.21644112440798,
    "lng": 139.6435546875
  },
  {
    "key": "Dead_City1",
    "name": "Dead City1",
    "lat": -76.94048839176438,
    "lng": 134.8095703125
  },
  {
    "key": "Dead_City2",
    "name": "Dead City2",
    "lat": -77.85109964137914,
    "lng": 125.0537109375
  },
  {
    "key": "Qarth",
    "name": "Qarth",
    "lat": -81.36788549290205,
    "lng": 161.396484375
  },
  {
    "key": "Zamettar",
    "name": "Zamettar",
    "lat": -79.146538254197,
    "lng": 70.7373046875
  },
  {
    "key": "Gogossos",
    "name": "Gogossos",
    "lat": -80.7817582281687,
    "lng": 58.212890625
  },
  {
    "key": "Yeen",
    "name": "Yeen",
    "lat": -81.0180577670709,
    "lng": 74.82421875
  },
  {
    "key": "Tall_Trees_Town",
    "name": "Tall Trees Town",
    "lat": -73.5034606372659,
    "lng": -130.927734375
  }
];
// End Quartermaester labeled map layer

export const MAJOR_LABEL_KEYS = new Set<string>([
  "King%27s_Landing",
  "Winterfell",
  "White_Harbor",
  "Pyke",
  "Riverrun",
  "Harrenhal",
  "Casterly_Rock",
  "Lannisport",
  "Highgarden",
  "Oldtown",
  "Dragonstone",
  "Storm%27s_End",
  "Sunspear",
  "Eyrie",
  "Gulltown",
  "Twins",
  "Braavos",
  "Pentos",
  "Myr",
  "Tyrosh",
  "Lys",
  "Norvos",
  "Qohor",
  "Volantis",
  "Meereen",
  "Qarth",
  "Astapor",
  "Yunkai",
  "Vaes_Dothrak",
]);
