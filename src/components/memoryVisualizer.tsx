import { Process } from "../core/systemManager";
import {getRandomColor, pickRandomColor} from "../core/utils/processColors";
import ProcessSquare from "./shared/processSquare";

interface Page{
  processes: Process[];
  pageId: number;
}

interface MemoryVisualizerProps{
  pages: Page[],
  size?: number, 
};

const MemoryVisualizer = (props: MemoryVisualizerProps) => {
  const PageSquare = (p: Page)=>(
    <div className="rounded border" style={{ borderColor: getRandomColor(100+p.pageId)}}>
      {p.pageId}
    </div>
  )
  return (
    <div style={{ width: ``}}>
      <div className="flex flex-col gap-1" style={{gridAutoColumns: `2rem`}}>
        { 
          props.pages.map(e => {
            return PageSquare(e);
          })
        }
      </div>
    </div>
  )
};

export default MemoryVisualizer;
export type {Page};