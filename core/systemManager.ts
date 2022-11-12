interface Process {
    pid?: number,
    creationTime: number,
    executionTime: number,
    deadline: number,
    priority: number
}

enum SchedulingAlgs {
    FIFO,
    SJF,
    RR,
    EDF,
}
class CPU {
    quantum: number;
    schedulingAlg: SchedulingAlgs;
    processQueue: Process[] = [];
    processes: Process[] = [];
    constructor(quantum:number = 2,sa: SchedulingAlgs){
        this.quantum = quantum;
        this.schedulingAlg = sa;
    }

    AddProcess(process: Process){
        this.processes.push(process);
    }

}

export default CPU;