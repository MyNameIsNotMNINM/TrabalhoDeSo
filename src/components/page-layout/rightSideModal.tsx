interface RightSideModalProps{
  children: React.ReactNode,
  enabled: boolean
};

const RightSideModal = (props: RightSideModalProps) => {
  if(props.enabled)
    return(
      <main className="fixed right-0 w-1/4">
        <div className="flex flex-col w-full h-screen p-2 rounded-l-md border border-l border-zinc-600 ">
          {props.children}
        </div>
      </main>
    )
  return null;
}

export default RightSideModal;