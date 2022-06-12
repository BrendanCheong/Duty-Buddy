// types
import { LoginFormInputValues } from '@interfaces/LoginScreen';

// libraries
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTailwind } from 'tailwind-rn';
import React, { ReactElement, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// code
import { auth } from '../firebase/Firebase';

const LoginScreen: React.FC = (): ReactElement => {
    const tailwind = useTailwind();
    const [registerFlag, setRegistrationFlag] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('user logged in');
            } else {
                console.log('user logged out');
            }
        });

        return unsubscribe;
    }, []);

    const initialState: LoginFormInputValues = {
        email: '',
        password: ''
    };

    const handleLogin = (values: LoginFormInputValues) => {
        console.log(values, registerFlag);
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user);
            })
            .catch((err) => {
                const errorCode = err.code;
                const errorMessage = err.message;
                console.error(errorCode, errorMessage);
            });
    };

    const handleSignUp = (values: LoginFormInputValues) => {
        console.log(values, registerFlag);
        createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user);
            })
            .catch((err) => {
                const errorCode = err.code;
                const errorMessage = err.message;
                console.error(errorCode, errorMessage);
            });
    };

    return (
        <KeyboardAvoidingView
            style={tailwind('flex flex-1 justify-center items-center w-full')}
            behavior="height">
            <Formik
                initialValues={initialState}
                validationSchema={Yup.object({
                    email: Yup.string().email().required('Email is required'),
                    password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required')
                })}
                onSubmit={(values: LoginFormInputValues) => {
                    registerFlag ? handleSignUp(values) : handleLogin(values);
                }}
                enableReinitialize={true}>
                {({ values, handleChange, handleSubmit, errors }) => {
                    return (
                        <>
                            <View style={tailwind('w-10/12')}>
                                <TextInput
                                    placeholder="Email"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    style={tailwind('bg-gray-100 p-5 rounded-lg mt-2')}
                                    blurOnSubmit={true}
                                />
                                {errors.email && (
                                    <Text style={tailwind('text-red-500')}>{errors.email}</Text>
                                )}
                                <TextInput
                                    placeholder="Password"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    style={tailwind('bg-gray-100 p-5 rounded-lg mt-2')}
                                    secureTextEntry={true}
                                    blurOnSubmit={true}
                                />
                                {errors.password && (
                                    <Text style={tailwind('text-red-500')}>{errors.password}</Text>
                                )}
                            </View>
                            <View style={tailwind('w-10/12 items-center justify-center mt-5')}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setRegistrationFlag(false);
                                        handleSubmit();
                                    }}
                                    style={tailwind(
                                        'bg-indigo-500 p-5 rounded-lg items-center w-10/12'
                                    )}>
                                    <Text style={tailwind('text-white font-bold text-base')}>
                                        Login
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setRegistrationFlag(true);
                                        handleSubmit();
                                    }}
                                    style={tailwind(
                                        'bg-white p-5 rounded-lg items-center mt-4 border-indigo-200 border-2 w-10/12'
                                    )}>
                                    <Text style={tailwind('text-black font-bold text-base')}>
                                        Register
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    );
                }}
            </Formik>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
