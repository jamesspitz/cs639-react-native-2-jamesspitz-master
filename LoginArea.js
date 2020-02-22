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
            <View style={{flex: 5, justifyContent: 'center', backgroundColor: '#fff', paddingHorizontal: 25}}>
                <View style={{padding:10}}>
                <TextInput style={{ height: 60, borderColor: 'gray', borderWidth: 2, backgroundColor: "white" , padding:10}} onChangeText={(val) =>  this.setState({username: val})} placeholder = "Username"
                           placeholderTextColor = '#D4D4D4'/>
                </View>
                <View style={{padding:10, paddingBottom:15}}>
                <TextInput style={{ height: 60, borderColor: 'gray', borderWidth: 2, backgroundColor: "white", padding:10}} secureTextEntry={true} onChangeText={(val) =>  this.setState({password: val})} placeholder = "Password:"
                           placeholderTextColor = '#D4D4D4'/>
                </View>

                <View style={{padding:20}}>
                <TouchableOpacity style={{borderRadius: 20, backgroundColor:'#598bff'}} onPress = {this.onLoginPressed.bind(this)}>
                    <Text style={{padding:20, textAlign: 'center', color:'#fff'}}>Login</Text>
                </TouchableOpacity>
                </View>

                <View style={{padding:20}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.navigate('registerPage')} style={{borderRadius: 20, backgroundColor:'#90ee90'}}>
                        <Text style={{padding:20, textAlign: 'center', color:'#fff'}}>Need an Account?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default LoginArea;