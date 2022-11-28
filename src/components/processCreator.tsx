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
  const [data, setData] = useState<ProcessCreatorDTO>();
  return (
    <RightSideModal enabled={true}>

    </RightSideModal>
  );
};

export default ProcessCreator;