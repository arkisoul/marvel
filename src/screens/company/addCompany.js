import React, { Component } from 'react';
import Expo, { SQLite } from 'expo';
import { View, AsyncStorage } from 'react-native';
import { Container, Header, Content, Spinner, Left, Right, Icon, Title, Button, Body, Form, Text, Input, Item, Label, H3, Toast } from 'native-base';
import styles from './styles';

const db = SQLite.openDatabase('marvel');

class AddCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      userid: null,
      company: {
        name: '',
        mobile: '',
        email: '',
        address: '',
        active: 1
      }
    }
  }

  _getUser = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    this.setState({ userid: user._id });
    // console.log(user, this.state.userid);
  }

  handleSubmit = () => {
    // console.log(this.state, this.userid);
    db.transaction(tx => {
      tx.executeSql('insert into companies (name, email, mobile, address, active, userid) values (?, ?, ?, ?, ?, ?)', [this.state.company.name, this.state.company.email, this.state.company.mobile, this.state.company.address, this.state.company.active, this.state.userid], (_, res) => {
        // console.log('company added successfully', res.insertId);
        Toast.show({
          type: 'success',
          duration: 2000,
          text: 'Success! Company added successfully'
        });
        this.props.navigation.navigate('Company');
      }, (_, err) => {
        console.log(err);
        Toast.show({
          type: 'danger',
          duration: 2000,
          text: 'Error! Can\'t add company'
        });
        this.props.navigation.navigate('Company');
      })
    });
  }

  componentWillMount = () => {
    this._getUser();
  }

  componentDidMount() {
    this.setState({ isReady: !this.state.isReady });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <Container>
          <Header />
          <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
            <Spinner />
          </Content>
        </Container>
      )
    }
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Add a Company</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Form>
            <H3 style={{ textAlign: 'center', paddingTop: 5, paddingBottom: 5 }}>Enter Company Details</H3>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input onChangeText={(text) => this.setState(prevState => ({
                company: {
                  ...prevState.company,
                  name: text
                }
              }))} value={this.state.company.name} />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={(text) => this.setState(prevState => ({
                company: {
                  ...prevState.company,
                  email: text
                }
              }))} value={this.state.company.email} />
            </Item>
            <Item floatingLabel>
              <Label>Mobile</Label>
              <Input keyboardType='numeric' onChangeText={(text) => this.setState(prevState => ({
                company: {
                  ...prevState.company,
                  mobile: text
                }
              }))} value={this.state.company.mobile} />
            </Item>
            <Item floatingLabel>
              <Label>Address</Label>
              <Input onChangeText={(text) => this.setState(prevState => ({
                company: {
                  ...prevState.company,
                  address: text
                }
              }))} value={this.state.company.address} />
            </Item>
            <View style={{ paddingTop: 10, paddingBottom: 5, justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row' }}>
              <Button iconLeft primary onPress={this.handleSubmit}>
                <Icon name='ios-add' />
                <Text>Add Company</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
    );
  };
}

export default AddCompany;