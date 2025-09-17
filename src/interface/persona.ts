export interface Persona {
  id: string;
  createdAt: Date;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  celular: string | null;
}