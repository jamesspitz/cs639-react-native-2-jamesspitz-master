import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity,  TouchableWithoutFeedback, Keyboard} from 'react-native';
import Button from './Button';

class RegisterArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            isLoggedIn: false
        }
    }

    loginNewUser() {
        fetch('https://mysqlcs639.cs.wisc.edu/login/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64.encode(`${this.state.username}:${this.state.password}`)}`
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({token: data});
                this.props.navigation.navigate("profilePage",
                    {user:this.state.username, token: data})
            })

            .catch(error => console.error(error));
        this.setState({isLoggedIn:true});
    }

    async onRegisterPressed(){
        try{
            let response = await fetch('https://mysqlcs639.cs.wisc.edu/users/' ,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        username: this.state.username,
                        password: this.state.password,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName
                    }
                )
            });

            let res =  await response.text();
            console.log(response);
            if (response.status == 409) {
                this.setState({errorCode: "Username is already taken"})
            } else if (response.status == 400) {
                this.setState({errorCode: "Password must be at least 5 characters!"})
            } else if (response.status == 200) {
                await response.json();
                this.props.navigation.navigate("homePage");
                alert(`Account successfully created.`)
            } else {
                let errors = res;
                throw errors;
            }
        } catch(errors) {
            console.log("Catch error is: " + errors);
        }

    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{flex: 5, justifyContent: 'center', backgroundColor: '#598bff', paddingHorizontal: 25}}>
                <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white" }} onChangeText={(val) =>  this.setState({username: val})} placeholder = "Username:"
                            placeholderTextColor = '#D4D4D4'/>
                <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white" }} onChangeText={(val) =>  this.setState({firstName: val})} placeholder = "First Name (Optional):"
                            placeholderTextColor = '#D4D4D4'/>
                <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white" }} onChangeText={(val) =>  this.setState({lastName: val})} placeholder = "Last Name (Optional):"
                            placeholderTextColor = '#D4D4D4'/>
                <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: "white"}} secureTextEntry={true} onChangeText={(val) =>  this.setState({password: val})} placeholder = "Password:"
                            placeholderTextColor = '#D4D4D4'/>
                <TouchableOpacity onPress = {this.onRegisterPressed.bind(this)} style={{paddingTop:15, borderRadius: 20}}>
                    <Text style={{borderRadius: 4, padding:20, textAlign: 'center', marginBottom: 20, color:'#fff', backgroundColor:'#90ee90'}}>CREATE ACCOUNT</Text>
                </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default RegisterArea;