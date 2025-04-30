"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/modal";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import confetti from "canvas-confetti"; // Import confetti for dramatic effect

const LotteryPage: React.FC = () => {
  const [names, setNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState<string>("");
  const [winnersCount, setWinnersCount] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [currentRollingName, setCurrentRollingName] = useState<string>("");
  const [drumrollAudio, setDrumrollAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [clapAudio, setClapAudio] = useState<HTMLAudioElement | null>(null);

  // Load names from localStorage
  useEffect(() => {
    const storedNames = localStorage.getItem("lotteryNames");
    if (storedNames) {
      setNames(JSON.parse(storedNames));
    }
    const drumrollAudio = new Audio("/sound/drum-roll.mp3");
    const clapAudio = new Audio("/sound/clap.wav");
    setDrumrollAudio(drumrollAudio);
    setClapAudio(clapAudio);
  }, []);

  useEffect(() => {
    localStorage.setItem("lotteryNames", JSON.stringify(names));
  }, [names]);

  const addNameToList = () => {
    const newNames = currentName
      .trim()
      .split("\n")
      .filter((name) => name && !names.includes(name));

    if (newNames.length) {
      setNames([...names, ...newNames]);
      setCurrentName(""); // clear input field
    } else {
      toast.error("Please enter a valid and unique name", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      addNameToList();
    }
  };

  const copyToClipboard = () => {
    const formattedNames = winners
      .map((name, index) => `${index + 1}. ${name}`)
      .join("\n");

    navigator.clipboard.writeText(formattedNames).then(() => {
      setIsModalVisible(false);
    });
  };

  const handleRoll = () => {
    if (winnersCount > names.length) {
      toast.error("Not enough names to pick that many winners", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    setIsRolling(true); // Set rolling state to true

    // Start countdown (3, 2, 1)
    let count = 4;
    setCountdown(count); // Show 3 initially

    if (drumrollAudio) {
      drumrollAudio.loop = true; // Set loop to true if drumrollAudio is not null
      drumrollAudio.play(); // Play the audio if drumrollAudio is not null
    }

    // Display random name every 100ms while rolling
    const randomNameInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setCurrentRollingName(names[randomIndex]); // Update the current random name
    }, 300);

    const countdownInterval = setInterval(() => {
      count -= 1;
      setCountdown(count); // Update countdown
      if (count <= 0) {
        // Stop the drumroll sound once countdown reaches 0
        if (drumrollAudio) {
          drumrollAudio.loop = false;
          drumrollAudio.pause();
          drumrollAudio.currentTime = 0;
        }

        if (clapAudio) {
          clapAudio.currentTime = 0;
          clapAudio.play();

          // Set an interval to decrease the volume over the last 2 seconds
          const fadeDuration = 5; // The duration to fade the volume (in seconds)
          const fadeInterval = 50; // The interval to update the volume (in ms)

          const fadeOut = setInterval(() => {
            // Calculate the remaining time of the audio
            const remainingTime = clapAudio?.duration - clapAudio?.currentTime;

            if (remainingTime && remainingTime <= fadeDuration) {
              // Gradually reduce the volume
              const volume = remainingTime / fadeDuration;
              if (clapAudio) clapAudio.volume = volume;
            }

            // Stop the fade out and pause the audio when the time is over
            if (clapAudio?.currentTime >= clapAudio?.duration) {
              clearInterval(fadeOut);
              clapAudio?.pause();
            }
          }, fadeInterval);
        }

        // Trigger the confetti effect during the roll
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        clearInterval(countdownInterval); // Stop countdown when it reaches 0
        selectWinners(); // Select winners after countdown finishes
      }
    }, 1000);
  };

  const selectWinners = () => {
    // Randomly select winners
    const shuffledNames = [...names].sort(() => 0.5 - Math.random());
    const selectedWinners = shuffledNames.slice(0, winnersCount);

    // Remove the selected winners from the participants list
    const remainingNames = names.filter(
      (name) => !selectedWinners.includes(name)
    );
    setNames(remainingNames); // Update participants list

    setWinners(selectedWinners); // Set winners
    setIsModalVisible(true); // Show winner modal
    setIsRolling(false); // Reset rolling state after the roll is complete
  };

  const handleClearAll = () => {
    setNames([]);
    localStorage.removeItem("lotteryNames");
    setIsClearModalOpen(false);
  };

  const handleDeleteName = (name: string) => {
    const updatedNames = names.filter((n) => n !== name);
    setNames(updatedNames);
  };

  return (
    <div>
      <ToastContainer />
      <div className="w-full max-w-[1024px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-4">Lottery Page</h1>

        {/* Name Input and List */}
        <div className="flex gap-2 mb-4">
          <textarea
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            placeholder="Enter Name"
            onKeyDown={handleKeyPress}
            className="w-full rounded-1xl h-24 p-2 resize-none"
          />
          <Button onPress={addNameToList} className="h-12 flex-1 md:flex-none">
            Add Name
          </Button>
        </div>

        {/* Winners Count */}
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={winnersCount}
            onChange={(e) => setWinnersCount(Number(e.target.value))}
            min="1"
            max={names.length}
            placeholder="Number of Winners"
            className="border-2 border-gray-300 p-2 rounded w-full"
          />
          <Button
            onPress={handleRoll}
            className={`h-12 flex-1 md:flex-none ${isRolling ? "animate-pulse bg-gradient-to-br from-blue-500 to-purple-600" : "bg-blue-500"}`}
            disabled={isRolling} // Disable the button during roll
          >
            {isRolling ? "Rolling..." : "Roll"}
          </Button>

          {/* Clear Button */}
          <Button
            className="bg-red-500 text-white h-12"
            onPress={() => setIsClearModalOpen(true)}
          >
            Clear
          </Button>
        </div>

        {/* Countdown Display */}
        {countdown > 0 && (
          <div className="text-4xl font-bold text-center mb-4">{countdown}</div>
        )}

        {/* <div className="text-center text-lg font-bold mb-4">
          {isRolling ? `${currentRollingName}` : ""}
        </div> */}

        <div className="text-center text-lg font-bold mb-4">
          {isRolling && names.length > 0
            ? names
                .slice(0, winnersCount)
                .map(
                  (_, i) => names[Math.floor(Math.random() * names.length + i)]
                )
                .join(", ")
            : ""}
        </div>

        <Listbox aria-label="Name list">
          {names.map((name, index) => (
            <ListboxItem key={index} textValue={name}>
              <div className="flex justify-between items-center p-4 bg-black-100 rounded mb-2">
                <div>{name}</div>
                <Button
                  size="sm"
                  color="danger"
                  onPress={() => handleDeleteName(name)}
                >
                  Delete
                </Button>
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      </div>

      {/* Winner Modal */}
      <Modal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        aria-labelledby="modal-title"
      >
        <ModalContent>
          <ModalHeader>
            <h3 id="modal-title">Chosen Winner(s)</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              {winners.map((winner, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="text-lg font-bold text-center">
                    Winner {index + 1}: {winner}
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              variant="light"
              onClick={copyToClipboard}
              className="mr-auto"
            >
              Copy to Clipboard
            </Button>
            <Button onPress={() => setIsModalVisible(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        aria-labelledby="clear-modal-title"
      >
        <ModalContent>
          <ModalHeader>
            <h3 id="clear-modal-title">Confirm Clear All Names</h3>
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to clear all names from the list?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onPress={handleClearAll}>
              Yes, Clear All
            </Button>
            <Button onPress={() => setIsClearModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LotteryPage;
