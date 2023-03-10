import { createContext, FC, useEffect, useRef, useState } from "react";
import "./style.scss";
import { useDisclosure } from "@chakra-ui/react";
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
  PopoverCloseButton,
} from "@chakra-ui/react";
import TimerForm from "../TimerForm";
import Clock from "../Clock";
import TimeUp from "../TimeUp";
import Timer from "../Timer";
import alarm from "../../assets/audio/alarm.mp3";
import alarm2 from "../../assets/audio/alarm.ogg";
import { minuteToMillisecond } from "../../utils/util";

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

const colorThemes = {
  DEFAULT: "default-theme",
  GREEN: "green-theme",
  ORANGE: "orange-theme",
  RED: "red-theme",
  BLINK: "blink",
};

const Home: FC = () => {
  const { Provider } = SettingsContext;

  const inputRef = useRef(null);

  const viewTypes = {
    CLOCK: "clock",
    TIMER: "timer",
    TIMEUP: "time-up",
  };

  const [view, setView] = useState(viewTypes.CLOCK);

  const [notificationPermission, setNotificationPermission] = useState("");

  const [classList, setClassList] = useState<string>(colorThemes.DEFAULT);
  const [displayPreferenceClass, setDisplayPreferenceClass] =
    useState<string>("dark-theme");

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

    if (notificationPermission === "granted") {
      new Notification("Timer Started", {
        body: `${hours} : ${minutes} : ${seconds}`,
        icon: "ProTime.png",
      });
    }
  };

  const pause = () => {
    pauseTimer();

    if (notificationPermission === "granted") {
      new Notification("Timer Paused", {
        body: `${hours} : ${minutes} : ${seconds}`,
        icon: "ProTime.png",
      });
    }
  };

  const setContDownTime = (value: any) => {
    setCountDown(minuteToMillisecond(value));
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

    if (displayPreference === displayModes.systemDefault) {
      setDisplayPreferenceClass("");
    } else if (displayPreference === displayModes.lightMode) {
      setDisplayPreferenceClass("light-theme");
    } else if (displayPreference === displayModes.darkMode) {
      setDisplayPreferenceClass("dark-theme");
    }
  }, [displayPreference]);

  useEffect(() => {
    if (!showClock) {
      if (timeUp) {
        setClassList(`${colorThemes.RED} ${colorThemes.BLINK}`);
      } else if (countDown < 10000) {
        setClassList(`${colorThemes.ORANGE} ${colorThemes.BLINK}`);
      } else if (countDown < 60000) {
        setClassList(colorThemes.ORANGE);
      } else {
        setClassList(colorThemes.GREEN);
      }
    } else {
      setClassList(colorThemes.DEFAULT);
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

  useEffect(() => {
    Notification.requestPermission().then((perm) =>
      setNotificationPermission(perm)
    );
  }, []);

  useEffect(() => {
    if (timeUp && notificationPermission === "granted") {
      new Notification("Time up", {
        body: `${hours} : ${minutes} : ${seconds}`,
        icon: "ProTime.png",
      });
    }
  }, [timeUp, notificationPermission]);

  return (
    <Provider value={{ displayModes, displayPreference, setDisplayPreference }}>
      <div
        id="container"
        className={`container ${classList} ${displayPreferenceClass}`}
        onDoubleClick={toggleFullScreen}
      >
        {timeUp && (
          <audio autoPlay muted={muted} loop>
            <source src={alarm} type="audio/mpeg" />
            <source src={alarm2} type="audio/ogg" />
          </audio>
        )}

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
              <MdPause title="Pause timer" className="icon" onClick={pause} />
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
