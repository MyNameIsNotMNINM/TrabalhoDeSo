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

  private static fifoSort(processes: Process[]){
    return [... processes].sort((a,b) => a.priority - b.priority);
  }
  private static sjfSort(processes: Process[]){
    return processes.sort((a, b) =>  {
      const primary = a.priority - b.priority;
      if(!primary)
        return a.executionTime - b.executionTime
      return primary
    });
  }
  private static rrSort(processes: Process[]){
    return processes.sort((a, b) => {
      const primary = a.priority - b.priority;
      if(!primary)
        return a.lastProcessed - b.lastProcessed 
      return primary
    });
  }
  private static edfSort(processes: Process[]){
    return processes.sort((a, b) =>  {
      const primary = a.priority - b.priority;
      if(!primary)
        return a.deadline - b.deadline
      return primary
    });
  }
}

export default Scheduler;
export {SchedulingAlgs};