import { Card, Flex, Heading } from "@radix-ui/themes";
import Chat from "../../components/Chat";
import JoinedUsers from "../../components/JoinedUsers";

const Room = ({ roomName }) => {
  return (
    <Card
      style={{
        width: "100%",
        maxWidth: "740.75px",
        height: "75vh",
        backgroundColor: "var(--gray-a2)",
        padding: "4px",
      }}
    >
      <Flex gap="4" height="100%">
        <JoinedUsers />
        <Flex direction="column" width="100%" height="100%">
          <Heading as="h2" size="8" mb="3" color="teal">
            Chat Room {roomName}
          </Heading>
          <Chat />
        </Flex>
      </Flex>
    </Card>
  );
};

export default Room;

export { default as Alpha } from "./Alpha";
export { default as Bravo } from "./Bravo";
