import React, { Component } from "react";
import Expo, { SQLite } from 'expo';
import { View, RefreshControl, AsyncStorage } from "react-native";
import { Container, Content, Header, List, Left, Body, Right, Button, Text, Spinner, H1, Icon, Title, H2, Fab, ListItem, Footer, FooterTab } from "native-base";
import styles from './styles';

const appBg = require("../../../assets/app-bg-img.jpg");

const db = SQLite.openDatabase('marvel');

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      refreshing: false,
      companies: [],
      userid: null
    }
    // console.log('company constructed');
  }

  _getUser = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    this.setState({userid: user._id});
    // console.log(user, this.state.userid);
  }

  componentWillUnmount() {
    // console.log('component will unmout');
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists companies (_id integer primary key not null, name text not null, email text, mobile text, address text, userid integer not null, active int default 1)'
      , [], (_, res) => console.log(res), (_, err) => console.log(err));
    });
    this.setState({ isReady: !this.state.isReady });
    const willFocus = this.props.navigation.addListener('willFocus', payLoad => {
      this.fetchData();
    });
    // console.log('company did mount');
  }

  fetchData = () => {
    this.setState({ isReady: false });
    db.transaction(tx => {
      tx.executeSql(
        'select * from companies where active = ? and userid = ?', [1, this.state.userid], (_, { rows: { _array } }) => {
          this.setState({ companies: _array, isReady: true });
        }
      )
    });
  }

  componentWillMount = () => {
    this._getUser();
    this.fetchData();
    // console.log('company will mount');
  }

  showCompanyDetail = (company) => {
    // console.log(company.company._id);
    this.props.navigation.navigate('CompanyDetail', company.company);
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchData();
    this.setState({refreshing: false});
  }

  displayCompanyList() {
    if (this.state.companies.length > 0) {
      return (
        <List
          dataArray={this.state.companies}
          renderRow={(company, _ , rowId) =>
            <ListItem
              noBorder
              button
              onPress={() => this.showCompanyDetail({company}) }
            >
              <Left>
                <Text style={styles.index}>{parseInt(rowId) + 1}.</Text>
                <Text style={styles.text}>
                  {company.name}
                </Text>
              </Left>
            </ListItem>}
        />
      );
    } else {
      return <Text style={{ textAlign: 'center' }}>No company added yet</Text>;
    }
  }

  render() {
    // console.log('company render');
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
            <Title>Company</Title>
          </Body>
          <Right />
        </Header>

        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <H2 style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 8 }}>Companies</H2>
          {this.displayCompanyList()}
        </Content>

        <Footer>
          <FooterTab>
            <Button full onPress={() => this.props.navigation.navigate('AddCompany')}>
              <Text style={{ fontSize: 16 }}>Add Company</Text>
            </Button>
          </FooterTab>
        </Footer>

      </Container>
    );
  }
}

export default Company;
