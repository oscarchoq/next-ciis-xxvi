"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { Search, Loader2, Upload, ImageIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { getDataByDNI } from '@/actions/get-data-by-dni';
import { InscripcionForm } from '@/interface/inscripcion';

import { Plan } from '@/interface/plan';
import { createInscription } from '@/actions/create-inscription';

interface FormularioProps {
  plan: Plan;
}

const Formulario = ({ plan }: FormularioProps) => {
  const [isSearching, setIsSearching] = useState(false)
  const [isDataFromAPI, setIsDataFromAPI] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFichaFile, setSelectedFichaFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [dragActiveFicha, setDragActiveFicha] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Verificar qué archivos son requeridos según el plan
  const voucherRequerido = plan.archivosRequeridos.includes('VOUCHER')
  const matriculaRequerida = plan.archivosRequeridos.includes('MATRICULA')

  const {
    register, handleSubmit, watch, setValue, clearErrors,
    formState: { errors }
  } = useForm<InscripcionForm>({
    mode: 'onChange'
  })

  const tipoDocumento = watch('tipoDocumento')
  const numeroDocumento = watch('numeroDocumento')

  useEffect(() => {
    register('tipoDocumento', {
      required: 'Selecciona un documento'
    })
  }, [register])

  useEffect(() => {
    register("voucher", { required: voucherRequerido ? "Voucher de pago requerido" : false });
    register("fichaMatricula", {
      required: matriculaRequerida ? "Ficha de matrícula requerida para este plan" : false
    });
    register("images");
  }, [register, voucherRequerido, matriculaRequerida]);

  useEffect(() => {
    if (tipoDocumento !== 'dni' || !numeroDocumento) {
      setIsDataFromAPI(false)
    }
  }, [tipoDocumento, numeroDocumento])

  // Buscar API Reniec
  const searchReniec = async () => {
    if (!numeroDocumento || numeroDocumento.length !== 8 || !/^\d{8}$/.test(numeroDocumento)) {
      toast.error('DNI debe tener 8 dígitos', {
        duration: 3000,
      });
      return
    }

    setIsSearching(true)

    try {
      const { nombres, apellidos } = await getDataByDNI(numeroDocumento)
      setValue('nombres', nombres, { shouldValidate: true })
      setValue('apellidos', apellidos, { shouldValidate: true })
      setIsDataFromAPI(true)

    } catch (error) {
      console.error('Error al buscar DNI:', error)
      toast.error("DNI no encontrado", {
        description: "Ingrese los datos manualmente",
        duration: 3000,
      });
      setValue('nombres', '', { shouldValidate: true })
      setValue('apellidos', '', { shouldValidate: true })
      setIsDataFromAPI(false)
    } finally {
      setIsSearching(false)
    }
  }

  // Submit Formulario
  const onSubmit = async (data: InscripcionForm) => {
    setIsSubmitting(true)

    try {
      // Combinar archivos en el array images antes de enviar
      const images: File[] = []
      if (data.voucher) images.push(data.voucher)
      if (data.fichaMatricula) images.push(data.fichaMatricula)

      console.log({ data })
      const formDataToSend = new FormData()

      formDataToSend.append('nombres', data.nombres)
      formDataToSend.append('apellidos', data.apellidos)
      formDataToSend.append('correo', data.correo)
      formDataToSend.append('numeroDocumento', data.numeroDocumento)
      formDataToSend.append('celular', data.celular)
      formDataToSend.append('universidad', data.universidad)
      formDataToSend.append('carrera', data.carrera)
      formDataToSend.append('planId', plan.id)

      if (images) {
        for (let i = 0; i < images.length; i++) {
          formDataToSend.append('images', images[i])
        }
      }

      console.log("Datos del formulario:", formDataToSend);
      // console.log("Archivos en el array images:", images);
      // console.log("Voucher:", data.voucher);
      // console.log("Ficha de matrícula:", data.fichaMatricula);
      // console.log("Plan requiere voucher:", voucherRequerido);
      // console.log("Plan requiere ficha:", matriculaRequerida);

      const {ok, inscription} = await createInscription(formDataToSend)
      console.log(inscription)
      if (ok) {
        toast.success('Inscripción exitosa! Revisa tu correo.', {
          duration: 5000,
        });
        // Redirigir a la página de éxito
        // router.push('/inscripcion/success')

      } else {
        toast.error("error al inscribirse", {
          duration: 3000,
        });
      }
      console.log("MANDO FORMULARIO")
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      toast.error(error instanceof Error ? error.message : 'Error en el registro', {
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  // Funciones para manejar el archivo de voucher
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes', {
          duration: 3000,
        });
        e.target.value = '';
        return;
      }
      if (file.size > 1024 * 1024) { // 1MB
        toast.error('El tamaño máximo permitido es 1MB', {
          duration: 3000,
        });
        e.target.value = '';
        return;
      }
      setSelectedFile(file)
      setValue('voucher', file, { shouldValidate: true })
      clearErrors('voucher')
    } else {
      setSelectedFile(null)
      setValue('voucher', null, { shouldValidate: true })
    }
  }

  // Funciones para manejar el archivo de ficha de matrícula
  const handleFichaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes', {
          duration: 3000,
        });
        e.target.value = '';
        return;
      }
      if (file.size > 1024 * 1024) { // 1MB
        toast.error('El tamaño máximo permitido es 1MB', {
          duration: 3000,
        });
        e.target.value = '';
        return;
      }
      setSelectedFichaFile(file)
      setValue('fichaMatricula', file, { shouldValidate: true })
      clearErrors('fichaMatricula')
    } else {
      setSelectedFichaFile(null)
      setValue('fichaMatricula', null, { shouldValidate: true })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes', {
          duration: 3000,
        });
        return;
      }
      if (file.size > 1024 * 1024) { // 1MB
        toast.error('El tamaño máximo permitido es 1MB', {
          duration: 3000,
        });
        return;
      }
      setSelectedFile(file)
      setValue('voucher', file, { shouldValidate: true })
      clearErrors('voucher')
    }
  }

  // Drag and drop functions for ficha de matrícula
  const handleFichaDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveFicha(true)
    } else if (e.type === 'dragleave') {
      setDragActiveFicha(false)
    }
  }

  const handleFichaDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveFicha(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes', {
          duration: 3000,
        });
        return;
      }
      if (file.size > 1024 * 1024) { // 1MB
        toast.error('El tamaño máximo permitido es 1MB', {
          duration: 3000,
        });
        return;
      }
      setSelectedFichaFile(file)
      setValue('fichaMatricula', file, { shouldValidate: true })
      clearErrors('fichaMatricula')
    }
  }

  return (
    <div className='max-w-sm w-full mx-auto xl:mr-0 xl:ml-12'>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

        {/* Datos Personales */}
        <div>
          <h3 className="text-[#000126] text-lg font-semibold mb-4">Datos Personales</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Tipo de documento */}
            <div className="space-y-2">
              <Label htmlFor="tipoDocumento" className="text-zinc-700 font-medium">
                Tipo de documento
              </Label>
              <Select
                value={tipoDocumento}
                disabled={isSubmitting}
                onValueChange={(value) => {
                  setValue('tipoDocumento', value, { shouldValidate: true })
                }}
              >
                <SelectTrigger className={`w-full ${errors.tipoDocumento ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Seleccionar documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="pasaporte">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoDocumento && (
                <p className="text-red-500 text-xs leading-tight">{errors.tipoDocumento.message}</p>
              )}
            </div>

            {/* Número de documento */}
            <div className="space-y-2">
              <Label htmlFor="numeroDocumento" className="text-zinc-700 font-medium">
                Número de documento
              </Label>
              <div className="flex gap-2">
                <Input
                  id="numeroDocumento"
                  type="text"
                  placeholder={tipoDocumento === 'dni' ? '12345678' : 'número de documento'}
                  className={`border-zinc-300 flex-1 ${errors.numeroDocumento ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  {...register('numeroDocumento', {
                    required: 'Número de documento requerido',
                    validate: (value) => {
                      if (tipoDocumento === 'dni') {
                        if (!/^\d{8}$/.test(value)) {
                          return 'DNI debe tener 8 dígitos'
                        }
                      } else if (tipoDocumento === 'pasaporte') {
                        if (value.length < 6) {
                          return 'Mín. 6 caracteres'
                        }
                        if (value.length > 20) {
                          return 'Máx. 20 caracteres'
                        }
                      }
                      return true
                    }
                  })}
                />
                {tipoDocumento === 'dni' && (
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    onClick={searchReniec}
                    disabled={isSearching || !numeroDocumento || numeroDocumento.length !== 8 || !/^\d{8}$/.test(numeroDocumento) || isSubmitting}
                    className=" bg-[#000126] text-white"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              {errors.numeroDocumento && (
                <p className="text-red-500 text-xs leading-tight">{errors.numeroDocumento.message}</p>
              )}
            </div>

            {/* Nombres */}
            <div className="space-y-2">
              <Label htmlFor="nombres" className="text-zinc-700 font-medium">
                Nombres
              </Label>
              <Input
                id="nombres"
                type="text"
                placeholder="Ingresa tus nombres"
                className={`border-zinc-300 ${isDataFromAPI ? 'bg-zinc-50' : ''} ${errors.nombres && !isDataFromAPI ? 'border-red-500' : ''}`}
                disabled={isDataFromAPI || isSubmitting}
                {...register('nombres', {
                  required: 'Nombres requeridos',
                  minLength: {
                    value: 2,
                    message: 'Mín. 2 caracteres'
                  },
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s]+$/,
                    message: 'Solo letras y espacios'
                  },
                  validate: (value) => value.trim() === value || 'Evita espacios al inicio y final'
                })}
              />
              {errors.nombres && !isDataFromAPI && (
                <p className="text-red-500 text-xs leading-tight">{errors.nombres.message}</p>
              )}
            </div>

            {/* Apellidos */}
            <div className="space-y-2">
              <Label htmlFor="apellidos" className="text-zinc-700 font-medium">
                Apellidos
              </Label>
              <Input
                id="apellidos"
                type="text"
                placeholder="Ingresa tus apellidos"
                className={`border-zinc-300 ${isDataFromAPI ? 'bg-zinc-50' : ''} ${errors.apellidos && !isDataFromAPI ? 'border-red-500' : ''}`}
                disabled={isDataFromAPI || isSubmitting}
                {...register('apellidos', {
                  required: 'Apellidos requeridos',
                  minLength: {
                    value: 2,
                    message: 'Mín. 2 caracteres'
                  },
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s]+$/,
                    message: 'Solo letras y espacios'
                  },
                  validate: (value) => value.trim() === value || 'Evita espacios al inicio y final'
                })}
              />
              {errors.apellidos && !isDataFromAPI && (
                <p className="text-red-500 text-xs leading-tight">{errors.apellidos.message}</p>
              )}
            </div>

            {/* Correo electrónico */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                className={`border-zinc-300 ${errors.correo ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
                {...register('correo', {
                  required: 'Correo requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo inválido'
                  }
                })}
              />
              {errors.correo && (
                <p className="text-red-500 text-xs leading-tight">{errors.correo.message}</p>
              )}
            </div>

            {/* Celular */}
            <div className="space-y-2">
              <Label htmlFor="celular" className="text-zinc-700 font-medium">
                Celular
              </Label>
              <Input
                id="celular"
                type="text"
                placeholder="987654321"
                className={`border-zinc-300 ${errors.celular ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
                onInput={(e) => {
                  // Solo permitir números
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9]/g, '');
                }}
                {...register('celular', {
                  required: 'Celular requerido',
                  pattern: {
                    value: /^\d{9}$/,
                    message: 'Debe tener 9 dígitos'
                  }
                })}
              />
              {errors.celular && (
                <p className="text-red-500 text-xs leading-tight">{errors.celular.message}</p>
              )}
            </div>
          </div>
        </div>


        {/* Información Académica */}
        <div>
          <h3 className="text-[#000126] text-lg font-semibold mb-4">Información Académica</h3>
          <div className="space-y-4">
            {/* Universidad */}
            <div className="space-y-2">
              <Label htmlFor="universidad" className="text-zinc-700 font-medium">
                Universidad
              </Label>
              <Input
                id="universidad"
                type="text"
                placeholder="Nombre de tu universidad"
                className={`border-zinc-300 ${errors.universidad ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
                {...register('universidad', {
                  required: 'Universidad requerida',
                  minLength: {
                    value: 3,
                    message: 'Mín. 3 caracteres'
                  },
                  validate: (value) => value.trim() === value || 'Evita espacios al inicio y final'
                })}
              />
              {errors.universidad && (
                <p className="text-red-500 text-xs leading-tight">{errors.universidad.message}</p>
              )}
            </div>

            {/* Carrera */}
            <div className="space-y-2">
              <Label htmlFor="carrera" className="text-zinc-700 font-medium">
                Carrera
              </Label>
              <Input
                id="carrera"
                type="text"
                placeholder="Nombre de tu carrera"
                className={`border-zinc-300 ${errors.carrera ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
                {...register('carrera', {
                  required: 'Carrera requerida',
                  minLength: {
                    value: 3,
                    message: 'Mín. 3 caracteres'
                  },
                  validate: (value) => value.trim() === value || 'Evita espacios al inicio y final'
                })}
              />
              {errors.carrera && (
                <p className="text-red-500 text-xs leading-tight">{errors.carrera.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Subir Voucher - Condicional */}
        {voucherRequerido && (
          <div>
            <h3 className="text-[#000126] text-lg font-semibold mb-4">Voucher de Pago</h3>
            <div className="space-y-3">

              {/* Área de drag and drop personalizada */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer hover:border-zinc-400 ${dragActive ? 'border-blue-400 bg-blue-50' :
                  errors.voucher ? 'border-red-500 bg-red-50' :
                    'border-zinc-300 bg-zinc-50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Input
                  id="voucher-input"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isSubmitting}
                  onChange={handleFileChange}
                />

                {selectedFile ? (
                  // Vista cuando hay archivo seleccionado
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{selectedFile.name}</p>
                      <p className="text-xs text-zinc-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  // Vista inicial sin archivo
                  <div className="text-center">
                    <div className="w-12 h-12 bg-zinc-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-zinc-500" />
                    </div>
                    <p className="text-sm font-medium text-zinc-700 mb-1">
                      Arrastra tu voucher aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-zinc-500">
                      JPG, PNG hasta 1MB
                    </p>
                  </div>
                )}
              </div>

              {errors.voucher && (
                <p className="text-red-500 text-xs leading-tight">{errors.voucher.message}</p>
              )}

              <p className="text-xs text-zinc-500">
                Sube una imagen clara de tu voucher de pago para verificar tu inscripción
              </p>
            </div>
          </div>
        )}

        {/* Subir Ficha de Matrícula - Condicional */}
        {matriculaRequerida && (
          <div>
            <h3 className="text-[#000126] text-lg font-semibold mb-4">Ficha de Matrícula</h3>
            <div className="space-y-3">

              {/* Área de drag and drop para ficha de matrícula */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer hover:border-zinc-400 ${dragActiveFicha ? 'border-blue-400 bg-blue-50' :
                  errors.fichaMatricula ? 'border-red-500 bg-red-50' :
                    'border-zinc-300 bg-zinc-50'
                  }`}
                onDragEnter={handleFichaDrag}
                onDragLeave={handleFichaDrag}
                onDragOver={handleFichaDrag}
                onDrop={handleFichaDrop}
              >
                <Input
                  id="ficha-input"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isSubmitting}
                  onChange={handleFichaFileChange}
                />

                {selectedFichaFile ? (
                  // Vista cuando hay archivo seleccionado
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{selectedFichaFile.name}</p>
                      <p className="text-xs text-zinc-500">
                        {(selectedFichaFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  // Vista inicial sin archivo
                  <div className="text-center">
                    <div className="w-12 h-12 bg-zinc-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-zinc-500" />
                    </div>
                    <p className="text-sm font-medium text-zinc-700 mb-1">
                      Arrastra tu ficha de matrícula aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-zinc-500">
                      JPG, PNG hasta 1MB
                    </p>
                  </div>
                )}
              </div>

              {errors.fichaMatricula && (
                <p className="text-red-500 text-xs leading-tight">{errors.fichaMatricula.message}</p>
              )}

              <p className="text-xs text-zinc-500">
                Sube una imagen clara de tu ficha de matrícula universitaria
              </p>
            </div>
          </div>
        )}

        {/* Botón de inscripción */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-semibold py-3 text-base transition-all duration-300 relative bg-green-700 hover:bg-green-800 text-white"
          >
            <span className={isSubmitting ? 'mr-6' : ''}>
              Inscribirme
            </span>
            {isSubmitting && (
              <Loader2 className="absolute right-4 h-5 w-5 animate-spin" />
            )}
          </Button>
        </div>

      </form>
    </div>
  )
}

export default Formulario