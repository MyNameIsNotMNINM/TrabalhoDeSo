import { useEffect, useState } from "react";
import { MemorySchedulingAlgs } from "../core/pageSwapper";
import { SchedulingAlgs } from "../core/scheduler";
import CPU, { Process } from "../core/systemManager";
import {getRandomColor, pickRandomColor} from "../core/utils/processColors";
import RightSideModal from "./page-layout/rightSideModal";

interface CreateDTO {
  creationTime: number,
  executionTime: number,
  deadline: number,
  priority: number,
  pageCount: number
}

const newProcess = (props: {onCreate: (a:CreateDTO)=>void}) => {
  const [creationTime, setCreationTime] = useState<number>(0);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [deadline, setDeadline] = useState<number>(0);
  const [priority, setPriority] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  return (
    <div className="flex flex-col gap-4 p-3">
      <h1 className="text-lg font-bold font">Novo Processo:</h1>
      <div className="flex gap-5">
        <label htmlFor="creationTime">creationTime: </label>
        <input type="number" id="creationTime" value={creationTime} onChange={e => setCreationTime(parseFloat(e.target.value))}/>
      </div>
      <div className="flex gap-5">
        <label htmlFor="executionTime">executionTime: </label>
        <input type="number" id="executionTime" value={executionTime} onChange={e => setExecutionTime(parseFloat(e.target.value))}/>
      </div>
      <div className="flex gap-5">
        <label htmlFor="deadline">deadline: </label>
        <input type="number" id="deadline" value={deadline} onChange={e => setDeadline(parseFloat(e.target.value))}/>
      </div>
      <div className="flex gap-5">
        <label htmlFor="priority">priority: </label>
        <input type="number" id="priority" value={priority} onChange={e => setPriority(parseFloat(e.target.value))}/>
      </div>
      <div className="flex gap-5">
        <label htmlFor="pageCount">pageCount: </label>
        <input type="number" id="pageCount" value={pageCount} onChange={e => setPageCount(parseFloat(e.target.value))}/>
      </div>
      <button onClick={()=>props.onCreate({
        creationTime,
        executionTime,
        deadline,
        priority,
        pageCount,
      })} className="p-3 bg-slate-800 text-white">Create New Process</button>
    </div>
    );
}

const ProcessShower = (props: {process: Process, index: number})=>{
  return (
    <div className="flex gap-4 p-3">
      <h1 className="text-md font-bold font">{props.index}</h1>
      <div className="flex gap-3">
        <h1>{props.process.creationTime}</h1>
        <h1>{props.process.executionTime}</h1>
        <h1>{props.process.deadline}</h1>
        <h1>{props.process.priority}</h1>
        <h1>{props.process.pageCount}</h1>
      </div>
    </div>
    );
}

interface ProcessCreatorProps{
  onFinished: (a: CPU) => void,
};

interface ProcessCreatorDTO{
  processes: Process[],
  schedulingAlgorithm: SchedulingAlgs,
  memoryAlgorithm: MemorySchedulingAlgs,
  quantum: number,
  overload: number,
}

const ProcessCreator = (props: ProcessCreatorProps) => {
  const [data, setData] = useState<ProcessCreatorDTO>({
    processes: [],
    schedulingAlgorithm: SchedulingAlgs.FIFO,
    memoryAlgorithm: MemorySchedulingAlgs.FIFO,
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

  function onCreateNewProcess(obj: CreateDTO){
    let newData: ProcessCreatorDTO = {... data};
    newData.processes.push(
      {
        ...obj,
        clocksProcessed: 0, 
        lastProcessed: 0
      }
    );
  }

  useEffect(() => {
    
  }, [data])
  

  return (
    <RightSideModal enabled={true}>
      <div className="flex flex-col gap-4 p-3">
        <h1 className="text-lg font-bold font">Configurações:</h1>
        <div className="flex gap-5">
          <label htmlFor="quantum">quantum: </label>
          <input type="number" value={data.quantum}  onChange={
            e => {
              modifyCPUData(
                {"quantum":parseFloat(e.target.value)}
                )
            }
          }/>
        </div>
        <div className="flex gap-5">
          <label htmlFor="overload">overload: </label>
          <input type="number" value={data.overload}  onChange={
              e => {
                modifyCPUData(
                  {"overload":parseFloat(e.target.value)}
                  )
              }
            }/>
        </div>
        <div className="flex gap-5">
          <label htmlFor="schedulingAlgorithm">schedulingAlgorithm: </label>
          <select value={data.schedulingAlgorithm} onChange={
              e => { modifyCPUData({"schedulingAlgorithm":parseFloat(e.target.value)}) }}>
              <option value={0}>FIFO</option>
              <option value={1}>SJF</option>
              <option value={2}>RR</option>
              <option value={3}>EDF</option>
          </select>
        </div>
        <div className="flex gap-5">
          <label htmlFor="memoryAlgorithm">memoryAlgorithm: </label>
          <select value={data.memoryAlgorithm} onChange={
              e => {
                modifyCPUData(
                  {"memoryAlgorithm":parseFloat(e.target.value)|| 0}
                  )
              }
            }>
              <option value={0}>FIFO</option>
              <option value={1}>LUF</option>
          </select>
        </div>
      </div>



      {newProcess({onCreate:onCreateNewProcess})}
      
      {
        data.processes.map((process, index) => <ProcessShower process={process} index={index} key={index}/>)
      }
      <button onClick={()=>{
        const cpu = new CPU(data.schedulingAlgorithm, data.quantum, data.overload, data.memoryAlgorithm);
        data.processes.forEach(e => cpu.AddProcess(e));
        props.onFinished(cpu)
      }} className="p-3 bg-green-500 text-white absolute bottom-0 w-[calc(100%-1rem)] rounded mb-2">Emulate</button>
    </RightSideModal>
  );
};




export default ProcessCreator;