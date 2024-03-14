import { Card, Flex, Heading } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import Chat from "../../components/Chat";
import JoinedUsers from "../../components/JoinedUsers";

const Room = ({ roomName }) => {
  const [isSmallerThen689, setIsSmallerThen689] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 689) {
        setIsSmallerThen689(true);
      } else {
        setIsSmallerThen689(false);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: "741px",
        ...(!isSmallerThen689 && { height: "75vh" }),
        ...(isSmallerThen689 && { marginBlock: "0.75rem 1rem" }),
        backgroundColor: "var(--gray-a2)",
        padding: "4px",
      }}
    >
      <Flex
        gap="4"
        height="100%"
        {...(isSmallerThen689 && { wrap: "wrap-reverse" })}
      >
        <JoinedUsers isSmallerThen689={isSmallerThen689} />
        <Flex direction="column" width="100%" height="100%">
          <Heading as="h2" size="7" mb="3" color="teal">
            Chat Room {roomName}
          </Heading>
          <Chat isSmallerThen689={isSmallerThen689} />
        </Flex>
      </Flex>
    </Card>
  );
};

export default Room;

export { default as Alpha } from "./Alpha";
export { default as Bravo } from "./Bravo";
