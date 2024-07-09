import "../styles/App.css";
import { useEffect, useState } from "react";
import { Button } from "antd";

let nextId = 0;

function App() {
  const [quote, setQuote] = useState("");
  const [authors, setAuthors] = useState([]);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetch("https://api.quotable.io/quotes/random?limit=4")
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
  }, []);

  const checkAnswer = (author) => {
    console.log(author, "author", answer, "answer");
    if (author === answer) {
      alert("Correct");
    } else {
      alert("Wrong");
    }
  };

  return (
    <div className="App">
      <div className="quote-quest">
        <div className="quote-wrapper">
          <div className="quote">{quote}</div>
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
      </div>
    </div>
  );
}

export default App;
