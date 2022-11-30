import { Page, memoryTableItem } from "./memoryManagementUnit";

enum MemorySchedulingAlgs {
  FIFO,
  LUF
}

interface PageSwapAlgoReturn{
  page: Page,
  memoryTableItem: memoryTableItem,
};

class PageSwapper {
  private static algomapper = {
    0: PageSwapper.fifo,
    1: PageSwapper.luf,
  }

  static getAllowedPage(algorithm: MemorySchedulingAlgs, pages: Page[], memoryItens: memoryTableItem[]): PageSwapAlgoReturn{
    return PageSwapper.algomapper[algorithm](pages, memoryItens);
  }

  private static fifo(pages: Page[], memoryItens: memoryTableItem[]): PageSwapAlgoReturn {
    let pagesMemoryInfo = [];
    for (let index = 0; index < pages.length; index++) {
      pagesMemoryInfo.push({ page: pages[index], memoryTableItem: memoryItens[index] });
    } 
    return [ ...pagesMemoryInfo ].sort((a, b) => a.page.enteredPrimary - b.page.enteredPrimary)[0];
  }

  private static luf(pages: Page[], memoryItens: memoryTableItem[]): PageSwapAlgoReturn {
    let pagesMemoryInfo = [];
    for (let index = 0; index < pages.length; index++) {
      pagesMemoryInfo.push({ page: pages[index], memoryTableItem: memoryItens[index] });
    } 
    return [ ...pagesMemoryInfo].sort((a, b) => b.page.lastAccessed - a.page.lastAccessed)[0];
  }
}
export { MemorySchedulingAlgs };
export default PageSwapper;