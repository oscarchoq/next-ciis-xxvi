"use server";

export const getDataByDNI = async (documentNumber: string) => {
  try {

    const response = await fetch(
      `https://api.perudevs.com/api/v1/dni/simple?document=${documentNumber}&key=${process.env.RENIEC_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error("Error al obtener los datos del DNI");
    }

    const data = await response.json();

    if (!data.estado) {
      throw new Error("No se encontraron datos para el DNI proporcionado");
    }

    const { nombres, apellido_paterno, apellido_materno } = data.resultado;

    // Validar que el nombre no esté vacío
    if (!nombres || nombres.trim() === "") {
      throw new Error("No se encontraron datos para el DNI proporcionado");
    }

    return {
      nombres,
      apellidos: `${apellido_paterno} ${apellido_materno}`,
    };


  } catch (error) {
    console.log(
      error
    )
    throw new Error("Error al obtener los datos del DNI");
  }
}