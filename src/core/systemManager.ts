import Scheduler, { SchedulingAlgs } from "./scheduler";

interface Process {
    pid?: number,
    creationTime: number,
    executionTime: number,
    deadline: number,
    priority: number,
    clocksProcessed: number
}

class CPU {
    quantum: number;
    lastQuantum: number = 0;
    currentClock: number = 0;

    schedulingAlg: SchedulingAlgs;
    processQueue: Process[] = [];
    processes: Process[] = [];
    runningProcess: Process|null = null;

    constructor(quantum: number = 2,sa: SchedulingAlgs){
        this.quantum = quantum;
        this.schedulingAlg = sa;
    }

    AddProcess(process: Process){
        this.processes.push(process);
    }

    Clock(){
        if(this.hasQuantumEnded()){
            if(this.runningProcess){
                this.processQueue.unshift(this.runningProcess);
                this.processQueue =Scheduler.sortProcesses(this.schedulingAlg, this.processQueue);
            }
            this.changeContext(this.PopNextProcess());
            return;
        }
        this.processes.forEach(element => {
            if (element.creationTime == this.currentClock){
                this.processQueue.push(element);
                this.processQueue =Scheduler.sortProcesses(this.schedulingAlg, this.processQueue);
            }
        });
        if(this.runningProcess){
            this.runningProcess.clocksProcessed++;
            if(this.runningProcess.clocksProcessed >= this.runningProcess.executionTime)
                this.runningProcess = null;
            return;
        }
        this.currentClock++;
    }

    getCPUContext(){
        return {
            processQueue: [ ... this.processQueue ],
            runningProcess: this.runningProcess,
        }
    }

    private hasQuantumEnded(){
        return this.currentClock - this.lastQuantum >= this.quantum;
    }

    private changeContext(process: Process | undefined){
        this.runningProcess = process || null;

    }

    private PopNextProcess(): Process | undefined{
        return this.processQueue.shift()
    }

}

export default CPU; 
export type { Process };