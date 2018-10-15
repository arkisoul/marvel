import React, { Component } from 'react';
import Expo, { SQLite } from 'expo';
import { View } from 'react-native';
import { Container, Header, Left, Button, Icon, Body, Title, Right, Content, Card, CardItem, Text } from 'native-base';

export default class CompanyDetail extends Component {
  constructor(props) {
    super(props);
    db = SQLite.openDatabase('marvel');
  }

  render = () => {
    const { navigation } = this.props;
    const companyName = navigation.getParam('name');
    const companyEmail = navigation.getParam('email');
    const companyMobile = navigation.getParam('mobile');
    const companyAdd = navigation.getParam('address');
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
            <Title>Company Detail</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Card>
            <CardItem header>
              <Text>{companyName}</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  Email: {companyEmail}
                </Text>
                <Text>
                  Mobile: {companyMobile}
                </Text>
                <Text>
                  Address: {companyAdd}
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  };
}