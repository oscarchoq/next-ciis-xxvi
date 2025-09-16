"use client"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { IoMdArrowRoundBack } from "react-icons/io"
import Formulario from "./Form"
import { Plan } from "@/interface"



const InscripcionPage = ({ plan }: { plan: Plan }) => {
  const [showBackText, setShowBackText] = useState(false)
  const router = useRouter()

  const handleBackClick = () => {
    router.push("/inscripcion")
  }

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-screen">

        {/* Lado izquierdo */}
        <div className="bg-[#000126] text-white py-12 px-8 lg:px-5 flex justify-center lg:justify-end lg:items-start">
          <div className="max-w-sm w-full mx-auto xl:ml-0 xl:mr-12">
            {/* Logo y volver */}
            <div
              className="inline-flex items-center gap-3 mb-8 cursor-pointer group"
              onMouseEnter={() => setShowBackText(true)}
              onMouseLeave={() => setShowBackText(false)}
              onClick={handleBackClick}
            >
              <IoMdArrowRoundBack className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors -ml-6" />
              <div className="relative overflow-hidden">
                <Image
                  src="/logo_ciis.png"
                  alt="CIIS Logo"
                  width={160}
                  height={54}
                  className={`h-10 transition-all duration-300 ${showBackText ? 'lg:-translate-x-full lg:opacity-0' : 'translate-x-0 opacity-100'}`}
                />
                <span className={`absolute top-1/2 left-0 -translate-y-1/2 text-base font-medium transition-all duration-300 ${showBackText ? 'lg:translate-x-0 lg:opacity-100' : 'translate-x-full opacity-0'} hidden lg:block whitespace-nowrap`}>Atrás</span>
              </div>
            </div>

            {/* Informacion del evento */}
            <div className="space-y-4">

              {/* Precio */}

              <div className="flex justify-between items-end mb-4">
                <div>
                  <h1 className="text-white/70 text-sm md:mb-1">Inscríbete al evento por</h1>
                  <div className="text-white/50 text-xs">{plan.denominacion}</div>
                </div>
                <div className="text-white font-extrabold font-jetbrains-mono text-xl sm:text-2xl md:text-3xl">S/. {plan.precioDescuento}</div>
              </div>

              <div className="w-full h-px bg-white/20 mb-4"></div>


              {/* Información del evento */}
              <div>
                <h3 className="text-white/90 text-base font-semibold mb-3">Información del evento</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-white/70 font-normal">
                    <span>📍</span>
                    Auditorio Central - UNJBG
                  </div>
                  <div className="flex items-center gap-2 text-white/70 font-normal">
                    <span>📅</span>
                    10 al 14 noviembre, 2025
                  </div>
                  <div className="flex items-center gap-2 text-white/70 font-normal">
                    <span>🏆</span>
                    Incluye certificación
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-white/20 mb-4"></div>


              {/* métodos de pago */}
              <div>
                <h3 className="text-white/90 text-base font-semibold mb-4">Métodos de pago</h3>

                {/* BCP - Método alternativo */}
                <div className="mb-4">
                  <h4 className="text-white/80 text-sm font-medium mb-2">Transferencia BCP</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/50 font-normal">Titular:</span>
                      <span className="text-white/80 font-medium">Lizzeth Mercedes Candia Llica</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50 font-normal">Cuenta:</span>
                      <span className="text-white/90 font-mono font-medium">540-07593062-0-83</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50 font-normal">CCI:</span>
                      <span className="text-white/90 font-mono text-xs text-right font-medium">002-54010759306208337</span>
                    </div>
                  </div>
                </div>

                {/* Separador */}
                <div className="w-full h-px bg-white/20 mb-3"></div>

                {/* Yape - Método principal */}
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-2">Yape</h4>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Datos del lado izquierdo */}
                    <div className="flex-1 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 font-normal">Nombre:</span>
                        <span className="text-white/80 font-medium">Lizzeth Mercedes Candia Llica</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 font-normal">Celular:</span>
                        <span className="text-white/90 font-mono font-medium">916 164 191</span>
                      </div>
                    </div>

                    {/* Separador vertical - solo en desktop */}
                    <div className="hidden lg:block w-px h-16 bg-white/20 mx-2"></div>

                    {/* QR del lado derecho en desktop, abajo en móvil */}
                    <div className="flex-shrink-0 text-center lg:text-center">
                      <p className="text-white/70 text-xs mb-1">o escanea</p>
                      <Image
                        src="/qr-yape.svg"
                        alt="QR Yape"
                        width={100}
                        height={100}
                        className="w-25 h-25 mx-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="bg-zinc-50 py-12 px-6 sm:px-8 lg:px-5 flex items-start justify-center lg:justify-start">
          <Formulario plan={plan} />
        </div>
      </div>
    </main>
  )
}

export default InscripcionPage