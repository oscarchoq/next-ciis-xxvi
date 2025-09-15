"use client";
import { sendEmail } from "@/actions/send-email";
export function ExampleSendMail() {

  const handleSendEmail = async () => {
    const data = {
      "to": "oachoques@unjbg.edu.pe",
      "name": "Oscar Alejandro Choque Surco",
      "subject": "REGISTRO CIIS XXVI",
    }
    const res = await sendEmail(data)
    console.log("FINAL LOG", res)
  }


  return (
    <div>

      {/* BOTON QUE CUANDO LE DE CLICK INVOQUE AL ACTIONS SEND EMAIL */}
      <button
        onClick={handleSendEmail}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        >
        Enviar correo
        </button>
    </div>
  );
}
