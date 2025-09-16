type TipoArchivo = 'VOUCHER' | 'MATRICULA';

interface Plan {
  denominacion: string;
  precioDescuento: number;
  precio: number;
  archivosRequeridos: TipoArchivo[];
}

interface Delegacion {
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
      "precio": 140,
      "archivosRequeridos": ["VOUCHER"]
    },
    {
      "denominacion": "Delegaciones",
      "precioDescuento": 100,
      "precio": 120,
      "archivosRequeridos": ["VOUCHER", "MATRICULA"]
    },
    {
      "denominacion": "Docentes UNJBG",
      "precioDescuento": 70,
      "precio": 90,
      "archivosRequeridos": ["VOUCHER"]
    },
    {
      "denominacion": "Estudiantes UNJBG",
      "precioDescuento": 50,
      "precio": 70,
      "archivosRequeridos": ["VOUCHER", "MATRICULA"]
    },
    {
      "denominacion": "Estudiantes ESIS",
      "precioDescuento": 35,
      "precio": 50,
      "archivosRequeridos": ["VOUCHER", "MATRICULA"]
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
