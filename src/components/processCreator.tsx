import { useState } from "react";
import { SchedulingAlgs } from "../core/scheduler";
import { Process } from "../core/systemManager";
import {getRandomColor, pickRandomColor} from "../core/utils/processColors";
import RightSideModal from "./page-layout/rightSideModal";

interface ProcessCreatorProps{
};
// creationTime: number,
// executionTime: number,
// deadline: number,
// priority: number,

interface ProcessCreatorDTO{
  processes: Process[],
  schedulingAlgorithm: SchedulingAlgs,
  quantum: number,
  overload: number,
}

const ProcessCreator = (props: ProcessCreatorProps) => {
  const [data, setData] = useState<ProcessCreatorDTO>({
    processes: [],
    schedulingAlgorithm: SchedulingAlgs.FIFO,
    quantum: 1,
    overload: 1,
  });

  function modifyCPUData(modifiedData: {[Key: string]: any}){
    let newData: any = {... data};
    Object.entries(modifiedData).forEach(entry => {
      newData[entry[0]] = entry[1];
    });
    setData(newData);
  }

  return (
    <RightSideModal enabled={true}>
      <input type="text" value={data.quantum}  onChange={
        e => {
          modifyCPUData(
            {"quantum":parseFloat(e.target.value)|| 0}
            )
        }
      }/>
    </RightSideModal>
  );
};

export default ProcessCreator;