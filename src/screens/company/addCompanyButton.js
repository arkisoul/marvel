import React from 'react';
import { Icon, Fab } from 'native-base';

const AddCompanyButton = ({ onPress }) => (
  <Fab
    containerStyle={{}}
    style={{ backgroundColor: '#002BDC' }}
    position="bottomRight"
    onPress={onPress}
  >
    <Icon name="ios-add" />
  </Fab>
);

export default AddCompanyButton;