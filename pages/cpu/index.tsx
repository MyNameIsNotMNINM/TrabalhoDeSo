import { MemorySchedulingAlgs } from "../../src/core/pageSwapper";
import { SchedulingAlgs } from "../../src/core/scheduler";
import CPU, { Process } from "../../src/core/systemManager"

const cpu = new CPU(SchedulingAlgs.RR, 3, 2, MemorySchedulingAlgs.FIFO);

function randomBetween(a: number, b: number){
  return Math.floor(Math.random() * (b - a) + a)
}

function ProcessFabric(): Process{
  return {
    creationTime: randomBetween(0, 1),
    executionTime: randomBetween(5,5),
    deadline: 10,
    priority: 10,
    lastProcessed: Number.NEGATIVE_INFINITY,
    pageCount: 10,
    clocksProcessed: 0
  }
}
cpu.AddProcess(ProcessFabric())
cpu.AddProcess(ProcessFabric())
cpu.AddProcess(ProcessFabric())
cpu.AddProcess(ProcessFabric())
cpu.AddProcess(ProcessFabric())

export default function Cpu() {
  const clock = ()=> {
    console.log(cpu.getCPUContext());
    cpu.Clock();
  };
  
  
  return <>
    <button onClick={ clock }>kkkk  </button>
  </>
}
