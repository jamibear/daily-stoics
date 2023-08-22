import React, { useState, useEffect } from 'react';
import ndjsonStream from 'can-ndjson-stream';

function MyComponent() {
  const [responseData, setResponseData] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: 'speak only using two words and no more than that.',
        }),
      });

      // Process the NDJSON stream data
      const ndjson= ndjsonStream(response.body);
      const reader = ndjson.getReader()
      let result = ""
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        // result = [...result, value];
        result = result + value.response
        setResponseData(result);
      }
      
      reader.releaseLock();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
    {responseData}
    </div>
  );
}

export default MyComponent;
