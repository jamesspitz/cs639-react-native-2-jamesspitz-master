import {Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView, View} from "react-native";
import React, {Component} from "react";
import DatePicker from "react-native-datepicker";
import Button from "./Button";


class CreateFoodArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.state.params.username,
            token:this.props.navigation.state.params.token.token,
            mealId: this.props.navigation.state.params.mealId,
            foodId: 0,
            name: "",
            calories:0,
            protein: 0,
            carbohydrates:0,
            fat: 0,
        }
    }

    async onCreateFoodPress(){
        try{
            if(this.state.name === ""){
                this.setState({
                    name: "Untitled Food"
                })
            }

            let response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + parseFloat(this.props.navigation.state.params.mealId).toString() + '/foods/',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.navigation.state.params.token.token,
                },
                body: JSON.stringify(
                    {
                        id: parseInt(this.state.foodId),
                        name: this.state.name,
                        calories: parseFloat(this.state.calories), //Minutes
                        protein: parseFloat(this.state.protein),
                        carbohydrates: parseFloat(this.state.carbohydrates),
                        fat: parseFloat(this.state.fat)
                    }
                )
            });
            let res =  await response.text();
            console.log(response);

        } catch(errors) {
            console.log("Catch error is: " + errors);
        }
        this.props.navigation.navigate('editMealPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token, mealId:this.props.navigation.state.params.mealId})

    }

    render() {
        return (
            <ScrollView style={{flex: 5, backgroundColor: '#FFF', paddingHorizontal: 25}}>
                <Text style={{padding:20, fontWeight: 'bold', fontSize:30, alignContent:'center', justifyContent:'center', paddingLeft:30}}>Create Activity</Text>
                <TextInput keyboardDismissMode={'interactive'} style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({name: val})}
                           placeholder="Food Name"
                           placeholderTextColor='#D4D4D4'/>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({calories: val})}
                           placeholder="Calories:"
                           placeholderTextColor='#D4D4D4'/>

                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({protein: val})} placeholder="Protein Content:"
                           placeholderTextColor='#D4D4D4'/>

                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({carbohydrates: val})} placeholder="Carbohydrates:"
                           placeholderTextColor='#D4D4D4'/>

                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({fat: val})} placeholder="Fat Content:"
                           placeholderTextColor='#D4D4D4'/>

                <TouchableOpacity onPress={this.onCreateFoodPress.bind(this)}
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

export default CreateFoodArea;