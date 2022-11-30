import { Page } from "../core/memoryManagementUnit";
import { Process } from "../core/systemManager";
import {getRandomColor, pickRandomColor} from "../core/utils/processColors";
import ProcessSquare from "./shared/processSquare";


interface MemoryVisualizerProps{
  pages: (Page|null)[],
};

const MemoryVisualizer = (props: MemoryVisualizerProps) => {
  console.log(props.pages)
  const PageSquare = (p: Page|null)=>{
    if(p !== null)
      return <div className="rounded border min-h-5 h-full w-full min-w-5 px-1" style={{ backgroundColor: getRandomColor(p.process.pid as number + 10)}}></div>
    return <div className="rounded border min-h-5 h-full w-full min-w-5 px-1" style={{ backgroundColor: "white"}}></div>
  }
  return (
      <div className="flex gap-[.2] w-full h-full" style={{gridAutoColumns: `2rem`}}>
        { 
          props.pages.map(e => {
            return PageSquare(e);
          })
        }
      </div>
  )
};

export default MemoryVisualizer;
export type {Page};