import { getPlanes } from "@/actions/plan/get-planes"
import Planes from "@/components/Planes"

const page = async () => {

  const response = await getPlanes()

  return (
      <Planes planes={response.planes ?? []} />
  )
}

export default page