import React, { Component } from "react";
import Expo, { SQLite } from 'expo';
import { ImageBackground, View, StatusBar, AsyncStorage } from "react-native";
import { Container, Button, Content, Body, Icon, Text, Item, Label, Input, Form, Toast } from "native-base";
import styles from "./styles";

const appBg = require("../../../assets/app-bg-img.jpg");

const db = SQLite.openDatabase('marvel');

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        password: ''
      },
      usernameError: '',
      passwordError: '',
      formError: true,
      isSubmitting: false,
      isSignUpSuccess: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    AsyncStorage.removeItem('@user');
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists users (_id integer primary key not null, username text not null, password text not null)'
      );
    });
  }

  handleSubmit = () => {
    this.setState({ isSubmitting: !this.state.isSubmitting });
    db.transaction(tx => {
      tx.executeSql('select * from users where username = ?', [this.state.user.username], (tx, { rows: { _array } }) => {
        if (_array.length == 0) {
          tx.executeSql('insert into users (username, password) values (?, ?)', [this.state.user.username, this.state.user.password], (tx, res) => {
            this.setState({ isSignUpSuccess: !this.state.isSignUpSuccess });
            if (this.state.isSignUpSuccess) {
              Toast.show({
                text: "Signup successful",
                type: "success",
                duration: 2000
              });
              console.log('User created: ', res.insertId, res.rows._array);
              this.setState({ isSubmitting: !this.state.isSubmitting });
              this._signUpAsync({ _id: res.insertId, username: this.state.username });
            }
          }, (tx, err) => {
            Toast.show({
              text: "Signup failed",
              type: "danger",
              duration: 2000
            });
            this.setState(prevState => ({
              isSubmitting: !this.state.isSubmitting,
              user: {
                ...prevState.user,
                username: '',
                password: ''
              }
            }));
          });
        } else {
          Toast.show({
            text: "Email already registered.",
            type: "danger",
            duration: 2000
          });
          this.setState(prevState => ({
            isSubmitting: !this.state.isSubmitting,
            user: {
              ...prevState.user,
              username: '',
              password: ''
            }
          }));
        }
      }, (tx, err) => {
        Toast.show({
          text: "Signup failed",
          type: "danger",
          duration: 2000
        });
        this.setState({ isSubmitting: !this.state.isSubmitting });
        this.setState(prevState => ({
          isSubmitting: !this.state.isSubmitting,
          user: {
            ...prevState.user,
            username: '',
            password: ''
          }
        }));
      });
    });
  }

  validateEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePassword = (password) => {
    if (password.length < 6) {
      this.setState(prevState => ({
        user: {
          ...prevState.user,
          password: password
        },
        passwordError: 'Password to short',
        formError: true
      }));
      return false;
    }
    else if (password.length > 14) {
      this.setState(prevState => ({
        user: {
          ...prevState.user,
          password: password
        },
        passwordError: 'Password must be 6 to 14 char long',
        formError: true
      }));
      return false;
    }
    return true;
  }

  validateForm = () => {
    if (this.state.usernameError.length != 0 || this.state.passwordError.length != 0) {
      this.setState({ formError: true });
    } else if (this.state.user.username.length == 0 || this.state.user.password.length == 0) {
      this.setState({ formError: true });
    } else {
      this.setState({ formError: false });
    }
    console.log(this.state);
  }

  _signUpAsync = async (user) => {
    await AsyncStorage.setItem('@user', JSON.stringify(user));
    this.props.navigation.navigate('Home');
  };

  render() {
    if (this.state.isSubmitting) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={appBg} style={styles.imageContainer} resizeMode={'stretch'}>
          <View style={styles.overlay} >
            <Content>
              <View style={styles.content}>
                <Form style={styles.form}>
                  <Text style={{ flex:1, textAlign: 'center' }}>Create an account</Text>
                  <Item floatingLabel>
                    <Label>Create a username(email id)</Label>
                    <Input onChangeText={
                      (text) => {
                        if (text.length <= 0) {
                          this.setState(
                            prevState => ({
                              user: {
                                ...prevState.user,
                                username: text
                              },
                              usernameError: 'Invalid email id',
                              formError: true
                            }
                            ));
                          return;
                        }
                        if (!this.validateEmail(text)) {
                          this.setState(
                            prevState => ({
                              user: {
                                ...prevState.user,
                                username: text
                              },
                              usernameError: 'Invalid email id',
                              formError: true
                            }
                            ));
                          return;
                        }
                        this.setState(prevState => ({
                          user: {
                            ...prevState.user,
                            username: text
                          },
                          usernameError: ''
                        }));
                        this.validateForm();
                      }
                    } value={this.state.user.username} />
                    <Icon name='ios-contact' />
                  </Item>
                  <Text style={styles.textError}>{this.state.usernameError}</Text>
                  <Item floatingLabel>
                    <Label>Create a password</Label>
                    <Input onChangeText={
                      (text) => {
                        if (text.length <= 0) {
                          this.setState(prevState => ({
                            user: {
                              ...prevState.user,
                              password: text
                            },
                            passwordError: 'Password to short',
                            formError: true
                          }));
                          return;
                        }
                        if (!this.validatePassword(text)) {
                          return;
                        }
                        this.setState(prevState => ({
                          user: {
                            ...prevState.user,
                            password: text
                          },
                          passwordError: ''
                        }));
                        this.validateForm();
                      }
                    } value={this.state.user.password} secureTextEntry={true} />
                    <Icon name='ios-unlock' />
                  </Item>
                  <Text style={styles.textError}>{this.state.passwordError}</Text>
                  <View style={styles.btn}>
                    <Button iconRight primary onPress={this.handleSubmit} disabled={this.state.formError}>
                      <Text>Sign Up</Text>
                      <Icon name='ios-log-in' />
                    </Button>
                  </View>
                  <View style={styles.prompt}>
                    <Text>Already registered?</Text>
                    <Button transparent onPress={() => this.props.navigation.navigate("SignIn")} style={{ padding: 0 }}>
                      <Text>Sign In</Text>
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
