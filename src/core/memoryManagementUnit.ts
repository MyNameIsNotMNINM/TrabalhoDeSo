import { Process } from "./systemManager"

interface Page{
  process: Process,
  lastAccessed: number,
};

interface memoryTableItem{
  virtualAddress: number,
  realAddress: number,
  isPaginated: boolean,
};

enum MemorySchedulingAlgs {
  FIFO,
  LUF
}

type FilterFunction = (page:memoryTableItem)=> boolean;


class MMU{
  private memoryTable: memoryTableItem[] = [];
  private maxPrimaryMemory: number = 40;
  private primaryMemory: Page|null[] = Array(this.maxPrimaryMemory).fill(null);
  private secondaryMemory: Page|null[] = Array(this.maxPrimaryMemory).fill(null);
  private memorySchedulingAlgorithm: MemorySchedulingAlgs;
  constructor(memorySchedulingAlgorithm: MemorySchedulingAlgs){
    this.memorySchedulingAlgorithm = memorySchedulingAlgorithm;

  }
  allocateMemory(process: Process, amount: number): Page[]{
    const pages = this.createPages(process, amount);
    pages.forEach(page=>{
      this.registerPage(page)
    })
    return pages;
  }

  createPages(process: Process, amount: number){
    const pages: Page[] = [];
    for (let index = 0; index < amount; index++) {
      pages.push({
        process,
        lastAccessed: Number.POSITIVE_INFINITY
      });
    }
    return pages;
  }

  registerPage(page: Page){
    const primaryMemoryCount = this.primaryMemory.length;
    if(primaryMemoryCount >= this.maxPrimaryMemory){
      //paginate to open space on primary memory
    }
    this.memoryTable.push({
      virtualAddress: 1,
      realAddress: ,
      isPaginated: false,
    })
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

}

export default MMU