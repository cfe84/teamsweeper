import dynamic from "next/dynamic";
import { SharedMap } from "fluid-framework";
import { Cell } from "./Cell";
// yuk...
import { Board, generateBoard } from "./MineSweeperBoard";

import * as React from "react";
import { MineSweeperConsts } from "./MineSweeperConsts";

const styles = {
  default: {
    color: "white",
    textAlign: "center",
  },
  input: {
    width: "300px",
  },
  center: {
    textAlign: "center"
  },
  board: {
    margin: "auto",
    display: "inline-block"
  }
} as const

const width = 25;
const height = 20;
const mines = Math.floor(width * height * .1);

const BOARD_KEY = "board";

function getBoard(map: SharedMap): Board {
  let board = map.get(BOARD_KEY)
  if (!board) {
    const grid = generateBoard(width, height, mines);
    board = {
      grid,
      size: {
        width,
        height
      },
      mines
    }
    map.set(BOARD_KEY, board);
  }
  return board;
}

export default dynamic(() => Promise.resolve(mineSweeper), {
  ssr: false
});

export function mineSweeper() {
  const [ cells, setCells ] = React.useState<JSX.Element[][]>([]);
  const [ name, setName ] = React.useState<string>("");
  const [ looser, setLooser ] = React.useState(false);

  function createCells(map: SharedMap, board: Board) {
    const cells: JSX.Element[][] = [];
    for (let r = 0; r < board.size.height; r++) {
      const row: JSX.Element[] = [];
      cells.push(row);
      for (let c = 0; c < board.size.width; c++) {
        const val = board.grid[r][c];
        const displayed = map.get(MineSweeperConsts.displayedKey(r, c)) === true;
        const hasFlag = map.get(MineSweeperConsts.flagKey(r, c)) === true;
        row.push(<Cell count={val} displayed={displayed} hasBomb={val < 0} key={r * board.size.height + c} row={r} col={c} map={map} hasFlag={hasFlag}></Cell>);
      }
    }
    return cells;
  }

  async function joinContainer() {
    const {LiveShareHost} = await import("@microsoft/teams-js");
    const { LiveShareClient } = await import("@microsoft/live-share");
    const host = LiveShareHost.create();
    const liveShare = new LiveShareClient(host);
    const schema = {
      initialObjects: { 
        val: SharedMap
      },
    };
    const { container } = await liveShare.joinContainer(schema);
    return container;
  }

  async function init() {
    const {app} = await import("@microsoft/teams-js");
    console.log(`Initializing stage`);
    await app.initialize();
    const container = await joinContainer();
    const map = container.initialObjects.val as SharedMap;
    const board: Board = getBoard(map);
    const cells = createCells(map, board);
    setCells(cells);

    map.on("valueChanged", (val, isLocal) => {
      if (val.key === "looser") {
        setLooser(true);
      }
    });

    const context = await app.getContext();
    setName(context.user?.userPrincipalName || "UNKNOWN");
  }

  React.useEffect(() => {
    init().then();
  }, [setCells])

  return <div style={styles.default}>
    <p><h1>{ looser ? "You lost!" : name }</h1></p>
    <div style={styles.board}>
      { cells.length ? cells.map(row => <div style={{display: "table-row"}}>{...row}</div>) : "Loading..." }
    </div>
  </div>
}