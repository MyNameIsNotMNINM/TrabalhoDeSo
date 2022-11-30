import { Process } from "../core/systemManager";
import {pickRandomColor} from "../core/utils/processColors";
import ProcessSquare from "./shared/processSquare";

interface ProcessTimeStep{
  runningProcessId: number,
  coreId: number,
};

interface GanttProps{
  processTimeline: ProcessTimeStep[],
  processes: number,
};

const Gantt = (props: GanttProps) => {
  const renderProcesses = ()=>{
    let labels = [];
    for (let index = 0; index < props.processTimeline.length; index++) {
      labels.push(
        <div className="text-sm text-center w-full" key={`clock:${index}`} 
          style={{gridRow: 1, gridColumn: index+2}}>
          {index}
        </div>
      )
    }
    for (let index = 0; index < props.processes; index++) {
      labels.push(
        <div className="text-sm text-center w-full " key={`pid:${index}`} 
          style={{gridRow: index+2, gridColumn: 1}}>
          p{index}
        </div>
      )
      
    }
    let tiles = props.processTimeline.map((element, index, arr) => {
      const isOverload = element.runningProcessId === -1;
      if(!isOverload)
        return <ProcessSquare pid={element.runningProcessId+10} key={index} className="w-full h-full rounded-lg bg-slate-600" style={{gridRow: element.runningProcessId+1, gridColumn: index+2}}>
        </ProcessSquare>
      return <ProcessSquare color="red" pid={0} key={index} className="w-full h-full rounded-lg bg-slate-600 text-center" style={{gridRow: 1, gridColumn: index+2}}>
        
      </ProcessSquare>
    })

    return [ ...labels, ...tiles]; 
  }
  return (
    <div style={{ width: ``}}>
      
      <div className="grid gap-y-1 rounded-sm shadow-md w-screen overflow-auto" style={{gridAutoColumns: `2rem`}}>
        {renderProcesses()}
      </div>
    </div>
  )
};

export default Gantt;
export type {ProcessTimeStep};