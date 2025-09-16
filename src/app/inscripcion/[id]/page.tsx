import { getPlanById } from "@/actions/plan/get-plan-by-id";
import { redirect } from "next/navigation";
import Inscripcion from "./ui/Inscripcion";

interface Props {
  params: Promise<{
    id: string;
  }>
}

export default async function InscripcionPage({ params }: Props) {
  const { id } = await params;
  const planResponse = await getPlanById(id)

  if ( !planResponse ) {
    redirect('/inscripcion');
  }
  const { plan } = planResponse
  // aqui mostrar el formulario
  return (
    // <div>
    //   <h1>Inscripción para {id}</h1>
    //   <pre>{JSON.stringify(plan, null, 2)}</pre>
    // </div>
    <Inscripcion 
      plan={plan}
    />
  );
}