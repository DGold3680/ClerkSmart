import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../context/AppContext";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { getPatientResponse } from "../services/geminiService";
import { Icon } from "../components/Icon";
import { Message } from "../types";

const PermissionModal: React.FC<{
  onAllow: () => void;
  onDeny: () => void;
}> = ({ onAllow, onDeny }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-slate-900 dark:text-white text-center max-w-sm">
      <Icon name="mic" size={40} className="mx-auto text-teal-400 mb-4" />
      <h2 className="text-xl font-bold mb-2">Microphone Access</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        ClerkSmart needs access to your microphone to enable voice conversations
        with the patient.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={onDeny}
          className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Deny
        </button>
        <button
          onClick={onAllow}
          className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg font-semibold text-white hover:scale-105 transform transition-transform"
        >
          Allow
        </button>
      </div>
    </div>
  </div>
);

const ClerkingScreen: React.FC = () => {
  const router = useRouter();
  const { caseState, addMessage } = useAppContext();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error: speechError,
  } = useSpeechRecognition();

  const [isPatientThinking, setIsPatientThinking] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [inputText, setInputText] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [caseState.messages, isListening, isPatientThinking, inputText]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !caseState.caseDetails) return;

      setApiError(null);
      const studentMessage: Message = {
        sender: "student",
        text,
        timestamp: new Date().toISOString(),
      };
      addMessage(studentMessage);
      setInputText("");

      setIsPatientThinking(true);

      // The history sent to the API includes the new student message
      const updatedHistory = [...caseState.messages, studentMessage];

      try {
        const responseText = await getPatientResponse(
          updatedHistory,
          caseState.caseDetails
        );
        const patientMessage: Message = {
          sender: "patient",
          text: responseText,
          timestamp: new Date().toISOString(),
        };
        addMessage(patientMessage);
      } catch (err) {
        console.error(err);
        let errorText = "Sorry, there was a connection issue.";
        if (err instanceof Error) {
          errorText = err.message.startsWith("QUOTA_EXCEEDED")
            ? err.message.split(": ")[1]
            : err.message;
        }
        setApiError(errorText); // Set API error state to display to user
        const errorMessage: Message = {
          sender: "system",
          text: `Error: ${errorText}`,
          timestamp: new Date().toISOString(),
        };
        addMessage(errorMessage);
      } finally {
        setIsPatientThinking(false);
      }
    },
    [addMessage, caseState.messages, caseState.caseDetails]
  );

  // Effect to handle sending transcript from speech recognition
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      handleSendMessage(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleMicClick = async () => {
    if (isListening) {
      stopListening();
      return;
    }
    try {
      // Check for permission first
      if (typeof window !== "undefined" && navigator?.permissions) {
        const permissionStatus = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        if (permissionStatus.state === "prompt") {
          setShowPermissionModal(true);
          return;
        }
        if (permissionStatus.state === "denied") {
          alert(
            "Microphone access was denied. Please enable it in your browser settings."
          );
          return;
        }
      }
      startListening();
    } catch (err) {
      console.error("Error checking mic permissions:", err);
      // Fallback for browsers that don't support permissions.query
      handlePermissionAllow();
    }
  };

  const handlePermissionAllow = () => {
    setShowPermissionModal(false);
    if (typeof window !== "undefined" && navigator?.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => startListening())
        .catch((err) =>
          alert(
            "Microphone access is required. Please enable it in your browser settings."
          )
        );
    }
  };

  const handlePermissionDeny = () => {
    setShowPermissionModal(false);
    alert("Microphone access is required for voice interaction.");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  if (!caseState.department || !caseState.caseDetails) {
    useEffect(() => {
      router.push("/departments");
    }, [router]);
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      {showPermissionModal && (
        <PermissionModal
          onAllow={handlePermissionAllow}
          onDeny={handlePermissionDeny}
        />
      )}

      <header
        className="fixed top-0 left-0 right-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700 p-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/departments")}
            className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white"
          >
            <Icon name="arrow-left" size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {caseState.department.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Patient Clerking
            </p>
          </div>
          <button
            onClick={() => router.push("/summary")}
            className="font-semibold text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 transition-colors pr-2"
          >
            Finish
          </button>
        </div>
      </header>

      <main className="flex-grow pt-28 pb-32 overflow-y-auto">
        <div className="flex flex-col items-center mb-8 px-4">
          <div className="relative">
            <img
              src={caseState.department.avatar}
              alt="Patient Avatar"
              className="w-24 h-24 rounded-full border-4 border-slate-200 dark:border-slate-700"
            />
            {(isListening || isPatientThinking) && (
              <div className="absolute inset-0 rounded-full border-2 border-teal-400 animate-pulse"></div>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {isPatientThinking
              ? "Patient is thinking..."
              : isListening
                ? "Listening..."
                : "Ready to talk"}
          </p>
        </div>

        <div className="space-y-4 px-4 max-w-4xl mx-auto">
          {caseState.messages.map((msg: Message, index: number) => {
            // Special handling for the first message (visual assessment)
            if (
              index === 0 &&
              msg.sender === "system" &&
              msg.text.includes("Visual Assessment:")
            ) {
              // Split the message into parts
              const parts = msg.text.split("Visual Assessment:");
              const introText = parts[0].trim();
              const remainingText = parts[1]?.trim();
              
              // Further split to separate visual assessment and opening statement
              const visualAndOpening = remainingText?.split("Opening Statement:") || [];
              const visualCue = visualAndOpening[0]?.trim();
              const openingStatement = visualAndOpening[1]?.trim();

              return (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4 mb-8"
                >
                  {/* Pill-shaped card for intro text */}
                  <div className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-medium">
                    {introText}
                  </div>

                  {/* Notification card for visual cue */}
                  {visualCue && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl w-full">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-center w-full mb-2.5">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>

                          </div>
                          <h4 className="ml-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
                              Visual Assessment{" "}
                            </h4>
                            </div>

                          <p className="text-sm text-blue-800 dark:text-blue-200 text-left md:text-center whitespace-pre-wrap">
                            {visualCue}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Opening statement card */}
                  {openingStatement && (
                    <div className="bg-green-50 hidden md:flex dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-2xl w-full">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-center w-full mb-2.5">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h4 className="ml-2 text-sm font-semibold text-green-900 dark:text-green-100">
                              Opening Statement
                            </h4>
                          </div>

                          {/* Handle pediatric speaker indicators in opening statement */}
                          {(openingStatement.includes("[CHILD]:") || openingStatement.includes("[CAREGIVER]:")) ? (
                            <div className="text-sm text-green-800 dark:text-green-200 text-left md:text-center">
                              {(() => {
                                const cleanedStatement = openingStatement.replace(/"/g, "");
                                const isChild = cleanedStatement.startsWith("[CHILD]:");
                                const speaker = isChild ? "Child" : "Caregiver";
                                const statementText = cleanedStatement.replace(/^\[(CHILD|CAREGIVER)\]:\s*/, "");
                                
                                return (
                                  <div>
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                      <div className={`w-3 h-3 rounded-full ${isChild ? 'bg-blue-400' : 'bg-orange-400'}`}></div>
                                      <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                                        {speaker} says:
                                      </span>
                                    </div>
                                    <p className="italic">"{statementText}"</p>
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            <p className="text-sm text-green-800 dark:text-green-200 text-left md:text-center whitespace-pre-wrap italic">
                              {openingStatement}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Regular message handling
            return (
              <div
                key={index}
                className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-2xl whitespace-pre-wrap ${
                    msg.sender === "student"
                      ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-br-lg"
                      : msg.sender === "patient"
                        ? "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white rounded-bl-lg"
                        : "bg-transparent text-slate-500 dark:text-slate-400 text-center w-full text-sm"
                  }`}
                >
                  {/* Handle pediatric speaker indicators */}
                  {msg.sender === "patient" && (msg.text.startsWith("[CHILD]:") || msg.text.startsWith("[CAREGIVER]:")) ? (
                    <div>
                      {(() => {
                        const isChild = msg.text.startsWith("[CHILD]:");
                        const speaker = isChild ? "CHILD" : "CAREGIVER";
                        const responseText = msg.text.replace(/^\[(CHILD|CAREGIVER)\]:\s*/, "");
                        
                        return (
                          <>
                            <div className="flex items-center space-x-2 mb-2 pb-1 border-b border-slate-300 dark:border-slate-600">
                              <div className={`w-3 h-3 rounded-full ${isChild ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                {isChild ? 'Child' : 'Caregiver'}
                              </span>
                            </div>
                            <div>{responseText}</div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            );
          })}
          {isListening && (
            <div className="flex justify-end">
              <div className="max-w-xs md:max-w-md p-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-br-lg">
                {transcript || "..."}
              </div>
            </div>
          )}
          {isPatientThinking && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-lg">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer
        className="fixed bottom-0 left-0 right-0 bg-slate-100 dark:bg-slate-800 z-10 border-t border-slate-200 dark:border-slate-700 p-2 transition-colors duration-300"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
      >
        <div className="flex items-end max-w-4xl mx-auto gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-grow bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-600 resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={
              inputText.trim()
                ? () => handleSendMessage(inputText)
                : handleMicClick
            }
            disabled={!hasRecognitionSupport || isPatientThinking}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 flex-shrink-0
                ${isListening ? "bg-red-600" : "bg-gradient-to-br from-teal-500 to-emerald-600"}
                ${isPatientThinking ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
                `}
          >
            {inputText.trim() ? (
              <Icon name="send" size={24} />
            ) : (
              <Icon name={isListening ? "mic-off" : "mic"} size={24} />
            )}
          </button>
        </div>
        {!hasRecognitionSupport && (
          <p className="text-red-400 text-xs text-center mt-1">
            Voice input not supported on this browser.
          </p>
        )}
        {(speechError || apiError) && (
          <p className="text-red-400 text-xs text-center mt-1 max-w-xs mx-auto">
            {speechError || apiError}
          </p>
        )}
      </footer>
    </div>
  );
};

export default ClerkingScreen;
