import { createContext, FC, useEffect, useRef, useState } from "react";
// import { CloseIcon, SettingsIcon, UpDownIcon } from "@chakra-ui/icons";
import "./style.scss";
import { useDisclosure } from "@chakra-ui/react";
// import CustomDrawer from "../Drawer";
// import Settings from "../Settings";
import { DisplayModes, SettingsProviderType } from "./types";
import useCountDownTimer from "../../utils/useCountDownTimer";
import {
  MdPlayArrow,
  MdPause,
  MdStop,
  MdQueryBuilder,
  MdCached,
  MdDarkMode,
  MdLightMode,
  MdSettings,
  MdFullscreen,
  MdFullscreenExit,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  // PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import TimerForm from "../TimerForm";
import Clock from "../Clock";
import TimeUp from "../TimeUp";
import Timer from "../Timer";
import alarm from "../../assets/audio/alarm.mp3";
// import CustomTooltip from "../CustomTooltip";

export const SettingsContext = createContext<SettingsProviderType>({});

declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
  }

  interface HTMLElement {
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
  }
}

const Home: FC = () => {
  const { Provider } = SettingsContext;

  const inputRef = useRef(null);

  const viewTypes = {
    CLOCK: "clock",
    TIMER: "timer",
    TIMEUP: "time-up",
  };

  const [view, setView] = useState(viewTypes.CLOCK);

  const [muted, setMuted] = useState<boolean>(true);

  const toggleMute = () => setMuted(!muted);

  const [countDownMin, setCountDownMin] = useState<any>("");

  const {
    hours,
    minutes,
    seconds,
    resetTimer,
    startTimer,
    pauseTimer,
    stopTimer,
    isPaused,
    timerStarted,
    timeUp,
    countDown,
    setCountDown,
  } = useCountDownTimer(countDownMin, true);

  const play = () => {
    setShowClock(false);
    startTimer();
  };

  const setContDownTime = (value: any) => {
    setCountDown(value * 60 * 1000);
    setCountDownMin(value);
    onCloseP();
    setShowClock(false);
  };

  const [showClock, setShowClock] = useState<boolean>(true);
  const toggleClock = () => {
    setShowClock(!showClock);
  };

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const displayModes: DisplayModes = {
    systemDefault: "1",
    lightMode: "2",
    darkMode: "3",
  };
  const [displayPreference, setDisplayPreference] = useState<string>(
    displayModes.darkMode
  );

  // const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenP,
    onOpen: onOpenP,
    onClose: onCloseP,
  } = useDisclosure();

  function enterFullScreen(element: HTMLElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
      element.mozRequestFullscreen(); // Firefox
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Safari
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE/Edge
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  const fullScreenMode = () => {
    const container = document.getElementById("container");
    if (container !== null) {
      enterFullScreen(container);
    }
  };

  const toggleFullScreen = (e: any) => {
    e.stopPropagation();
    if (isFullScreen) {
      exitFullscreen();
    } else {
      fullScreenMode();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", (evt) => {
      if (window.innerHeight == screen.height) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    });

    return () => {
      window.removeEventListener("resize", (evt) => {
        if (window.innerHeight == screen.height) {
          setIsFullScreen(true);
        } else {
          setIsFullScreen(false);
        }
      });
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("container");

    if (
      displayPreference === displayModes.systemDefault &&
      container !== null
    ) {
      container.classList.remove("darkMode");
      container.classList.remove("lightMode");
    } else if (
      displayPreference === displayModes.lightMode &&
      container !== null
    ) {
      container.classList.remove("darkMode");
      container.classList.add("lightMode");
    } else if (
      displayPreference === displayModes.darkMode &&
      container !== null
    ) {
      container.classList.add("darkMode");
      container.classList.remove("lightMode");
    }
  }, [displayPreference]);

  useEffect(() => {
    const container = document.getElementById("container");
    if (!showClock) {
      if ((countDown < 10000 || timeUp) && container !== null) {
        container.classList.add("timeUp");
        container.classList.remove("redBg");
        container.classList.remove("greenBg");
        container.classList.remove("orangeBg");
        container.classList.remove("normalBg");
      } else if (countDown < 60000 && container !== null) {
        container.classList.add("redBg");
        container.classList.remove("timeUp");
        container.classList.remove("greenBg");
        container.classList.remove("orangeBg");
        container.classList.remove("normalBg");
      } else if (countDown < 120000 && container !== null) {
        container.classList.add("orangeBg");
        container.classList.remove("timeUp");
        container.classList.remove("greenBg");
        container.classList.remove("redBg");
        container.classList.remove("normalBg");
      } else if (container !== null) {
        container.classList.add("greenBg");
        container.classList.remove("timeUp");
        container.classList.remove("orangeBg");
        container.classList.remove("redBg");
        container.classList.remove("normalBg");
      }
    } else if (container !== null) {
      container.classList.add("normalBg");
      container.classList.remove("timeUp");
      container.classList.remove("orangeBg");
      container.classList.remove("redBg");
      container.classList.remove("greenBg");
    }
  }, [countDown, timeUp, showClock]);

  useEffect(() => {
    window.addEventListener("keydown", (evt) => {
      if (evt.code === "Space") {
        if (timerStarted) {
          pauseTimer();
        } else {
          play();
        }
      }
    });

    return () => {
      window.removeEventListener("keydown", (evt) => {
        if (evt.code === "Space") {
          if (timerStarted) {
            pauseTimer();
          } else {
            play();
          }
        }
      });
    };
  }, [timerStarted]);

  useEffect(() => {
    if (showClock) {
      setView(viewTypes.CLOCK);
    } else if (timeUp) {
      setView(viewTypes.TIMEUP);
    } else {
      setView(viewTypes.TIMER);
    }
  }, [showClock, timeUp]);

  return (
    <Provider value={{ displayModes, displayPreference, setDisplayPreference }}>
      <div
        id="container"
        className={`container`}
        onDoubleClick={toggleFullScreen}
      >
        {timeUp && (
          <audio autoPlay muted={muted} loop>
            <source src={alarm} type="audio/ogg" />
          </audio>
        )}
        {/* {isOpen && (
          <CustomDrawer title="Settings" {...{ isOpen, onClose }}>
            <Settings />
          </CustomDrawer>
        )} */}
        <div className="iconContainer">
          <div className="left">
            <MdQueryBuilder
              title="Toggle clock"
              className="icon"
              onClick={toggleClock}
            />

            {!timerStarted || isPaused || timeUp ? (
              <MdPlayArrow
                title="Start timer"
                className="icon"
                onClick={play}
              />
            ) : null}
            {timerStarted && !isPaused && !timeUp && (
              <MdPause
                title="Pause timer"
                className="icon"
                onClick={pauseTimer}
              />
            )}

            <MdStop title="Stop timer" className="icon" onClick={stopTimer} />

            <MdCached
              title="Restart timer"
              className="icon"
              onClick={resetTimer}
            />

            <Popover
              isOpen={isOpenP}
              initialFocusRef={inputRef}
              onOpen={onOpenP}
              onClose={onCloseP}
              // placement="bottom"
              closeOnBlur={true}
              trigger="hover"
            >
              <PopoverTrigger>
                <button
                  className="popover-trigger-button"
                  aria-pressed="false"
                  type="reset"
                >
                  <MdSettings title="Set timer" className="icon" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="popover-content">
                {/* <PopoverArrow /> */}
                <PopoverCloseButton className="popover-close-button" />
                <PopoverBody>
                  <TimerForm ref={inputRef} {...{ setContDownTime }} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
          <div className="right">
            {muted ? (
              <MdVolumeOff
                title="Toggle audio on and off (currently off)"
                className="icon"
                onClick={toggleMute}
              />
            ) : (
              <MdVolumeUp
                title="Toggle audio on and off (currently on)"
                className="icon"
                onClick={toggleMute}
              />
            )}
            {displayPreference === displayModes.darkMode ? (
              <MdDarkMode
                title="Toggle light and dark modes (currently dark mode)"
                className="icon"
                onClick={() => setDisplayPreference(displayModes.lightMode)}
              />
            ) : (
              <MdLightMode
                title="Toogle light and dark modes (currently light mode)"
                className="icon"
                onClick={() => setDisplayPreference(displayModes.darkMode)}
              />

              // <></>
            )}
            {isFullScreen ? (
              <MdFullscreenExit
                title="Enter fullscreen"
                className="icon"
                onClick={exitFullscreen}
              />
            ) : (
              <MdFullscreen
                title="Enter fullscreen"
                className="icon"
                onClick={fullScreenMode}
              />
            )}
          </div>
        </div>

        {view === viewTypes.CLOCK && <Clock />}
        {view === viewTypes.TIMEUP && <TimeUp />}
        {view === viewTypes.TIMER && (
          <Timer
            {...{
              hours,
              minutes,
              seconds,
              timerStarted,
              countDown,
              setCountDown,
            }}
          />
        )}
      </div>
    </Provider>
  );
};

export default Home;
