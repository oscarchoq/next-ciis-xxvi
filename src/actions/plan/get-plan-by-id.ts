"use server";

import prisma from "@/lib/prisma";

export const getPlanById = async (id: string) => {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id: id, activo: true },
    })

    if (!plan) return null;
    
    return {
      plan
    }
  } catch (error) {
    console.log(error)
    throw new Error("Failed to fetch plan by id")
  }
}