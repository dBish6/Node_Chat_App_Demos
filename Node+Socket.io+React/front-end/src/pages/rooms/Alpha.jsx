import { Card, Heading } from "@radix-ui/themes";
import { containerStyles } from ".";
import Chat from "../../components/Chat";

const Alpha = () => {
  return (
    <Card style={containerStyles}>
      <Heading as="h2" size="8" mb="3" color="teal">
        Chat Room Alpha
      </Heading>
      <Chat />
    </Card>
  );
};

export default Alpha;
