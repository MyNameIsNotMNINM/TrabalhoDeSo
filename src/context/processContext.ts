import React, { createContext } from 'react';

const PidContext = createContext<any>({
  pid: null as number|null,
  setPid: (pid: number|null) => {}
});
export default PidContext;