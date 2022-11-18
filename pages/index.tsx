import { useEffect, useRef, useState } from 'react';
import Gantt, { ProcessTimeStep } from '../src/components/grantt'
import DashboardLayout from '../src/components/page-layout/dashboardLayout'

function makes(t: ProcessTimeStep[] = []){
  t = [...t]
  for (let index = 0; index < 1; index++) {
    t.push({ runningProcessId: Math.floor(Math.random()*10), coreId: 1})
  }
  return t
}

export default function Home() {
  const [timeline, setTimeline] = useState<ProcessTimeStep[]>([]);
  const timelineRef = useRef(timeline);
  timelineRef.current = timeline
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeline(makes(timelineRef.current)); // count is 0 here
      console.log(1)
    },1000);
    
  }, []);
  return (
    <>
      <DashboardLayout main={<Gantt processTimeline={timeline} processes={10}/>} header={<div/>}></DashboardLayout>
    </>
  )
}

export async function getStaticProps(context:any){
  return {
    props: {}, // will be passed to the page component as props
  }
}
