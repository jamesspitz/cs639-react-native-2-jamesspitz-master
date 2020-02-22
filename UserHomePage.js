import React, { Component } from 'react';
import {Text, ScrollView, View, Alert} from 'react-native';
import Button from "./Button";
import {Card} from "react-native-elements";
import {CircularProgress} from 'react-native-svg-circular-progress';
import {navigation} from 'react-navigation'

class UserHomePage extends Component {
    constructor(props) {
        super(props);
        //this._isMounted = false;
        this.state = {
            username: this.props.navigation.state.params.username,
            token:this.props.navigation.state.params.token.token,
            firstName:" ",
            lastName: " ",
            goalDailyCalories: 1,
            goalDailyProtein: 1,
            goalDailyCarbohydrates:1,
            goalDailyFat: 1,
            goalDailyActivity:1,
            allActivities: {},
            date: new Date().toLocaleString(),
            activityID:0,
            activityName: "",
            activityDuration: 0,
            activityDate: new Date(),
            activityCalories: 1,
            interval: null,
            cards: [],
            count:0,
            dayProtein: 300,
            dayFat:400,
            dayCarb: 10
        }
        this.t = setInterval(() => {
            this.setState({ count: this.state.count + 1 });
        }, 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.interval);
        clearTimeout(this.interval);
        this.focusListener.remove();
    }


    componentDidMount(){
        //this._isMounted = true;
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.setState({ count: 0 })});

            this.interval = setInterval( () => {
                this.setState({
                    date : new Date().toLocaleString(),
                    cards: this.getActivities()
                })
            },1000);



        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.navigation.state.params.username, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token':  this.props.navigation.state.params.token.token,
            }
        })
            .then(response =>  {
                return response.json()
            })
            .then(data => {
                this.setState({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    username: data.username,
                    goalDailyActivity: data.goalDailyActivity,
                    goalDailyCalories: data.goalDailyCalories,
                    goalDailyCarbohydrates: data.goalDailyCarbohydrates,
                    goalDailyFat: data.goalDailyFat,
                    goalDailyProtein: data.goalDailyProtein
                })
            })
            .catch(error=>console.log(error))

        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token':  this.props.navigation.state.params.token.token,
            }
        })
            .then(response =>  {
                return response.json()
            })
            .then(data => {
                this.setState({
                    allActivities: data,
                })
            })
            .catch(error=>console.log(error))

        this.setState({cards: this.getActivities()})
    }

    onDeleteActivityPress(id){

            fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
                method: 'DELETE',
                headers: {
                    'x-access-token': this.props.navigation.state.params.token.token
                },
            }).then(response => {
                return response.json();
            }).catch(error => console.error(error)
            );
            alert(`Activity Deleted`);
    }

    getProgress() {
        let calorieCount = 0;
        let activityCount = 0;
        let activityData = [];

        for (const activity of Object.entries(this.state.allActivities)) {
            activityData = JSON.parse(JSON.stringify(activity[1]));
            for (let act of activityData) {
                calorieCount = calorieCount + act.calories;
                activityCount = activityCount + act.duration;
            }
        }
        return(
            <View style={{flexDirection:"row", backgroundColor: '#FFFFFF'}}>
                <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:30}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Daily Activity Goal</Text>
                    <CircularProgress percentage={(activityCount / this.state.goalDailyActivity)*100} >
                        <View>
                            <Text style={{textAlign:'center'}}>{Math.round((activityCount / this.state.goalDailyActivity)*100).toFixed(0)} %</Text>
                        </View>
                    </CircularProgress>
                </View>
                <View style={{flex:1, justifyContent: 'flex-end', padding:10}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Daily Calorie Goal</Text>
                    <CircularProgress percentage={(calorieCount / this.state.goalDailyCalories)*100} >
                        <View>
                            <Text style={{textAlign:'center'}}>{Math.round((calorieCount / this.state.goalDailyCalories)*100).toFixed(0)} %</Text>
                        </View>
                    </CircularProgress>
                </View>
            </View>
        )
    }

    getNutritionProgress() {
        let proteinCount = this.state.dayProtein;
        let fatCount = this.state.dayFat;
        let carbCount = this.state.dayCarb;

        return(
            <View style={{flexDirection:"row", backgroundColor: '#FFFFFF'}}>
                <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:10}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Daily Activity Goal</Text>
                    <CircularProgress percentage={(proteinCount / this.state.goalDailyProtein)*100} >
                        <View>
                            <Text style={{textAlign:'center'}}>{Math.round((proteinCount / this.state.goalDailyProtein)*100).toFixed(0)} %</Text>
                        </View>
                    </CircularProgress>
                </View>
                <View style={{flex:1, justifyContent: 'flex-end', padding:10}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Daily Calorie Goal</Text>
                    <CircularProgress percentage={(fatCount / this.state.goalDailyFat)*100} >
                        <View>
                            <Text style={{textAlign:'center'}}>{Math.round((fatCount / this.state.goalDailyFat)*100).toFixed(0)} %</Text>
                        </View>
                    </CircularProgress>
                </View>
                <View style={{flex:1, justifyContent: 'flex-end', padding:10}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Daily Calorie Goal</Text>
                    <CircularProgress percentage={(carbCount / this.state.goalDailyCalories)*100} >
                        <View>
                            <Text style={{textAlign:'center'}}>{Math.round((carbCount / this.state.goalDailyCarbohydrates)*100).toFixed(0)} %</Text>
                        </View>
                    </CircularProgress>
                </View>
            </View>
        )
    }

    getActivities() {
        let activities = [];
        let activityData = [];
        let currDate = new Date();

        for(const activity of Object.entries(this.state.allActivities)) {
            activityData = JSON.parse(JSON.stringify(activity[1]));
            for(let act of activityData){
                    activities.push(
                        <Card title={act.name}>
                            {
                                <View key={act.id}>
                                    <Text style={{width: 250, textAlign: 'center'}}>Duration: {act.duration}</Text>
                                    <Text style={{width: 250, textAlign: 'center'}}>Calories: {act.calories}</Text>
                                    <Button title='EDIT' buttonStyle={{
                                        borderRadius: 4,
                                        padding: 10,
                                        textAlign: 'center',
                                        marginBottom: 20,
                                        backgroundColor: '#90ee90',
                                        color: '#fff'
                                    }} onPress={() => this.props.navigation.navigate('editActivityPage', {
                                        username: this.props.navigation.state.params.username,
                                        token: this.props.navigation.state.params.token,
                                        activityID: act.id,
                                        activityName: act.name,
                                        activityDuration: act.duration,
                                        activityCalories: act.calories,
                                        activityDate: act.date
                                    })} text={'EDIT'} textStyle={{textAlign:'center', color:'#FFFFFF'}}>EDIT</Button>
                                    <Button title='X' style={{justifyContent:'center'}} buttonStyle={{
                                        borderRadius: 4,
                                        padding: 10,
                                        textAlign: 'center',
                                        marginBottom: 20,
                                        backgroundColor: '#FF3B30',
                                        color: '#fff',
                                        width: 50
                                    }} text={'X'} textStyle={{textAlign:'center', color:'#FFFFFF'}} onPress={() => this.onDeleteActivityPress(act.id)}>X</Button>
                                </View>
                            }
                        </Card>
                    )
                }
            }
        return activities;
    }

    render() {
        return (
            <ScrollView style={{flex: 1, paddingHorizontal: 10,  backgroundColor: '#598bff'}}>
                <Text style={{fontWeight: 'bold',textDecorationLine:'underline', fontSize:30, backgroundColor: '#FFFFFF', paddingBottom:10}}>{this.state.date}</Text>
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
                            backgroundColor: '#ffa500',
                            color: '#fff'
                        }} text={'Profile'} title="ProfilePage" onPress = {()=>this.props.navigation.navigate('profilePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                    </View>
                    <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:10}}>
                        <Button buttonStyle={{
                            borderRadius: 4,
                            padding: 10,
                            textAlign: 'center',
                            marginBottom: 20,
                            backgroundColor: '#808080',
                            color: '#fff'
                        }} text={'Settings'} title="settingsPage" onPress = {()=>this.props.navigation.navigate('settingsPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                    </View>
                </View>
                {this.getProgress()}
                {this.getNutritionProgress()}
                <Button style={{padding:20}} buttonStyle={{backgroundColor: '#90ee90', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Create Activity'} onPress = {()=>this.props.navigation.navigate('activityPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                {this.state.cards}
            </ScrollView>
        );
    }
}

export default UserHomePage;