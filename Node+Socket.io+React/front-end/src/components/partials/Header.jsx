import { Heading } from "@radix-ui/themes";

const Header = () => {
  return (
    <header style={{ paddingBlock: 20, paddingInline: 8 }}>
      <Heading
        as="h1"
        size="8"
        align="center"
        highContrast
        color="teal"
        style={{ fontStyle: "italic" }}
      >
        Socket.io Chat App Demo
      </Heading>
    </header>
  );
};

export default Header;
