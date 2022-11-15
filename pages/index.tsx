import Gantt, { ProcessTimeStep } from '../src/components/grantt'
import DashboardLayout from '../src/components/page-layout/dashboardLayout'

function makes(){
  let t = [];
  for (let index = 0; index < 10000; index++) {
    t.push({ runningProcessId: Math.floor(Math.random()*10), cpuId: 1})
  }
  return t
}

export default function Home() {
  return (
    <>
      <DashboardLayout main={<Gantt processTimeline={makes()} processes={10}/>} header={<div/>}></DashboardLayout>
    </>
  )
}
