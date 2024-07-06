import "./App.css";
import { useEffect, useState } from "react";
import { Button, Flex, Segmented } from "antd";

let nextId = 0;

function App() {
  const [quote, setQuote] = useState("");
  const [authors, setAuthors] = useState([]);

  const boxStyle = {
    width: "100%",
    height: 120,
  };

  useEffect(() => {
    fetch("https://api.quotable.io/quotes/random?limit=4")
      .then((response) => response.json())
      .then((data) => {
        // Choose one random quote
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        setQuote(randomQuote.content);

        data.forEach((quote) => {
          setAuthors([...authors, { id: nextId++, name: quote.author }]);
          console.log(quote.author, "quote");
          console.log(authors, "author");
        });
      });
  }, []);

  return (
    <div className="App">
      <div className="quote-quest">
        <div className="quote-wrapper">
          <div className="quote">{quote}</div>
        </div>

        <div className="answer">
          <Button type="primary" className="btn">
            Primary
          </Button>
          <Button type="primary" className="btn">
            Primary
          </Button>
          <Button type="primary" className="btn">
            Primary
          </Button>
          <Button type="primary" className="btn">
            Primary
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
