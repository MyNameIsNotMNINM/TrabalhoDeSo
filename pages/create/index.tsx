import { useEffect, useState } from "react";
import Gantt, { ProcessTimeStep } from "../../src/components/gantt";
import MemoryVisualizer from "../../src/components/memoryVisualizer"
import ProcessCreator from "../../src/components/processCreator";
import CPU, { Process } from "../../src/core/systemManager"


export default function Home(props: any) {
  const [cpu, setCpu] = useState<CPU|null>(null);
  const [timeline, setTimeline] = useState<ProcessTimeStep[]>([]);

  return (
    <>
      {
        !cpu && <ProcessCreator onFinished={setCpu}/>
      }
      {
        cpu && 
        <div className="flex flex-col gap-2 h-screen w-screen p-5">
          <button onClick={()=>{
              cpu.Clock();
              setTimeline([...timeline, { runningProcessId: cpu.runningProcess?.pid || -1, coreId: 1}])
            }} className="p-3 bg-green-500 text-white w-[calc(100%-1rem)] rounded mb-2">Clock</button>
            <div className="flex w-full h-2/3">
              <Gantt processTimeline={timeline} processes={cpu.processes.length}></Gantt>
            </div>
            <div className="flex flex-col gap-2 w-full h-1/3 overflow-scroll">
              <h1 className=" text-lg font-bold">Primary:</h1>
              <MemoryVisualizer pages={cpu.mmu.primaryMemory}></MemoryVisualizer>
              <h1 className=" text-lg font-bold">Secondary:</h1>
              <MemoryVisualizer pages={cpu.mmu.secondaryMemory}></MemoryVisualizer>
            </div>
            
        </div>
      }

    </>
  )
}

export async function getStaticProps(){
  return {
    props: {
    }, // will be passed to the page component as props
  }
}
