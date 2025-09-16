"use server";

import prisma from "@/lib/prisma";
import { TipoArchivo } from "@/interface/plan";

export const getPlanById = async (id: string) => {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id: id, activo: true },
    })

    if (!plan) return null;
    
    // Hacer casting del campo Json a TipoArchivo[]
    const planWithTypedArchivos = {
      ...plan,
      archivosRequeridos: plan.archivosRequeridos as TipoArchivo[]
    };
    
    return {
      plan: planWithTypedArchivos
    }
  } catch (error) {
    console.log(error)
    throw new Error("Failed to fetch plan by id")
  }
}