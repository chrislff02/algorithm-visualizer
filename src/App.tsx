import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [arraySize, setArraySize] = useState(8);

  const [array, setArray] = useState([42, 88, 21, 65, 35, 97, 53, 74]);

  const [comparing, setComparing] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(400);
  const speedRef = useRef(400);

  function generateNewArray() {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 80) + 20,
    );

    setArray(newArray);
    setComparing([]);
    setSortedIndices([]);
    setComparisons(0);
    setSwaps(0);
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function bubbleSort() {
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    setComparing([]);
    setSortedIndices([]);

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

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">INTERACTIVE CS TOOL</p>
          <h1>Algorithm Visualizer</h1>
        </div>

        <nav className="nav">
          <button>Sorting</button>
          <button>Searching</button>
          <button>Pathfinding</button>
          <button>Graphs</button>
        </nav>
      </header>

      <main className="main">
        <section className="controls-panel">
          <div>
            <label>Algorithm</label>

            <select disabled={isSorting}>
              <option>Bubble Sort</option>
              <option>Merge Sort</option>
              <option>Quick Sort</option>
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
                setComparing([]);
                setSortedIndices([]);
                setComparisons(0);
                setSwaps(0);
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
            onClick={bubbleSort}
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
                  comparing.includes(index) ? "comparing" : ""
                } ${sortedIndices.includes(index) ? "sorted" : ""}`}
                style={{ height: `${value * 3}px` }}
              >
                <span>{value}</span>
              </div>
            ))}
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
            <strong>O(n²)</strong>
          </div>

          <div>
            <span>Space Complexity</span>
            <strong>O(1)</strong>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
