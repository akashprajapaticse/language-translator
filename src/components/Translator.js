import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faCopy,
  faExchange,
} from "@fortawesome/free-solid-svg-icons";
import languages from "../languages";

function Translator() {
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');

  const handleExchange = () => {
    // Swap text content
    let tempValue = fromText;
    setFromText(toText);
    setToText(tempValue);

    // Swap language selection
    let tempLanguage = fromLang;
    setFromLang(toLang);
    setToLang(tempLanguage);
  };

  const handleIconClick = (icon, type) => {
    if (icon.classList.contains('fa-copy')) {
      if (type === 'from') {
        copyContent(fromText);
      } else {
        copyContent(toText);
      }
    } else {
      if (type === 'from') {
        utterText(fromText, fromLang);
      } else {
        utterText(toText, toLang);
      }
    }
  };

  const copyContent = (text) => {
    navigator.clipboard.writeText(text);
  };

  const utterText = (text, lang) => {
    const utter = new SpeechSynthesisUtterance();
    utter.text = text;
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
  };

  const handleTranslate = () => {
    let url = `https://api.mymemory.translated.net/get?q=${fromText}!&langpair=${fromLang}|${toLang}`;
    fetch(url).then((res) =>  res.json()).then((data) => {
      setToText(data.responseData.translatedText);
    })
  }

  return (
    <>
      <div className="wrapper">
        <div className="text-input">
          <textarea
            className="from-text"
            name="from"
            id="from"
            placeholder="Enter Text"
            value={fromText}
            onChange={(event) => setFromText(event.target.value)}
          ></textarea>
          <textarea
            className="to-text"
            name="to"
            id="to"
            value={toText}
            readOnly
          ></textarea>
        </div>

        <ul className="controls">
          <li className="row from">
            <div className="icons">
              <FontAwesomeIcon
                icon={faVolumeHigh}
                className="icon"
                onClick={(event) => handleIconClick(event.target, 'from')}
              />
              <FontAwesomeIcon
                icon={faCopy}
                className="icon"
                onClick={(event) => handleIconClick(event.target, 'from')}
              />
            </div>
            <select
              value={fromLang}
              onChange={(event) => setFromLang(event.target.value)}
            >
              {Object.entries(languages).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </li>
          <li className="exchange" onClick={handleExchange}>
            <FontAwesomeIcon icon={faExchange} className="icon" />
          </li>
          <li className="row to">
            <div className="icons">
              <FontAwesomeIcon
                icon={faCopy}
                className="icon"
                onClick={(event) => handleIconClick(event.target, 'to')}
              />
              <FontAwesomeIcon
                icon={faVolumeHigh}
                className="icon"
                onClick={(event) => handleIconClick(event.target, 'to')}
              />
            </div>
            <select
              value={toLang}
              onChange={(event) => setToLang(event.target.value)}
            >
              {Object.entries(languages).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </li>
        </ul>
        <button onClick={handleTranslate}>Translate</button>
      </div>
    </>
  );
}

export default Translator;
