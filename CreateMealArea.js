import {Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView, View} from "react-native";
import React, {Component} from "react";
import DatePicker from "react-native-datepicker";
import Button from "./Button";


class CreateMealArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.state.params.username,
            token:this.props.navigation.state.params.token.token,
            id: 0,
            name: "",
            date: new Date(),
            mealDate:new Date()
        }
    }

    async onCreateMealPress(){
        try{
            if(this.state.name === ""){
                this.setState({
                    name: "Untitled Meal"
                })
            }

            let response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' ,{
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
                        date: this.state.mealDate
                    }
                )
            });
            let res =  await response.text();
            console.log(response);
            console.log(this.state.date);
            console.log(this.state.name);

        } catch(errors) {
            console.log("Catch error is: " + errors);
        }
        this.props.navigation.navigate('userHomePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token})

    }

    render() {
        return (
            <ScrollView style={{flex: 5, backgroundColor: '#598bff', paddingHorizontal: 25}}>
                <Text style={{padding:20}}>Create Meal</Text>
                <TextInput keyboardDismissMode={'interactive'} style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({name: val})}
                           placeholder="Meal Name"
                           placeholderTextColor='#D4D4D4'/>
                <DatePicker
                    style={{width: 200, backgroundColor: "white"}}
                    date={this.state.mealDate}
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
                        this.setState({mealDate: dateFormat})
                    }}
                />
                <TouchableOpacity onPress={this.onCreateMealPress.bind(this)}
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
                    <Text>{this.props.navigation.state.params.token.token}</Text>
                    <Text>{this.props.navigation.state.params.mealId}</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

export default CreateMealArea;