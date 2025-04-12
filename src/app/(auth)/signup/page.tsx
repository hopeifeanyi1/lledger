import React from 'react'
import Image from 'next/image'
import { Intro } from '../../../../public/svgs'

const page = () => {
  return (
    <div>
      <Image src={Intro} alt=''/>
    </div>
  )
}

export default page
