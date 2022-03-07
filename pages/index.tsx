import type { NextPage } from 'next';
import { useState } from 'react';

const Landing: NextPage = () => {
  const [number, setNumber] = useState(0);
  return (
    <>
      <h1>Elemental Arena</h1>
      <hr />
      <button
        type="button"
        onClick={() => setNumber(number + 1)}
      >
        #
        {number}
      </button>
    </>
  );
};

export default Landing;
