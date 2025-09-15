-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "denominacion" TEXT NOT NULL,
    "precioDescuento" DOUBLE PRECISION NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Delegacion" (
    "id" TEXT NOT NULL,
    "denominacion" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Delegacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Persona" (
    "id" TEXT NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "celular" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inscripcion" (
    "id" TEXT NOT NULL,
    "universidad" TEXT NOT NULL,
    "carrera" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personaId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "delegacionId" TEXT,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InscripcionArchivo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipoArchivo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inscripcionId" TEXT NOT NULL,

    CONSTRAINT "InscripcionArchivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delegacion_codigo_key" ON "public"."Delegacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_numeroDocumento_key" ON "public"."Persona"("numeroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_correo_key" ON "public"."Persona"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_personaId_planId_key" ON "public"."Inscripcion"("personaId", "planId");

-- AddForeignKey
ALTER TABLE "public"."Inscripcion" ADD CONSTRAINT "Inscripcion_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "public"."Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripcion" ADD CONSTRAINT "Inscripcion_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripcion" ADD CONSTRAINT "Inscripcion_delegacionId_fkey" FOREIGN KEY ("delegacionId") REFERENCES "public"."Delegacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InscripcionArchivo" ADD CONSTRAINT "InscripcionArchivo_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES "public"."Inscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
