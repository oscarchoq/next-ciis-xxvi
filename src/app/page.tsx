
import { ExampleSendMail } from "./exampleEmail";
import { Formulario } from './formulario';


export default function Home() {
  // redirect("https://www.ciistacna.com");
  // redirect("/inscripcion")

  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center mx-auto">
      CIIS XXVI
      
      <ExampleSendMail />
      <Formulario />
    </div>
  );
}