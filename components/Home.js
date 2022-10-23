import { StyleSheet, SafeAreaView, View, TextInput, Text, FlatList, TouchableOpacity, Alert, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconDark from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {

    const [darkMode, setDarkMode] = useState(false);
    const [todos, setTodos] = useState([]);             
    const [textInput, setTextInput] = useState('');                 // used in textInput

    //  load all records at the first rendering of the app
    useEffect(() => {
        getTodosFromUserDevice();
    }, []);
    
    // save new task ONLY IF the 'todos' are changed 
    useEffect(() => {
        saveTodoToUserDevice(todos);
    }, [todos]);

    // gets user input tasks and the completed tasks and
    // make it into object and appends it to the current 'todo list' in the app
    const addTodo = () => {

        // if empty input
        if (textInput == '') {
        Alert.alert('Error', 'Please input todo');
        } 
        else {
        const newTodo = {                           // craete an array
            id: Math.random(),                      // assigns unique random id 
            task: textInput,                        // sample {id:1, task:'first task', completed:true} 
            completed: false,
        };
        // use spread operator for iterable values (to insert the new array of 'Todo')
        setTodos([...todos, newTodo]);
        // clears the 'textInput' to receive another character / new task from user
        setTextInput('');
        }
    };
    
    // for saving on rerender
    const saveTodoToUserDevice = async todos => {
        try {
        // change from array useState (which is const 'todos' and 'setTodo') to String
        const stringifyTodos = JSON.stringify(todos);
        // save it to the user's device
        await AsyncStorage.setItem('todos', stringifyTodos);
        } catch (error) {
        console.log(error);
        }
    };
    
    // 
    const getTodosFromUserDevice = async () => {
        try {
        const todos = await AsyncStorage.getItem('todos');
        if (todos != null) {
            setTodos(JSON.parse(todos));
        }
        } catch (error) {
        console.log(error);
        }
    };
    
    // check if the props('todoId') is the same to the mapped (todo). If it match, it will return/marked as complete
    // MAP
    const markTodoComplete = todoId => {
        const newTodosItem = todos.map(item => {
        if (item.id == todoId) {
            return {...item, completed: true};
        }
        return item;
        });
    
        setTodos(newTodosItem);
    };
    
    // FILTER
    const deleteTodo = todoId => {
        const newTodosItem = todos.filter(item => item.id != todoId);
        setTodos(newTodosItem);
    };
    
    const clearAllTodos = () => {
        Alert.alert('Confirm', 'Clear todos?', [
        {
            text: 'Yes',
            onPress: () => setTodos([]),
        },
        {
            text: 'No',
        },
        ]);
    };
    
    const ListItem = ({todo}) => {
        return (
        <View style={styles.listItem}>

            <View style={{flex: 1}}>
                <Text
                    style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: darkMode ? 'white' : 'black',
                    // checks if 'todo' (task) is already completed
                    textDecorationLine: todo?.completed ? 'line-through' : 'none',
                    }}>
                    {todo?.task}
                </Text>
            </View>
            
            {/* checks if 'todo' is not completed */}
            {!todo?.completed && (
                <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
                    <View style={[styles.actionIcon, {backgroundColor: 'green'}]}>
                    <Icon name="done" size={20} color="white" />
                    </View>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                <View style={styles.actionIcon}>
                    <Icon name="delete" size={20} color="white" />
                </View>
            </TouchableOpacity>
        </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: darkMode ? '#1c2129' : '#fff',
        },
        footer: {
            position: 'absolute',
            elevation: 40,
            bottom: 0,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            backgroundColor: darkMode ? '#282f3b' : '#f5f5f5',
        },
        inputContainer: {
            height: 50,
            paddingHorizontal: 20,
            elevation: 50,
            backgroundColor: darkMode ? '#7b8084' : '#e5e5e5',
            flex: 1,
            marginVertical: 20,
            marginRight: 20,
            borderRadius: 30,
        },
        iconContainer: {
            height: 50,
            width: 50,
            backgroundColor: darkMode ? '#7b8084' : '#e5e5e5',
            elevation: 40,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10
        },
        listItem: {
            padding: 20,
            backgroundColor: darkMode ? '#282f3b' : '#f5f5f5',
            flexDirection: 'row',
            //elevation: 12,
            borderRadius: 7,
            marginVertical: 10,
        },
        actionIcon: {
            height: 25,
            width: 25,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red',
            marginLeft: 5,
            borderRadius: 3,
        },
        header: {
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, ]}>
                    <Icon name="delete" size={25} color={darkMode ? 'white' : 'black'} onPress={clearAllTodos} />
                </View>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{padding: 20, paddingBottom: 100}}
                data={todos}
                // render the list
                renderItem={({item}) => <ListItem todo={item} />}
            />

            <View style={styles.footer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        
                        placeholder="Add Todo"
                        // the user's input is equal to 'textInput' useState
                        value={textInput}
                        onChangeText={text => setTextInput(text)}
                    />
                </View>
                <TouchableOpacity onPress={addTodo}>
                    <View style={styles.iconContainer}>
                        <Icon name="add" color={darkMode ? 'white' : 'black'} size={30} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => darkMode ? setDarkMode(false) : setDarkMode(true)}>
                    <View style={styles.iconContainer}>
                        <IconDark name={darkMode ? 'light-up' : 'moon'} size={24}
                            color={darkMode ? 'white' : 'black'}
                            
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Home

