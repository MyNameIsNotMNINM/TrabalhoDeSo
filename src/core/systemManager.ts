import Scheduler, { SchedulingAlgs } from "./scheduler";

interface Process {
    pid?: number,
    creationTime: number,
    executionTime: number,
    deadline: number,
    priority: number,
    clocksProcessed?: number
}

class CPU {
    quantum: number;
    lastQuantum: number = 0;
    currentClock: number = 0;
    overload: number;
    schedulingAlg: SchedulingAlgs;
    processQueue: Process[] = [];
    processes: Process[] = [];
    runningProcess: Process|null = null;
    static pid_count = 1;
    
    constructor(sa: SchedulingAlgs, quantum: number, overload: number){
        this.quantum = quantum;
        this.schedulingAlg = sa;
        this.overload = overload;
    }

    AddProcess(process: Process){
        process.clocksProcessed = 0;
        process.pid = CPU.pid_count;
        CPU.pid_count++;
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
                this.processQueue = Scheduler.sortProcesses(this.schedulingAlg, this.processQueue);
            }
        });
        if(this.runningProcess){
            if(!this.runningProcess.clocksProcessed)
                return;
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