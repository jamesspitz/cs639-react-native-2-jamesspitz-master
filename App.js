import React from 'react';
import { View } from 'react-native';
import Button from './Button';
import RegisterArea from "./RegisterArea";
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import UserProfileArea from "./UserProfileArea";
import LoginArea from "./LoginArea";
import SettingsArea from "./SettingsArea";
import UserHomePage from "./UserHomePage";
import CreateActivityArea from "./CreateActivityArea";
import EditActivityArea from "./EditActivityArea"



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {

      return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#598bff'}}>
        <Button buttonStyle={{backgroundColor: '#00e5ee', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 20, width: 300, height: 80, marginBottom: 15}} textStyle={{color: '#ffffff', textShadowRadius:2, textShadowColor: 'black', fontSize:42}} text={'Login'} onPress={() => this.props.navigation.navigate('loginPage')}/>
        <Button buttonStyle={{backgroundColor: '#90ee90', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 20, width: 250, height: 65, marginBottom: 10, marginTop: 15}} textStyle={{color: '#ffffff', textShadowRadius:2, textShadowColor: 'black', fontSize:30}} text={'Sign-Up'} onPress={() => this.props.navigation.navigate('registerPage')}/>
      </View>

    );
  }
}

const FullApp = createStackNavigator({
    homePage: {
        screen: App,
    },
    registerPage:{
        screen: RegisterArea,
    },
    loginPage:{
        screen: LoginArea,
    },
    profilePage:{
        screen: UserProfileArea
    },
    settingsPage:{
        screen: SettingsArea
    },
    userHomePage:{
        screen: UserHomePage
    },
    activityPage:{
        screen: CreateActivityArea
    },
    editActivityPage:{
      screen: EditActivityArea
    }
});

export default createAppContainer(FullApp);
