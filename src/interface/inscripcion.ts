export interface InscripcionForm {
  tipoDocumento: string
  numeroDocumento: string
  nombres: string
  apellidos: string
  correo: string
  celular: string
  universidad: string
  carrera: string
  voucher: File | null
  fichaMatricula: File | null
  images: File[]
}