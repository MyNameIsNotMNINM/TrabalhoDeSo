import {pickRandomColor, getRandomColor} from "../../core/utils/processColors";

interface processSquareProps{
  color?: string,
  pid: number,
  processName?: string,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode,
};

const ProcessSquare = (props: processSquareProps) => {
  return <div style={{ backgroundColor: props?.color || getRandomColor(props.pid), ...props?.style }} className={`text-lg ${props?.className}`} >
    {props.children}
  </div>
};

export default ProcessSquare;