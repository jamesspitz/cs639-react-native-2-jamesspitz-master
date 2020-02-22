import React, {Component} from "react";
import {ScrollView, Text, TextInput, TouchableOpacity} from "react-native";
import DatePicker from "react-native-datepicker";

class EditActivityArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.state.params.username,
            token: this.props.navigation.state.params.token.token,
            id: this.props.navigation.state.params.activityID,
            name: this.props.navigation.state.params.activityName,
            duration: this.props.navigation.state.params.activityDuration, //Minutes
            date: this.props.navigation.state.params.activityDate,
            calories: this.props.navigation.state.params.activityCalories,
            newName: "",
            newDuration: 0, //Minutes
            newDate: new Date(),
            newCalories: 0,
            changedName: false,
            changedDuration: false,
            changedDate: false,
            changedCalories: false
        }
    }

    // componentDidMount(){
    //     fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.props.navigation.state.params.username, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'x-access-token':  this.props.navigation.state.params.token.token,
    //         }
    //     })
    //         .then(response =>  {
    //             return response.json()
    //         })
    //         .then(data => {
    //             this.setState({
    //                 name: data.name,
    //                 duration: data.duration,
    //                 date: data.date,
    //                 calories: data.calories
    //             })
    //         })
    //         .catch(error=>console.log(error))
    //
    // }


   async onEditActivityPress (){

        let name = this.state.name;
        let date = this.state.date;
        let calories = this.state.calories;
        let duration = this.state.duration;

        // Check for changes and valid changes
        if((this.state.changedName === true) && this.state.newName !== ""){
            name = this.state.newName
        }

        if((this.state.changedDate === true) && this.state.newName !== this.state.date){
            date = this.state.newDate
        }

        if((this.state.changedCalories === true) && this.state.newCalories !== ""){
            calories = parseFloat(this.state.newCalories)
        }
        if((this.state.changedDuration === true) && this.state.newDuration !== ""){
            duration = parseFloat(this.state.newDuration)
        }
        console.log(name)
       console.log(duration)
       console.log(date)
       console.log(calories)
        try{
            let response = fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.props.navigation.state.params.activityID ,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.navigation.state.params.token.token,
                },
                body: JSON.stringify(
                    {
                        name: name,
                        duration: duration, //Minutes
                        date: date,
                        calories: calories
                    }
                )
            }).then(response =>  {
                let resp = response.json();
                console.log(resp)
                return resp;
            });

        } catch(errors) {
            console.log("Catch error is: " + errors);
        }
        alert(`Goal Updated`);
        this.props.navigation.navigate('userHomePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token.token})

    }


    render() {
        return (
            <ScrollView style={{flex: 5, backgroundColor: '#FFFFFF', paddingHorizontal: 25}}>
                <Text style={{padding:20, textAlign: 'center', backgroundColor: '#90ee90'}}>Edit Activity</Text>
                <TextInput keyboardDismissMode={'interactive'} style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({newName: val, changedName:true})}
                           placeholder={this.state.name}
                           placeholderTextColor='#D4D4D4'/>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({newDuration: val, changedDuration: true})}
                           placeholder={this.state.duration + " Minutes"}
                           placeholderTextColor='#D4D4D4'/>
                <DatePicker
                    style={{width: 200, backgroundColor: "white"}}
                    date={this.state.date}
                    mode="date"
                    placeholder="Select Date"
                    format="YYYY-MM-DD"
                    minDate="2019-01-01"
                    maxDate="2020-01-01"
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
                        this.setState({newDate: date, changedDate: true})
                    }}
                />
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({newCalories: val, changedCalories: true})} placeholder= {this.state.calories + " calories"}
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

                    }} onPress={this.onEditActivityPress.bind(this)}>Save Changes</Text>
                    <Text>{this.props.navigation.state.params.token.token}</Text>
                    <Text>{this.props.navigation.state.params.activityID}</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

}
export default EditActivityArea;