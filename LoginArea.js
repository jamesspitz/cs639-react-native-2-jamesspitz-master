import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity} from 'react-native';
import Button from "./Button";

import base64 from 'base-64';


class LoginArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            token: "",
        }
    }
    async onLoginPressed() {
        if ((this.state.username !== "") || (this.state.password !== "")){
            fetch('https://mysqlcs639.cs.wisc.edu/login', {
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
                    //if(this.state.token === Object) {
                        this.props.navigation.navigate('userHomePage', {username: this.state.username, token: data})
                    //}
                    //else{
                      //  alert(`Error: Account doesn't exist`);
                    //}
                })

                .catch(error => console.error(error));
    }
        else{
            alert(`Error logging in`);
        }
    }
    render() {
        return (
            <View style={{flex: 5, justifyContent: 'center', backgroundColor: '#598bff', paddingHorizontal: 25}}>
                <TextInput style={{ height: 60, borderColor: 'gray', borderWidth: 1, backgroundColor: "white" , padding:15}} onChangeText={(val) =>  this.setState({username: val})} placeholder = "Username"
                           placeholderTextColor = '#D4D4D4'/>
                <TextInput style={{ height: 60, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}} secureTextEntry={true} onChangeText={(val) =>  this.setState({password: val})} placeholder = "Password:"
                           placeholderTextColor = '#D4D4D4'/>
                <TouchableOpacity onPress = {this.onLoginPressed.bind(this)}>
                    <Text style={{height: 40, borderRadius: 4, padding:10, textAlign: 'center', marginBottom: 20, color:'#fff', backgroundColor:'#90ee90'}}>Login</Text>
                </TouchableOpacity>
                <Button style={{borderRadius: 4, padding:20, textAlign: 'center', marginBottom: 20, color:'#fff', backgroundColor:'#90ee90'}} title = "Sign Up" color = "green" onPress = {() => this.props.navigation.navigate('registerPage')}/>
            </View>
        );
    }
}
export default LoginArea;