import React, { Component } from "react";
import Expo, { SQLite } from 'expo';
import { ImageBackground, View, StatusBar, AsyncStorage } from "react-native";
import { Container, Button, Content, Body, Icon, Text, Item, Label, Input, Form, Toast } from "native-base";
import styles from "./styles";

const appBg = require("../../../assets/app-bg-img.jpg");

const db = SQLite.openDatabase('marvel');

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        password: '',
      },
      isSubmitting: false,
      isSignInSuccess: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    AsyncStorage.removeItem('@user');
  }

  handleSubmit = () => {
    this.setState({ isSubmitting: !this.state.isSubmitting });
    db.transaction(tx => {
      tx.executeSql('select * from users where username = ? and password = ?', [this.state.user.username, this.state.user.password],
        (tx, { rows: { _array } }) => {
          let signInUser = _array[0];
          if (signInUser) {
            // console.log('Sign in successful', signInUser);
            this.setState({ isSignInSuccess: !this.state.isSignInSuccess });
            Toast.show({
              text: 'Congrats! Sign In Successful',
              type: 'success',
              duration: 2000
            });
            this.setState({ isSubmitting: !this.state.isSubmitting });
            this._signInAsync(signInUser);
          } else {
            // console.log('login error failed');
            Toast.show({
              text: 'Error! Incorrect login credentials.',
              type: 'warning',
              duration: 2000
            });
            this.setState({ isSubmitting: !this.state.isSubmitting });
          }
        }, (_, err) => {
          // console.log('login error failed');
          Toast.show({
            text: 'Error! Sign In failed',
            type: 'warning',
            duration: 2000
          });
          this.setState({ isSubmitting: !this.state.isSubmitting });
        }
      );
    });
  }

  _signInAsync = async (user) => {
    // console.log('setting up session value');
    await AsyncStorage.setItem('@user', JSON.stringify(user));
    this.props.navigation.navigate('Home');
  };

  render() {
    if (this.state.isSubmitting) {
      return <Expo.AppLoading />
    }
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={appBg} style={styles.imageContainer} resizeMode={'stretch'}>
          <View style={styles.overlay} >
            <Content>
              <View style={styles.content}>
                <Form style={styles.form}>
                  <Text>Enter your sign in details</Text>
                  <Item floatingLabel>
                    <Label>Enter your username</Label>
                    <Input onChangeText={(text) => this.setState(prevState => ({
                      user: {
                        ...prevState.user,
                        username: text
                      }
                    }))} value={this.state.user.username} />
                    <Icon name='ios-contact' />
                  </Item>
                  <Item floatingLabel>
                    <Label>Enter your password</Label>
                    <Input onChangeText={(text) => this.setState(prevState => ({
                      user: {
                        ...prevState.user,
                        password: text
                      }
                    }))} value={this.state.user.password} secureTextEntry={true} />
                    <Icon name='ios-unlock' />
                  </Item>
                  <View style={styles.btn}>
                    <Button iconRight primary onPress={this.handleSubmit}>
                      <Text>Sign In</Text>
                      <Icon name='ios-log-in' />
                    </Button>
                  </View>
                  <View style={styles.prompt}>
                    <Text>Already a user?</Text>
                    <Button transparent onPress={() => this.props.navigation.navigate("SignUp")} style={{ padding: 0 }}>
                      <Text>Sign Up</Text>
                    </Button>
                  </View>
                </Form>
              </View>
            </Content>
          </View>
        </ImageBackground>
      </Container>
    );
  }
}
