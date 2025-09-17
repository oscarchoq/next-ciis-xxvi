"use server";
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary'
import { sendEmail } from './send-email';
import { Persona } from '@/interface';

cloudinary.config( process.env.CLOUDINARY_URL ?? '' )

export const createInscription = async (formData: FormData) => {
  try {

    // Se puede mejorar esto mas adelante
    const nombres = formData.get('nombres') as string;
    const apellidos = formData.get('apellidos') as string;
    const correo = formData.get('correo') as string;
    const numeroDocumento = formData.get('numeroDocumento') as string;
    const celular = formData.get('celular') as string;
    const universidad = formData.get('universidad') as string;
    const carrera = formData.get('carrera') as string;
    const planId = formData.get('planId') as string;

    // Validación básica
    if (!nombres || !apellidos || !correo || !numeroDocumento || !celular || !universidad || !carrera || !planId) {
      throw new Error('Todos los campos son requeridos');
    }

    // Validaciones con la base de datos
    // 1. Verificar que no exista esa persona ya registrada
    const foundPerson = await prisma.persona.findFirst({
      where: { numeroDocumento },
      select: { id: true }
    })
    if ( foundPerson ) throw new Error('Ya existe una persona con ese número de documento')

    // 2. Verificar que no exista el correo ya registrado
    const foundEmail = await prisma.persona.findFirst({
      where: { correo },
      select: { id: true }
    })
    if ( foundEmail ) throw new Error('Ya existe una persona con ese correo electrónico')

    // 3. Verificar numero de celular - mas adelante si es que uso enviar notificaciones por wsp
    // 4. Verificar el plan pero no es tan necesario
    
    // guardar en la base de datos
    const prismaTx = await prisma.$transaction(async (tx) => {

      // Primero crear la persona
      const person = await tx.persona.create({
        data: {
          nombres,
          apellidos,
          correo: correo.toLowerCase(),
          numeroDocumento,
          celular
        }
      })

      // Luego crear la inscripción
      const inscription = await tx.inscripcion.create({
        data: {
          personaId: person.id,
          planId: planId,
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
          tipoArchivo: 'IMAGEN',
        }))
      })

      console.log({ person, inscription, images })

      return {
        ok: true,
        person,
        inscription
      }
    })

    if ( prismaTx.ok) {
      const emailData = {
        to: prismaTx.person.correo,
        name: prismaTx.person.nombres + ' ' + prismaTx.person.apellidos,
        subject: 'Registro CIIS XXVI',
      }
      await sendEmail(emailData)

      return {
        ok: true,
        inscription: prismaTx.inscription
      }
    }

    return {
      ok: false,
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