import MemoryVisualizer, { Page } from "../../src/components/memoryVisualizer"
import { Process } from "../../src/core/systemManager"


const newProcess = (): Process=>{
  return {
      pid: 1,
      creationTime: 1,
      executionTime: 1,
      deadline: 1,
      priority: 1,
      clocksProcessed: 1,
  }
}
let pageCount = 0;

const newPage = (): Page => {
  const processes: Process[] = [];
  for (let index = 0; index < Math.floor(Math.random()*5); index++) {
    processes.push(newProcess());
  }
  return {
    processes: processes,
    pageId: ++pageCount,
  }
}


export default function Home(props: any) {
  if(typeof window == undefined)
    return <></>
  const pages: Page[] = []
  for (let index = 0; index < props.m; index++) {
    pages.push(newPage());
  }
  return (
    <div className="h-screen w-screen flex">

      <aside className="w-2/5 h-full rounded border">
        <MemoryVisualizer pages={pages}></MemoryVisualizer>
      </aside>
      <aside className="w-2/5 h-full rounded border">
        a
      </aside>
      <aside className="w-1/5 h-full rounded border">
        a
      </aside>
    </div>
  )
}

export async function getStaticProps(){
  return {
    props: {
      m: Math.floor(Math.random()*15),
    }, // will be passed to the page component as props
  }
}
