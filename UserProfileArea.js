import React, { Component } from 'react';
import {View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import Button from "./Button";
import { Table, Row, Rows } from 'react-native-table-component';

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
        }
    }
    componentDidMount(){
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
                    goalDailyProtein: data.goalDailyProtein,
                    tableHead: [data.firstName + " " + data.lastName],
                    tableBody: [
                        ["Daily Activity Goal:", data.goalDailyActivity],
                        ["Daily Calorie Goal:", data.goalDailyCalories],
                        ["Carbohydrates Goal:", data.goalDailyCarbohydrates],
                        ["Daily Fat Goal:", data.goalDailyFat],
                        ["Daily Protein Goal:", data.goalDailyProtein]
                    ]
                })
            })
            .catch(error=>console.log(error))
    }

    render() {
        return (
            <View style={styles.container}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                    <Rows data={this.state.tableBody} textStyle={styles.text}/>
                </Table>
                <Text>{this.state.token.token}</Text>
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
                        }} text={'Day View'} title="HomePage" onPress = {()=>this.props.navigation.navigate('userHomePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
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

<Button buttonStyle={{backgroundColor: '#90ee90', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 20, width: 250, height: 65, marginBottom: 10, marginTop: 15}} onPress = {()=>this.props.navigation.navigate('settingsPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 }
});

export default UserProfileArea;