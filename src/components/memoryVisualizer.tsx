import { useContext } from "react";
import PidContext from "../context/processContext";
import { Page } from "../core/memoryManagementUnit";
import { Process } from "../core/systemManager";
import {getRandomColor, pickRandomColor} from "../core/utils/processColors";
import useHover from "../hooks/useHover";
import ProcessSquare from "./shared/processSquare";


interface MemoryVisualizerProps{
  pages: (Page|null)[],
};

const MemoryVisualizer = (props: MemoryVisualizerProps) => {
  const PageSquare = (p: Page|null)=>{
    const {pid, setPid} = useContext(PidContext);
    const selectedStyle = pid == p?.process.pid ? "border border-2 border-white scale-[1.3]" : ""
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();
    if(isHovered){
      setPid(p?.process.pid)
    }
    if(p !== null)
      return <div ref={hoverRef} className={`rounded border min-h-5 h-full w-full min-w-5 px-1 ${selectedStyle}`} style={{ backgroundColor: getRandomColor(p.process.pid as number + 10)}}></div>
    return <div ref={hoverRef} className={`rounded border min-h-5 h-full w-full min-w-5 px-1 ${selectedStyle}` }style={{ backgroundColor: "white"}}></div>
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