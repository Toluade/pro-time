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
import { feature } from "../../utils/storedItems";

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
  const [oneBg, setOneBg] = useState(
    localStorage.getItem(feature.ONE_BG.enable) === "true" ? true : false
  );

  const [mouseOver, setMouseOver] = useState(false);

  const toggleOneBg = () => {
    setOneBg((prev) => !prev);

    if (!Boolean(localStorage.getItem(feature.ONE_BG.name))) {
      localStorage.setItem(feature.ONE_BG.name, feature.ONE_BG.options.TRUE);
    }
  };

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

    Notification.requestPermission().then((perm) =>
      setNotificationPermission(perm)
    );

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

  const setContDownTime = (value: number) => {
    setCountDown(value);
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
    if (window && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDisplayPreferenceClass("dark-theme");
    } else {
      setDisplayPreferenceClass("light-theme");
    }

    if (window) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (event) => {
          if (event.matches) {
            //dark mode
            setDisplayPreferenceClass("dark-theme");
          } else {
            //light mode
            setDisplayPreferenceClass("light-theme");
          }
        });
    }

    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", (event) => {
          if (event.matches) {
            //dark mode
            setDisplayPreferenceClass("dark-theme");
          } else {
            //light mode
            setDisplayPreferenceClass("light-theme");
          }
        });
  }, []);

  useEffect(() => {
    if (oneBg) {
      setClassList(colorThemes.DEFAULT);
      localStorage.setItem(feature.ONE_BG.enable, feature.ONE_BG.options.TRUE);
      return;
    } else {
      localStorage.setItem(feature.ONE_BG.enable, feature.ONE_BG.options.FALSE);
    }
    if (!showClock) {
      if (timeUp || countDown < countDownMin * 0.05) {
        setClassList(`${colorThemes.RED} ${colorThemes.BLINK}`);
      } else if (countDown < countDownMin * 0.2) {
        setClassList(`${colorThemes.RED} ${colorThemes.BLINK}`);
      } else if (countDown < countDownMin * 0.5) {
        setClassList(colorThemes.ORANGE);
      } else {
        setClassList(colorThemes.GREEN);
      }
    } else {
      setClassList(colorThemes.DEFAULT);
    }
  }, [countDown, timeUp, showClock, oneBg]);
  // useEffect(() => {
  //   if (oneBg) {
  //     setClassList(colorThemes.DEFAULT);
  //     localStorage.setItem(feature.ONE_BG.enable, feature.ONE_BG.options.TRUE);
  //     return;
  //   } else {
  //     localStorage.setItem(feature.ONE_BG.enable, feature.ONE_BG.options.FALSE);
  //   }
  //   if (!showClock) {
  //     if (timeUp) {
  //       setClassList(`${colorThemes.RED} ${colorThemes.BLINK}`);
  //     } else if (countDown < 10000) {
  //       setClassList(`${colorThemes.ORANGE} ${colorThemes.BLINK}`);
  //     } else if (countDown < 60000) {
  //       setClassList(colorThemes.ORANGE);
  //     } else {
  //       setClassList(colorThemes.GREEN);
  //     }
  //   } else {
  //     setClassList(colorThemes.DEFAULT);
  //   }
  // }, [countDown, timeUp, showClock, oneBg]);

  useEffect(() => {
    window.addEventListener("keydown", (evt) => {
      if (evt.code === "Space" || evt.code === "Enter") {
        if (timerStarted) {
          pauseTimer();
        } else {
          play();
        }
      }
    });

    return () => {
      window.removeEventListener("keydown", (evt) => {
        if (evt.code === "Space" || evt.code === "Enter") {
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
    if (timeUp && notificationPermission === "granted") {
      new Notification("Time up", {
        body: `${hours} : ${minutes} : ${seconds}`,
        icon: "ProTime.png",
      });
    }
  }, [timeUp, notificationPermission]);

  useEffect(() => {
    const date = new Date();

    if (
      date &&
      date.getMonth() !== feature.ONE_BG.expiryMonth &&
      date.getFullYear() !== feature.ONE_BG.expiryYear &&
      localStorage.getItem(feature.ONE_BG.name) === "true"
    ) {
      localStorage.setItem(feature.ONE_BG.name, feature.ONE_BG.options.TRUE);
    }
  }, []);

  useEffect(() => {
    const iconContainer = document.getElementById("iconContainer");
    // let timeout;
    // if (iconContainer && isFullScreen && !mouseOver) {
    //   timeout = setTimeout(() => {
    //     iconContainer.style.transition = "1s";
    //     iconContainer.style.opacity = "0";
    //   }, 3800);
    // } else if (iconContainer) {
    //   clearTimeout(timeout);
    //   iconContainer.style.transition = "0.3s";
    //   iconContainer.style.opacity = "1";
    // }

    window.addEventListener("mousemove", (event) => {
      const mouseY = event.clientY;
      if (iconContainer && !isFullScreen) {
        iconContainer.style.opacity = "1";
        return;
      }

      if (
        iconContainer &&
        mouseY >= iconContainer?.getBoundingClientRect()?.y - 350
      ) {
        iconContainer.style.opacity = "1";
      } else if (iconContainer && isFullScreen) {
        iconContainer.style.opacity = "0";
      }
    });

    return () =>
      window.removeEventListener("mousemove", (event) => {
        const mouseY = event.clientY;
        if (iconContainer && !isFullScreen) {
          iconContainer.style.opacity = "1";
          return;
        }

        if (
          iconContainer &&
          mouseY >= iconContainer?.getBoundingClientRect()?.y
        ) {
          iconContainer.style.opacity = "1";
        } else if (iconContainer && isFullScreen) {
          iconContainer.style.opacity = "0";
        }
      });
  }, [isFullScreen]);

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

        <div
          onMouseOver={() => setMouseOver(true)}
          onMouseOut={() => setMouseOver(false)}
          id="iconContainer"
          className="iconContainer"
        >
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
              // trigger="hover"
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
                  <TimerForm
                    ref={inputRef}
                    {...{ setContDownTime, toggleOneBg, oneBg }}
                  />
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
            {displayPreferenceClass === "dark-theme" ? (
              <MdLightMode
                title="Toogle light and dark modes (currently dark mode)"
                className="icon"
                onClick={() => setDisplayPreferenceClass("light-theme")}
              />
            ) : (
              <MdDarkMode
                title="Toggle light and dark modes (currently light mode)"
                className="icon"
                onClick={() => setDisplayPreferenceClass("dark-theme")}
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
