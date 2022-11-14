import Head from 'next/head'
import Image from 'next/image'
import DashboardLayout from '../components/page-layout/dashboardLayout'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <DashboardLayout main={<div className=" bg-slate-700">a</div>} header={<div className=" bg-slate-700">a</div>}></DashboardLayout>
  )
}
