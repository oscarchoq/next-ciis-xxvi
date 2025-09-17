"use server";

import prisma from "@/lib/prisma";
import { TipoArchivo } from "@/interface/plan";

export const getPlanes = async () => {
  try {
    const planes = await prisma.plan.findMany({
      where: { activo: true },
    });
    
    // Hacer casting del campo Json a TipoArchivo[] para cada plan
    const planesWithTypedArchivos = planes.map(plan => ({
      ...plan,
      archivosRequeridos: plan.archivosRequeridos as TipoArchivo[]
    }));
    
    console.log({planes: planesWithTypedArchivos})
    return {
      ok: true,
      planes: planesWithTypedArchivos,
    }
  } catch (error) {
      console.log(error)
      return {
        ok: false,
        error: "Failed to fetch planes"
      }
  }
}