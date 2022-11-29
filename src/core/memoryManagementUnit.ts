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
  private memoryTable: memoryTableItem[] = [];
  private maxPrimaryMemory: number = 40;
  private primaryMemory: (Page | null)[] = Array(this.maxPrimaryMemory).fill(null);
  private secondaryMemory: (Page | null)[] = [];
  private memorySchedulingAlgorithm: MemorySchedulingAlgs;
  //endereços disponiveis
  private secondaryMemoryAddressCount: number = 0;
  private virtualMemoryAddressCount: number = 0;
  private avaiableSecondaryMemory: number[] = [];
  private avaiableVirtualMemory: number[] = [];
  private processMemoryMap: any = {};
  private cpu: CPU;

  constructor(memorySchedulingAlgorithm: MemorySchedulingAlgs, cpu: CPU){
    this.memorySchedulingAlgorithm = memorySchedulingAlgorithm;
    this.cpu = cpu;
  }

  getAvaiableVirtualAddress(): number{
    if(this.avaiableVirtualMemory.length)
      return this.avaiableVirtualMemory.pop() as number;
    return this.virtualMemoryAddressCount++;
  }

  getAvaiableSecondaryAddress(): number{
    if(this.avaiableSecondaryMemory.length)
      return this.avaiableSecondaryMemory.pop() as number;
    return this.secondaryMemoryAddressCount++;
  }

  firstAvailablePrimaryMemoryPage(): number|null{
    for (let index = 0; index < this.primaryMemory.length; index++) {
      if(!this.primaryMemory[index])
        return index;
    }
    return null;
  }

  allocateMemory(process: Process, amount: number, currentClock: number): Page[]{
    this.processMemoryMap[process.pid as number] = [];
    const pages = this.createPages(process, amount, currentClock);
    pages.forEach(page=>{
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

  registerPage(page: Page){
    let avaiablePosition = this.firstAvailablePrimaryMemoryPage();
    if(!avaiablePosition){
      //paginate to open space on primary memory
      avaiablePosition = this.paginatePrimaryMemory(p => !p.isPaginated);
    }
    let virtualAddress = this.getAvaiableVirtualAddress();
    this.memoryTable.push({
      virtualAddress: this.getAvaiableVirtualAddress(),
      realAddress: avaiablePosition as number,
      isPaginated: false,
    });
    this.primaryMemory[avaiablePosition as number] = page;
    return virtualAddress;
  }

  paginatePrimaryMemory(filterFunction: FilterFunction): number{

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
    if(!avaiablePosition){
      //paginate to open space on primary memory
      avaiablePosition = this.paginatePrimaryMemory(p => !p.isPaginated);
    }
    this.primaryMemory[avaiablePosition] = page;
    this.memoryTable[memoryTableItemIndex].realAddress = avaiablePosition;
    this.memoryTable[memoryTableItemIndex].isPaginated = false;
  }
  movePageTosecondaryMemory(page: Page, memoryTableItemIndex: number){
    let avaiableSecondaryAddress = this.getAvaiableSecondaryAddress();
    this.secondaryMemory[avaiableSecondaryAddress] = page;
    this.memoryTable[memoryTableItemIndex].realAddress = avaiableSecondaryAddress;
    this.memoryTable[memoryTableItemIndex].isPaginated = true;
  }
  movePagesToPrimaryMemory(pages: Page[], memoryTableItemIndex: number[]){
    pages.forEach((p, index) => this.movePageToPrimaryMemory(p, memoryTableItemIndex[index]));
  }

  getAllPagesFromProcess(process: Process): Page[] {
    let pages = [] as Page[];
    this.memoryTable.forEach(mt => {
      let actPage: Page;
      if (mt.isPaginated) {
        actPage = this.secondaryMemory[mt.realAddress] as Page;
      } else {
        actPage = this.primaryMemory[mt.realAddress] as Page;
      }
      if (actPage.process.pid == process.pid) {
        pages.push(actPage);
      }
    });
    return pages;
  }

}

export default MMU
export type { Page, memoryTableItem };