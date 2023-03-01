import "../flow/config";
import * as fcl from "@onflow/fcl";
import { Box, Button, Center, Heading, HStack, VStack,Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";


const UnauthenticatedState = () => {
  return (
    
    <VStack
      pos={"absolute"}
      top={"50%"}
      left={"40%"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      boxShadow={"xl"}
      rounded={"lg"}
      p={6}
      maxW={"max-content"}
    >
        <HStack>
            <Image
              src={
                "https://assets-global.website-files.com/5f734f4dbd95382f4fdfa0ea/6343e639b9d4ce0733ba6ce8_Group%20840.png"
              }
              width={200}
              height={200}
              alt={"chocolate"}
              boxSize={"200px"}
            />
            
          </HStack>
      <Heading textAlign={"center"}>Flow users</Heading>
      <HStack>
            <Image
              src={
                "https://assets-global.website-files.com/5f734f4dbd95382f4fdfa0ea/63e120dba0e597a8b5b4cd64_IMG%20-%20Mainstream%20Ready-p-800.jpg"
              }
              width={200}
              height={200}
              alt={"chocolate"}
              boxSize={"200px"}
            />
            
          </HStack>
      <HStack>
        <Button onClick={fcl.logIn}>Log In</Button>
        <Button onClick={fcl.signUp}>Sign Up</Button>
      </HStack>
    </VStack>
  );
};

export default UnauthenticatedState;
