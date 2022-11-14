interface processSquareProps{
  color: string,
  pid: number,
  className: string;
};

const ProcessSquare = (props: processSquareProps) => {
  return <div style={{ backgroundColor: props.color }} className={` text-lg ${props.className}`}>
    {props.pid}
  </div>
}

export default ProcessSquare;