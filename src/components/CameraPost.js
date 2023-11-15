import { Camera, CameraType } from "expo-camera";
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import { FontAwesome, Ionicons, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';

import { storage } from '../firebase/config';


class CameraPost extends Component{


    constructor(props){
        
        super(props);
     
        this.state = {

            props: props,
            permission: false,
            photo: '',
            showCamera: false
        }
    };

    componentDidMount() {
        Camera.requestCameraPermissionsAsync()

        .then(() => {
            this.setState({
                permission: true,
                showCamera: true
            })
        })

        .catch(error => console.log(error))
    }


    takePicture() {
        // intento acceder a un objeto que se llama metodosdecamara y llamar al metodo takepictureasync
        this.metodosDeCamara.takePictureAsync()
            // se encadena un then (metodo) para manejar la resolucion de la promesa devuelta por takepictureasync
            .then(photo => {
                // utilizamos setState para actualizar el estado del componente 
                // actualizo las propiedades photo y showcamera 
                this.setState({
                    photo: photo.uri,
                    showCamera: false
                })
            })
            // catch es un metodo utilizado en javascript para capturar y manejar errores de bloques de codigo 
            // capturamos cualquier error que pueda ocurrir durante la solicitud 
            // si se produce un error se registra en la consola, y lo podemos manejar de manera adecuada
            .catch(error => console.log(error))
    }

    // la funcion clearphoto se utiliza para borrar la foto capturada y vovler a mostrar interfaz de camara
    clearPhoto() {
        // llamamos a setState para actualizar las propiedades photo y showcamera 
        // al poner '' en photo, en vez de como arriba, se elimina la URL de la foto capturada 
        // al estar showcamera true, indica que se debe mostrar nuevamente la interfaz de la camara 
        this.setState({
            photo: '',
            showCamera: true,
        })
    }

    // la funcion savephoto se utiliza para guardar la foto capturada en el almacenamiento, en este caso firebase storage
    savePhoto(){
        // se llama a la funcion fetch pasando la URL de la foto capturada (this.satte.photo)
        // la funcion fetch se usa para realizar una solicitud http para obtener datos de imagen 
        fetch(this.state.photo)
         // despues del primer then, se obtiene la respuesta de la solicitud de http 
         // se llama a res.blob, la funcion blob convierte la respuesta en un objeto 
         // el objeto blob es un tipo de dato utilizado para datos binarios, como imagenes 
         .then(res=>res.blob()) 
         // aca en el siguiente then, se recibe el objeto blob que representa la imagen 
         .then(image =>{
            // se crea la referencia ref en firebase storage usando el metodo storage.ref()
            // proporciona una ruta unica para la imagen 
            // se usa el date.now para que imagen tenga un nomrbe unico 
           const ref=storage.ref(`photos/${Date.now()}.jpg`)
           // se llama al metodo put() de referencia ref, pasando el objeto blob 
           // esto sube la imagen al almacenamiento remoto de firebase 
           ref.put(image)
                // se completa la carga de la imagen) 
                .then(()=>{
                    // se llama al metodo getdownloadURL de ref para obtener la URL de descarga 
                   ref.getDownloadURL()
                        .then(url => {
                            // se obtiene la url de descarga y se pasa a this.props.onimageupload(url)
                            // es una funcion pasada como prop al componente camerapost
                            // esta funcion se encarga de manejar la URL de la imagen en algun otro componente 
                            this.props.onImageUpload(url);
                         })
                 })
         })
         // catch es un metodo utilizado en javascript para capturar y manejar errores de bloques de codigo 
         // capturamos cualquier error que pueda ocurrir durante la solicitud 
         // si se produce un error se registra en la consola, y lo podemos manejar de manera adecuada
         .catch(e=>console.log(e))
       }

    
    render(){
     
        return(
           
            <View style={style.container}>
                {this.state.showCamera===true ?
                    <React.Fragment>
                        <Camera
                            style={style.camera}
                            type={Camera.Constants.Type.back}
                            ref={metodosDeCamara => this.metodosDeCamara = metodosDeCamara}
                        />
                        <TouchableOpacity onPress={() => this.takePicture()} style={style.btnCapture}>
                            <Ionicons name="radio-button-on-sharp" size={66} color="green" />
                        </TouchableOpacity>
                    </React.Fragment>
                : null}
                {this.state.photo !== '' ?
                    <React.Fragment>
                        <Image
                            style={style.image}
                            source={{ uri: this.state.photo }}
                        />
                        <View style={style.checksDiv}>
                            <TouchableOpacity onPress={() => this.clearPhoto()}>
                                <Ionicons name="md-trash-sharp" size={40} color="red" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.savePhoto()}>
                                <AntDesign name="checkcircle" size={40} color="green" />
                            </TouchableOpacity>
                        </View>
                    </React.Fragment>
                    :
                    null
                }
            </View>
        )
    }
}

// se utiliza const para declarar una constante en javascript
// en este caso declare la variable style como una constante y le asigne el objeto StyleSheet.create
// se define un objeto style utilizando un metodo StyleSheet.create de react native 
// el objeto contiene estilos CSS que se usan para dar estilo a los componentes 
// estos estilos se aplican a los componentes correspondientes en el codigo JSX para darles apariencia 
const style = StyleSheet.create({
    container: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    camera: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    btnCapture: {
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 0,  
        alignItems: 'center'
    },
    btnOff: {
        position: 'absolute',  
        right: 5, 
        top: 5
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    checksDiv:{ 
        position: 'absolute', 
        flexDirection: 'row',
        flex: 2,
        left: 0, 
        right: 0, 
        bottom: 0,  
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

export default CameraPost;
