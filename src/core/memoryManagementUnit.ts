import CPU, { Process } from "./systemManager"
import PageSwapper, { MemorySchedulingAlgs } from "./pageSwapper";

interface Page{
  process: Process,
  lastAccessed: number,
  enteredPrimary: number,
};

interface memoryTableItem{
  virtualAddress: number,
  realAddress: number,
  isPaginated: boolean,
};


type FilterFunction = (page:memoryTableItem)=> boolean;


class MMU {
  memoryTable: memoryTableItem[] = [];
  private maxPrimaryMemory: number = 40;
  primaryMemory: (Page | null)[] = Array(this.maxPrimaryMemory).fill(null);
  secondaryMemory: (Page | null)[] = [];
  private memorySchedulingAlgorithm: MemorySchedulingAlgs;
  //endereços disponiveis
  private secondaryMemoryAddressCount: number = 0;
  private virtualMemoryAddressCount: number = 0;
  private avaiableSecondaryMemory: number[] = [];
  private avaiableVirtualMemory: number[] = [];
  private processMemoryMap: {[key: number]: number[]} = {};
  private cpu: CPU;

  constructor(memorySchedulingAlgorithm: MemorySchedulingAlgs, cpu: CPU) {
    this.memorySchedulingAlgorithm = memorySchedulingAlgorithm;
    this.cpu = cpu;
    
  }


  private getAvaiableVirtualAddress(): number {
    if (this.avaiableVirtualMemory.length)
      return this.avaiableVirtualMemory.pop() as number;
    return this.virtualMemoryAddressCount++;
  }

  getAvaiableSecondaryAddress(): number {
    if (this.avaiableSecondaryMemory.length)
      return this.avaiableSecondaryMemory.pop() as number;
    return this.secondaryMemoryAddressCount++;
  }

  firstAvailablePrimaryMemoryPage(): number | null {
    for (let index = 0; index < this.primaryMemory.length; index++) {
      if (!this.primaryMemory[index])
        return index;
    }
    return null;
  }

  deleteProcess(process: Process){
    let indexesToBeRemoved: memoryTableItem[] = [];
    this.processMemoryMap[process.pid as number].forEach(virtualAddress =>{
      const e = this.getMemoryTableItemFromVirtualAddress(virtualAddress) as memoryTableItem;
      if(!e.isPaginated)
        this.primaryMemory[e.realAddress] = null;
      else
        this.secondaryMemory[e.realAddress] = null;
      indexesToBeRemoved.push(e)
    })
    indexesToBeRemoved.forEach(e=>this.memoryTable.splice(this.memoryTable.indexOf(e), 1))
    this.processMemoryMap[process.pid as number] = [];
  }

  private getMemoryTableItemFromVirtualAddress(virtualAddress: number){
    return this.memoryTable.find(e => e.virtualAddress === virtualAddress)
  }

  allocateMemory(process: Process, amount: number, currentClock: number): Page[] {
    this.processMemoryMap[process.pid as number] = [];
    const pages = this.createPages(process, amount, currentClock);
    pages.forEach(page => {
      const virtualAdress = this.registerPage(page)
      this.processMemoryMap[process.pid as number].push(virtualAdress);
    })
    return pages;
  }

  createPages(process: Process, amount: number, currentClock: number) {
    const pages: Page[] = [];
    for (let index = 0; index < amount; index++) {
      pages.push({
        process,
        lastAccessed: currentClock,
        enteredPrimary: currentClock,
      });
    }
    return pages;
  }

  registerPage(page: Page) {
    let avaiablePosition = this.firstAvailablePrimaryMemoryPage();
    if (avaiablePosition === null) {
      //paginate to open space on primary memory
      avaiablePosition = this.paginatePrimaryMemory(p => !p.isPaginated);
    }
    let virtualAddress = this.getAvaiableVirtualAddress();
    this.memoryTable.push({
      virtualAddress: virtualAddress,
      realAddress: avaiablePosition as number,
      isPaginated: false,
    });
    this.primaryMemory[avaiablePosition as number] = page;
    return virtualAddress;
  }

  paginatePrimaryMemory(filterFunction: FilterFunction): number {

    const itensInPrimaryMemory = this.memoryTable.filter(filterFunction)
    let itensInPrimaryMemoryAlloweds = [] as (memoryTableItem)[];
    let pages = [] as (Page)[];

    for (let index = 0; index < itensInPrimaryMemory.length; index++) {
      let page = this.primaryMemory[itensInPrimaryMemory[index].realAddress];
      if (page?.process.pid != this.cpu.runningProcess?.pid) {
        pages.push(this.primaryMemory[itensInPrimaryMemory[index].realAddress] as Page)
        itensInPrimaryMemoryAlloweds.push(itensInPrimaryMemory[index]);
      }
    }
    let allowedPage = PageSwapper.getAllowedPage(this.memorySchedulingAlgorithm, pages, itensInPrimaryMemoryAlloweds);
    const memoryItemIndex = this.memoryTable.indexOf(allowedPage.memoryTableItem);
    const primaryMemoryAddress = this.memoryTable[memoryItemIndex].realAddress;
    this.movePageTosecondaryMemory(allowedPage.page, memoryItemIndex);
    return primaryMemoryAddress;
  }

  movePageToPrimaryMemory(page: Page, memoryTableItemIndex: number) {
    let avaiablePosition = this.firstAvailablePrimaryMemoryPage();
    if (!avaiablePosition) {
      //paginate to open space on primary memory
      avaiablePosition = this.paginatePrimaryMemory(p => !p.isPaginated);
    }
    page.enteredPrimary = this.cpu.currentClock;
    page.lastAccessed = this.cpu.currentClock;
    this.primaryMemory[avaiablePosition] = page;
    this.secondaryMemory[this.memoryTable[memoryTableItemIndex].realAddress] = null;
    this.avaiableSecondaryMemory.push(this.memoryTable[memoryTableItemIndex].realAddress);
    this.memoryTable[memoryTableItemIndex].realAddress = avaiablePosition;
    this.memoryTable[memoryTableItemIndex].isPaginated = false;
  }
  movePageTosecondaryMemory(page: Page, memoryTableItemIndex: number) {
    let avaiableSecondaryAddress = this.getAvaiableSecondaryAddress();
    this.secondaryMemory[avaiableSecondaryAddress] = page;
    this.memoryTable[memoryTableItemIndex].realAddress = avaiableSecondaryAddress;
    this.memoryTable[memoryTableItemIndex].isPaginated = true;
  }
  movePagesToPrimaryMemory(pages: Page[], memoryTableItemIndex: number[]) {
    pages.forEach((p, index) => this.movePageToPrimaryMemory(p, memoryTableItemIndex[index]));
  }

  getAllPagesFromProcess(process: Process): {page: Page, memoryTableItem: memoryTableItem,  memoryTableItemIndex: number}[] {
    let pages = [] as {page: Page, memoryTableItem: memoryTableItem, memoryTableItemIndex: number}[];
    this.memoryTable.forEach((mt, index) => {
      let actPage: Page;
      if (mt.isPaginated) {
        actPage = this.secondaryMemory[mt.realAddress] as Page;
      } else {
        actPage = this.primaryMemory[mt.realAddress] as Page;
      }
      if (actPage.process.pid == process.pid) {
        pages.push({ page: actPage , memoryTableItem: mt, memoryTableItemIndex: index});
      }
    });
    return pages;
  }

  pushProcessToPrimaryMemory(process: Process): boolean {
      let pagesFromProcess = this.getAllPagesFromProcess(process);
      for (let index = 0; index < pagesFromProcess.length; index++) {
        let pageFromProcess = pagesFromProcess[index];
      if (pageFromProcess.memoryTableItem.isPaginated) {
        this.movePageToPrimaryMemory(pageFromProcess.page, pageFromProcess.memoryTableItemIndex);
      } else {
        pageFromProcess.page.lastAccessed = this.cpu.currentClock;
        this.primaryMemory[pageFromProcess.memoryTableItem.realAddress] = pageFromProcess.page;
      }
    }
    return true;
  }

}

export default MMU
export type { Page, memoryTableItem };