"use client";
import React, { useState } from 'react'
import { createInscription } from '@/actions/create-inscription'

export const Formulario = () => {
  const [numberOfFiles, setNumberOfFiles] = useState(1); // Variable que controla cuántos inputs mostrar (1-3)

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await createInscription(formData);
      console.log('Resultado:', result);
      alert('Inscripción creada exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la inscripción');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Formulario de Inscripción</h2>
      
      <form action={handleSubmit} className="space-y-4">
        {/* Datos de la persona */}
        <div>
          <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
            Nombres:
          </label>
          <input
            type="text"
            id="nombres"
            name="nombres"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tus nombres"
          />
        </div>

        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos:
          </label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tus apellidos"
          />
        </div>

        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico:
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-1">
            Número de documento:
          </label>
          <input
            type="text"
            id="numeroDocumento"
            name="numeroDocumento"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="12345678"
          />
        </div>

        <div>
          <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">
            Celular:
          </label>
          <input
            type="tel"
            id="celular"
            name="celular"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="987654321"
          />
        </div>

        <div>
          <label htmlFor="universidad" className="block text-sm font-medium text-gray-700 mb-1">
            Universidad:
          </label>
          <input
            type="text"
            id="universidad"
            name="universidad"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="UNJBG"
          />
        </div>

        <div>
          <label htmlFor="carrera" className="block text-sm font-medium text-gray-700 mb-1">
            Carrera:
          </label>
          <input
            type="text"
            id="carrera"
            name="carrera"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ESIS"
          />
        </div>

        {/* Control para número de archivos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de documentos a subir:
          </label>
          <div className="flex gap-2">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setNumberOfFiles(num)}
                className={`px-3 py-1 rounded-md text-sm ${
                  numberOfFiles === num 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {num} archivo{num > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs de archivos dinámicos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documentos (imágenes):
          </label>
          
          {Array.from({ length: numberOfFiles }, (_, index) => (
            <div key={index} className="mb-2">
              <input
                type="file"
                name="images"
                accept="image/*"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Archivo {index + 1} de {numberOfFiles}
              </p>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Crear Inscripción
        </button>
      </form>
    </div>
  )
}
