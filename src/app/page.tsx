
import Link from "next/link";
import { ExampleSendMail } from "./exampleEmail";
import { Formulario } from './formulario';


export default function Home() {
  // redirect("https://www.ciistacna.com");
  // redirect("/inscripcion")

  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center mx-auto">
      CIIS XXVI

      <Link className="bg-amber-200 px-4 py-2 rounded" href="/inscripcion" >
        Ir a Inscripción
      </Link>
      
      {/* <ExampleSendMail />
      <Formulario /> */}
    </div>
  );
}