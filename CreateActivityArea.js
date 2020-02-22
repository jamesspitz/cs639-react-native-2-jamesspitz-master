import {Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView, View} from "react-native";
import React, {Component} from "react";
import DatePicker from "react-native-datepicker";
import Button from "./Button";


class CreateActivityArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.state.params.username,
            token:this.props.navigation.state.params.token.token,
            id: 0,
            name: "",
            duration:0, //Minutes
            date: new Date(),
            calories:0,
            activityDate:new Date()
        }
    }

    async onCreateActivityPress(){
        try{
            if(this.state.name === ""){
                this.setState({
                    name: "Untitled Activity"
                })
            }

            let response = await fetch('https://mysqlcs639.cs.wisc.edu/activities/' ,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.navigation.state.params.token.token,
                },
                body: JSON.stringify(
                    {
                        id: parseInt(this.state.id),
                        name: this.state.name,
                        duration: parseFloat(this.state.duration), //Minutes
                        date: this.state.activityDate,
                        calories: parseFloat(this.state.calories)
                    }
                )
            });
            let res =  await response.text();
            console.log(response);

        } catch(errors) {
            console.log("Catch error is: " + errors);
        }
        this.props.navigation.navigate('userHomePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})

    }

    render() {
            return (
                <ScrollView style={{flex: 5, backgroundColor: '#598bff', paddingHorizontal: 25}}>
                <Text style={{padding:20}}>Create Activity</Text>
                    <TextInput keyboardDismissMode={'interactive'} style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                               onChangeText={(val) => this.setState({name: val})}
                               placeholder="Activity Name"
                               placeholderTextColor='#D4D4D4'/>
                    <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                               style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                               onChangeText={(val) => this.setState({duration: val})}
                               placeholder="Activity Duration (Minutes)"
                               placeholderTextColor='#D4D4D4'/>
                    <DatePicker
                        style={{width: 200, backgroundColor: "white"}}
                        date={this.state.activityDate}
                        mode="date"
                        placeholder="Select Date"
                        format="MM-DD-YYYY"
                        minDate="01-01-2018"
                        maxDate="01-01-2020"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => {
                            let dateParts = date.split('-');

                            let dateFormat = new Date(dateParts[2], dateParts[0]-1, dateParts[1]);
                            this.setState({activityDate: dateFormat})
                        }}
                    />
                    <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                               style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                               onChangeText={(val) => this.setState({calories: val})} placeholder="Calories:"
                               placeholderTextColor='#D4D4D4'/>

                    <TouchableOpacity onPress={this.onCreateActivityPress.bind(this)}
                                      style={{borderRadius: 20, padding: 10}}>
                        <Text style={{
                            borderRadius: 4,
                            alignContent: 'center',
                            padding: 10,
                            textAlign: 'center',
                            color: '#fff',
                            backgroundColor: '#90ee90',
                            height: 50

                        }}>CREATE</Text>
                    </TouchableOpacity>
                </ScrollView>
            )
    }
}

export default CreateActivityArea;