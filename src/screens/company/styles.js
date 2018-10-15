const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    backgroundColor: "#FFF"
  },
  content: {
    flex: 1,
    height: deviceHeight
  },
  view: {
    flex: 1,
    height: deviceHeight - 100
  },
  text: {
    fontSize: 16
  },
  index: {
    fontSize: 16,
    marginRight: 5
  }
};
