export type TipoArchivo = 'VOUCHER' | 'MATRICULA';

export interface Plan {
  id: string;
  denominacion: string;
  precioDescuento: number;
  precio: number;
  activo: boolean;
  archivosRequeridos: TipoArchivo[];
  createdAt: Date;
}

