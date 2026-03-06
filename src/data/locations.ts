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
    gotX: 218, gotY: 318,
    house: 'Lannister',
    images: [pexels(2225439), pexels(3879071), pexels(2901209)],
  },
  {
    id: 2,
    name: 'Mdina, Malta',
    gotName: "King's Landing (S1)",
    description: 'The Silent City — ancient walled hilltop used in early seasons',
    lat: 35.8878, lng: 14.4025,
    gotX: 205, gotY: 308,
    house: 'Baratheon',
    images: [pexels(4388158), pexels(1486213), pexels(3889742)],
  },
  {
    id: 3,
    name: 'Thingvellir, Iceland',
    gotName: 'The Vale / Beyond the Wall',
    description: 'Volcanic rift valley standing in for the frozen North',
    lat: 64.2559, lng: -21.1295,
    gotX: 238, gotY: 252,
    house: 'Stark',
    images: [pexels(1633351), pexels(3641385), pexels(2108813)],
  },
  {
    id: 4,
    name: 'Ballintoy, Northern Ireland',
    gotName: 'The Iron Islands',
    description: 'Rugged basalt coast — seat of House Greyjoy',
    lat: 55.2408, lng: -6.3597,
    gotX: 68, gotY: 264,
    house: 'Greyjoy',
    images: [pexels(3800109), pexels(1738434), pexels(4916559)],
  },
  {
    id: 5,
    name: 'Seville, Spain',
    gotName: 'Dorne / Water Gardens',
    description: "The sun-drenched Alcázar — seat of House Martell",
    lat: 37.3826, lng: -5.9922,
    gotX: 175, gotY: 448,
    house: 'Martell',
    images: [pexels(1388030), pexels(3757144), pexels(4348349)],
  },
  {
    id: 6,
    name: 'Vatnajökull, Iceland',
    gotName: 'Beyond the Wall',
    description: "Europe's largest glacier — the eternal frozen wilderness",
    lat: 64.4, lng: -16.9,
    gotX: 152, gotY: 78,
    house: "Night's Watch",
    images: [pexels(1433052), pexels(3225528), pexels(3622614)],
  },
  {
    id: 7,
    name: 'Essaouira, Morocco',
    gotName: 'Astapor',
    description: 'Where Daenerys purchased the Unsullied',
    lat: 31.5085, lng: -9.7595,
    gotX: 555, gotY: 415,
    house: 'Targaryen',
    images: [pexels(2549018), pexels(3889740), pexels(1549168)],
  },
  {
    id: 8,
    name: 'Dark Hedges, N. Ireland',
    gotName: 'The Kingsroad',
    description: 'Eerie beech tunnel where Arya fled south',
    lat: 55.1167, lng: -6.35,
    gotX: 162, gotY: 215,
    house: 'Stark',
    images: [pexels(1563356), pexels(167699), pexels(38136)],
  },
];

export function pickRandom(n: number): Location[] {
  return [...ALL_LOCATIONS].sort(() => Math.random() - 0.5).slice(0, n);
}
