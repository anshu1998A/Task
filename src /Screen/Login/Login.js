import React, { useState, useEffect } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Button } from 'react-native'
import RNRestart from 'react-native-restart'
import { useDispatch } from 'react-redux'
import TextInputComponent from '../../Components/TextInput'
import strings, { changelanguage } from '../../constatnts/lang'
import { Login1 } from '../../redux/action/auth'
import LoginStyle from '../../styles/LoginStyle'
import Modal from 'react-native-modal'
import { LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin'

export default function Login({ navigation }) {
  const dispatch = useDispatch()
  const [pass, setPass] = useState('Anshul@30')
  const [email, setEmail] = useState('Anshul@gmail.com')
  const [nameShow, setNameShow] = useState(false)
  const [passShow, setPassShow] = useState(false)
  const [emailError, setEmailError] = useState(false)

 useEffect(()=>{
   GoogleSignin.configure()
 },[])

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("user info", userInfo)
      const data = userInfo?.user
      console.log("data",data)
      dispatch(Login1(data))
     
    } 
    catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("error4 raise", error)
      } else if (error.code === statusCodes.IN_PROGRESS) {
        
        console.log("error3 raise", error)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("error2 raise", error)
      } else {
        console.log("error1 raise", error)
      }
    }
  };
  // ------------Regex---------
  const fbLogIn = (resCallBack) => {
    LoginManager.logOut();
    return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      result => {
        console.log("fb result ****************", result);
        if (result.declinedPermissions && result.declinedPermissions.includes("email")) {
          resCallBack({ message: "Email is required" })
        }
        if (result.isCancelled) {
          console.log("dxcfgvbhjn")
        } else {
          const infoRequest = new GraphRequest(
            'me?fields= email,name, picture',
            null,
            resCallBack
          );
          new GraphRequestManager().addRequest(infoRequest).start()
        }
      },
      function (errror) {
        console.log("login failed", errror)
      }
    )
  }

  const _resInfoCallback = async (error, result) => {
    if (error) {
      console.log("error raised at response", error)
      return;
    }
    else {
      const userData = result
      console.log("id",userData)
      dispatch(Login1(userData))

    }
  }
  const onFBlogIn = async () => {
    try {
      await fbLogIn(_resInfoCallback)
      console.log("hii")
    } catch (error) {
      console.log("error", error)
    }
  }
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const emailRegex = /^[\w-\.\_\$]+@([\w]{3,5}\.)[\w]{2,4}$/;
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%\^&\*])(?=.{8,})");
  const data1 = { email, pass }


  const onchnagelanguge = (key) => {
    changelanguage(key)
    RNRestart.Restart()

  }

  // ----------------validations----------


  const click = () => {
    if (email != 0) {
      setEmailError(false)
      if (emailRegex.test(email)) {
        setNameShow(false)
        if (strongRegex.test(pass)) {
          setPassShow(false)
          dispatch(Login1(data1))

        }
        else {
          setPassShow(true)

        }
      }
      else
        setNameShow(true)
    }
    else {
      setEmailError(true)
    }
  }


  return (
    <>
      <SafeAreaView>
        <View style={LoginStyle.view}>
          <View >

            <Text style={LoginStyle.text}>{strings.LOGIN}</Text>
            <Text></Text>
            <TextInputComponent
              placeholder={strings.ENTER_EMAIL}
              value={email}
              onChangeText={(value) => setEmail(value)} />

            {nameShow ? <Text style={LoginStyle.error}>{strings.ENTER_VALID_EMAIL}</Text> : null}
            {emailError ? <Text style={LoginStyle.error}>{strings.EMAIL_CANT_BE_EMPTY} </Text> : null}

          </View>
          <View>

            <TextInputComponent
              placeholder={strings.ENTER_PASSWORD}
              onChangeText={(value) => setPass(value)}
              value={pass}
              securetext={true}
            />


            {passShow ? <Text style={LoginStyle.error}>{strings.ENTER_STRONG_PASSWORD}</Text> : null}

          </View>
          <TouchableOpacity onPress={click}>
            <View style={LoginStyle.btn}>
              <Text style={{ color: 'white' }}>{strings.LOGIN}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleModal}>
            <View style={LoginStyle.btn}>
              <Text style={{ color: 'white' }}>Change Language</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onFBlogIn}>
            <View style={LoginStyle.btn}>
              <Text style={{ color: 'white' }}>Login With Facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={googleLogin}>
            <View style={LoginStyle.btn}>
              <Text style={{ color: 'white' }}>GOOGLE</Text>
            </View>
          </TouchableOpacity>


          {/* -----------------MODAL---------------------- */}




          <Modal isVisible={isModalVisible}>
            <View style={{ backgroundColor: 'white' }}>
              <TouchableOpacity onPress={() => onchnagelanguge('hn')}>
                <View style={LoginStyle.btn}>
                  <Text style={{ color: 'white' }}>Italian</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onchnagelanguge('en')}>
                <View style={LoginStyle.btn}>
                  <Text style={{ color: 'white' }}>English</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onchnagelanguge('en')}>
                <View style={LoginStyle.btn}>
                  <Text style={{ color: 'white' }}>Hindi</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onchnagelanguge('en')}>
                <View style={LoginStyle.btn}>
                  <Text style={{ color: 'white' }}>Urdu</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onchnagelanguge('en')}>
                <View style={LoginStyle.btn}>
                  <Text style={{ color: 'white' }}>Tamil</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onchnagelanguge('en')}>
                <View style={LoginStyle.btn}>
                  <Text style={{ color: 'white' }}>French</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onchnagelanguge('en')}>
                <View style={LoginStyle.btn}>
                  <Text style={{ color: 'white' }}>Punajbi</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onchnagelanguge('en')}>
                <View style={LoginStyle.btn}>
                  <Text style={{ color: 'white' }}>Spanish</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onchnagelanguge('en')}>
                <View style={LoginStyle.btn}>
                  <Text style={{ color: 'white' }}>Japenese</Text>
                </View>
              </TouchableOpacity>
              <Button title='hide' onPress={handleModal} />
            </View>
          </Modal>

          {/* ---------------------MODAL END---------------------------- */}
        </View>
      </SafeAreaView>
    </>
  )
}
