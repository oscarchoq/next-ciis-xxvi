import { ExampleSendMail } from "./exampleEmail";
import { Formulario } from './formulario';
import { GetPlanesExample } from './getPlanesExample';
       
export default function Home() {
  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center mx-auto">
      CIIS XXVI
      
      <ExampleSendMail />
      <GetPlanesExample />
      <Formulario />
    </div>
  );
}