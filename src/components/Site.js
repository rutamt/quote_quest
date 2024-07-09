import "../styles/App.css";
import options from "./ThemeSelect";
import { useEffect, useState } from "react";
import { Button, Skeleton, Cascader, Modal } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

let nextId = 0;
let roundNum = 1;

function Site() {
  const [quote, setQuote] = useState("");
  const [authors, setAuthors] = useState([]);
  const [answer, setAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(
    parseInt(localStorage.getItem("correctAnswers")) || 0
  );
  const [incorrectAnswers, setIncorrectAnswers] = useState(
    parseInt(localStorage.getItem("incorrectAnswers")) || 0
  );
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "random");
  const [roundPerformance, setRoundPerformance] = useState(
    JSON.parse(localStorage.getItem("roundPerformance")) || []
  );
  const [gameOver, setGameOver] = useState(
    JSON.parse(localStorage.getItem("gameOver")) || true
  );

  // Starts the game on component render
  useEffect(() => {
    getQuestion();
  }, []);

  useEffect(() => {
    localStorage.setItem("correctAnswers", correctAnswers);
    localStorage.setItem("incorrectAnswers", incorrectAnswers);
    localStorage.setItem("theme", theme);
    localStorage.setItem("roundPerformance", JSON.stringify(roundPerformance));
    localStorage.setItem("gameOver", JSON.stringify(gameOver));
  }, [correctAnswers, incorrectAnswers, theme, roundPerformance, gameOver]);

  // Uses able api to find quote and assigns that to a var
  const getQuestion = () => {
    clearStates();
    console.log("theme", theme);
    let url =
      theme === "random"
        ? "https://api.quotable.io/quotes/random?limit=4"
        : `https://api.quotable.io/quotes/random?tags=${theme}&limit=4`;

    console.log(url);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Choose one random quote
        console.log(data);
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        setQuote(randomQuote.content);
        setAnswer(randomQuote.author);

        data.forEach((quote) => {
          setAuthors((a) => [...a, { id: nextId++, name: quote.author }]);
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        // Handle the error here (e.g., set an error state or show a message to the user)
      });
  };

  // Clears the variables needed to start another round
  const clearStates = () => {
    setQuote("");
    setAnswer("");
    setAuthors([]);
  };

  // Checks the answer and gives feedback
  const checkAnswer = (author) => {
    console.log(author, "author", answer, "answer");
    if (author === answer) {
      alert("Correct");
      setCorrectAnswers(correctAnswers + 1);
    } else {
      alert(`Wrong, it was actually ${answer}`);
      setIncorrectAnswers(incorrectAnswers + 1);
    }
    getQuestion();
    setRoundPerformance([
      ...roundPerformance,
      {
        round: roundNum++,
        performance:
          correctAnswers + incorrectAnswers
            ? (
                (correctAnswers / (correctAnswers + incorrectAnswers)) *
                100
              ).toFixed(2)
            : 0,
      },
    ]);
  };

  // End game modal functions
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const endGame = () => {
    showModal();
  };

  // Used to change theme with cascader
  const onChange = (value) => {
    setTheme(`${value}`);
    console.log(theme);
  };

  // const resizeQuote = () => {
  //   let box = document.querySelector("#qt");
  //   console.log(box.clientHeight);
  // };

  return (
    <>
      <div className="App">
        <div className="quote-quest">
          <div className="nav-wrapper">
            <Cascader
              defaultValue={[theme]}
              options={options}
              onChange={onChange}
            ></Cascader>
            <Button
              onClick={() => {
                getQuestion();
              }}
            >
              Start
            </Button>
          </div>

          <div className="quote-wrapper">
            <div className="quote" id="qt">
              {!quote && <Skeleton active />}
              {quote}
            </div>
          </div>

          <div className="answer">
            {authors.map((author) => (
              <Button
                key={author.id}
                onClick={() => {
                  checkAnswer(author.name);
                }}
                type="primary"
                className="btn resizable"
              >
                {author.name}
              </Button>
            ))}
          </div>

          <div className="JAEWONHELP">
            {/* <h1>Correct: {correctAnswers}</h1>
            <h1>Incorrect: {incorrectAnswers}</h1> */}
            <h1>Score: {correctAnswers + -incorrectAnswers}</h1>
          </div>
          <Button onClick={endGame}>End game</Button>
          <Modal
            title="Game over"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <h2>
              Accuracy:{" "}
              {correctAnswers + incorrectAnswers
                ? (
                    (correctAnswers / (correctAnswers + incorrectAnswers)) *
                    100
                  ).toFixed(2)
                : 0}
              %
            </h2>
            <h2>Score: {correctAnswers + -incorrectAnswers}</h2>
            <LineChart width={500} height={300} data={roundPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" padding={{ left: 30, right: 30 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="performance" stroke="#82ca9d" />
            </LineChart>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Site;
