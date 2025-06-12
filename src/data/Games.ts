import { Game, Category } from "../types/models";

export const games: Game[] = [
  {
    id: "1",
    title: "The Last Guardian",
    category: Category.ADVENTURE,
    imageUrl:
      "https://i.ytimg.com/vi/iZ4UPziWmUo/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDvcrQ3AEslDFc38NUIxx8CiU-JlA",
    description:
      "An action-adventure game that follows a young boy who befriends a giant half-bird, half-mammal creature named Trico.",
    rating: 4.5,
    releaseDate: "2016-12-06",
  },
  {
    id: "2",
    title: "Outlast",
    category: Category.HORROR,
    imageUrl:
      "https://image.api.playstation.com/cdn/UP2113/CUSA00325_00/M7Xcn9Q7mUkmm3dSilcsbkORlPPiQ0VK.png",
    description:
      "A first-person survival horror game where you must survive the horrors of Mount Massive Asylum.",
    rating: 4.2,
    releaseDate: "2013-09-04",
  },
  {
    id: "3",
    title: "Final Fantasy VII Remake",
    category: Category.RPG,
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/ce/FFVIIRemake.png",
    description:
      "A reimagining of the iconic RPG that follows Cloud Strife, a former SOLDIER, as he joins an eco-terrorist group to fight against the Shinra Electric Power Company.",
    rating: 4.8,
    releaseDate: "2020-04-10",
  },
  {
    id: "4",
    title: "Forza Horizon 5",
    category: Category.RACING,
    imageUrl:
      "https://image.api.playstation.com/vulcan/ap/rnd/202502/1900/631436cfbc1d64659c778e3783f29fafad6022145e0ffec8.jpg",
    description:
      "An open-world racing game set in a fictionalized representation of Mexico.",
    rating: 4.7,
    releaseDate: "2021-11-09",
  },
  {
    id: "5",
    title: "Age of Empires IV",
    category: Category.STRATEGY,
    imageUrl:
      "https://static.wikia.nocookie.net/ageofempires/images/f/f4/AoE4_Wallpaper_X1_768x432.jpg/revision/latest?cb=20210615074024&path-prefix=es",
    description:
      "A real-time strategy game that focuses on historical events throughout the Middle Ages.",
    rating: 4.3,
    releaseDate: "2021-10-28",
  },
  {
    id: "6",
    title: "FIFA 23",
    category: Category.SPORTS,
    imageUrl:
      "https://juegosdigitalescolombia.com/files/images/productos/1673124993-fifa-23-espanol-espana-ps4-0.jpg",
    description:
      "A football simulation game that features the 2022 FIFA World Cup.",
    rating: 4.0,
    releaseDate: "2022-09-30",
  },
  {
    id: "7",
    title: "Street Fighter 6",
    category: Category.FIGHTING,
    imageUrl:
      "https://image.api.playstation.com/vulcan/ap/rnd/202211/1408/ENialNds5tXo7Mb9ahX2yESt.png",
    description:
      "A fighting game that introduces new mechanics and game modes.",
    rating: 4.6,
    releaseDate: "2023-06-02",
  },
  {
    id: "8",
    title: "God of War Ragnarök",
    category: Category.ACTION,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg",
    description:
      "An action game that continues the story of Kratos and his son Atreus as they face the impending Ragnarök.",
    rating: 4.9,
    releaseDate: "2022-11-09",
  },
  {
    id: "9",
    title: "Schedule",
    category: Category.RPG,
    imageUrl:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3164500/header.jpg",
    description:
      "From small-time dope pusher to kingpin - manufacture and distribute a range of drugs throughout the grungy city of Hyland Point.",
    rating: 4.2,
    releaseDate: "2025-03-24",
  },
];
