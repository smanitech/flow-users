import "../flow/config";
import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  useDisclosure,
  VStack,
  Image,
} from "@chakra-ui/react";

const AuthedState = () => {
  const [name, setName] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [user, setUser] = useState({ loggedIn: null });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
            import Profile from 0xProfile
    
            pub fun main(address: Address): Profile.ReadOnly? {
              return Profile.read(address)
            }
          `,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });

    setName(profile?.name ?? "No Profile");
  };

  const initAccount = async () => {
    sendQuery();
    executeTransaction();
    const transactionId = await fcl.mutate({
      cadence: `
            import Profile from 0xProfile
    
            transaction {
              prepare(account: AuthAccount) {
                // Only initialize the account if it hasn't already been initialized
                if (!Profile.check(account.address)) {
                  // This creates and stores the profile in the user's account
                  account.save(<- Profile.new(), to: Profile.privatePath)
    
                  // This creates the public capability that lets applications read the profile's info
                  account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
                }
              }
            }
          `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log(transaction);
  };

  const executeTransaction = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
            import Profile from 0xProfile
    
            transaction(name: String) {
              prepare(account: AuthAccount) {
                account
                  .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
                  .setName(name)
              }
            }
          `,
      args: (arg, t) => [arg("Flow Developer!", t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    fcl.tx(transactionId).subscribe((res) => setTransactionStatus(res.status));
  };

  return (
    <Box>
      <Box
        px={8}
        py={4}
        display={"flex"}
        justifyContent={"space-between"}
        boxShadow={"lg"}
      >
        <Center>
          <Heading size={"md"}>Flow Users</Heading>
        </Center>
        <Center>
          <HStack>
            <Button onClick={fcl.unauthenticate} variant={"outline"}>
              Log Out
            </Button>
            <Avatar
              onClick={onOpen}
              size={"sm"}
              src={""}
              cursor={"pointer"}
              _hover={{ opacity: 0.9 }}
            />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay>
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Profile</DrawerHeader>

                  <DrawerBody>
                    <Text>Address: {user?.addr ?? "No Address"}</Text>
                    <Text>Profile Name: {name ?? "--"}</Text>
                    <Text>Transaction Status: {transactionStatus ?? "--"}</Text>
                  </DrawerBody>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          </HStack>
        </Center>
      </Box>
      {/* <Button onClick={sendQuery}>Send Query</Button> */}
      <Center bg={"#b2fc91"} p={"10%"}>
        {!name ? (
          <VStack spacing={20}>
            <Heading color={"white"}>
              You are just one click away to get started!
            </Heading>
            <Button onClick={initAccount}>Init Account</Button>
          </VStack>
        ) : (
          <>
            <VStack spacing={20}>
              <Heading color={"white"}>
                You are all set! You can now browse flow user!
              </Heading>
            </VStack>
          </>
        )}
      </Center>
      {name && (
        <VStack p={10}>
          <HStack>
            <Image
              src={
                "https://media.istockphoto.com/id/1276645382/photo/chocolate-assortment-background-top-view-of-different-kinds-of-chocolate.jpg?s=612x612&w=0&k=20&c=VSi2enumIt0aHCKTu4_yzvAFIm7DFGdNXZii0mj9iYs="
              }
              alt={"chocolate"}
              boxSize={"200px"}
            />
            <Image
              src={
                "https://plus.unsplash.com/premium_photo-1674176786816-0f3deebee870?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              }
              alt={"chocolate"}
              boxSize={"200px"}
            />
            <Image
              src={
                "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
              }
              alt={"chocolate"}
              boxSize={"200px"}
            />
          </HStack>
          <HStack>
            <Image
              src={
                "https://images.unsplash.com/photo-1571091799989-e88304d6aed3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              }
              alt={"chocolate"}
              boxSize={"200px"}
            />
            <Image
              src={
                "https://images.unsplash.com/photo-1481391319762-47dff72954d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNob2NvbGF0ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60"
              }
              alt={"chocolate"}
              boxSize={"200px"}
            />
            <Image
              src={
                "https://images.unsplash.com/photo-1587271644048-2fbb187de8d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              }
              alt={"chocolate"}
              boxSize={"200px"}
            />
          </HStack>
          <HStack>
            <Image
              src={
                "https://images.unsplash.com/photo-1565071559227-20ab25b7685e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              }
              alt={"chocolate"}
              boxSize={"200px"}
            />
            <Image
              src={
                "https://images.unsplash.com/photo-1614338143359-470838a54a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              }
              alt={"chocolate"}
              boxSize={"200px"}
            />
            <Image
              src={
                "https://images.unsplash.com/photo-1545015451-f05567aa6bcc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              }
              alt={"chocolate"}
              boxSize={"200px"}
            />
          </HStack>
        </VStack>
      )}
      {/* <Button onClick={executeTransaction}>Execute Transaction</Button> */}
    </Box>
  );
};

export default AuthedState;
