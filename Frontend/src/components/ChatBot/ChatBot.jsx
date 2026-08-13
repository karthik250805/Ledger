import { useState } from "react";
import {
    FaRobot,
    FaPaperPlane,
    FaTimes
} from "react-icons/fa";

import "./Chatbot.css";
import { askChatbot } from "../../API/api";

function Chatbot() {

    const [isOpen, setIsOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);


    const handleSend = async () => {

        const userMessage = message.trim();

        if (!userMessage || loading) {
            return;
        }

        // Show user's message
        setMessages((previousMessages) => [
            ...previousMessages,
            {
                sender: "user",
                text: userMessage
            }
        ]);

        // Clear input
        setMessage("");

        // Show loading state
        setLoading(true);

        try {

            const response =
                await askChatbot(userMessage);

            // Get Gemini response
            const botResponse =
                response.data.response;

            // Show Gemini response
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    sender: "bot",
                    text: botResponse
                }
            ]);

        } catch (error) {

            console.error(
                "Chatbot error:",
                error
            );

            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    sender: "bot",
                    text:
                        "Sorry, I couldn't process your request."
                }
            ]);

        } finally {

            setLoading(false);
        }
    };


    return (
        <>
            {/* Floating chatbot button */}

            {!isOpen && (

                <button
                    className="chatbot-floating-button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open Ledger AI"
                >
                    <FaRobot />
                </button>

            )}


            {/* Chat window */}

            {isOpen && (

                <div className="chatbot-window">


                    {/* Header */}

                    <div className="chatbot-header">

                        <div className="chatbot-title">

                            <div className="chatbot-header-icon">
                                <FaRobot />
                            </div>

                            <div>

                                <h3>
                                    Ledger AI
                                </h3>

                                <span>
                                    Ask about your transactions
                                </span>

                            </div>

                        </div>


                        <button
                            className="chatbot-close"
                            onClick={() =>
                                setIsOpen(false)
                            }
                            aria-label="Close chatbot"
                        >
                            <FaTimes />
                        </button>

                    </div>


                    {/* Messages */}

                    <div className="chatbot-messages">

                        {/* Initial message */}

                        {messages.length === 0 && (

                            <div className="chatbot-message bot-message">

                                Hi! I can help you analyze your
                                transactions, expenses, income,
                                customers and loans.

                            </div>

                        )}


                        {/* Conversation */}

                        {messages.map(
                            (chat, index) => (

                                <div
                                    key={index}
                                    className={
                                        chat.sender === "user"
                                            ? "chatbot-message user-message"
                                            : "chatbot-message bot-message"
                                    }
                                >
                                    {chat.text}
                                </div>

                            )
                        )}


                        {/* Loading */}

                        {loading && (

                            <div className="chatbot-message bot-message">
                                Thinking...
                            </div>

                        )}

                    </div>


                    {/* Input */}

                    <div className="chatbot-input-area">

                        <input
                            type="text"
                            placeholder="Ask about your finances..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    handleSend();
                                }

                            }}
                            disabled={loading}
                        />


                        <button
                            onClick={handleSend}
                            className="chatbot-send-button"
                            disabled={loading}
                        >
                            <FaPaperPlane />
                        </button>

                    </div>

                </div>

            )}

        </>
    );
}

export default Chatbot;