import { useEffect, useState } from "react";
import ndjsonStream from 'can-ndjson-stream';
const Aristotle = () => {
    const [prompt, setPrompt] = useState("")
    const [answer, setAnswer] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        setAnswer("")
        setIsLoading(true)
        fetchData()
    }

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                model: 'aristotle',
                prompt: prompt,
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
                result = value.response ? result + value.response : result
                setIsLoading(false)
                setAnswer(result);
            }
            
            reader.releaseLock();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <h1>Ask Aristotle</h1>
            <img src="https://www.aplustopper.com/wp-content/uploads/2020/08/Aristotle-Biography-300x300.jpg" height={300}></img>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your question..."
                />
                <button>Enlighten me!</button>
            </form>
            <div>
                <p>
                {isLoading ? "Loading..." : answer}
                </p>
            </div>

        </>
    )
}

export default Aristotle;