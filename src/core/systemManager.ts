import MMU from "./memoryManagementUnit";
import { MemorySchedulingAlgs } from "./pageSwapper";
import Scheduler, { SchedulingAlgs } from "./scheduler";

interface Process {
    pid?: number,
    creationTime: number,
    executionTime: number,
    deadline: number,
    priority: number,
    clocksProcessed: number,
    lastProcessed: number,
    pageCount: number,
    turnAround?: number,
}

class CPU {
    quantum: number;
    quantumEnd: number = Number.NEGATIVE_INFINITY;
    currentClock: number = 0;
    overload: number;
    schedulingAlg: SchedulingAlgs;
    processQueue: Process[] = [];
    processes: Process[] = [];
    runningProcess: Process | null = null;
    overloadEnd: number = Number.NEGATIVE_INFINITY;
    mmu: MMU;
    static pid_count = 1;
   
    constructor(sa: SchedulingAlgs, quantum: number, overload: number, memorySchedulingAlgorithm: MemorySchedulingAlgs){
        this.quantum = quantum;
        this.schedulingAlg = sa;
        this.overload = overload;
        this.mmu = new MMU(memorySchedulingAlgorithm, this);
    }

    AddProcess(process: Process){
        process.clocksProcessed = 0;
        process.pid = CPU.pid_count;
        process.turnAround = 0;
        CPU.pid_count++;
        this.processes.push(process);
    }

    Clock() {
        console.log([...this.mmu.primaryMemory], [...this.mmu.secondaryMemory])
        console.log(this.runningProcess, [...this.processQueue]);
        console.log(`pid: ${this.runningProcess?.pid}`);
        console.log([...this.mmu.memoryTable])
        console.error("clockend");
        if (this.hasProcessEnded()){
            if (this.runningProcess)
                this.mmu.deleteProcess(this.runningProcess);
            this.runningProcess = null;
        }
        this.spawnProcess();
        
        if(this.hasQuantumEnded() || this.hasProcessEnded()){
            if(this.runningProcess){
                this.processQueue.unshift(this.runningProcess);
                this.runningProcess = null;
                if (Scheduler.algorithmHasTimeSharing(this.schedulingAlg)) {
                    this.beginOverload();
                }
            }
            if(this.hasOverloadEnded())
                this.changeContext(this.PopNextProcess());
        }
        
        this.runProcess();   
        
        this.calculateTurnAround();

        this.currentClock++;
    }

    private beginOverload() {
        this.overloadEnd = this.currentClock + this.overload;
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
                this.mmu.allocateMemory(element, element.pageCount, this.currentClock);
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
            this.mmu.pushProcessToPrimaryMemory(this.runningProcess)
            this.runningProcess.lastProcessed = this.currentClock;
            this.runningProcess.clocksProcessed++;
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
    private hasProcessEnded() {
        return !this.runningProcess || this.runningProcess.clocksProcessed >= this.runningProcess.executionTime;
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