import {
  Flex,
  Text,
  ScrollArea,
  Avatar,
  Box,
  TextField,
  IconButton,
  Button,
} from "@radix-ui/themes";
import { PaperPlaneIcon, PersonIcon } from "@radix-ui/react-icons";
import { useRef, useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import { delay } from "async-delay-callback";
import debounce from "lodash.debounce";

import { socket } from "../services/socketConfig";
import getInitialMessages from "../services/getInitialMessages";
import setupSocketListeners from "../services/setupSocketListeners";
import emitUserTyping from "../services/emitUserTyping";

import { selectMessages } from "../redux/chatSelectors";

import handleSubmitMessage from "../utils/handleSubmitMessage";
import { handleLeaveRoom } from "../utils/roomHandlers";

import { Spinner } from "./loaders";

const Chat = () => {
  const scrollAreaRef = useRef(null),
    avatarCacheRef = useRef({});

  const [loading, setLoading] = useState({ value: true, error: false }),
    [usersTyping, setUsersTyping] = useState(new Set([]));

  const dispatch = useDispatch(),
    messages = useSelector(selectMessages);

  useEffect(() => {
    // Gets messages from the db, if any.
    dispatch(getInitialMessages(setLoading));
    // All chat listeners.
    setupSocketListeners(setUsersTyping);

    return () => socket.removeAllListeners();
  }, []);

  const onChange = (e) =>
    dispatch(debounce(emitUserTyping(e.target.value), 1400));

  useEffect(() => {
    if (messages.length > 1) {
      setLoading({ value: true, error: false });
      messages.forEach((msg) => {
        const userId = msg.username;
        const cachedSrc = avatarCacheRef.current[userId];

        if (!cachedSrc && userId) {
          const newSrc = `https://avatar.iran.liara.run/public/${Math.floor(
            Math.random() * 100
          )}`;
          avatarCacheRef.current[userId] = newSrc;
        }
      });
      setLoading({ value: false, error: false });
      console.log("avatarCacheRef.current", avatarCacheRef.current);
    }
  }, [messages]);
  useEffect(() => {
    // If the sever takes too long to give us the message.
    delay(
      40000,
      () => loading.value && setLoading({ value: false, error: true })
    );
  }, []);

  useEffect(() => {
    if (!loading.value) {
      // Keeps the scroll of the ScrollArea at the bottom.
      const scrollAreaInner = document.querySelector(".rt-ScrollAreaViewport");
      if (scrollAreaInner)
        scrollAreaInner.scrollTop = scrollAreaInner.scrollHeight;
    }
  }, [loading.value]);

  return (
    <Flex
      direction="column"
      style={{
        maxWidth: "532px",
        height: "calc(100% - 52px)",
        backgroundColor: "var(--gray-a2)",
        paddingInline: "0.75rem",
        borderRadius: "var(--radius-3)",
      }}
    >
      <ScrollArea
        ref={scrollAreaRef}
        type="always"
        scrollbars="vertical"
        grow="1"
        style={{ position: "relative", marginBlock: "0.5rem 2rem" }}
      >
        {!loading.value ? (
          messages.length > 1 ? (
            // prettier-ignore
            messages.slice().reverse().map((msg, i) => (
                <Fragment key={i}>
                  {!msg.username && msg.message.includes("joined") ? (
                    <Text
                      id="joinMsg"
                      as="div"
                      color="gold"
                      highContrast
                      size="1"
                      mb="3"
                      style={{ opacity: "0.5", wordWrap: "break-word" }}
                    >
                      &gt; {msg.message}
                    </Text>
                  ) : (
                    // Message Box
                    <Box mr="4" mb="5">
                      <Flex
                        align="end"
                        gap="2"
                        width="100%"
                        style={{ marginBottom: 6 }}
                      >
                        <Avatar
                          src={avatarCacheRef.current[msg.username]}
                          fallback={<PersonIcon />}
                          size="2"
                          radius="full"
                        />
                        <Flex justify="between" grow="1">
                          <Text size="2" color="gray">
                            {msg.username}
                          </Text>
                          <Text size="1" color="gray" style={{ opacity: "0.45" }}>
                            {`${msg.timestamp.slice(5, 10)} ${msg.timestamp.slice(
                              11,
                              16
                            )}`}
                          </Text>
                        </Flex>
                      </Flex>

                      <Text
                        as="p"
                        color="gray"
                        width="min-content"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {msg.message}
                      </Text>
                    </Box>
                  )}
                </Fragment>
              ))
          ) : (
            <Text color="gray" size="4">
              {loading.error
                ? "The server must be down or a unexpected server error occurred."
                : "Empty Chat Room"}
            </Text>
          )
        ) : (
          <Spinner
            style={{
              position: "absolute",
              top: "50%",
              left: "45%",
              transform: "translateX(-50%)",
            }}
          />
        )}
      </ScrollArea>

      <Box position="relative" mb="3">
        {/* TODO: Add scrolling to this. */}
        {Array.from(usersTyping).length > 0 && (
          <Flex
            position="absolute"
            width="100%"
            gap="2"
            style={{
              top: -18,
              overflow: "hidden",
            }}
          >
            {Array.from(usersTyping).map((user, i) => (
              <Text
                key={i}
                align="center"
                color="gray"
                style={{
                  fontSize: "10px",
                  opacity: 0.5,
                  whiteSpace: "nowrap",
                }}
              >
                <Text
                  weight="medium"
                  style={{
                    display: "inline-block",
                    maxWidth: "115px",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    verticalAlign: "middle",
                  }}
                >
                  {user}
                </Text>{" "}
                is typing...
              </Text>
            ))}
          </Flex>
        )}

        <form onSubmit={(e) => handleSubmitMessage(e)}>
          <TextField.Root mb="4">
            <TextField.Input
              placeholder="Message"
              name="message"
              autoComplete="off"
              onChange={(e) => onChange(e)}
              size="3"
              style={{ paddingRight: 15 }}
            />
            <TextField.Slot>
              <IconButton
                type="submit"
                size="4"
                variant="ghost"
                style={{
                  position: "relative",
                  right: 4,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                <PaperPlaneIcon width="14" height="14" />
              </IconButton>
            </TextField.Slot>
          </TextField.Root>
        </form>

        <Button variant="outline" size="2" onClick={() => handleLeaveRoom()}>
          Leave Chat
        </Button>
      </Box>
    </Flex>
  );
};

export default Chat;
