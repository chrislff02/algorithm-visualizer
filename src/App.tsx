import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [arraySize, setArraySize] = useState(8);

  const [array, setArray] = useState([42, 88, 21, 65, 35, 97, 53, 74]);

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

  const [speed, setSpeed] = useState(400);
  const speedRef = useRef(400);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");
  const [activeSection, setActiveSection] = useState("sorting");

  const [searchArray, setSearchArray] = useState([
    12, 21, 35, 42, 53, 65, 74, 88, 97,
  ]);

  const [selectedSearchAlgorithm, setSelectedSearchAlgorithm] =
    useState("binary");

  const [searchTarget, setSearchTarget] = useState(53);
  const [searchMiddle, setSearchMiddle] = useState<number | null>(null);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [searchComparisons, setSearchComparisons] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  function resetVisualization() {
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
    resetVisualization();
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function bubbleSort() {
    setIsSorting(true);
    resetVisualization();

    const workingArray = [...array];

    for (let i = 0; i < workingArray.length - 1; i++) {
      for (let j = 0; j < workingArray.length - i - 1; j++) {
        setComparing([j, j + 1]);
        setComparisons((count) => count + 1);

        await sleep(speedRef.current);

        if (workingArray[j] > workingArray[j + 1]) {
          const temp = workingArray[j];

          workingArray[j] = workingArray[j + 1];
          workingArray[j + 1] = temp;

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

  async function selectionSort() {
    setIsSorting(true);
    resetVisualization();

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
        const temp = workingArray[i];

        workingArray[i] = workingArray[minIndex];
        workingArray[minIndex] = temp;

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

  async function insertionSort() {
    setIsSorting(true);
    resetVisualization();

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

        const temp = workingArray[j - 1];

        workingArray[j - 1] = workingArray[j];
        workingArray[j] = temp;

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

    setComparing([]);
    setCurrentInsert(null);

    setSortedIndices(
      Array.from({ length: workingArray.length }, (_, index) => index),
    );

    setIsSorting(false);
  }

  async function mergeSort() {
    setIsSorting(true);
    resetVisualization();

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

  async function quickSort() {
    setIsSorting(true);
    resetVisualization();

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
            const temp = workingArray[i];

            workingArray[i] = workingArray[j];
            workingArray[j] = temp;

            setArray([...workingArray]);
            setSwaps((count) => count + 1);

            await sleep(speedRef.current);
          }
        }
      }

      const pivotPosition = i + 1;

      if (pivotPosition !== high) {
        const temp = workingArray[pivotPosition];

        workingArray[pivotPosition] = workingArray[high];
        workingArray[high] = temp;

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
    if (selectedAlgorithm === "bubble") {
      bubbleSort();
    }

    if (selectedAlgorithm === "selection") {
      selectionSort();
    }

    if (selectedAlgorithm === "insertion") {
      insertionSort();
    }

    if (selectedAlgorithm === "merge") {
      mergeSort();
    }

    if (selectedAlgorithm === "quick") {
      quickSort();
    }
  }

  function getTimeComplexity() {
    if (selectedAlgorithm === "merge" || selectedAlgorithm === "quick") {
      return "O(n log n)";
    }

    return "O(n²)";
  }

  function getSpaceComplexity() {
    if (selectedAlgorithm === "merge") {
      return "O(n)";
    }

    if (selectedAlgorithm === "quick") {
      return "O(log n)";
    }

    return "O(1)";
  }

  async function linearSearch() {
    setIsSearching(true);
    setSearchMiddle(null);
    setEliminatedIndices([]);
    setFoundIndex(null);
    setSearchComparisons(0);

    for (let i = 0; i < searchArray.length; i++) {
      setSearchMiddle(i);
      setSearchComparisons((count) => count + 1);

      await sleep(speedRef.current);

      if (searchArray[i] === searchTarget) {
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

  function startSearch() {
    if (selectedSearchAlgorithm === "binary") {
      binarySearch();
    }

    if (selectedSearchAlgorithm === "linear") {
      linearSearch();
    }
  }

  async function binarySearch() {
    setIsSearching(true);
    setSearchMiddle(null);
    setEliminatedIndices([]);
    setFoundIndex(null);
    setSearchComparisons(0);

    let left = 0;
    let right = searchArray.length - 1;

    while (left <= right) {
      const middle = Math.floor((left + right) / 2);

      setSearchMiddle(middle);
      setSearchComparisons((count) => count + 1);

      await sleep(speedRef.current);

      if (searchArray[middle] === searchTarget) {
        setFoundIndex(middle);
        setSearchMiddle(null);
        setIsSearching(false);
        return;
      }

      if (searchArray[middle] < searchTarget) {
        const eliminated = Array.from(
          { length: middle - left + 1 },
          (_, index) => left + index,
        );

        setEliminatedIndices((indices) => [...indices, ...eliminated]);

        left = middle + 1;
      } else {
        const eliminated = Array.from(
          { length: right - middle + 1 },
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
        {activeSection === "sorting" && (
          <>
            <section className="controls-panel">
              <div>
                <label>Algorithm</label>

                <select
                  value={selectedAlgorithm}
                  disabled={isSorting}
                  onChange={(event) => {
                    setSelectedAlgorithm(event.target.value);
                    resetVisualization();
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
                  onChange={(event) => {
                    const newSize = Number(event.target.value);

                    setArraySize(newSize);

                    const newArray = Array.from(
                      { length: newSize },
                      () => Math.floor(Math.random() * 80) + 20,
                    );

                    setArray(newArray);
                    resetVisualization();
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
                  onChange={(event) => {
                    const newSpeed = 750 - Number(event.target.value);

                    setSpeed(newSpeed);
                    speedRef.current = newSpeed;
                  }}
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
                    style={{ height: `${value * 3}px` }}
                  >
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              <div className="legend">
                <div>
                  <span className="legend-box comparing-box"></span>
                  Comparing
                </div>

                {selectedAlgorithm === "selection" && (
                  <div>
                    <span className="legend-box minimum-box"></span>
                    Current Minimum
                  </div>
                )}

                {selectedAlgorithm === "insertion" && (
                  <div>
                    <span className="legend-box inserting-box"></span>
                    Inserting
                  </div>
                )}

                {selectedAlgorithm === "merge" && (
                  <>
                    <div>
                      <span className="legend-box merge-range-box"></span>
                      Merge Range
                    </div>

                    <div>
                      <span className="legend-box merge-writing-box"></span>
                      Writing
                    </div>
                  </>
                )}

                {selectedAlgorithm === "quick" && (
                  <div>
                    <span className="legend-box pivot-box"></span>
                    Pivot
                  </div>
                )}

                <div>
                  <span className="legend-box sorted-box"></span>
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

        {activeSection === "searching" && (
          <>
            <section className="controls-panel">
              <div>
                <label>Algorithm</label>

                <select
                  value={selectedSearchAlgorithm}
                  disabled={isSearching}
                  onChange={(event) => {
                    setSelectedSearchAlgorithm(event.target.value);
                    setSearchMiddle(null);
                    setEliminatedIndices([]);
                    setFoundIndex(null);
                    setSearchComparisons(0);
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
                    setSearchMiddle(null);
                    setFoundIndex(null);
                    setEliminatedIndices([]);
                    setSearchComparisons(0);
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
                  onChange={(event) => {
                    const newSpeed = 750 - Number(event.target.value);

                    setSpeed(newSpeed);
                    speedRef.current = newSpeed;
                  }}
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
                {searchArray.map((value, index) => (
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
                  <span className="legend-box search-middle-box"></span>
                  {selectedSearchAlgorithm === "binary" ? "Middle" : "Checking"}
                </div>

                <div>
                  <span className="legend-box search-eliminated-box"></span>
                  Eliminated
                </div>

                <div>
                  <span className="legend-box search-found-box"></span>
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

        {activeSection === "pathfinding" && (
          <section className="placeholder-panel">
            <h2>Pathfinding Visualizer</h2>
            <p>Pathfinding algorithms will go here later.</p>
          </section>
        )}

        {activeSection === "graphs" && (
          <section className="placeholder-panel">
            <h2>Graph Visualizer</h2>
            <p>Graph traversal algorithms will go here later.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
