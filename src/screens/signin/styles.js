const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default {
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#002BDC",
    opacity: 0.9,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1
  },
  form: {
    flex: 1,
    borderRadius: 8,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  prompt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 0,
    paddingBottom: 5
  }
};
