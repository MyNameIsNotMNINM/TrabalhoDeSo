import { Process } from "./systemManager"

interface Page{
  process: Process,
  lastAccessed: number,
  enteredPrimary: number,
};

interface memoryTableItem{
  virtualAddress: number,
  realAddress: number,
};

enum MemorySchedulingAlgs {
  FIFO,
  LUF
}

type FilterFunction = (page:memoryTableItem)=> boolean;


class MMU{
  private memoryTable: memoryTableItem[] = [];
  private maxPrimaryMemory: number = 40;
  private primaryMemory: (Page|null)[] = Array(this.maxPrimaryMemory).fill(null);
  private secondaryMemory: (Page|null)[] = [];
  private memorySchedulingAlgorithm: MemorySchedulingAlgs;
  //endereços disponiveis
  private secondaryMemoryAddressCount: number = 0;
  private virtualMemoryAddressCount: number = 0;
  private avaiableSecondaryMemory: number[] = [];
  private avaiableVirtualMemory: number[] = [];

  constructor(memorySchedulingAlgorithm: MemorySchedulingAlgs){
    this.memorySchedulingAlgorithm = memorySchedulingAlgorithm;

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
    const pages = this.createPages(process, amount, currentClock);
    pages.forEach(page=>{
      this.registerPage(page)
    })
    return pages;
  }

  createPages(process: Process, amount: number, currentClock: number){
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
    }
    this.memoryTable.push({
      virtualAddress: this.getAvaiableVirtualAddress(),
      realAddress: avaiablePosition as number,
    });
    this.primaryMemory[avaiablePosition as number] = page;
  }

  paginatePrimaryMemory(filterFunction: FilterFunction): number{
    this.memoryTable.filter(filterFunction)
    // return paginated page position. also set it to falsy 
    return 1;
  }

  movePageToPrimaryMemory(page: Page){
    
  }
  movePageTosecondaryMemory(page: Page){
    
  }
  movePagesToPrimaryMemory(pages: Page[]){

  }

  getAllPagesFromProcess(process: Process): number[]{

  }

}

export default MMU