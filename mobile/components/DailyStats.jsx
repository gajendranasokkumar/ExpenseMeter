import { View, Text } from "react-native";
import React, { useEffect } from "react";

const DailyStats = ({ date, month, year }) => {

  return (
    <View>
      <Text>DailyStats</Text>
      <Text>{date + " " + month + " " + year}</Text>
    </View>
  );
};

export default DailyStats;
