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
import emitManageRoom from "../services/emitManageRoom";
import getInitialMessages from "../services/getInitialMessages";
import setupSocketListeners from "../services/setupSocketListeners";
import emitUserTyping from "../services/emitUserTyping";

import { selectRoomId, selectMessages } from "../redux/chatSelectors";
import { CLEAR_MESSAGES } from "../redux/chatSlice";

import history from "../utils/history";
import handleSubmitMessage from "../utils/handleSubmitMessage";

import { Spinner } from "./loaders";

const Chat = ({ isSmallerThen689 }) => {
  const scrollAreaRef = useRef(null),
    avatarCacheRef = useRef({});

  const [loading, setLoading] = useState({
      setup: true,
      complete: false,
      error: false,
    }),
    [usersTyping, setUsersTyping] = useState(new Set([]));

  const dispatch = useDispatch(),
    roomId = useSelector(selectRoomId),
    messages = useSelector(selectMessages);

  const onChange = (e) =>
    dispatch(debounce(emitUserTyping(e.target.value), 1400));

  const handleLeaveRoom = () =>
    dispatch(
      emitManageRoom({
        type: "leave",
        roomId: roomId,
      })
    );

  useEffect(() => {
    if (!roomId) {
      history.navigate("/home");
    } else {
      const manageRoom = dispatch(
          emitManageRoom({ type: "join", roomId: roomId }) // Joins the room.
        ),
        initialMessages = dispatch(getInitialMessages()); // Gets the messages from the db, if any.
      Promise.all([manageRoom, initialMessages]).then(() =>
        setLoading({ setup: false, complete: false, error: false })
      );
      // All chat listeners.
      setupSocketListeners(setUsersTyping);
      // Listens for app leave to show leave message; refresh, exit, etc.
      window.addEventListener("beforeunload", handleLeaveRoom);

      return () => {
        window.removeEventListener("beforeunload", handleLeaveRoom);
        socket.removeAllListeners();
        dispatch(CLEAR_MESSAGES());
      };
    }
  }, []);

  useEffect(() => {
    if (!loading.setup && messages.length > 1) {
      messages.forEach((data) => {
        const userId = data.username;
        const cachedSrc = avatarCacheRef.current[userId];
        if (!cachedSrc && userId) {
          const newSrc = `https://avatar.iran.liara.run/public/${Math.floor(
            Math.random() * 100
          )}`;
          avatarCacheRef.current[userId] = newSrc;
        }
      });
      setLoading((prev) => ({ ...prev, complete: true }));
    }
  }, [loading.setup, messages]);
  useEffect(() => {
    // If the server takes too long to give us the messages.
    delay(
      40000,
      () =>
        !loading.complete &&
        setLoading((prev) => ({ ...prev, complete: true, error: true }))
    );
  }, []);

  useEffect(() => {
    if (loading.complete) {
      // Keeps the scroll of the ScrollArea at the bottom onload.
      const scrollAreaInner = document.querySelector(
        ".chatScroll .rt-ScrollAreaViewport"
      );

      if (scrollAreaInner)
        scrollAreaInner.scrollTop = scrollAreaInner.scrollHeight;
    }
  }, [loading.complete]);

  return (
    <Flex
      direction="column"
      grow="1"
      style={{
        height: isSmallerThen689 ? "600px" : "calc(100% - 52px)",
        backgroundColor: "var(--gray-a2)",
        paddingInline: "0.75rem",
        borderRadius: "var(--radius-3)",
      }}
    >
      <ScrollArea
        ref={scrollAreaRef}
        className="chatScroll"
        type="always"
        scrollbars="vertical"
        grow="1"
        style={{ position: "relative", marginBlock: "0.5rem 2rem" }}
      >
        {loading.complete ? (
          messages.length > 1 ? (
            // prettier-ignore
            messages.slice().reverse().map((data, i) => (
                <Fragment key={i}>
                  {!data.username && (data.message.includes("joined") ||
                   data.message.includes("left")) ? (
                    <Text
                      id="joinMsg"
                      as="div"
                      color="gold"
                      highContrast
                      size="1"
                      mb="3"
                      style={{ opacity: "0.5", wordWrap: "break-word" }}
                    >
                      &gt; {data.message}
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
                          src={avatarCacheRef.current[data.username]}
                          fallback={<PersonIcon />}
                          size="2"
                          radius="full"
                        />
                        <Flex justify="between" grow="1" wrap="wrap" style={{gap: "0px 12px"}}>
                          <Text size="2" color="gray">
                            {data.username}
                          </Text>
                          <Text size="1" color="gray" style={{ opacity: "0.45" }}>
                            {`${data.timestamp.slice(5, 10)} ${data.timestamp.slice(
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
                        {data.message}
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
        {Array.from(usersTyping).length > 0 && (
          <ScrollArea
            scrollbars="horizontal"
            width="100%"
            style={{
              display: "flex",
              position: "absolute",
              gap: "8px",
              top: -23,
              height: "fit-content",
              overflow: "hidden",
            }}
          >
            {Array.from(usersTyping).map((username, i) => (
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
                  {username}
                </Text>{" "}
                is typing...
              </Text>
            ))}
          </ScrollArea>
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
