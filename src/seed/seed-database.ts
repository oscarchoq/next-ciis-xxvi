import prisma from '../lib/prisma';
import { initialData } from './seed';

async function main () {
  console.log("Seed database");

  await prisma.inscripcionArchivo.deleteMany();
  await prisma.inscripcion.deleteMany();
  await prisma.delegacion.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.persona.deleteMany();

  
  const { plan, delegacion } = initialData;
  
  // 1. Crear planes
  const planes = await prisma.plan.createMany({
    data: plan
  })
  
  console.log({ planes });
  
  // 2. Crear delegaciones
  const delegaciones = await prisma.delegacion.createMany({
    data: delegacion
  });
  
  console.log({ delegaciones });
  
  console.log("Seed database completed");
}

(() => {
  if ( process.env.NODE_ENV === "production") return;
  main();
})();