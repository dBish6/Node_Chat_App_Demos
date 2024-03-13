import { Flex, Box, Text } from "@radix-ui/themes";
import * as Progress from "@radix-ui/react-progress";
import { useState, useEffect } from "react";

import { delay } from "async-delay-callback";
import history from "../../utils/history";
import { socket } from "../../services/socketConfig";

const OverlayLoader = ({ setLoading }) => {
  const [progress, setProgress] = useState(1),
    ANIMATION_DURATION = 660;

  const loadingComplete = () =>
    delay(ANIMATION_DURATION, () => setLoading(false));

  useEffect(() => {
    (async () => {
      let checkConnectionInterval;
      await delay(1000, () => setProgress(60));

      if (socket.connected) {
        await delay(1500, () => setProgress(100));
        loadingComplete();
      } else {
        let reties = 0;
        checkConnectionInterval = setInterval(() => {
          if (reties === 8) {
            clearInterval(checkConnectionInterval);
            loadingComplete();
            history.push("/error-500");
          }

          if (socket.connected) {
            clearInterval(checkConnectionInterval);
            setProgress(100);
            loadingComplete();
          }
          reties++;
        }, 1000);
      }

      return () => clearTimeout(checkConnectionInterval);
    })();
  }, []);

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        position: "fixed",
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "rgba(26, 26, 26, 0.8)",
        backdropFilter: "blur(40px)",
        zIndex: 10,
      }}
    >
      <Box>
        <Text size="3" style={{ opacity: 0.95 }}>
          Loading...
        </Text>
        <Progress.Root
          style={{
            overflow: "hidden",
            backgroundColor: "var(--accent-a5)",
            borderRadius: "6px",
            width: "320px",
            height: "18px",
            marginTop: "4px",
            transform: "translateZ(0)",
          }}
          value={progress}
        >
          <Progress.Indicator
            style={{
              backgroundColor: "var(--accent-a11)",
              width: `${progress}%`,
              height: "100%",
              transition: `width ${ANIMATION_DURATION}ms cubic-bezier(0.65, 0, 0.35, 1)`,
            }}
          />
        </Progress.Root>
      </Box>
    </Flex>
  );
};

export default OverlayLoader;
