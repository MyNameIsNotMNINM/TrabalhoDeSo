import { useEffect, useState } from "react";
import MemoryVisualizer, { Page } from "../../src/components/memoryVisualizer"
import ProcessCreator from "../../src/components/processCreator";
import { Process } from "../../src/core/systemManager"


export default function Home(props: any) {
  return (
    <ProcessCreator/>
  )
}

export async function getStaticProps(){
  return {
    props: {
    }, // will be passed to the page component as props
  }
}
