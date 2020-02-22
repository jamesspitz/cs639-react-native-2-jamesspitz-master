import React, { Component } from 'react';
import {Text, ScrollView, View, Alert} from 'react-native';
import Button from "./Button";
import {Card} from "react-native-elements";
import {CircularProgress} from 'react-native-svg-circular-progress';

//TODO  Styling
class UserHomePage extends Component {
    constructor(props) {
        super(props);
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
            allMeals: {},
            date: new Date().toLocaleDateString("en-US"),
            activityID:0,
            activityName: "",
            activityDuration: 0,
            activityDate: new Date(),
            activityCalories: 0,
            interval: null,
            dayProtein: 0,
            dayFat:0,
            dayCarb: 0,
            dayCalories:0,
            cards:[],
            meals:[],
            nProgress: [],
            aProgress: [],
            mealData: new Array(4).fill(0),
            foodData:{},
            tempProtein: 0,
            tempFat:0,
            tempCarb: 0,
            tempCalories:0,
        }

    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.willFocusSubscription.remove();
    }

    async fetchData(){
        const {navigation} = this.props;
        let username = this.props.navigation.state.params.username;
        let token = this.props.navigation.state.params.token.token;
        let calorieCount = 0;
        let proCount = 0;
        let fatCount = 0;
        let carbCount = 0;


        let newHeaders = new Headers();
        newHeaders.append('Content-Type', 'application/json');
        newHeaders.append('x-access-token', token);

            fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.navigation.state.params.username, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token':  this.props.navigation.state.params.token.token,
                },
                redirect: 'follow'
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
            .catch(error=>console.log(error));

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
            .catch(error=>console.log(error));

        fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token':  this.props.navigation.state.params.token.token,
            }
        })
            .then(response =>  {
                return response.json();
            })
            .then(data => {
                    this.setState({
                            allMeals: data,
                        }
                    )
                }
            )
            .catch(error=>console.log(error));

        let mealData = [];
        let mealIds = [];
        let currDate = (new Date(new Date().setDate(new Date().getDate() - 1))).toISOString().substring(0, 10);

        for (const meals of Object.entries(this.state.allMeals)) {

            mealData = JSON.parse(JSON.stringify(meals[1]));

            for (let meal of mealData) {

                let mealSubString = meal.date.substring(0, 10);

                if (mealSubString === currDate) {

                    mealIds.push(meal.id);
                }
            }
        }

        for(let i =0; i < mealIds.length; i++) {
            let foodDataOb = {};
            fetch('https://mysqlcs639.cs.wisc.edu/meals/' + parseFloat(mealIds[i]).toString() + '/foods/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.navigation.state.params.token.token,
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    foodDataOb = data;
                    this.setState({foodData: foodDataOb})
                    return foodDataOb
                });


            let ingredientsData = [];

            for (const ingredient of Object.entries(this.state.foodData)) {
                ingredientsData = JSON.parse(JSON.stringify(ingredient[1]));

                for (let i = 0; i < ingredientsData.length; i++) {
                    proCount = proCount + ingredientsData[i].protein;
                    fatCount = fatCount + ingredientsData[i].fat;
                    calorieCount = calorieCount + ingredientsData[i].calories;
                    carbCount = carbCount + ingredientsData[i].carbohydrates;
                }
            }
        }
        this.setState({dayProtein: proCount,
            dayFat: fatCount,
            dayCarb: carbCount,
            dayCalories: calorieCount})

    }


    async getMealData() {
        let nutData = [];
        let mealData = [];
        let mealIds = [];
        let currDate = (new Date(new Date().setDate(new Date().getDate() - 1))).toISOString().substring(0, 10);
        let calorieCount = 0;
        let proCount = 0;
        let fatCount = 0;
        let carbCount = 0;

        for (const meals of Object.entries(this.state.allMeals)) {

            mealData = JSON.parse(JSON.stringify(meals[1]));

            for (let meal of mealData) {

                let mealSubString = meal.date.substring(0, 10);

                if (mealSubString === currDate) {

                    mealIds.push(meal.id);
                }
            }
        }

        for(let i =0; i < mealIds.length; i++) {

            let foodData = {};
            await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + parseFloat(mealIds[i]).toString() + '/foods/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.navigation.state.params.token.token,
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    foodData = data;
                    this.setState({foodData: foodData})
                });
            await foodData;
            let foodsData = this.state.foodData;
            let ingredientsData = [];

            for (const ingredient of Object.entries(foodsData)) {

                ingredientsData = JSON.parse(JSON.stringify(ingredient[1]));
                for (let i = 0; i < ingredientsData.length; i++) {


                    proCount = proCount + ingredientsData[i].protein;
                    fatCount = fatCount + ingredientsData[i].fat;
                    calorieCount = calorieCount + ingredientsData[i].calories;
                    carbCount = carbCount + ingredientsData[i].carbohydrates;
                }
            }

        }

        this.setState({
            tempProtein: proCount,
            tempFat: fatCount,
            tempCarb: carbCount,
            tempCalories: calorieCount});

        nutData.push(calorieCount);
        nutData.push(proCount);
        nutData.push(carbCount);
        nutData.push(fatCount);

        return nutData
    }

    componentDidMount(){
        this.fetchData();
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.fetchData();
            }
        );

        this.interval = setInterval( () => {
            this.fetchData();
            this.setState({
                date : new Date().toLocaleDateString("en-US"),
                cards: this.getActivities(),
                nProgress: this.getNutritionProgress(),
                aProgress: this.getProgress(),
                meals: this.getMeals()
            })
        },1000);

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
            this.fetchData();
    }

    onDeleteMealPress(id){

        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id, {
            method: 'DELETE',
            headers: {
                'x-access-token': this.props.navigation.state.params.token.token
            },
        }).then(response => {
            return response.json();
        }).catch(error => console.error(error)
        );
        alert(`Meal Deleted`);
        this.fetchData();
    }



    getMeals(){
        let mealCards = [];
        let mealData = [];
        let currDate = (new Date(new Date().setDate(new Date().getDate() - 1))).toISOString().substring(0,10);
        let totCal = 0;
        let totPro = 0;
        let totCarb = 0;
        let totFat = 0;


        for(const meals of Object.entries(this.state.allMeals)) {

            mealData = JSON.parse(JSON.stringify(meals[1]));

            for(let meal of mealData){

                // error handle empty names
                let mealName = meal.name;
                if(mealName ===""){
                    mealName = "Untitled Activity"
                }

                let mealSubString = meal.date.substring(0,10);

                if(mealSubString === currDate) {

                    mealCards.push(
                        <Card title={mealName} key={meal.id}>
                            <View style={{padding:5}}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                marginBottom:1
                            }}>
                                <View style={{flex:1, justifyContent: 'center', padding: 5, paddingLeft:10}}>
                                    <Button title='EDIT' buttonStyle={{
                                        borderRadius: 4,
                                        padding: 5,
                                        textAlign: 'center',
                                        marginBottom: 5,
                                        backgroundColor: '#90ee90',
                                        color: '#fff'
                                    }} onPress={() => this.props.navigation.navigate('editMealPage', {
                                        username: this.props.navigation.state.params.username,
                                        token: this.props.navigation.state.params.token,
                                        mealId: meal.id,
                                        mealName: meal.name,
                                        mealDate: mealSubString
                                    })} text={'EDIT'} textStyle={{textAlign: 'center', color: '#FFFFFF'}}/>
                                </View>
                                <View style={{flex:1, justifyContent: 'center', padding: 5, paddingLeft:100, alignContent:'center'}}>
                                    <Button title='X' style={{justifyContent: 'center'}} buttonStyle={{
                                        borderRadius: 4,
                                        padding: 5,
                                        textAlign: 'center',
                                        marginBottom: 5,
                                        backgroundColor: '#FF3B30',
                                        color: '#fff',
                                        width: 50,
                                    }} text={'X'} textStyle={{textAlign: 'center', color: '#FFFFFF', textShadowRadius:2, textShadowColor: 'black'}}
                                            onPress={() => this.onDeleteMealPress(meal.id)}/>
                                </View>
                            </View>
                            </View>
                        </Card>
                    )
                }
            }
        }
        return mealCards;
    }


    getProgress() {
        let calorieCount = 0;
        let activityCount = 0;
        let activityData = [];
        let currDate = (new Date(new Date().setDate(new Date().getDate() - 1))).toISOString().substring(0,10);

        for (const activity of Object.entries(this.state.allActivities)) {
            activityData = JSON.parse(JSON.stringify(activity[1]));
            for (let act of activityData) {
                if(act.date.substring(0,10) === currDate) {
                    calorieCount = calorieCount + act.calories;
                    activityCount = activityCount + act.duration;
                }
            }
        }
        return(
            <View style={{flexDirection:"row", backgroundColor: '#FFFFFF'}}>
                <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:30}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Daily Activity Goal</Text>
                    <CircularProgress percentage={(activityCount / this.state.goalDailyActivity)*100}>
                        <View>
                            <Text style={{textAlign:'center'}}>{Math.round((activityCount / this.state.goalDailyActivity)*100).toFixed(0)} %</Text>
                        </View>
                    </CircularProgress>
                </View>
                <View style={{flex:1, justifyContent: 'flex-end', padding:10}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Daily Calorie Goal</Text>
                    <CircularProgress percentage={(((-1) * (this.state.dayCalories - calorieCount)) / this.state.goalDailyCalories)*100} >
                        <View>
                            <Text style={{textAlign:'center'}}>{Math.round((((-1) * (this.state.dayCalories - calorieCount)) / this.state.goalDailyCalories)*100).toFixed(0)} %</Text>
                        </View>
                    </CircularProgress>
                </View>
            </View>
        )
    }

   getNutritionProgress() {
        // this.getMealData()
        let proteinCount = this.state.dayProtein;
        let fatCount = this.state.dayFat;
        let carbCount = this.state.dayCarb;


        return(
            <View style={{flexDirection:"row", backgroundColor: '#FFFFFF'}}>
                <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:10}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Daily Protein Goal</Text>
                    <CircularProgress percentage={(proteinCount / this.state.goalDailyProtein)*100} >
                        <View>
                            <Text style={{textAlign:'center'}}>{Math.round((proteinCount / this.state.goalDailyProtein)*100).toFixed(0)} %</Text>
                        </View>
                    </CircularProgress>
                </View>
                <View style={{flex:1, justifyContent: 'flex-end', padding:10}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Daily Fat Goal</Text>
                    <CircularProgress percentage={(fatCount / this.state.goalDailyFat)*100} >
                        <View>
                            <Text style={{textAlign:'center'}}>{Math.round((fatCount / this.state.goalDailyFat)*100).toFixed(0)} %</Text>
                        </View>
                    </CircularProgress>
                </View>
                <View style={{flex:1, justifyContent: 'flex-end', padding:10}}>
                    <Text style={{fontWeight: 'bold', fontSize:15, padding:5}}>Carbohydrate Goal</Text>
                    <CircularProgress percentage={(carbCount / this.state.goalDailyCarbohydrates)*100}>
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
        let currDate = (new Date(new Date().setDate(new Date().getDate() - 1))).toISOString().substring(0,10);

        for(const activity of Object.entries(this.state.allActivities)) {
            activityData = JSON.parse(JSON.stringify(activity[1]));
            for(let act of activityData){

                // error handle empty names
                let activityName = act.name;
                if(activityName ===""){
                    activityName = "Untitled Activity"
                }

                if(act.date.substring(0,10) === currDate) {

                    activities.push(
                        <Card title={activityName} key={act.id}>
                            <View>
                                <Text style={{width: 250, textAlign: 'center'}}>Duration: {act.duration}</Text>
                                <Text style={{width: 250, textAlign: 'center'}}>Calories: {act.calories}</Text>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    marginBottom:1
                                }}>
                                <View style={{flex:1, justifyContent: 'center', padding: 5, paddingLeft:10}}>
                                    <Button title='EDIT' buttonStyle={{
                                        borderRadius: 4,
                                        padding: 5,
                                        textAlign: 'center',
                                        marginBottom: 5,
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
                                    })} text={'EDIT'} textStyle={{textAlign: 'center', color: '#FFFFFF'}}/>
                                </View>
                                <View style={{flex:1, justifyContent: 'center', padding: 5, paddingLeft:100, alignContent:'center'}}>
                                    <Button title='X' style={{justifyContent: 'center'}} buttonStyle={{
                                        borderRadius: 4,
                                        padding: 5,
                                        textAlign: 'center',
                                        marginBottom: 5,
                                        backgroundColor: '#FF3B30',
                                        color: '#fff',
                                        width: 50,
                                    }} text={'X'} textStyle={{textAlign: 'center', color: '#FFFFFF', textShadowRadius:2, textShadowColor: 'black'}}
                                            onPress={() => this.onDeleteActivityPress(act.id)}/>
                                </View>
                            </View>
                            </View>
                        </Card>
                    )
                }
                }
            }
        return activities;
    }
//,textDecorationLine:'underline'
    render() {
        return (
            <ScrollView style={{flex: 1, paddingHorizontal: 10, backgroundColor: '#FFF'}}>
                <View style={{backgroundColor: '#598bff', padding:20, borderColor:'#000000'}}>
                <Text style={{fontWeight: 'bold', fontSize:30, textAlign:'center', justifyContent:'center', alignContent:'center', color: '#ffffff', textShadowRadius:2, textShadowColor: 'black'}}>{this.state.date}</Text>
                </View>
                    <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:10}}>
                        <Button buttonStyle={{
                            borderRadius: 15,
                            padding: 10,
                            textAlign: 'center',
                            marginBottom: 20,
                            backgroundColor: '#ffa500',
                            borderColor: '#000',
                            borderWidth:1,
                            color: '#fff'
                        }} text={'Profile'} textStyle={{fontSize: 15, color: '#ffffff', textShadowRadius:2, textShadowColor: 'black', textAlign:'center'}} title="ProfilePage" onPress = {()=>this.props.navigation.navigate('profilePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                    </View>
                    <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:10}}>
                        <Button buttonStyle={{
                            borderRadius: 15,
                            padding: 10,
                            textAlign: 'center',
                            marginBottom: 20,
                            backgroundColor: '#808080',
                            borderColor: '#000',
                            borderWidth:1,
                            color: '#fff'
                        }} text={'Settings'} textStyle={{fontSize: 15, color: '#ffffff', textShadowRadius:2, textShadowColor: 'black', textAlign:'center'}} title="settingsPage" onPress = {()=>this.props.navigation.navigate('settingsPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                    </View>
                </View>

                <View style={{padding:10, borderColor:'#000000', borderWidth:1,}}>
                {this.state.aProgress}
                </View>

                <View style={{padding:20, borderColor:'#000000', borderWidth:1}}>
                    {this.state.nProgress}
                </View>

                <View style={{padding:20}}>
                <Button buttonStyle={{backgroundColor: '#90ee90', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, borderColor:'#000000', borderWidth:1,}} textStyle={{color:'black'}} text={'Create Activity'} onPress = {()=>this.props.navigation.navigate('activityPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                </View>

                <View style={{padding:20}}>
                {this.state.cards}
                </View>

                <Button buttonStyle={{backgroundColor: '#90ee90', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, borderWidth:1, borderColor:'#000'}} textStyle={{color: 'black'}} text={'Create Meal'} onPress = {()=>this.props.navigation.navigate('createMealPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                {this.state.meals}
            </ScrollView>
        )
    }
}
export default UserHomePage;