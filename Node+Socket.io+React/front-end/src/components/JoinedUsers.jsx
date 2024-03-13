import { Flex, Heading, ScrollArea, Text } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { selectUserList } from "../redux/chatSelectors";

import { Spinner } from "./loaders";

const JoinedUsers = () => {
  const userList = useSelector(selectUserList);

  return (
    <Flex
      direction="column"
      style={{
        width: "171px",
        backgroundColor: "var(--gray-a2)",
        padding: "0.5rem 0.5rem 0.75rem 0.75rem",
        borderRadius: "var(--radius-3)",
      }}
    >
      <Heading as="h3" size="4" color="teal" mb="2">
        Roommates
      </Heading>

      <ScrollArea scrollbars="vertical">
        {userList.length ? (
          userList.map((data) => (
            <Text
              key={data.user}
              as="div"
              size="2"
              color="gray"
              mb="3"
              style={{
                maxWidth: "151px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                verticalAlign: "middle",
              }}
            >
              {data.user}
            </Text>
          ))
        ) : (
          <Spinner />
        )}
      </ScrollArea>
    </Flex>
  );
};

export default JoinedUsers;
