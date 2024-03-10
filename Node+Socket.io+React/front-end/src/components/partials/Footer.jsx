import {
  Text,
  HoverCard,
  Link,
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
} from "@radix-ui/themes";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  EnvelopeClosedIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import veryHappy from "../../assets/very-happy.jpg";
import coffee from "../../assets/buy-me-a-coffee.svg";

const Footer = () => {
  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingTop: 8,
        paddingBottom: 12,
        paddingInline: 16,
      }}
    >
      <Text color="gray" highContrast style={{ opacity: 0.9 }}>
        Developer:{" "}
        <HoverCard.Root>
          <HoverCard.Trigger>
            <Link
              href="https://davidbishop.info"
              target="_blank"
              rel="noopener noreferrer"
              color="gray"
              style={{ fontStyle: "italic" }}
            >
              David Bishop
            </Link>
          </HoverCard.Trigger>
          <HoverCard.Content className="hoverCardContent" size="2">
            <Flex gap="2">
              <Avatar
                size="3"
                fallback="very-happy.jpg"
                radius="full"
                src={veryHappy}
              />
              <Box>
                <Heading size="3" as="h3">
                  David Bishop
                </Heading>
                <Text as="div" size="2" color="gray" mb="1">
                  Full-Stack UX Designer/Developer
                </Text>

                <Flex gap="3">
                  <IconButton
                    variant="soft"
                    color="gray"
                    size="1"
                    onClick={() =>
                      window.open(
                        "https://github.com/dBish6",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <GitHubLogoIcon width="14" height="14" />
                  </IconButton>
                  <IconButton
                    variant="soft"
                    color="blue"
                    size="1"
                    onClick={() =>
                      window.open(
                        "https://www.linkedin.com/in/d-bish/",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <LinkedInLogoIcon width="14" height="14" />
                  </IconButton>
                  <IconButton
                    variant="soft"
                    color="yellow"
                    size="1"
                    onClick={() =>
                      window.open(
                        "https://www.buymeacoffee.com/dBish",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <img
                      src={coffee}
                      alt="Buy me a Coffee"
                      style={{
                        width: 16,
                        height: 16,
                        fill: "var(--accent-a11)",
                      }}
                    />
                  </IconButton>
                  <IconButton
                    variant="soft"
                    color="violet"
                    size="1"
                    onClick={() =>
                      window.open("mailto:davidbish2002@hotmail.com")
                    }
                  >
                    <EnvelopeClosedIcon width="14" height="14" />
                  </IconButton>
                  <IconButton
                    variant="soft"
                    color="lime"
                    size="1"
                    onClick={() =>
                      window.open(
                        "https://davidbishop.info",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <QuestionMarkIcon width="14" height="14" />
                  </IconButton>
                </Flex>
              </Box>
            </Flex>
          </HoverCard.Content>
        </HoverCard.Root>
      </Text>
    </footer>
  );
};

export default Footer;
