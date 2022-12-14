interface DashboardLayoutProps{
  main: React.ReactNode,
  header: React.ReactNode
};

const DashboardLayout = (props: DashboardLayoutProps) => {
  return <div className="h-screen w-screen p-4 flex gap-4 flex-col">
    <header className="w-full h-1/3 flex gap-3">{props.header}</header>
    <main className="w-full flex overflow-scroll" >{props.main}</main>
  </div>
}

export default DashboardLayout;