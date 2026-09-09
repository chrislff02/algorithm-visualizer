import { useRef, useState } from "react";
import "./App.css";

/* ----------------------------- */
/* Constants / Types             */
/* ----------------------------- */

const INITIAL_ARRAY = [42, 88, 21, 65, 35, 97, 53, 74];

const SEARCH_ARRAY = [12, 21, 35, 42, 53, 65, 74, 88, 97];

const ROWS = 12;
const COLS = 20;

const START_NODE = { row: 5, col: 3 };
const END_NODE = { row: 5, col: 16 };

type Section = "sorting" | "searching" | "pathfinding" | "graphs";

type SortingAlgorithm =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick";

type SearchAlgorithm = "binary" | "linear";

type PathAlgorithm = "bfs" | "dfs" | "dijkstra";

type GridMode = "wall" | "weight";

/* ----------------------------- */
/* App                           */
/* ----------------------------- */

function App() {
  /* --------------------------- */
  /* General                     */
  /* --------------------------- */

  const [activeSection, setActiveSection] = useState<Section>("sorting");

  const [speed, setSpeed] = useState(400);
  const speedRef = useRef(400);

  /* --------------------------- */
  /* Sorting                     */
  /* --------------------------- */

  const [arraySize, setArraySize] = useState(8);
  const [array, setArray] = useState(INITIAL_ARRAY);

  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<SortingAlgorithm>("bubble");

  const [comparing, setComparing] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const [currentMin, setCurrentMin] = useState<number | null>(null);

  const [currentInsert, setCurrentInsert] = useState<number | null>(null);

  const [mergeRange, setMergeRange] = useState<number[]>([]);

  const [mergeWriting, setMergeWriting] = useState<number | null>(null);

  const [pivotIndex, setPivotIndex] = useState<number | null>(null);

  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isSorting, setIsSorting] = useState(false);

  /* --------------------------- */
  /* Searching                   */
  /* --------------------------- */

  const [selectedSearchAlgorithm, setSelectedSearchAlgorithm] =
    useState<SearchAlgorithm>("binary");

  const [searchTarget, setSearchTarget] = useState(53);

  const [searchMiddle, setSearchMiddle] = useState<number | null>(null);

  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);

  const [foundIndex, setFoundIndex] = useState<number | null>(null);

  const [searchComparisons, setSearchComparisons] = useState(0);

  const [isSearching, setIsSearching] = useState(false);

  /* --------------------------- */
  /* Pathfinding                 */
  /* --------------------------- */

  const [selectedPathAlgorithm, setSelectedPathAlgorithm] =
    useState<PathAlgorithm>("bfs");

  const [gridMode, setGridMode] = useState<GridMode>("wall");

  const [walls, setWalls] = useState<string[]>([]);
  const [weightedNodes, setWeightedNodes] = useState<string[]>([]);

  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [pathNodes, setPathNodes] = useState<string[]>([]);

  const [isPathfinding, setIsPathfinding] = useState(false);

  /* --------------------------- */
  /* Shared Helpers              */
  /* --------------------------- */

  function sleep(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function handleSpeedChange(value: string) {
    const newSpeed = 750 - Number(value);

    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  }

  /* --------------------------- */
  /* Sorting Helpers             */
  /* --------------------------- */

  function resetSortingVisualization() {
    setComparing([]);
    setSortedIndices([]);
    setCurrentMin(null);
    setCurrentInsert(null);
    setMergeRange([]);
    setMergeWriting(null);
    setPivotIndex(null);
    setComparisons(0);
    setSwaps(0);
  }

  function generateNewArray() {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 80) + 20,
    );

    setArray(newArray);
    resetSortingVisualization();
  }

  function changeArraySize(newSize: number) {
    setArraySize(newSize);

    const newArray = Array.from(
      { length: newSize },
      () => Math.floor(Math.random() * 80) + 20,
    );

    setArray(newArray);
    resetSortingVisualization();
  }

  /* --------------------------- */
  /* Bubble Sort                 */
  /* --------------------------- */

  async function bubbleSort() {
    setIsSorting(true);
    resetSortingVisualization();

    const workingArray = [...array];

    for (let i = 0; i < workingArray.length - 1; i++) {
      for (let j = 0; j < workingArray.length - i - 1; j++) {
        setComparing([j, j + 1]);
        setComparisons((count) => count + 1);

        await sleep(speedRef.current);

        if (workingArray[j] > workingArray[j + 1]) {
          [workingArray[j], workingArray[j + 1]] = [
            workingArray[j + 1],
            workingArray[j],
          ];

          setArray([...workingArray]);
          setSwaps((count) => count + 1);

          await sleep(speedRef.current);
        }
      }

      setSortedIndices((indices) => [...indices, workingArray.length - 1 - i]);
    }

    setComparing([]);

    setSortedIndices(
      Array.from({ length: workingArray.length }, (_, index) => index),
    );

    setIsSorting(false);
  }

  /* --------------------------- */
  /* Selection Sort              */
  /* --------------------------- */

  async function selectionSort() {
    setIsSorting(true);
    resetSortingVisualization();

    const workingArray = [...array];

    for (let i = 0; i < workingArray.length - 1; i++) {
      let minIndex = i;

      setCurrentMin(minIndex);

      for (let j = i + 1; j < workingArray.length; j++) {
        setComparing([j]);
        setComparisons((count) => count + 1);

        await sleep(speedRef.current);

        if (workingArray[j] < workingArray[minIndex]) {
          minIndex = j;
          setCurrentMin(minIndex);
        }
      }

      if (minIndex !== i) {
        [workingArray[i], workingArray[minIndex]] = [
          workingArray[minIndex],
          workingArray[i],
        ];

        setArray([...workingArray]);
        setSwaps((count) => count + 1);

        await sleep(speedRef.current);
      }

      setSortedIndices((indices) => [...indices, i]);
      setCurrentMin(null);
    }

    setComparing([]);
    setCurrentMin(null);

    setSortedIndices(
      Array.from({ length: workingArray.length }, (_, index) => index),
    );

    setIsSorting(false);
  }

  /* --------------------------- */
  /* Insertion Sort              */
  /* --------------------------- */

  async function insertionSort() {
    setIsSorting(true);
    resetSortingVisualization();

    setSortedIndices([0]);

    const workingArray = [...array];

    for (let i = 1; i < workingArray.length; i++) {
      let j = i;

      setCurrentInsert(j);

      while (j > 0) {
        setCurrentInsert(j);
        setComparing([j - 1]);

        setComparisons((count) => count + 1);

        await sleep(speedRef.current);

        if (workingArray[j - 1] <= workingArray[j]) {
          break;
        }

        [workingArray[j - 1], workingArray[j]] = [
          workingArray[j],
          workingArray[j - 1],
        ];

        setArray([...workingArray]);
        setSwaps((count) => count + 1);

        j--;

        setCurrentInsert(j);

        await sleep(speedRef.current);
      }

      setComparing([]);
      setCurrentInsert(null);

      setSortedIndices(Array.from({ length: i + 1 }, (_, index) => index));
    }

    setSortedIndices(
      Array.from({ length: workingArray.length }, (_, index) => index),
    );

    setIsSorting(false);
  }

  /* --------------------------- */
  /* Merge Sort                  */
  /* --------------------------- */

  async function mergeSort() {
    setIsSorting(true);
    resetSortingVisualization();

    const workingArray = [...array];

    async function merge(left: number, middle: number, right: number) {
      const leftArray = workingArray.slice(left, middle + 1);

      const rightArray = workingArray.slice(middle + 1, right + 1);

      setMergeRange(
        Array.from({ length: right - left + 1 }, (_, index) => left + index),
      );

      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftArray.length && j < rightArray.length) {
        setComparing([left + i, middle + 1 + j]);

        setComparisons((count) => count + 1);

        await sleep(speedRef.current);

        if (leftArray[i] <= rightArray[j]) {
          workingArray[k] = leftArray[i];
          i++;
        } else {
          workingArray[k] = rightArray[j];
          j++;
        }

        setMergeWriting(k);
        setArray([...workingArray]);

        await sleep(speedRef.current);

        k++;
      }

      while (i < leftArray.length) {
        workingArray[k] = leftArray[i];

        setMergeWriting(k);
        setArray([...workingArray]);

        i++;
        k++;

        await sleep(speedRef.current);
      }

      while (j < rightArray.length) {
        workingArray[k] = rightArray[j];

        setMergeWriting(k);
        setArray([...workingArray]);

        j++;
        k++;

        await sleep(speedRef.current);
      }

      setComparing([]);
      setMergeWriting(null);
    }

    async function divide(left: number, right: number): Promise<void> {
      if (left >= right) {
        return;
      }

      const middle = Math.floor((left + right) / 2);

      await divide(left, middle);
      await divide(middle + 1, right);

      await merge(left, middle, right);
    }

    await divide(0, workingArray.length - 1);

    setMergeRange([]);
    setMergeWriting(null);
    setComparing([]);

    setSortedIndices(
      Array.from({ length: workingArray.length }, (_, index) => index),
    );

    setIsSorting(false);
  }

  /* --------------------------- */
  /* Quick Sort                  */
  /* --------------------------- */

  async function quickSort() {
    setIsSorting(true);
    resetSortingVisualization();

    const workingArray = [...array];

    async function partition(low: number, high: number) {
      const pivotValue = workingArray[high];

      setPivotIndex(high);

      let i = low - 1;

      for (let j = low; j < high; j++) {
        setComparing([j]);
        setComparisons((count) => count + 1);

        await sleep(speedRef.current);

        if (workingArray[j] < pivotValue) {
          i++;

          if (i !== j) {
            [workingArray[i], workingArray[j]] = [
              workingArray[j],
              workingArray[i],
            ];

            setArray([...workingArray]);
            setSwaps((count) => count + 1);

            await sleep(speedRef.current);
          }
        }
      }

      const pivotPosition = i + 1;

      if (pivotPosition !== high) {
        [workingArray[pivotPosition], workingArray[high]] = [
          workingArray[high],
          workingArray[pivotPosition],
        ];

        setArray([...workingArray]);
        setSwaps((count) => count + 1);

        await sleep(speedRef.current);
      }

      setSortedIndices((indices) => [...indices, pivotPosition]);

      setPivotIndex(null);
      setComparing([]);

      return pivotPosition;
    }

    async function sort(low: number, high: number): Promise<void> {
      if (low > high) {
        return;
      }

      if (low === high) {
        setSortedIndices((indices) =>
          indices.includes(low) ? indices : [...indices, low],
        );

        return;
      }

      const pivotPosition = await partition(low, high);

      await sort(low, pivotPosition - 1);

      await sort(pivotPosition + 1, high);
    }

    await sort(0, workingArray.length - 1);

    setComparing([]);
    setPivotIndex(null);

    setSortedIndices(
      Array.from({ length: workingArray.length }, (_, index) => index),
    );

    setIsSorting(false);
  }

  function startSorting() {
    switch (selectedAlgorithm) {
      case "bubble":
        void bubbleSort();
        break;

      case "selection":
        void selectionSort();
        break;

      case "insertion":
        void insertionSort();
        break;

      case "merge":
        void mergeSort();
        break;

      case "quick":
        void quickSort();
        break;
    }
  }

  function getTimeComplexity() {
    switch (selectedAlgorithm) {
      case "merge":
        return "O(n log n)";

      case "quick":
        return "O(n log n) avg.";

      default:
        return "O(n²)";
    }
  }

  function getSpaceComplexity() {
    switch (selectedAlgorithm) {
      case "merge":
        return "O(n)";

      case "quick":
        return "O(log n)";

      default:
        return "O(1)";
    }
  }

  /* --------------------------- */
  /* Search Helpers              */
  /* --------------------------- */

  function resetSearchVisualization() {
    setSearchMiddle(null);
    setEliminatedIndices([]);
    setFoundIndex(null);
    setSearchComparisons(0);
  }

  async function linearSearch() {
    setIsSearching(true);
    resetSearchVisualization();

    for (let i = 0; i < SEARCH_ARRAY.length; i++) {
      setSearchMiddle(i);
      setSearchComparisons((count) => count + 1);

      await sleep(speedRef.current);

      if (SEARCH_ARRAY[i] === searchTarget) {
        setFoundIndex(i);
        setSearchMiddle(null);
        setIsSearching(false);

        return;
      }

      setEliminatedIndices((indices) => [...indices, i]);

      await sleep(speedRef.current);
    }

    setSearchMiddle(null);
    setIsSearching(false);
  }

  async function binarySearch() {
    setIsSearching(true);
    resetSearchVisualization();

    let left = 0;
    let right = SEARCH_ARRAY.length - 1;

    while (left <= right) {
      const middle = Math.floor((left + right) / 2);

      setSearchMiddle(middle);

      setSearchComparisons((count) => count + 1);

      await sleep(speedRef.current);

      if (SEARCH_ARRAY[middle] === searchTarget) {
        setFoundIndex(middle);
        setSearchMiddle(null);
        setIsSearching(false);

        return;
      }

      if (SEARCH_ARRAY[middle] < searchTarget) {
        const eliminated = Array.from(
          {
            length: middle - left + 1,
          },
          (_, index) => left + index,
        );

        setEliminatedIndices((indices) => [...indices, ...eliminated]);

        left = middle + 1;
      } else {
        const eliminated = Array.from(
          {
            length: right - middle + 1,
          },
          (_, index) => middle + index,
        );

        setEliminatedIndices((indices) => [...indices, ...eliminated]);

        right = middle - 1;
      }

      await sleep(speedRef.current);
    }

    setSearchMiddle(null);
    setIsSearching(false);
  }

  function startSearch() {
    if (selectedSearchAlgorithm === "binary") {
      void binarySearch();
    } else {
      void linearSearch();
    }
  }

  /* --------------------------- */
  /* Pathfinding Helpers         */
  /* --------------------------- */

  function resetPathVisualization() {
    setVisitedNodes([]);
    setPathNodes([]);
  }

  function clearGrid() {
    setWalls([]);
    setWeightedNodes([]);

    resetPathVisualization();
  }

  function toggleWall(row: number, col: number) {
    const key = `${row}-${col}`;

    const isStart = row === START_NODE.row && col === START_NODE.col;

    const isEnd = row === END_NODE.row && col === END_NODE.col;

    if (isStart || isEnd) {
      return;
    }

    setWalls((currentWalls) => {
      if (currentWalls.includes(key)) {
        return currentWalls.filter((wall) => wall !== key);
      }

      return [...currentWalls, key];
    });

    setWeightedNodes((current) => current.filter((node) => node !== key));

    resetPathVisualization();
  }

  function toggleWeight(row: number, col: number) {
    const key = `${row}-${col}`;

    const isStart = row === START_NODE.row && col === START_NODE.col;

    const isEnd = row === END_NODE.row && col === END_NODE.col;

    if (isStart || isEnd) {
      return;
    }

    setWeightedNodes((current) => {
      if (current.includes(key)) {
        return current.filter((node) => node !== key);
      }

      return [...current, key];
    });

    setWalls((current) => current.filter((wall) => wall !== key));

    resetPathVisualization();
  }

  async function animatePath(
    endKey: string,
    startKey: string,
    parents: Map<string, string | null>,
  ) {
    const path: string[] = [];

    let current: string | null = endKey;

    while (current !== null) {
      path.unshift(current);

      current = parents.get(current) ?? null;
    }

    for (const node of path) {
      if (node !== startKey && node !== endKey) {
        setPathNodes((nodes) => [...nodes, node]);

        await sleep(speedRef.current / 2);
      }
    }
  }

  /* --------------------------- */
  /* BFS                         */
  /* --------------------------- */

  async function bfsPathfinding() {
    setIsPathfinding(true);
    resetPathVisualization();

    const startKey = `${START_NODE.row}-${START_NODE.col}`;

    const endKey = `${END_NODE.row}-${END_NODE.col}`;

    const queue: string[] = [startKey];

    const visited = new Set<string>([startKey]);

    const parents = new Map<string, string | null>();

    parents.set(startKey, null);

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    while (queue.length > 0) {
      const currentKey = queue.shift();

      if (!currentKey) {
        break;
      }

      const [row, col] = currentKey.split("-").map(Number);

      if (currentKey !== startKey && currentKey !== endKey) {
        setVisitedNodes((nodes) => [...nodes, currentKey]);

        await sleep(speedRef.current / 3);
      }

      if (currentKey === endKey) {
        await animatePath(endKey, startKey, parents);

        setIsPathfinding(false);
        return;
      }

      for (const [rowChange, colChange] of directions) {
        const newRow = row + rowChange;

        const newCol = col + colChange;

        if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) {
          continue;
        }

        const neighborKey = `${newRow}-${newCol}`;

        if (walls.includes(neighborKey)) {
          continue;
        }

        if (visited.has(neighborKey)) {
          continue;
        }

        visited.add(neighborKey);

        parents.set(neighborKey, currentKey);

        queue.push(neighborKey);
      }
    }

    setIsPathfinding(false);
  }

  /* --------------------------- */
  /* DFS                         */
  /* --------------------------- */

  async function dfsPathfinding() {
    setIsPathfinding(true);
    resetPathVisualization();

    const startKey = `${START_NODE.row}-${START_NODE.col}`;

    const endKey = `${END_NODE.row}-${END_NODE.col}`;

    const stack: string[] = [startKey];

    const visited = new Set<string>();

    const parents = new Map<string, string | null>();

    parents.set(startKey, null);

    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];

    while (stack.length > 0) {
      const currentKey = stack.pop();

      if (!currentKey) {
        break;
      }

      if (visited.has(currentKey)) {
        continue;
      }

      visited.add(currentKey);

      const [row, col] = currentKey.split("-").map(Number);

      if (currentKey !== startKey && currentKey !== endKey) {
        setVisitedNodes((nodes) => [...nodes, currentKey]);

        await sleep(speedRef.current / 3);
      }

      if (currentKey === endKey) {
        await animatePath(endKey, startKey, parents);

        setIsPathfinding(false);

        return;
      }

      for (let i = directions.length - 1; i >= 0; i--) {
        const [rowChange, colChange] = directions[i];

        const newRow = row + rowChange;

        const newCol = col + colChange;

        if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) {
          continue;
        }

        const neighborKey = `${newRow}-${newCol}`;

        if (walls.includes(neighborKey)) {
          continue;
        }

        if (visited.has(neighborKey)) {
          continue;
        }

        if (!parents.has(neighborKey)) {
          parents.set(neighborKey, currentKey);
        }

        stack.push(neighborKey);
      }
    }

    setIsPathfinding(false);
  }

  /* --------------------------- */
  /* Dijkstra                    */
  /* --------------------------- */

  async function dijkstraPathfinding() {
    setIsPathfinding(true);
    resetPathVisualization();

    const startKey = `${START_NODE.row}-${START_NODE.col}`;

    const endKey = `${END_NODE.row}-${END_NODE.col}`;

    const distances = new Map<string, number>();

    const parents = new Map<string, string | null>();

    const visited = new Set<string>();

    const unvisited: string[] = [];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const key = `${row}-${col}`;

        if (!walls.includes(key)) {
          distances.set(key, Infinity);

          unvisited.push(key);
        }
      }
    }

    distances.set(startKey, 0);

    parents.set(startKey, null);

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    while (unvisited.length > 0) {
      unvisited.sort(
        (a, b) =>
          (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity),
      );

      const currentKey = unvisited.shift();

      if (!currentKey) {
        break;
      }

      const currentDistance = distances.get(currentKey) ?? Infinity;

      if (currentDistance === Infinity) {
        break;
      }

      if (visited.has(currentKey)) {
        continue;
      }

      visited.add(currentKey);

      if (currentKey !== startKey && currentKey !== endKey) {
        setVisitedNodes((nodes) => [...nodes, currentKey]);

        await sleep(speedRef.current / 3);
      }

      if (currentKey === endKey) {
        await animatePath(endKey, startKey, parents);

        setIsPathfinding(false);

        return;
      }

      const [row, col] = currentKey.split("-").map(Number);

      for (const [rowChange, colChange] of directions) {
        const newRow = row + rowChange;

        const newCol = col + colChange;

        if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) {
          continue;
        }

        const neighborKey = `${newRow}-${newCol}`;

        if (walls.includes(neighborKey)) {
          continue;
        }

        if (visited.has(neighborKey)) {
          continue;
        }

        const weight = weightedNodes.includes(neighborKey) ? 5 : 1;

        const newDistance = currentDistance + weight;

        if (newDistance < (distances.get(neighborKey) ?? Infinity)) {
          distances.set(neighborKey, newDistance);

          parents.set(neighborKey, currentKey);
        }
      }
    }

    setIsPathfinding(false);
  }

  function startPathfinding() {
    switch (selectedPathAlgorithm) {
      case "bfs":
        void bfsPathfinding();
        break;

      case "dfs":
        void dfsPathfinding();
        break;

      case "dijkstra":
        void dijkstraPathfinding();
        break;
    }
  }

  /* --------------------------- */
  /* Render                      */
  /* --------------------------- */

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">INTERACTIVE CS TOOL</p>

          <h1>Algorithm Visualizer</h1>
        </div>

        <nav className="nav">
          <button
            className={activeSection === "sorting" ? "active" : ""}
            onClick={() => setActiveSection("sorting")}
          >
            Sorting
          </button>

          <button
            className={activeSection === "searching" ? "active" : ""}
            onClick={() => setActiveSection("searching")}
          >
            Searching
          </button>

          <button
            className={activeSection === "pathfinding" ? "active" : ""}
            onClick={() => setActiveSection("pathfinding")}
          >
            Pathfinding
          </button>

          <button
            className={activeSection === "graphs" ? "active" : ""}
            onClick={() => setActiveSection("graphs")}
          >
            Graphs
          </button>
        </nav>
      </header>

      <main className="main">
        {/* --------------------- */}
        {/* Sorting               */}
        {/* --------------------- */}

        {activeSection === "sorting" && (
          <>
            <section className="controls-panel">
              <div>
                <label>Algorithm</label>

                <select
                  value={selectedAlgorithm}
                  disabled={isSorting}
                  onChange={(event) => {
                    setSelectedAlgorithm(
                      event.target.value as SortingAlgorithm,
                    );

                    resetSortingVisualization();
                  }}
                >
                  <option value="bubble">Bubble Sort</option>

                  <option value="selection">Selection Sort</option>

                  <option value="insertion">Insertion Sort</option>

                  <option value="merge">Merge Sort</option>

                  <option value="quick">Quick Sort</option>
                </select>
              </div>

              <div className="size-control">
                <label>Array Size: {arraySize}</label>

                <input
                  type="range"
                  min="5"
                  max="20"
                  value={arraySize}
                  disabled={isSorting}
                  onChange={(event) =>
                    changeArraySize(Number(event.target.value))
                  }
                />
              </div>

              <div className="speed-control">
                <label>Speed: {speed} ms</label>

                <input
                  type="range"
                  min="50"
                  max="700"
                  step="50"
                  value={750 - speed}
                  onChange={(event) => handleSpeedChange(event.target.value)}
                />
              </div>

              <button
                className="secondary-button"
                onClick={generateNewArray}
                disabled={isSorting}
              >
                Generate New Array
              </button>

              <button
                className="primary-button"
                onClick={startSorting}
                disabled={isSorting}
              >
                {isSorting ? "Sorting..." : "Start"}
              </button>
            </section>

            <section className="visualizer-panel">
              <div className="bars-container">
                {array.map((value, index) => (
                  <div
                    key={index}
                    className={`bar ${
                      mergeRange.includes(index) ? "merge-range" : ""
                    } ${comparing.includes(index) ? "comparing" : ""} ${
                      currentMin === index ? "minimum" : ""
                    } ${currentInsert === index ? "inserting" : ""} ${
                      mergeWriting === index ? "merge-writing" : ""
                    } ${pivotIndex === index ? "pivot" : ""} ${
                      sortedIndices.includes(index) ? "sorted" : ""
                    }`}
                    style={{
                      height: `${value * 3}px`,
                    }}
                  >
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              <div className="legend">
                <div>
                  <span className="legend-box comparing-box" />
                  Comparing
                </div>

                {selectedAlgorithm === "selection" && (
                  <div>
                    <span className="legend-box minimum-box" />
                    Current Minimum
                  </div>
                )}

                {selectedAlgorithm === "insertion" && (
                  <div>
                    <span className="legend-box inserting-box" />
                    Inserting
                  </div>
                )}

                {selectedAlgorithm === "merge" && (
                  <>
                    <div>
                      <span className="legend-box merge-range-box" />
                      Merge Range
                    </div>

                    <div>
                      <span className="legend-box merge-writing-box" />
                      Writing
                    </div>
                  </>
                )}

                {selectedAlgorithm === "quick" && (
                  <div>
                    <span className="legend-box pivot-box" />
                    Pivot
                  </div>
                )}

                <div>
                  <span className="legend-box sorted-box" />
                  Sorted
                </div>
              </div>
            </section>

            <section className="info-panel">
              <div>
                <span>Comparisons</span>

                <strong>{comparisons}</strong>
              </div>

              <div>
                <span>Swaps</span>

                <strong>{swaps}</strong>
              </div>

              <div>
                <span>Time Complexity</span>

                <strong>{getTimeComplexity()}</strong>
              </div>

              <div>
                <span>Space Complexity</span>

                <strong>{getSpaceComplexity()}</strong>
              </div>
            </section>
          </>
        )}

        {/* --------------------- */}
        {/* Searching             */}
        {/* --------------------- */}

        {activeSection === "searching" && (
          <>
            <section className="controls-panel">
              <div>
                <label>Algorithm</label>

                <select
                  value={selectedSearchAlgorithm}
                  disabled={isSearching}
                  onChange={(event) => {
                    setSelectedSearchAlgorithm(
                      event.target.value as SearchAlgorithm,
                    );

                    resetSearchVisualization();
                  }}
                >
                  <option value="binary">Binary Search</option>

                  <option value="linear">Linear Search</option>
                </select>
              </div>

              <div>
                <label>Target</label>

                <input
                  className="target-input"
                  type="number"
                  value={searchTarget}
                  disabled={isSearching}
                  onChange={(event) => {
                    setSearchTarget(Number(event.target.value));

                    resetSearchVisualization();
                  }}
                />
              </div>

              <div className="speed-control">
                <label>Speed: {speed} ms</label>

                <input
                  type="range"
                  min="50"
                  max="700"
                  step="50"
                  value={750 - speed}
                  onChange={(event) => handleSpeedChange(event.target.value)}
                />
              </div>

              <button
                className="primary-button"
                onClick={startSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Start Search"}
              </button>
            </section>

            <section className="search-visualizer-panel">
              <div className="search-array">
                {SEARCH_ARRAY.map((value, index) => (
                  <div
                    key={index}
                    className={`search-item ${
                      searchMiddle === index ? "search-middle" : ""
                    } ${
                      eliminatedIndices.includes(index)
                        ? "search-eliminated"
                        : ""
                    } ${foundIndex === index ? "search-found" : ""}`}
                  >
                    {value}
                  </div>
                ))}
              </div>

              <div className="legend">
                <div>
                  <span className="legend-box search-middle-box" />

                  {selectedSearchAlgorithm === "binary" ? "Middle" : "Checking"}
                </div>

                <div>
                  <span className="legend-box search-eliminated-box" />
                  Eliminated
                </div>

                <div>
                  <span className="legend-box search-found-box" />
                  Found
                </div>
              </div>
            </section>

            <section className="info-panel">
              <div>
                <span>Comparisons</span>

                <strong>{searchComparisons}</strong>
              </div>

              <div>
                <span>Target</span>

                <strong>{searchTarget}</strong>
              </div>

              <div>
                <span>Time Complexity</span>

                <strong>
                  {selectedSearchAlgorithm === "binary" ? "O(log n)" : "O(n)"}
                </strong>
              </div>

              <div>
                <span>Space Complexity</span>

                <strong>O(1)</strong>
              </div>
            </section>
          </>
        )}

        {/* --------------------- */}
        {/* Pathfinding           */}
        {/* --------------------- */}

        {activeSection === "pathfinding" && (
          <>
            <section className="controls-panel">
              <div>
                <label>Algorithm</label>

                <select
                  value={selectedPathAlgorithm}
                  disabled={isPathfinding}
                  onChange={(event) => {
                    setSelectedPathAlgorithm(
                      event.target.value as PathAlgorithm,
                    );

                    resetPathVisualization();
                  }}
                >
                  <option value="bfs">BFS</option>

                  <option value="dfs">DFS</option>

                  <option value="dijkstra">Dijkstra</option>
                </select>
              </div>

              <div>
                <label>Grid Tool</label>

                <select
                  value={gridMode}
                  disabled={isPathfinding}
                  onChange={(event) =>
                    setGridMode(event.target.value as GridMode)
                  }
                >
                  <option value="wall">Wall</option>

                  <option value="weight">Weight</option>
                </select>
              </div>

              <div className="speed-control">
                <label>Speed: {speed} ms</label>

                <input
                  type="range"
                  min="50"
                  max="700"
                  step="50"
                  value={750 - speed}
                  onChange={(event) => handleSpeedChange(event.target.value)}
                />
              </div>

              <button
                className="secondary-button"
                onClick={clearGrid}
                disabled={isPathfinding}
              >
                Clear Grid
              </button>

              <button
                className="secondary-button"
                onClick={resetPathVisualization}
                disabled={isPathfinding}
              >
                Reset Path
              </button>

              <button
                className="primary-button"
                onClick={startPathfinding}
                disabled={isPathfinding}
              >
                {isPathfinding ? "Searching..." : "Start Pathfinding"}
              </button>
            </section>

            <section className="pathfinding-panel">
              <div
                className="path-grid"
                style={{
                  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                }}
              >
                {Array.from({
                  length: ROWS * COLS,
                }).map((_, index) => {
                  const row = Math.floor(index / COLS);

                  const col = index % COLS;

                  const key = `${row}-${col}`;

                  const isStart =
                    row === START_NODE.row && col === START_NODE.col;

                  const isEnd = row === END_NODE.row && col === END_NODE.col;

                  const isWall = walls.includes(key);

                  const isWeighted = weightedNodes.includes(key);

                  return (
                    <button
                      key={key}
                      className={`grid-node ${
                        visitedNodes.includes(key) ? "visited-node" : ""
                      } ${isWeighted ? "weighted-node" : ""} ${
                        isWall ? "wall-node" : ""
                      } ${pathNodes.includes(key) ? "path-node" : ""} ${
                        isStart ? "start-node" : ""
                      } ${isEnd ? "end-node" : ""}`}
                      onClick={() => {
                        if (isPathfinding) {
                          return;
                        }

                        if (gridMode === "wall") {
                          toggleWall(row, col);
                        } else {
                          toggleWeight(row, col);
                        }
                      }}
                      aria-label={`Row ${row + 1}, Column ${col + 1}`}
                    >
                      {isStart ? "S" : isEnd ? "E" : ""}
                    </button>
                  );
                })}
              </div>

              <div className="legend">
                <div>
                  <span className="legend-box start-box" />
                  Start
                </div>

                <div>
                  <span className="legend-box end-box" />
                  End
                </div>

                <div>
                  <span className="legend-box wall-box" />
                  Wall
                </div>

                <div>
                  <span className="legend-box weight-box" />
                  Weight (5)
                </div>

                <div>
                  <span className="legend-box visited-box" />
                  Visited
                </div>

                <div>
                  <span className="legend-box path-box" />

                  {selectedPathAlgorithm === "dfs" ? "Path" : "Shortest Path"}
                </div>
              </div>
            </section>
          </>
        )}

        {/* --------------------- */}
        {/* Graphs                */}
        {/* --------------------- */}

        {activeSection === "graphs" && (
          <section className="placeholder-panel">
            <h2>Graph Visualizer</h2>

            <p>Graph traversal algorithms will go here next.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
