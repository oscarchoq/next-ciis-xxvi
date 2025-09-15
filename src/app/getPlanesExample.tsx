import { getPlanes } from '@/actions/get-planes'
import React from 'react'

export const GetPlanesExample = async () => {

  const planes = await getPlanes()
  console.log(planes)
  return (
    <div>
      <h1>Planes</h1>
      <pre>{JSON.stringify(planes, null, 2)}</pre>
    </div>
  )
}
