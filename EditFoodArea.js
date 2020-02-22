import React, {Component} from "react";
import {ScrollView, Text, TextInput, TouchableOpacity} from "react-native";
import DatePicker from "react-native-datepicker";
//TODO check that pass-ins work
class EditFoodArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.state.params.username,
            token: this.props.navigation.state.params.token.token,
            mealId: this.props.navigation.state.params.mealId,
            foodId: this.props.navigation.state.params.foodId,
            calories: this.props.navigation.state.params.foodCalories,
            name: this.props.navigation.state.params.foodName,
            fat: this.props.navigation.state.params.foodFat,
            protein: this.props.navigation.state.params.foodProtein,
            carbohydrates: this.props.navigation.state.params.foodCarbohydrates,
            newName: "",
            newProtein: 0,
            newFat: 0,
            newCalories: 0,
            newCarbohydrates: 0,
            changedName: false,
            changedProtein: false,
            changedFat: false,
            changedCalories: false,
            changedCarbohydrates: false
        }
    }


    async onEditFoodPress (){

        let name = this.state.name;
        let calories = this.state.calories;
        let protein = this.state.protein;
        let fat = this.state.fat;
        let carbs = this.state.carbohydrates;

        // Check for changes and valid changes
        if((this.state.changedName === true) && this.state.newName !== ""){
            name = this.state.newName
        }

        if((this.state.changedCalories === true) && this.state.newCalories !== ""){
            calories = parseFloat(this.state.newCalories)
        }

        if((this.state.changedProtein === true) && this.state.newProtein !== ""){
            protein = parseFloat(this.state.newProtein)
        }
        if((this.state.changedCarbohydrates === true) && this.state.newCarbohydrates !== ""){
            carbs = parseFloat(this.state.newCarbohydrates)
        }
        if((this.state.changedFat === true) && this.state.newFat !== ""){
            fat = parseFloat(this.state.newFat)
        }
        console.log(calories);
        try{
            let response = fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.navigation.state.params.mealId + '/foods/' +  this.props.navigation.state.params.foodId,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.navigation.state.params.token.token,
                },
                body: JSON.stringify(
                    {
                        name: this.state.name,
                        calories: calories,
                        protein: protein,
                        carbohydrates: carbs,
                        fat: fat
                    }
                )
            }).then(response =>  {
                let resp = response.json();
                console.log(resp);
                return resp;
            });

        } catch(errors) {
            console.log("Catch error is: " + errors);
        }
        alert(`Food Updated`);
        this.props.navigation.navigate('editMealPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token.token,  mealId: this.props.navigation.state.params.mealId,})

    }


    render() {
        return (
            <ScrollView style={{flex: 5, backgroundColor: '#FFFFFF', paddingHorizontal: 25}}>
                <Text style={{padding:20, textAlign: 'center', backgroundColor: '#90ee90'}}>Edit Food</Text>

                <TextInput keyboardDismissMode={'interactive'} style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({newName: val, changedName:true})}
                           placeholder={this.state.name}
                           placeholderTextColor='#D4D4D4'/>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({calories: val})}
                           placeholder="Calories:"
                           placeholderTextColor='#D4D4D4'/>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({newProtein: val, changedProtein: true})}
                           placeholder={"Protein Content:" + this.state.protein}
                           placeholderTextColor='#D4D4D4'/>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({newCarbohydrates: val, changedCarbohydrates: true})}
                           placeholder={"Carbohydrates:" + this.state.carbohydrates}
                           placeholderTextColor='#D4D4D4'/>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({newFat: val, changedFat: true})}
                           placeholder={"Fat Content:" + this.state.fat}
                           placeholderTextColor='#D4D4D4'/>

                <TouchableOpacity
                    style={{borderRadius: 20, padding: 10}}>
                    <Text style={{
                        borderRadius: 4,
                        alignContent: 'center',
                        padding: 10,
                        textAlign: 'center',
                        color: '#fff',
                        backgroundColor: '#90ee90',
                        height: 50

                    }} onPress={this.onEditFoodPress.bind(this)}>Save Changes</Text>
                    <Text>{this.props.navigation.state.params.token.token}</Text>
                    <Text>{this.props.navigation.state.params.mealID}</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

}
export default EditFoodArea;