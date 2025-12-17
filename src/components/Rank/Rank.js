import React, { useState, useEffect } from 'react';

const Rank = ({ name, entries }) => {
  const [emoji, setEmoji] = useState('');

  const SERVERLESS_BASE_URL = process.env.REACT_APP_SERVERLESS_BASE_URL;

  useEffect(() => {
    const generateEmoji = (entries) => {
      fetch(`${SERVERLESS_BASE_URL}/rank?rank=${entries}`)
        .then((response) => response.json())
        .then((data) => {
          setEmoji(data.input);
        })
        .catch(console.log);
    };

    generateEmoji(entries);
  }, [entries, name, SERVERLESS_BASE_URL]);

  return (
    <div>
      <div className='white f3'>
        {`${name}, your current entry count is...`}
      </div>
      <div className='white f1'>{entries}</div>
      <div className='white f3'>{`Rank Badge: ${emoji}`}</div>
    </div>
  );
};

export default Rank;
