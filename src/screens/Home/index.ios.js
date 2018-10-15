import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { Container, Content, Header, Left, Body, Right, Button, Text, Spinner, H1, Icon, Title } from "native-base";
import { NavigationActions } from 'react-navigation';
import styles from './styles';

const appBg = require("../../../assets/app-bg-img.jpg");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    }
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  componentDidMount() {
    this.setState({ isReady: !this.state.isReady });
  }

  render() {
    if (!this.state.isReady) {
      return <Container>
        <Header />
        <Content>
          <Spinner />
        </Content>
      </Container>
    }
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
              // onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Home</Title>
          </Body>
          <Right>
            <Button onPress={() => this._signOutAsync()}>
              <Icon name="ios-power" />
            </Button>
          </Right>
        </Header>

        <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
          <View style={styles.view}>
            <H1>Welcome to Invoice Managmenet App</H1>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Home;
