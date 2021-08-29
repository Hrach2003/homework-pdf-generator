import React, { useState } from "react";
import { ImageDropzone } from "./components/drag.component";
import { buildDoc } from "./helpers/build.doc";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <ImageDropzone />
    </div>
  );
}

export default App;
