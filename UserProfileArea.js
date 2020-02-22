import React, { Component } from 'react';
import {View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import Button from "./Button";
import { Table, Row, Rows } from 'react-native-table-component';
import BarChart from "react-native-svg-charts/src/bar-chart/bar-chart";
import Grid from "react-native-svg-charts/src/grid";
import LineChart from "react-native-svg-charts/src/line-chart/line-chart";


//TODO aggregate week data, graph data
class UserProfileArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.state.params.username,
            token:this.props.navigation.state.params.token,
            firstName:" ",
            lastName: " ",
            goalDailyCalories: 0,
            goalDailyProtein: 0,
            goalDailyCarbohydrates:0 ,
            goalDailyFat: 0,
            goalDailyActivity:0,
            tableHead: [],
            tableBody: [],
            allActivities: {},
            activityChart:[],
            protChart:[],
            carbChart:[],
            fatChart:[],
            caloriesChart:[],
            foodData:{},
            allMeals: {},
            charts:[],
            nProgress: [],
            aProgress: [],

        }
    }

    async fetchData(){
        const {navigation} = this.props;
        let username = this.props.navigation.state.params.username;
        let token = this.props.navigation.state.params.token.token;
        let dateArray = [];
        let charts = [];

        // Stores daily numbers for the 7 days
        let dayWeekCalories = Array(7).fill(0);
        let dayWeekPro = Array(7).fill(0);
        let dayWeekCarbs = Array(7).fill(0);
        let dayWeekFat = Array(7).fill(0);

        // Create array of date strings for last 7 days
        for(let i =0; i<7; i++){
            let day = new Date();
            day.setDate(day.getDate() - (7-i));
            dateArray.push(day.toISOString().substring(0,10))
        }

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
                    goalDailyProtein: data.goalDailyProtein,
                    tableHead: [data.firstName + " " + data.lastName],
                    tableBody: [
                        ["Daily Activity Goal:", data.goalDailyActivity],
                        ["Daily Calorie Goal:", data.goalDailyCalories],
                        ["Carbohydrates Goal:", data.goalDailyCarbohydrates],
                        ["Daily Fat Goal:", data.goalDailyFat],
                        ["Daily Protein Goal:", data.goalDailyProtein]
                    ],
                })
            })
            .catch(error=>console.log(error));

        await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
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

        let obData = {};

        await fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
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
                obData = data;
                console.log(obData)
                    this.setState({
                            allMeals: data,
                        }
                    )
                return obData
                }
            )
            .catch(error=>console.log(error));

        let mealData = [];
        let mealIds = [];

        let currDate = (new Date(new Date().setDate(new Date().getDate() - 1))).toISOString().substring(0, 10);

        // k days in week
        for(let k = 0; k < dateArray.length; k++) {

            // counters for day
            let calorieCount = 0;
            let proCount = 0;
            let fatCount = 0;
            let carbCount = 0;

            // checks all meals from the server
            for (const meals of Object.entries(this.state.allMeals)) {// store ids of meals on day k
                mealData = JSON.parse(JSON.stringify(meals[1]));
                for (let meal of mealData) {

                    let mealSubString = meal.date.substring(0, 10);
                    if (mealSubString === dateArray[k]) {

                        mealIds.push(meal.id);
                    }
                }
            }

            console.log(mealIds.length)

            for (let i = 0; i < mealIds.length; i++) {
                let foodDataOb = {};
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
                        foodDataOb = data;
                        this.setState({foodData: foodDataOb});
                        return foodDataOb
                    });

                let ingredientsData = [];

                // get foods of meal
                for (const ingredient of Object.entries(this.state.foodData)) {
                    console.log(JSON.stringify(ingredient[1]))
                    ingredientsData = JSON.parse(JSON.stringify(ingredient[1]));
                    // get food data
                    for (let i = 0; i < ingredientsData.length; i++) {

                        // keep running count of nutrients
                        console.log(ingredientsData[i].protein)
                        proCount = proCount + ingredientsData[i].protein;
                        fatCount = fatCount + ingredientsData[i].fat;
                        calorieCount = calorieCount + ingredientsData[i].calories;
                        carbCount = carbCount + ingredientsData[i].carbohydrates;
                    }

                }
            }
            console.log(proCount)
            // save running count in arrays for their week day
            dayWeekPro[k] = proCount;
            dayWeekCarbs[k] = calorieCount;
            dayWeekFat[k] = fatCount;
            dayWeekCalories[k] = carbCount;

        } // counts clear

        // update the array stored in state
        this.setState({
            protChart: [dayWeekPro],
            carbChart:[dayWeekCarbs],
            fatChart:[dayWeekFat],
            caloriesChart: [dayWeekCalories],
        })
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.willFocusSubscription.remove();
    }

    // TODO add nutrition fetch
    componentDidMount(){
        this.fetchData();
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.fetchData();
            }
        );

        this.interval = setInterval( () => {
            this.setState({
                date : new Date().toLocaleDateString("en-US"),
                nProgress: this.getWeekNutrientStats(),
                aProgress: this.getWeekActivityStats()
            })
        },1000);

    }

    //TODO add nutrition week stats, return a rendered object
    getWeekActivityStats(){

        // cumulative count for last 7 days
        let calorieWeekCount = 0;
        let activityWeekCount = 0;

        // Stores daily numbers for the 7 days
        let dayWeekCalories = Array(7).fill(0);
        let dayWeekActivity = Array(7).fill(0);

        let activityData = [];
        let dateArray = [];

        // Create array of date strings for last 7 days
        for(let i =0; i<7; i++){
            let day = new Date();
            day.setDate(day.getDate() - (7-i));
            dateArray.push(day.toISOString().substring(0,10))
        }


        for (const activity of Object.entries(this.state.allActivities)) {
            activityData = JSON.parse(JSON.stringify(activity[1]));
            for (let act of activityData) {
                for(let j =0; j < dateArray.length; j++){
                    if(act.date.substring(0,10) === dateArray[j]) {

                        // Add to cumulative
                        calorieWeekCount = calorieWeekCount - act.calories; // losing calories
                        activityWeekCount = activityWeekCount + act.duration;
                    }
                    // Add to individual day count
                    dayWeekCalories[j] = calorieWeekCount;
                    dayWeekActivity[j] = activityWeekCount;
                }
            }
        }
        let barData = [];
        for(let i =0; i < dayWeekActivity.length; i++){
            barData.push(dayWeekActivity[i])
        }

        return (

            <LineChart
                style={{ height: 200 }}
                data={ barData }
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid/>
            </LineChart>

        )
    }

    getWeekNutrientStats(){
        // cumulative count for last 7 days
        let proCount = this.state.protChart[0];
        let fatCount = this.state.fatChart[0];
        let carbCount = this.state.carbChart[0];
        let calCount = this.state.caloriesChart[0];
        let barData = [];

        let dateArray = [];
        let fatArray = Array(7).fill(0);
        let carbArray = Array(7).fill(0);
        let calArray = Array(7).fill(0);
        let proArray = Array(7).fill(0);

        // Create array of date strings for last 7 days
        for(let i =0; i<7; i++){
            let day = new Date();
            day.setDate(day.getDate() - (7-i));
            dateArray.push(day.toISOString().substring(0,10))
            proArray[i] = parseFloat(proCount[i]);
            carbArray[i] = parseFloat(carbCount[i]);
            fatArray[i] = parseFloat(fatCount[i]);
            calArray[i] = parseFloat(calCount[i]);
        }
        console.log(proArray[6])
        const fill = 'rgb(134, 65, 244)';
        barData.push(<Text style={{fontWeight: 'bold', fontSize:20, backgroundColor: '#FFFFFF',paddingTop:10, paddingBottom:10, textAlign:'center', borderColor:'#000000'}}>Protein Progress</Text>)
        barData.push(
            <LineChart
                style={{ height: 200 }}
                data={ proArray }
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid/>
            </LineChart>
        )
        barData.push(<Text style={{fontWeight: 'bold', fontSize:20, backgroundColor: '#FFFFFF',paddingTop:10, paddingBottom:10, textAlign:'center', borderColor:'#000000'}}>Fats Progress</Text>)
        barData.push(
            <LineChart
                style={{ height: 200 }}
                data={ fatArray }
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid/>
            </LineChart>
        )
        barData.push(<Text style={{fontWeight: 'bold', fontSize:20, backgroundColor: '#FFFFFF',paddingTop:10, paddingBottom:10, textAlign:'center', borderColor:'#000000'}}>Carbohydrates Progress</Text>)
        barData.push(
            <LineChart
                style={{ height: 200 }}
                data={ carbArray }
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid/>
            </LineChart>
        )
        barData.push(<Text style={{fontWeight: 'bold', fontSize:20, backgroundColor: '#FFFFFF',paddingTop:10, paddingBottom:10, textAlign:'center', borderColor:'#000000'}}>Calories Progress</Text>)
        barData.push(
            <LineChart
                style={{ height: 200 }}
                data={ calArray }
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid/>
            </LineChart>
        )
        return barData
    }




    render() {
        return (
            <ScrollView style={{flex: 1, paddingHorizontal: 10, backgroundColor: '#FFF'}}>
            <View style={styles.container}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                    <Rows data={this.state.tableBody} textStyle={styles.text}/>
                </Table>
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
                            backgroundColor: '#dc143c',
                            color: '#fff',
                            borderColor: '#000',
                            borderWidth:1,

                        }} text={'Day View'} title="HomePage" onPress = {()=>this.props.navigation.navigate('userHomePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
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
                        }} text={'Settings'} title="settingsPage" onPress = {()=>this.props.navigation.navigate('settingsPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
                    </View>
                </View>
                <Text style={{fontWeight: 'bold', fontSize:30, backgroundColor: '#FFFFFF', paddingBottom:10, textAlign:'center', borderColor:'#000000', textDecorationLine:'underline'}}>Last 7 Days</Text>
                <Text style={{fontWeight: 'bold', fontSize:20, backgroundColor: '#FFFFFF', paddingBottom:10, paddingTop:10, textAlign:'center', borderColor:'#000000'}}>Activity Minutes</Text>
                <View>
                    {this.state.aProgress}
                    {this.state.nProgress}
                </View>
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#FFF' },
    head: { height: 40, backgroundColor: '#598bff' },
    text: { margin: 6 }
});

export default UserProfileArea;