import { Process } from "./systemManager";

enum SchedulingAlgs {
  FIFO,
  SJF,
  RR,
  EDF,
}

class Scheduler{
  private static algomapper = {
    0: Scheduler.fifoSort,
    1: Scheduler.sjfSort,
    2: Scheduler.rrSort,
    3: Scheduler.edfSort
  }

  static algorithmHasTimeSharing(algorithm: SchedulingAlgs) : boolean {
    return {
      0: false,
      1: false,
      2: true,
      3: true,
    }[algorithm];
  }

  static sortProcesses(algorithm: SchedulingAlgs, processes: Process[]): Process[]{
    return Scheduler.algomapper[algorithm](processes);
  }

  static onQuantum(algorithm: SchedulingAlgs, processes: Process[]){
    
  }

  private static fifoSort(processes: Process[]){
    return processes;
  }
  private static sjfSort(processes: Process[]){
    return processes.sort((a, b) =>  a.executionTime - b.executionTime);
  }
  private static rrSort(processes: Process[]){
    return processes
  }
  private static edfSort(processes: Process[]){
    return processes.sort((a, b) =>  a.deadline - b.deadline);
  }
}

export default Scheduler;

export type { SchedulingAlgs };
