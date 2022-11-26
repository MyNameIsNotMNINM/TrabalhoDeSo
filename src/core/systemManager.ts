import Scheduler, { SchedulingAlgs } from "./scheduler";

interface Process {
    pid?: number,
    creationTime: number,
    executionTime: number,
    deadline: number,
    priority: number,
    clocksProcessed: number,
    turnAround?: number,
}

class CPU {
    quantum: number;
    quantumEnd: number = Number.MIN_VALUE;
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
        process.turnAround = 0;
        CPU.pid_count++;
        this.processes.push(process);
    }

    Clock() {
        this.spawnProcess();
        
        if(this.hasQuantumEnded()){
            if(this.runningProcess){
                this.processQueue.unshift(this.runningProcess);
                this.runningProcess = null;
                if (Scheduler.algorithmHasTimeSharing(this.schedulingAlg)) {
                    this.beginOverload();
                }
            }
            this.changeContext(this.PopNextProcess());
        }

        this.runProcess();   
        
        this.calculateTurnAround();

        this.currentClock++;
    }

    private beginOverload() {
        this.overloadEnd = this.currentClock + this.quantum;
    }

    private calculateTurnAround() {
        this.processes.forEach(process => {
            process.turnAround = process.turnAround ? process.turnAround : 0;
            if (this.runningProcess
                && this.runningProcess.pid == process.pid
                && this.processQueue.findIndex(a => a.pid == process.pid)) {
                process.turnAround += 1;
            }
        });
    }

    private spawnProcess() {
        this.processes.forEach(element => {
            if (element.creationTime == this.currentClock){
                this.processQueue.push(element);
                this.processQueue = Scheduler.sortProcesses(this.schedulingAlg, this.processQueue);
            }
        });
    }

    getRelativeTurnAround() {
        let sumTurnAround = 0;
        this.processes.forEach(p => {
            sumTurnAround += (p.turnAround ? p.turnAround : 0);
        });
        return sumTurnAround / this.processes.length;
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

    private changeContext(process: Process | undefined) {
        if (this.hasOverloadEnded()) {
            this.runningProcess = process || null;
            this.quantumEnd = this.currentClock + this.quantum;
        }
    }

    private PopNextProcess(): Process | undefined{
        this.processQueue = Scheduler.sortProcesses(this.schedulingAlg, this.processQueue);
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