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
    quantumEnd: number = number.MIN_VALUE;
    currentClock: number = 0;
    overload: number;
    schedulingAlg: SchedulingAlgs;
    processQueue: Process[] = [];
    processes: Process[] = [];
    runningProcess: Process | null = null;
    overloadEnd: number = Number.MIN_VALUE;
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

    Clock() {
        this.spawnProcess();

        if(this.hasQuantumEnded() && Scheduler.algorithmHasTimeSharing(this.schedulingAlg)){
            if(this.runningProcess){
                this.processQueue.unshift(this.runningProcess);
                this.processQueue = Scheduler.sortProcesses(this.schedulingAlg, this.processQueue);
                this.overloadEnd = this.currentClock + this.quantum;
            }
        }
        if (this.hasOverloadEnded() && !this.runningProcess)
        {
            this.changeContext(this.PopNextProcess());
            this.runProcess();   
        }
        this.currentClock++;
    }

    private spawnProcess() {
        this.processes.forEach(element => {
            if (element.creationTime == this.currentClock){
                this.processQueue.push(element);
                this.processQueue = Scheduler.sortProcesses(this.schedulingAlg, this.processQueue);
            }
        });
    }

    getCPUContext(){
        return {
            processQueue: [ ... this.processQueue ],
            runningProcess: this.runningProcess,
        }
    }

    private runProcess() {
        if (this.runningProcess) {
            this.runningProcess.clocksProcessed++;
            if (this.runningProcess.clocksProcessed >= this.runningProcess.executionTime)
                this.runningProcess = null;
        }
    }

    private hasQuantumEnded(){
        return this.currentClock >= this.quantumEnd;
    }

    private changeContext(process: Process | undefined){
        this.runningProcess = process || null;
        this.quantumEnd = this.currentClock + this.quantum;
    }

    private PopNextProcess(): Process | undefined{
        return this.processQueue.shift()
    }

    private hasOverloadEnded() {
        return this.overloadEnd <= this.currentClock;
    }

    getOverloadProcess() {
        return {
            pid: -1,
            creationTime: this.currentClock,
            executionTime: this.overload,
            deadline: 0,
            priority: 0,
            clocksProcessed: 0
        }
    }
}

export default CPU; 
export type { Process };