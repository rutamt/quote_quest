import "../styles/App.css";
import options from "./ThemeSelect";
import { useEffect, useState } from "react";
import { Button, Skeleton, Cascader } from "antd";

let nextId = 0;

function Site() {
  const [quote, setQuote] = useState("");
  const [authors, setAuthors] = useState([]);
  const [answer, setAnswer] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [theme, setTheme] = useState("random");

  // Starts the game on component render
  useEffect(() => {
    getQuestion();
  }, []);

  // Uses able api to find quote and assigns that to a var
  const getQuestion = () => {
    clearStates();
    let url =
      theme === "random"
        ? "https://api.quotable.io/quotes/random?limit=4"
        : `https://api.quotable.io/quotes/random?tags=${theme}&limit=4`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Choose one random quote
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        setQuote(randomQuote.content);
        setAnswer(randomQuote.author);

        data.forEach((quote) => {
          setAuthors((a) => [...a, { id: nextId++, name: quote.author }]);
        });
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
      getQuestion();
    } else {
      alert("Wrong, it was actually ", answer);
      setIncorrectAnswers(incorrectAnswers + 1);
      getQuestion();
    }
  };

  // Used to change theme with cascader
  const onChange = (value) => {
    setTheme(value);
    console.log(theme);
  };

  return (
    <>
      <div className="App">
        <div className="quote-quest">
          <div className="quote-wrapper">
            <Cascader
              defaultValue={["random"]}
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
            <div className="quote">
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
                className="btn"
              >
                {author.name}
              </Button>
            ))}
          </div>

          <div className="JAEWONHELP">
            <h1>Correct: {correctAnswers}</h1>
            <h1>Incorrect: {incorrectAnswers}</h1>
            <h1>Score: {correctAnswers + -incorrectAnswers}</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Site;
