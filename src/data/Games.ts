import { Game, Category } from "../types/models";


//*Lista de juegos para el app tambien pa que se filtren por categorias y mostrar detalles deljuego en especifico
export const games: Game[] = [
  {
    id: "1",
    title: "The Last Guardian",
    category: Category.ADVENTURE,
    imageUrl: "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg",
    description: "An action-adventure game that follows a young boy who befriends a giant half-bird, half-mammal creature named Trico.",
    rating: 4.5,
    releaseDate: "2016-12-06"
  },
  {
    id: "2",
    title: "Outlast",
    category: Category.HORROR,
    imageUrl: "https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg",
    description: "A first-person survival horror game where you must survive the horrors of Mount Massive Asylum.",
    rating: 4.2,
    releaseDate: "2013-09-04"
  },
  {
    id: "3",
    title: "Final Fantasy VII Remake",
    category: Category.RPG,
    imageUrl: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
    description: "A reimagining of the iconic RPG that follows Cloud Strife, a former SOLDIER, as he joins an eco-terrorist group to fight against the Shinra Electric Power Company.",
    rating: 4.8,
    releaseDate: "2020-04-10"
  },
  {
    id: "4",
    title: "Forza Horizon 5",
    category: Category.RACING,
    imageUrl: "https://images.pexels.com/photos/12920555/pexels-photo-12920555.jpeg",
    description: "An open-world racing game set in a fictionalized representation of Mexico.",
    rating: 4.7,
    releaseDate: "2021-11-09"
  },
  {
    id: "5",
    title: "Age of Empires IV",
    category: Category.STRATEGY,
    imageUrl: "https://images.pexels.com/photos/279618/pexels-photo-279618.jpeg",
    description: "A real-time strategy game that focuses on historical events throughout the Middle Ages.",
    rating: 4.3,
    releaseDate: "2021-10-28"
  },
  {
    id: "6",
    title: "FIFA 23",
    category: Category.SPORTS,
    imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
    description: "A football simulation game that features the 2022 FIFA World Cup.",
    rating: 4.0,
    releaseDate: "2022-09-30"
  },
  {
    id: "7",
    title: "Street Fighter 6",
    category: Category.FIGHTING,
    imageUrl: "https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg",
    description: "A fighting game that introduces new mechanics and game modes.",
    rating: 4.6,
    releaseDate: "2023-06-02"
  },
  {
    id: "8",
    title: "God of War Ragnarök",
    category: Category.ACTION,
    imageUrl: "https://images.pexels.com/photos/6692132/pexels-photo-6692132.jpeg",
    description: "An action game that continues the story of Kratos and his son Atreus as they face the impending Ragnarök.",
    rating: 4.9,
    releaseDate: "2022-11-09"
  }
];