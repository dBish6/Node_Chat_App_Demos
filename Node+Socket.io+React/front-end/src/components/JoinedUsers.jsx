import { Flex, Heading, ScrollArea, Text } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { selectUserList } from "../redux/chatSelectors";

import { Spinner } from "./loaders";

const JoinedUsers = ({ isSmallerThen689 }) => {
  const userList = useSelector(selectUserList);

  return (
    <Flex
      direction="column"
      style={{
        width: isSmallerThen689 ? "100%" : "171px",
        backgroundColor: "var(--gray-a2)",
        padding: isSmallerThen689
          ? "0.5rem 0.75rem 0.75rem"
          : "0.5rem 0.5rem 0.75rem 0.75rem",
        borderRadius: "var(--radius-3)",
      }}
    >
      <Heading as="h3" size="4" color="teal" mb="2">
        Roommates
      </Heading>

      <ScrollArea scrollbars="vertical">
        <Flex wrap="wrap" gap="3">
          {userList.length ? (
            userList.map((data) => (
              <Text
                key={data.userId}
                size="2"
                color="gray"
                {...(isSmallerThen689 && { mr: "2" })}
                style={{
                  maxWidth: isSmallerThen689 ? "200px" : "151px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  verticalAlign: "middle",
                }}
              >
                {data.username}
              </Text>
            ))
          ) : (
            <Spinner
              style={{ width: "1.5rem", height: "1.5rem", borderWidth: "3px" }}
            />
          )}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default JoinedUsers;
