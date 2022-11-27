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

class MMU{
  private memoryTable: memoryTableItem[] = [];
  private primaryMemory: Page[] = []; 
  private secondaryMemory: Page[] = []; 
  private memorySchedulingAlgorithm: MemorySchedulingAlgs;
  constructor(memorySchedulingAlgorithm: MemorySchedulingAlgs){
    this.memorySchedulingAlgorithm = memorySchedulingAlgorithm
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

  }
  movePageToPrimaryMemory(page: Page){
    
  }
  movePageTosecondaryMemory(page: Page){
    
  }
  movePagesToPrimaryMemory(pages: Page[]){

  }

}

export default MMU