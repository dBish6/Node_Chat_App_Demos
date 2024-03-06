import { Card, Heading, Text, Flex, Button } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { handleJoinRoom } from "../utils/roomHandlers";

const Home = () => {
  return (
    <Card
      style={{
        width: "100%",
        maxWidth: "500px",
        padding: "1rem 0.5rem 0.5rem",
        backgroundColor: "var(--gray-a2)",
      }}
    >
      <Heading as="h2" size="7" align="center" color="teal" mb="2">
        Start By Joining a Room
      </Heading>
      <Text as="p" size="3" align="center" color="gray" mb="4">
        Welcome! This is a demo chat room app. There are two rooms{" "}
        <Text weight="medium">Alpha</Text> and{" "}
        <Text weight="medium">Bravo</Text>, join either one!
      </Text>
      <Text as="p" size="3" align="center" color="gray" mb="6">
        When you join a room, you can open another browser or open a
        private/incognito window and talk to yourself!
      </Text>
      <Flex>
        <Button
          variant="soft"
          size="3"
          mr="4"
          onClick={(e) => handleJoinRoom(e.target.innerText.toLowerCase())}
          style={{ flexGrow: 1 }}
        >
          Alpha <ArrowRightIcon />
        </Button>
        <Button
          variant="soft"
          size="3"
          onClick={(e) => handleJoinRoom(e.target.innerText.toLowerCase())}
          style={{ flexGrow: 1 }}
        >
          Bravo <ArrowRightIcon />
        </Button>
      </Flex>
    </Card>
  );
};

export default Home;
