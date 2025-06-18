import { useState } from 'react'
import { Button, Stack } from '@mui/material';


function App() {
  const [X,setX] = useState([1,2,3,4,5,6,7,8,0]);
  const [moving, setMoving] = useState(null);

  function shuffle(){
    console.log("shuffle");
    let newX = [...Array(9).keys()].map(i => (i + 1) % 9); // [1,2,3,4,5,6,7,8,0]
    let emptyIdx = newX.indexOf(0);

    function getNeighbors(i) {
      const neighbors = [];
      const n = north(i);
      const s = south(i);
      const e = east(i);
      const w = west(i);
      if (n !== -1) neighbors.push(n);
      if (s !== -1) neighbors.push(s);
      if (e !== -1) neighbors.push(e);
      if (w !== -1) neighbors.push(w);
      return neighbors;
    }

    for (let step = 0; step < 100; step++) {
      const neighbors = getNeighbors(emptyIdx);
      const randIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Swap 0 with random neighbor
      [newX[emptyIdx], newX[randIdx]] = [newX[randIdx], newX[emptyIdx]];
      emptyIdx = randIdx;
    }
    setX(newX);
  }


  function startTimer(){
    setTimeout(()=>{console.log("F")}, 3000);
  }

  function click(i){
    const newX = X.slice();
    console.log("clicked", north(i), south(i), east(i), west(i));
    if (newX[north(i)]==0){
      newX[north(i)]=newX[i];
      newX[i]=0;
      setMoving({idx:north(i), dx:0, dy:-1 })
    }
    else if(newX[south(i)]==0){
      newX[south(i)]=newX[i];
      newX[i]=0;
      setMoving({idx:south(i), dx:0, dy:1 })
    }
    else if(newX[east(i)]==0){
      newX[east(i)]=newX[i];
      newX[i]=0;
      setMoving({idx:east(i), dx:1, dy:0 })
    }
    else if(newX[west(i)]==0){
      newX[west(i)]=newX[i];
      newX[i]=0;
      setMoving({idx:west(i), dx:-1, dy:0 })
    }else{
      return;
    }
    setX(newX);
    setTimeout(()=>{setMoving(null)}, 200);
  }

  function idx2pos(i){
    return {c:i%3, r:Math.floor(i/3)};
  }

  function north(i){
    const pos = idx2pos(i);
    if (pos.r <= 0){
      return -1;
    }
    return 3*(pos.r-1)+pos.c;
  }

  function south(i){
    const pos = idx2pos(i);
    if (pos.r >= 2){
      return -1;
    }
    return 3*(pos.r+1)+pos.c;
  }
  
  function west(i){
    const pos = idx2pos(i);
    if (pos.c <= 0){
      return -1;
    }
    return 3*pos.r+(pos.c-1);
  }

  function east(i){
    const pos = idx2pos(i);
    if (pos.c >= 2){
      return -1;
    }
    return 3*pos.r+(pos.c+1);
  }

  function completed(){
    for (let i=0; i<X.length; i++){
      if (X[i]!=(i+1)%9){
        return false;
      }
    }
    return true;
  }

  function Completed(){
    if (completed()){
      return <h1>完成です</h1>
    }
    else{
      return <h1>未完成です</h1>
    }
  }

  function Piece({i}){

    const text = (X[i]==0)?"":X[i]
    const color = (X[i]==0)?"none":"palegreen"
    const stroke = (X[i]==0)?"none":"white"
    const x = 100*(i%3);
    const y = 100*(Math.floor(i/3));
    let dx = 0;
    let dy = 0;
    if (moving == null){
      dx=0; dy=0;
    }
    else{
      if (moving.idx==i){
        dx = -50*moving.dx;
        dy = -50*moving.dy;
      }
    }
    const trans = "translate("+(x+dx)+","+(y+dy)+")";
    return <g onClick={()=>click(i)} transform={trans}>
        <rect  fill={color} stroke={stroke}
            x={0} y={0} width={100} height={100}></rect>
        <text x={50} y={50} stroke="black">{text}</text>
      </g>  
  }

  function Board(){
    const pieces = [];
    for (let i=0; i<X.length; i++){
      pieces.push(<Piece i={i}></Piece>);
    }
    return pieces;
  }

  return(
    <>
      <Stack spacing={1}>
        <Completed></Completed>
        <Stack direction="row" spacing={1}>
          <Button onClick={shuffle} variant="contained"> Shuffle </Button>
          <Button variant="contained"> Solve </Button>
        </Stack>
        <svg width={400} height={400}>
          <Board></Board>
        </svg>
        <Button onClick={startTimer} variant='outlined'>timer</Button>
      </Stack>
    </>
  )
}

export default App
