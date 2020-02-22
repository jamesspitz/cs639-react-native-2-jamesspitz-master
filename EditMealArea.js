import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import DatePicker from "react-native-datepicker";
import {Card} from "react-native-elements";
import Button from "./Button";
import {Row, Rows, Table} from "react-native-table-component";

//TODO refresh on return, add from existing foods, add delete meal button

class EditMealArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.state.params.username,
            token: this.props.navigation.state.params.token.token,
            id: this.props.navigation.state.params.mealId,
            name: this.props.navigation.state.params.mealName,
            date: this.props.navigation.state.params.mealDate, // Passed in as YYYY-MM-DD substring of date
            calories: 0,
            newName: "",
            newDate: new Date(),
            changedName: false,
            changedDate: false,
            allFoods: {},
            mealDataTable: [],
            ingreds: []
        }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        this.willFocusSubscription.remove();
    }

    async fetchData(){
        const {navigation} = this.props;

        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + parseFloat(this.props.navigation.state.params.mealId).toString() + '/foods/', {
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
                    allFoods: data,
                })
            })
            .catch(error=>console.log(error));
        console.log(Object.entries(this.state.allFoods))
    }

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
                ingreds: this.getIngredients()
            })
        },1000);

    }

    onDeleteFoodPress(id){

        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + parseFloat(this.props.navigation.state.params.mealId).toString() + '/foods/' + id, {
            method: 'DELETE',
            headers: {
                'x-access-token': this.props.navigation.state.params.token.token
            },
            redirect: 'follow'
        }).then(response => {
            return response.json();
        }).catch(error => console.error(error)
        );

        alert(`Food Deleted`);
    }

    getMealData(){
        let mealData =[]; // use for updated state return
        let ingredientsData = [];
        let calorieCount = 0;
        let proCount = 0;
        let fatCount = 0;
        let carbCount = 0;

        for(const ingredient of Object.entries(this.state.allFoods)) {
            ingredientsData = JSON.parse(JSON.stringify(ingredient[1]));

            for (let ing of ingredientsData) {
                proCount = proCount + ing.protein;
                fatCount = fatCount + ing.fat;
                calorieCount = calorieCount + ing.calories;
                carbCount = carbCount + ing.carbohydrates;
            }
        }

        let tableHead = ['Nutrition Information'];
        let tableBody = [
            ["Calories:", calorieCount],
            ["Protein:", proCount],
            ["Carbohydrates:", carbCount],
            ["Fat:", fatCount],
        ];
        return(
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                <Row data={tableHead} style={styles.head} textStyle={{fontWeight: 'bold', fontSize:20, backgroundColor: '#FFFFFF', paddingBottom:10, textAlign:'center', borderColor:'#000000'}}/>
                <Rows data={tableBody} textStyle={styles.text}/>
            </Table>
        )
    }



    getIngredients(){

        let ingredients = [];
        let ingredientsData = [];
        let calorieCount = 0;
        let proCount = 0;
        let fatCount = 0;
        let carbCount = 0;

        for(const ingredient of Object.entries(this.state.allFoods)) {
            ingredientsData = JSON.parse(JSON.stringify(ingredient[1]));
            for (let ing of ingredientsData) {

                // error handle empty names
                let ingredientName = ing.name;
                if (ingredientName === "") {
                    ingredientName = "Untitled Ingredient"
                }

                proCount = proCount + ing.protein;
                fatCount = fatCount + ing.fat;
                calorieCount = calorieCount + ing.calories;
                carbCount = carbCount + ing.carbohydrates;

                ingredients.push(
                    <Card title={ingredientName} key={ing.id}>
                        <View>
                            <Text style={{width: 250, textAlign: 'center'}}>Calories: {ing.calories}</Text>
                            <Text style={{width: 250, textAlign: 'center'}}>Protein Content: {ing.protein}</Text>
                            <Text style={{width: 250, textAlign: 'center'}}>Carbohydrates: {ing.carbohydrates}</Text>
                            <Text style={{width: 250, textAlign: 'center'}}>Fat Content: {ing.fat}</Text>

                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                marginBottom:1
                            }}>
                            <View style={{flex:1, justifyContent: 'center', padding: 5, paddingLeft:10}}>
                                <Button title='EDIT' buttonStyle={{
                                    borderRadius: 4,
                                    padding: 5,
                                    textAlign: 'center',
                                    marginBottom: 5,
                                    backgroundColor: '#90ee90',
                                    color: '#fff'
                                }} onPress={() => this.props.navigation.navigate('editFoodPage', {
                                    username: this.props.navigation.state.params.username,
                                    token: this.props.navigation.state.params.token,
                                    mealId: this.props.navigation.state.params.mealId,
                                    foodId: ing.id,
                                    foodName: ing.name,
                                    foodProtein: ing.protein,
                                    foodCalories: ing.calories,
                                    foodFat: ing.fat,
                                    foodCarbohydrates: ing.carbohydrates
                                })} text={'EDIT'} textStyle={{textAlign: 'center', color: '#FFFFFF'}}/>
                            </View>
                            <View style={{flex:1, justifyContent: 'center', padding: 5, paddingLeft:100, alignContent:'center'}}>
                                <Button title='X' style={{justifyContent: 'center'}} buttonStyle={{
                                    borderRadius: 4,
                                    padding: 5,
                                    textAlign: 'center',
                                    marginBottom: 5,
                                    backgroundColor: '#FF3B30',
                                    color: '#fff',
                                    width: 50,
                                }} text={'X'} textStyle={{textAlign: 'center', color: '#FFFFFF', textShadowRadius:2, textShadowColor: 'black'}}
                                        onPress={() => this.onDeleteFoodPress(ing.id)}/>
                            </View>
                        </View>
                        </View>
                    </Card>
                )
            }
        } // End Ing iteration

        return ingredients
    }


    async onEditMealPress (){

        let name = this.state.name;
        let date = this.state.date;

        // Check for changes and valid changes
        if((this.state.changedName === true) && this.state.newName !== ""){
            name = this.state.newName
        }

        // Compare substrings
        if((this.state.changedDate === true) && this.state.newDate.toISOString().substring(0,10) !== this.state.date){
            date = this.state.newDate
        }

        try{
            let response = fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.navigation.state.params.mealId ,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.navigation.state.params.token.token,
                },
                body: JSON.stringify(
                    {
                        name: name,
                        date: date,
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
        alert(`Meal Updated`);
        this.props.navigation.navigate('userHomePage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token.token})

    }


    render() {
        return (
            <ScrollView style={{flex: 5, backgroundColor: '#FFFFFF', paddingHorizontal: 25}}>
                <Text style={{fontWeight: 'bold', fontSize:30, backgroundColor: '#FFFFFF', paddingBottom:10, textAlign:'center', borderColor:'#000000'}}>{this.props.navigation.state.params.mealName}</Text>

                <View style={{paddingBottom:15}}>
                {this.getMealData()}
                </View>

                <Text style={{padding:20, textAlign: 'center', fontWeight: 'bold', fontSize:15}}>Edit Meal Info</Text>
                <TextInput keyboardDismissMode={'interactive'} style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({newName: val, changedName:true})}
                           placeholder={this.state.name}
                           placeholderTextColor='#D4D4D4'/>
                <View style={{alignContent:'center'}}>
                <DatePicker
                    style={{width: 200, backgroundColor: "white"}}
                    date={this.props.navigation.state.params.mealDate}
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
                        let dateParts = date.split('-');

                        let dateFormat = new Date(dateParts[2], dateParts[0]-1, dateParts[1]);

                        this.setState({newDate: dateFormat, changedDate: true})
                    }}
                />
                </View>
                <TextInput keyboardDismissMode={'interactive'} keyboardType={'numeric'}
                           style={{height: 50, borderColor: 'gray', borderWidth: 1, backgroundColor: "white", padding:15}}
                           onChangeText={(val) => this.setState({newCalories: val, changedCalories: true})} placeholder= {this.state.calories + " calories"}
                           placeholderTextColor='#D4D4D4'/>

                <TouchableOpacity
                    style={{borderRadius: 20, padding: 10, height: 100,}}>
                    <Text style={{
                        borderRadius: 4,
                        alignContent: 'center',
                        padding:15,
                        textAlign: 'center',
                        color: '#fff',
                        backgroundColor: '#90ee90',
                        textShadowRadius:2, textShadowColor: 'black'

                    }} onPress={this.onEditMealPress.bind(this)}>Save Changes</Text>
                </TouchableOpacity>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding:10
                    }}>
                        <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:10}}>
                        </View>
                        <View style={{flex:1, justifyContent: 'flex-start', padding: 10, paddingLeft:10}}>
                            <Button buttonStyle={{
                                borderRadius: 4,
                                padding: 10,
                                textAlign: 'center',
                                marginBottom: 20,
                                backgroundColor: '#808080',
                                color: '#fff'
                            }} text={'Create Ingredient'} title="createFoodPage" onPress = {()=>this.props.navigation.navigate('createFoodPage', {username:this.props.navigation.state.params.username, token:this.props.navigation.state.params.token, mealId: this.props.navigation.state.params.mealId})}/>
                        </View>
                    </View>

                <View style={{padding:10}}>
                {this.state.ingreds}
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#598bff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 }
});

export default EditMealArea;