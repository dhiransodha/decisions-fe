import { View, Text, StyleSheet } from "react-native";
import { MenuOption } from "./DropdownMenu";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api-client";
import { DecisionProps } from "@/utils/props";

type Props = {
  setIsNotificationDropdownVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function Notifications({
  setIsNotificationDropdownVisible,
}: Props) {
  const { user } = useUser();
  const [inProgress, setInProgress] = useState<DecisionProps[]>([]);
  const [notStarted, setNotStarted] = useState<DecisionProps[]>([]);

  useEffect(() => {
    apiClient
      .get(`/users/${user._id}/decisions?votingStatus=in%20progress`)
      .then(({ data }) => {
        setInProgress(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);
  useEffect(() => {
    apiClient
      .get(`/users/${user._id}/decisions?votingStatus=not%20started`)
      .then(({ data }) => {
        setNotStarted(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);
  const youAreCurrentPlayer = inProgress.filter((decision: DecisionProps) => {
    if (user._id && decision?.saveData?.currentPlayer)
      return decision.saveData.currentPlayer === user._id;
    else return false;
  });
  const router = useRouter();
  return (
    <View>
      <MenuOption onSelect={() => {}}>
        <Text style={styles.boldText}>
          You have {inProgress.length} decisions in progress,{" "}
          {youAreCurrentPlayer.length} of which it is your turn:
        </Text>
      </MenuOption>
      {youAreCurrentPlayer.map((decision) => {
        return (
          <MenuOption
            key={decision._id}
            onSelect={() => {
              setIsNotificationDropdownVisible(false);
              router.push({
                pathname: "/Decision",
                params: { decision_id: decision._id },
              });
            }}
          >
            <Text>
              It is your turn to make a decision with group{" "}
              {decision?.group?.name} on list {decision?.list?.title}
            </Text>
          </MenuOption>
        );
      })}
      <MenuOption onSelect={() => {}}>
        <Text style={styles.boldText}>
          You have {notStarted.length} decisions which have not started yet:
        </Text>
      </MenuOption>
      {notStarted.map((decision) => {
        return (
          <MenuOption
            key={decision._id}
            onSelect={() => {
              setIsNotificationDropdownVisible(false);
              router.push({
                pathname: "/Decision",
                params: { decision_id: decision._id },
              });
            }}
          >
            <Text>
              Click here to start the decision with group{" "}
              {decision?.group?.name} with list {decision?.list?.title}
            </Text>
          </MenuOption>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: "bold",
  },
});
