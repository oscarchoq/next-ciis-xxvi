import Link from "next/link";

export interface Plan {
  id: string;
  denominacion: string;
  precioDescuento: number;
  precio: number;
  activo: boolean;
  createdAt: Date;
}

const Planes = ({ planes }: { planes: Plan[] }) => {
 return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Selecciona tu Plan de Inscripción
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {planes.map((plan) => (
            <div 
              key={plan.id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {plan.denominacion}
                </h2>
                <div className="flex items-baseline mb-4">
                  {plan.precioDescuento && (
                    <span className="text-4xl font-extrabold text-indigo-600">
                      ${plan.precioDescuento}
                    </span>
                  )}
                  <span className={`ml-2 text-2xl font-semibold ${plan.precioDescuento ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    ${plan.precio}
                  </span>
                </div>
                <p className="text-gray-600">
                  Aprovecha el precio especial por ser **{plan.denominacion}**.
                </p>
              </div>
              <div className="mt-6">
                <Link 
                  href={`/inscripcion/${plan.id}`} 
                  className="w-full text-center bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                  Seleccionar Plan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Planes