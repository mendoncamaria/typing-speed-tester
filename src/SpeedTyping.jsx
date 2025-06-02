import React, { useState, useEffect, useRef } from 'react';
import './SpeedTyping.css';
import TypingArea from './TypingArea'; // Import the TypingArea component

const SpeedTypingGame = () => {
  const paragraphs = [
    'A plant is one of the most important living things that develop on the earth and is made up of stems, leaves, roots, and so on.Parts of Plants: The part of the plant that developed beneath the soil is referred to as root and the part that grows outside of the soil is known as shoot. The shoot consists of stems, branches, leaves, fruits, and flowers.Plants are made up of six main parts: roots, stems, leaves, flowers, fruits, and seeds.',
    'The root is the part of the plant that grows in the soil. The primary root emerges from the embryo.Its primary function is to provide the plant stability in the earth and make other mineral salts from the earth available to the plant for various metabolic processes There are three types of roots i.e.Tap Root, Adventitious Roots, and Lateral Root.The roots arise from the parts of the plant and not from the rhizomes roots.',
    'Stem is the posterior part that remains above the ground and grows negatively geotropic. Internodes and nodes are found on the stem.Branch, bud, leaf, petiole, flower, and inflorescence on a node are all those parts of the plant that remain above the ground and undergo negative subsoil development.The trees have brown bark and the young and newly developed stems are green.The roots arise from the parts of plant and not from the rhizomes roots.',
    'It is the blossom of a plant. A flower is the part of a plant that produces seeds, which eventually become other flowers.They are the reproductive system of a plant. Most flowers consist of 04 main parts that are sepals, petals, stamens, and carpels. The female portion of the flower is the carpels.The majority of flowers are hermaphrodites, meaning they have both male and female components.Others may consist of one of two parts and may be male or female.',
    'An aunt is a bassoon from the right perspective. As far as we can estimate, some posit the melic myanmar to be less than kutcha.One cannot separate foods from blowzy bows. The scampish closet reveals itself as a sclerous llama to those who look.A hip is the skirt of a peak.Some hempy laundries are thought of simply as orchids.A gum is a trumpet from the right perspective.A freebie flight is a wrench of the mind.Some posit the croupy.',
  ];

  const [typingText, setTypingText] = useState([]);
  const [inpFieldValue, setInpFieldValue] = useState('');
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  const intervalRef = useRef(null); // Ref to store the interval ID

  const loadParagraph = () => {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
      <span
        key={index}
        className={`char ${index === 0 ? 'active' : ''}`} // Apply 'active' to the first char
      >
        {letter}
      </span>
    ));
    setTypingText(content);
    setInpFieldValue('');
    setCharIndex(0);
    setMistakes(0);
    setIsTyping(false);
    setTimeLeft(maxTime); // Reset time on paragraph load
    setWPM(0); // Reset WPM
    setCPM(0); // Reset CPM

    // Clear any existing active classes and set the first character as active
    const characters = document.querySelectorAll('.char');
    characters.forEach((span) => {
      span.classList.remove('correct', 'wrong', 'active');
    });
    if (characters.length > 0) {
      characters[0].classList.add('active');
    }
  };

  const calculateMetrics = (timePassed) => {
    // Calculate CPM
    const correctChars = charIndex - mistakes;
    let cpm = (correctChars / timePassed) * 60;
    cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
    setCPM(parseInt(cpm, 10));

    // Calculate WPM
    let wpm = (correctChars / 5 / timePassed) * 60;
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    setWPM(Math.round(wpm));
  };

  const initTyping = (event) => {
    const characters = document.querySelectorAll('.char');
    const typedChar = event.target.value;
    setInpFieldValue(typedChar); // Update the input field value

    if (!isTyping && timeLeft > 0 && charIndex < characters.length) {
      setIsTyping(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setIsTyping(false);
          }
          // Calculate metrics every second
          const timePassed = maxTime - newTime;
          calculateMetrics(timePassed);
          return newTime;
        });
      }, 1000);
    }

    if (charIndex < characters.length && timeLeft > 0) {
      const currentSpan = characters[charIndex];
      const currentChar = currentSpan.innerText;

      if (typedChar.length > charIndex) {
        // User typed a new character
        if (typedChar[charIndex] === currentChar) {
          currentSpan.classList.remove('wrong');
          currentSpan.classList.add('correct');
        } else {
          currentSpan.classList.add('wrong');
          setMistakes((prevMistakes) => prevMistakes + 1);
        }
        currentSpan.classList.remove('active');
        setCharIndex((prevIndex) => prevIndex + 1);
        if (charIndex + 1 < characters.length) {
          characters[charIndex + 1].classList.add('active');
        } else {
          // End of paragraph
          clearInterval(intervalRef.current);
          setIsTyping(false);
        }
      } else if (typedChar.length < charIndex) {
        // User pressed Backspace
        const prevSpan = characters[charIndex - 1];
        if (prevSpan.classList.contains('correct')) {
          prevSpan.classList.remove('correct');
        } else if (prevSpan.classList.contains('wrong')) {
          prevSpan.classList.remove('wrong');
          setMistakes((prevMistakes) => prevMistakes - 1);
        }
        currentSpan.classList.remove('active');
        prevSpan.classList.add('active');
        setCharIndex((prevIndex) => prevIndex - 1);
      }

      // Recalculate metrics immediately after each character is typed
      const timePassed = maxTime - timeLeft;
      if (timePassed > 0) {
        calculateMetrics(timePassed);
      }
    } else {
      clearInterval(intervalRef.current);
      setIsTyping(false);
    }
  };

  const resetGame = () => {
    clearInterval(intervalRef.current); // Clear any running interval
    loadParagraph();
  };

  useEffect(() => {
    loadParagraph();
    // Focus the input field on component mount
    const inputField = document.getElementsByClassName('input-field')[0];
    if (inputField) {
      inputField.focus();
    }
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      setIsTyping(false);
    }
  }, [timeLeft]);

  return (
    <div className="container">
      <input
        type="text"
        className="input-field"
        value={inpFieldValue}
        onChange={initTyping}
      />
      <TypingArea
        typingText={typingText}
        inpFieldValue={inpFieldValue}
        timeLeft={timeLeft}
        mistakes={mistakes}
        WPM={WPM}
        CPM={CPM}
        initTyping={initTyping}
        resetGame={resetGame}
      />
    </div>
  );
};

export default SpeedTypingGame;