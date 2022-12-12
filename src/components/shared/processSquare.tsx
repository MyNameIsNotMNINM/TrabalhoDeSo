import { useContext } from "react";
import PidContext from "../../context/processContext";
import {pickRandomColor, getRandomColor} from "../../core/utils/processColors";
import useHover from "../../hooks/useHover";

interface processSquareProps{
  color?: string,
  pid: number,
  processName?: string,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode,
};

const ProcessSquare = (props: processSquareProps) => {
  const {pid, setPid} = useContext(PidContext);
    const selectedStyle = pid == props.pid ? " scale-[1.3]" : ""
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();
    if(isHovered){
      setPid(props.pid)
    }
  return <div ref={hoverRef} style={{ backgroundColor: props?.color || getRandomColor(props.pid +10), ...props?.style }} className={`text-lg ${props?.className} ${selectedStyle}`} >
    {props.children}
  </div>
};

export default ProcessSquare;