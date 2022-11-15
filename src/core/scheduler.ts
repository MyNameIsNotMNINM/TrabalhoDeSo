import { Process } from "./systemManager";

enum SchedulingAlgs {
  FIFO,
  SJF,
  RR,
  EDF,
}

class Scheduler{
  static algomapper = {
    0: Scheduler.fifo,
    1: Scheduler.sjf,
    2: Scheduler.rr,
    3: Scheduler.edf
  }

  static sortProcesses(algorithm: SchedulingAlgs, processes: Process[]){
    this.algomapper[algorithm](processes);
  }

  static fifo(processes: Process[]){

  }
  static sjf(processes: Process[]){
    
  }
  static rr(processes: Process[]){
    
  }
  static edf(processes: Process[]){
    
  }
}

export default Scheduler;

export type { SchedulingAlgs };
