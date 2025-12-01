// Données des logements - Cité KONGO
// Port-Bouët, quartier ABEKAN-BERNARD

export const logements = [
  // VILLA DUPLEX 4 PIÈCES
  {
    id: "LOG-001",
    reference: "VD4P-01",
    type: "Villa Duplex",
    nom: "Villa Duplex 4 Pièces",
    superficie: 150,
    nombrePieces: 4,
    nombreChambres: 3,
    nombreSallesBain: 3,
    nombreWC: 3,
    etage: "R+1",
    prix: 120000000,
    prixM2: 800000,
    description: "Magnifique villa duplex sur deux niveaux offrant 150m² d'espace de vie. RDC: grand séjour avec coin salle à manger, cuisine moderne équipée, toilettes invités. Étage: 3 chambres spacieuses dont une suite parentale avec salle de bain privative, seconde salle de bain commune. Finitions de qualité et espaces optimisés pour le confort familial.",
    equipements: [
      "Suite parentale avec dressing",
      "Cuisine moderne",
      "Grand séjour avec salle à manger",
      "Terrasse au rez-de-chaussée",
      "Balcon à l'étage",
      "Garage 2 véhicules"
    ],
    balcon: true,
    terrasse: true,
    jardin: false,
    parking: {
      inclus: true,
      nombrePlaces: 2
    },
    orientation: "sud",
    statut: "disponible",
    images: [
      "/assets/images/logements/villa-duplex-4p-1.png"
    ],
    planUrl: "/assets/plans/villa-duplex-4p.pdf",
    actif: true
  },

  // VILLA DUPLEX 5 PIÈCES
  {
    id: "LOG-002",
    reference: "VD5P-01",
    type: "Villa Duplex",
    nom: "Villa Duplex 5 Pièces",
    superficie: 250,
    nombrePieces: 5,
    nombreChambres: 4,
    nombreSallesBain: 4,
    nombreWC: 4,
    etage: "R+1",
    prix: 150000000,
    prixM2: 600000,
    description: "Spacieuse villa duplex de 250m² conçue pour les familles recherchant confort et élégance. RDC: double séjour lumineux, salle à manger, cuisine équipée avec coin repas, chambre d'invités avec salle d'eau, toilettes invités. Étage: suite parentale luxueuse avec dressing et salle de bain privative, 2 grandes chambres, salle de bain commune, bureau/espace multimédia. Finitions premium et nombreux rangements.",
    equipements: [
      "Suite parentale avec grand dressing",
      "Grande terrasse couverte",
      "Double séjour spacieux",
      "4 chambres dont 1 au RDC",
      "Cuisine moderne avec coin repas",
      "Garage 2 véhicules",
      "2 Balcons à l'étage"
    ],
    balcon: true,
    terrasse: true,
    jardin: false,
    parking: {
      inclus: true,
      nombrePlaces: 2
    },
    orientation: "sud-ouest",
    statut: "disponible",
    images: [
      "/assets/images/logements/villa-duplex-5p-1.png"
    ],
    planUrl: "/assets/plans/villa-duplex-5p.pdf",
    actif: true
  },

  // VILLA TRIPLEX 6 PIÈCES
  {
    id: "LOG-003",
    reference: "VT6P-01",
    type: "Villa Triplex",
    nom: "Villa Triplex 6 Pièces",
    superficie: 300,
    nombrePieces: 6,
    nombreChambres: 5,
    nombreSallesBain: 5,
    nombreWC: 5,
    etage: "R+2",
    prix: 250000000,
    prixM2: 833333,
    description: "Villa d'exception sur trois niveaux offrant 300m² d'espace de vie luxueux. RDC: hall d'entrée, double séjour cathédrale, salle à manger, cuisine américaine équipée premium, chambre d'invités avec salle d'eau, toilettes invités, cellier. 1er étage: suite parentale royale avec dressing et salle de bain spa, 2 chambres avec salles d'eau attenantes, bureau. 2ème étage: 2 chambres supplémentaires, salle de bain, espace détente/home cinema, terrasse panoramique. Le summum du confort et du standing.",
    equipements: [
      "Suite parentale avec grand dressing",
      "Double séjour spacieux",
      "Cuisine moderne",
      "5 chambres sur 3 niveaux",
      "Seule chambre parentale au 2e étage",
      "Chambre d'invités au RDC",
      "Espace détente/home cinema",
      "Terrasse panoramique",
      "Balcons à chaque étage",
      "Cellier",
      "Garage 3 places"
    ],
    balcon: true,
    terrasse: true,
    jardin: true,
    parking: {
      inclus: true,
      nombrePlaces: 3
    },
    orientation: "sud",
    statut: "disponible",
    images: [
      "/assets/images/logements/villa-triplex-6p-1.png"
    ],
    planUrl: "/assets/plans/villa-triplex-6p.pdf",
    actif: true
  }
];

// Fonction utilitaire pour obtenir les logements par type
export const getLogementsByType = (type) => {
  return logements.filter(log => log.type === type && log.actif);
};

// Fonction utilitaire pour obtenir les logements disponibles
export const getLogementsDisponibles = () => {
  return logements.filter(log => log.statut === 'disponible' && log.actif);
};

// Fonction utilitaire pour filtrer les logements
export const filterLogements = (filters) => {
  let results = logements.filter(log => log.actif);

  if (filters.type && filters.type !== 'tous') {
    results = results.filter(log => log.type === filters.type);
  }

  if (filters.prixMin) {
    results = results.filter(log => log.prix >= Number(filters.prixMin));
  }

  if (filters.prixMax) {
    results = results.filter(log => log.prix <= Number(filters.prixMax));
  }

  if (filters.superficieMin) {
    results = results.filter(log => log.superficie >= Number(filters.superficieMin));
  }

  if (filters.superficieMax) {
    results = results.filter(log => log.superficie <= Number(filters.superficieMax));
  }

  if (filters.statut && filters.statut !== 'tous') {
    results = results.filter(log => log.statut === filters.statut);
  }

  return results;
};

// Statistiques des logements
export const getLogementsStats = () => {
  const disponibles = logements.filter(log => log.statut === 'disponible' && log.actif);
  const prix = logements.filter(log => log.actif).map(log => log.prix);

  return {
    total: logements.filter(log => log.actif).length,
    disponibles: disponibles.length,
    reserves: logements.filter(log => log.statut === 'réservé' && log.actif).length,
    vendus: logements.filter(log => log.statut === 'vendu' && log.actif).length,
    prixMin: Math.min(...prix),
    prixMax: Math.max(...prix),
    prixMoyen: Math.round(prix.reduce((a, b) => a + b, 0) / prix.length)
  };
};

export default logements;
