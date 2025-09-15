"use server";
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config( process.env.CLOUDINARY_URL ?? '' )

export const createInscription = async (formData: FormData) => {
  try {
    
    // Validar datos del form
    const nombres = formData.get('nombres') as string;
    const apellidos = formData.get('apellidos') as string;
    const correo = formData.get('correo') as string;
    const numeroDocumento = formData.get('numeroDocumento') as string;
    const celular = formData.get('celular') as string;
    const universidad = formData.get('universidad') as string;
    const carrera = formData.get('carrera') as string;

    // Validación básica
    if (!nombres || !apellidos || !correo || !numeroDocumento || !celular || !universidad || !carrera) {
      throw new Error('Todos los campos son requeridos');
    }

    // guardar en la base de datos

    const prismaTx = await prisma.$transaction(async (tx) => {

      // Primero crear la persona
      const person = await tx.persona.create({
        data: {
          nombres,
          apellidos,
          correo,
          numeroDocumento,
          celular
        }
      })

      // Luego crear la inscripción
      const inscription = await tx.inscripcion.create({
        data: {
          personaId: person.id,
          planId: 'a39ef10b-564c-492b-b89c-34d19d01078d',
          universidad,
          carrera,
          estado: 'PENDIENTE'
        }
      })

      // Subir las imágenes a Cloudinary
      const images = await uploadImages(formData.getAll('images') as File[]);
      if ( !images ) {
        throw new Error('No se pudo subir las imágenes, rolling back transaction');
      }

      // Si logra subir las imágenes, guardarlas en la base de datos
      await tx.inscripcionArchivo.createMany({
        data: images.map ( (img) => ({
          url: img!,
          inscripcionId: inscription.id,
          tipoArchivo: 'DOCUMENTO',
        }))
      })

      console.log({ person, inscription, images })
      return {
        inscription
      }
    })

    return {
      ok: true,
      inscription: prismaTx.inscription
    }
  } catch (error) {
    console.log(error)
    throw new Error('Error creating inscription: ' + (error as Error).message);
  }
}

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async image => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
          folder: 'inscriptions',
        })
        .then( r => r.secure_url)

      } catch (error) {
        console.log('Error uploading image individual:', error);
        return null;
      }
    })

    const uploadImages = await Promise.all(uploadPromises);
    return uploadImages

  } catch (error) {
    console.log(error)
    return null
  }
}