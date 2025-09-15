export interface Plan {
  denominacion: string;
  precioDescuento: number;
  precio: number;
}

export interface Delegacion {
  denominacion: string;
  codigo: string;
}

interface SeedData {
  plan: Plan[],
  delegacion: Delegacion[]
}

export const initialData: SeedData = {
  plan: [
    {
      "denominacion": "Público General",
      "precioDescuento": 120,
      "precio": 140
    },
    {
      "denominacion": "Delegaciones",
      "precioDescuento": 100,
      "precio": 120
    },
    {
      "denominacion": "Docentes UNJBG",
      "precioDescuento": 70,
      "precio": 90
    },
    {
      "denominacion": "Estudiantes UNJBG",
      "precioDescuento": 50,
      "precio": 70
    },
    {
      "denominacion": "Estudiantes ESIS",
      "precioDescuento": 35,
      "precio": 50
    }
  ],
  delegacion: [
    {
      "denominacion": "SENATI",
      "codigo": "DEL-A3F9K2"
    },
    {
      "denominacion": "UNI",
      "codigo": "DEL-Z7Q8M1"
    }
  ]
}
