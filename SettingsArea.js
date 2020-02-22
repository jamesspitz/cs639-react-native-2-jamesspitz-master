import {Text, TextInput, TouchableOpacity, ScrollView, Alert, View} from "react-native";
import React, { Component } from 'react';
import Button from "./Button.ios";

class SettingsArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.navigation.state.params.username,
            token: this.props.navigation.state.params.token.token,
            firstName: "",
            lastName: "",
            goalDailyActivity: 0,
            goalDailyCalories: 0,
            goalDailyCarbohydrates: 0,
            goalDailyFat: 0,
            goalDailyProtein: 0,
            newGoalDailyActivity: 0,
            newGoalDailyCalories: 0,
            newGoalDailyCarbohydrates: 0,
            newGoalDailyFat: 0,
            newGoalDailyProtein: 0,
            changedActivity: false,
            changedProtein: false,
            changedFat: false,
            changedCalories: false,
            changedCarbohydrates: false
        }
    }


    async onNameChangePress() {
            fetch('https://mysqlcs639.cs.wisc.edu/users/'+ this.props.navigation.state.params.username, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token':  this.state.token,
                },
                body: JSON.stringify(
                    {
                        firstName: this.state.firstName,
                        lastName: this.state.lastName
                    }
                )
            }).then(response =>  {
                return response.json();
            })
                .catch(error => console.error(error));
        alert(`You have successfully updated your name!`);
    }

    async onGoalChangePress() {

        let activity = this.state.newGoalDailyActivity;
        let calories = this.state.newGoalDailyCalories;
        let protein = this.state.newGoalDailyProtein;
        let fat = this.state.newGoalDailyFat;
        let carbs = this.state.newGoalDailyCarbohydrates;

        // Check for changes and valid changes
        if((this.state.changedActivity === true) && parseFloat(this.state.newGoalDailyActivity !== 0)){
            activity = this.state.newGoalDailyActivity
        }

        if((this.state.changedCalories === true) && parseFloat(this.state.newGoalDailyCalories) !== 0){
            calories = parseFloat(this.state.newGoalDailyCalories)
        }

        if((this.state.changedProtein === true) && parseFloat(this.state.newGoalDailyProtein) !== 0){
            protein = parseFloat(this.state.newGoalDailyProtein)
        }
        if((this.state.changedCarbohydrates === true) && parseFloat(this.state.newGoalDailyCarbohydrates) !== 0){
            carbs = parseFloat(this.state.newGoalDailyCarbohydrates)
        }
        if((this.state.changedFat === true) && parseFloat(this.state.newGoalDailyFat) !== 0){
            fat = parseFloat(this.state.newGoalDailyFat)
        }


        fetch('https://mysqlcs639.cs.wisc.edu/users/'+ this.props.navigation.state.params.username, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token':  this.props.navigation.state.params.token.token,
            },
            body: JSON.stringify(
                {
                    goalDailyActivity: parseFloat(activity),
                    goalDailyCalories: parseFloat(calories),
                    goalDailyCarbohydrates: parseFloat(carbs),
                    goalDailyFat: parseFloat(fat),
                    goalDailyProtein: parseFloat(protein)
                }
            )
        }).then(response =>  {
            return response.json();
        })
            .catch(error => console.error(error));
        alert(`You have successfully updated your goals!`);
    }


    onLogoutPress() {
        this.setState({token:""});
        this.props.navigation.navigate('homePage');
    }

    onDeleteAccountPress(){
        let confirmDelete = false;

        // Secondary confirmation
        Alert.alert('Confirm Delete','Are you sure you want to delete your account?' [
            {text: 'Cancel', onPress: () => confirmDelete === false},
            {text: 'Confirm', onPress: () => (confirmDelete === true)}
        ]);

        if(confirmDelete === true) {
            fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.navigation.state.params.username, {
                method: 'DELETE',
                headers: {
                    'x-access-token': this.props.navigation.state.params.token.token
                },
            }).then(response => {
                return response.json();
            }).catch(error => console.error(error)
            );
            this.setState({token: ""});
            alert(`Account Deleted`);
            this.props.navigation.navigate('homePage');
        }
    }




    render() {
        return (
            <ScrollView style={{flex: 5, backgroundColor: '#598bff', paddingHorizontal: 25}}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:10}}>
                        <Button buttonStyle={{
                            borderRadius: 4,
                            padding: 10,
                            textAlign: 'center',
                            marginBottom: 20,
                            backgroundColor: '#dc143c',
                            color: '#fff'
                        }} text={'Day View'} title="HomePage" onPress = {()=>this.props.navigation.navigate('userHomePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                    </View>
                    <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:10}}>
                        <Button buttonStyle={{
                            borderRadius: 4,
                            padding: 10,
                            textAlign: 'center',
                            marginBottom: 20,
                            backgroundColor: '#ffa500',
                            color: '#fff'
                        }} text={'Profile'} title="ProfilePage" onPress = {()=>this.props.navigation.navigate('profilePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                    </View>
                </View>
                <Text>Change Name</Text>
                <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white" }} onChangeText={(val) =>  this.setState({firstName: val})} placeholder = "First Name:"
                           placeholderTextColor = '#D4D4D4'/>
                <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white"}} onChangeText={(val) =>  this.setState({lastName: val})} placeholder = "Last Name:"
                           placeholderTextColor = '#D4D4D4'/>
                <TouchableOpacity onPress = {this.onNameChangePress.bind(this)} style={{paddingTop:15, borderRadius: 20, paddingBottom: 30}}>
                    <Text style={{borderRadius: 4, padding:10, textAlign: 'center', marginBottom: 20, color:'#fff', backgroundColor:'#90ee90'}}>Save Changes</Text>
                </TouchableOpacity>

                <Text>Change Goals</Text>
                <TextInput keyboardType={'numeric'} style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white"}} onChangeText={(val) =>  this.setState({newGoalDailyActivity: val, changedActivity: true})} placeholder = "Daily Activity Goal:"
                           placeholderTextColor = '#D4D4D4'/>
                <TextInput keyboardType={'numeric'} style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white"}} onChangeText={(val) =>  this.setState({newGoalDailyCalories: val, changedCalories: true})} placeholder = "Daily Calorie Goal:"
                           placeholderTextColor = '#D4D4D4'/>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'} style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white" }} onChangeText={(val) =>  this.setState({newGoalDailyCarbohydrates: val, changedCarbohydrates: true})} placeholder = "Carbohydrates Goal:"
                           placeholderTextColor = '#D4D4D4'/>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'} style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white"}} onChangeText={(val) =>  this.setState({newGoalDailyFat: val, changedFat: true})} placeholder = "Daily Fat Goal:"
                           placeholderTextColor = '#D4D4D4'/>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'} style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white" }} onChangeText={(val) =>  this.setState({newGoalDailyProtein: val, changedProtein: true})} placeholder = "Daily Protein Goal:"
                           placeholderTextColor = '#D4D4D4'/>

                <TouchableOpacity onPress = {this.onGoalChangePress.bind(this)} style={{paddingTop:15, borderRadius: 20, paddingBottom: 20}}>
                    <Text style={{borderRadius: 4, padding:10, textAlign: 'center', marginBottom: 20, color:'#fff', backgroundColor:'#90ee90'}}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress = {()=>this.onLogoutPress()} style={{paddingTop:15, borderRadius: 20}}>
                    <Text style={{borderRadius: 4, padding:10, textAlign: 'center', marginBottom: 20, backgroundColor: '#FF3B30', color: '#fff'}}>LOGOUT</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress = {()=>this.onDeleteAccountPress()} style={{paddingTop:15, borderRadius: 20}}>
                    <Text style={{borderRadius: 4, padding:10, textAlign: 'center', marginBottom: 20, backgroundColor: '#FF3B30', color: '#fff'}}>DELETE ACCOUNT</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}
export default SettingsArea;