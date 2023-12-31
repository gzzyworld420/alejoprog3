import React,{Component} from 'react';
import {TouchableOpacity,View, Text, StyleSheet, TextInput, Image } from 'react-native';
import {db, auth, storage} from '../firebase/config';
import { FontAwesome, Ionicons, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import CameraPost from '../components/CameraPost';
import * as ImagePicker from 'expo-image-picker';


class AddPost extends Component{
    constructor(props){ 
        super(props);
        this.state = {
            description: '',
            msj: '',
            cameraOpen: false,
            photo: '',
            enableBtn: true
        }
    }

    onImageUpload(url) {
        this.setState({
            photo: url,
            cameraOpen: false,
            msj: ''
        })
    }

  
    mostrarCamara() {
        this.setState({
            cameraOpen: true
        })
    }

    crearPost() {
        this.setState({
        
            enableBtn: false
        })

        if(this.state.description === '') {
            this.setState({
                msj: 'No hay descripcion'
            }) 
        } 
        // igual que antes, pero en vez de verificar description, verificamos photo 
        else if (this.state.photo === ''){
            this.setState({
                msj: 'No hay foto'
            }) 
        } 

        else if (this.state.enableBtn === false ) {
            this.setState({
                msj: 'La carga del posteo ya se esta procesando'
            })
        }

    
        else{
 
        db.collection('posts').add({
            owner: auth.currentUser.email, // es una funcionalidad de firebase que te ofrece todos los emtodos de autenticacion y ademas te ofrece toda la informacion del usuario autenticado
            description: this.state.description,
            createdAt: Date.now(), // devuelve la fecha en milisegundos
            likes: [], // array de usuarios que le dieron like
            comments: [], // array de comentarios
            photo: this.state.photo // url de la foto
        })
        // despues de agregar exitosamente el documento a la coleccion posts se ejecuta el bloque .then()
        .then(res => {
            // se actualizan los valores description, photo, msj una vez hecho el posteo 
            // utilizando this.setState({...}) vuelve a sus valores iniciales 
            this.props.navigation.navigate('TabNavigation') // redirecciona a la pantalla de inicio de la app una vez que se creo el posteo correctamente 
            this.setState({
                description: '',
                photo: '',
                msj: ''
            })
        })
        
        .catch(error => this.setState({
            msj: error.message
        })
        )
        }
    }


    pickImage = async () => {
        let results = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [2/1],
        })
        this.handleImagePicked(results);
       }
    handleImagePicked = async (results) => {
        // bloque try-catch se usa para capturar cualquier error que pueda ocurrir durante el proceso 
        try {
          // se verifica si la imagen no fue cancelada
          // signitica que se selecciono una imagen valida 
          if (!results.cancelled) {
            // se llama a la funcion savephoto 
            this.savePhoto(results.uri);
          }
        } 
        // si ocurre algun error durante el proceso, se captura en este bloque 
        // se muestra una alerta indicado que la carga ha fallado 
        catch (e) {
          console.log(e);
          alert("Image upload failed");
        }
    };

    // la funcion savephoto se encarga de guardar una imagen en el almacenamiento de firebase storage 
    // se recibe uploadurl que es la URL de la imagen seleccionada a cargar
    savePhoto(uploadUrl){
        // se utiliza el metodo fetch para realizar una solicitud de http a la URL de la imagen 
        fetch(uploadUrl)
         // con el metodo res.blob() se convierte en un objeto de tipo blob 
         // blob es una representacion de datos binarios 
         .then(res=>res.blob())
         // se crea una referencia ref en el almacenamiento de firebase 
         .then(image =>{
            // se utiliza la carpeta photos y genera un nombre de archivo unico con date.now 
           const ref=storage.ref(`photos/${Date.now()}.jpg`)
           // se utiliza el metodo put de la referencia para cargar el objeto blob 
           ref.put(image)
                .then(()=>{
                    // se utiliza el metodo getdownloadurl para obtener la URL 
                   ref.getDownloadURL()
                        .then(url => {
                            // se llama al metodo onimageupload, se le pasa la url
                            this.onImageUpload(url);
                         })
                 })
         })
    
         .catch(e=>console.log(e))
       }


    render(){
        return(
            
            <View style={style.container}>
                {this.state.cameraOpen === false ?
                    <React.Fragment>
                        {this.state.msj !== '' ? <Text style={style.error}>{this.state.msj}</Text> : null}
                        <View style={style.inputsYBtns}>
                            <Text style={style.title}>Escribí lo que quieras postear</Text>
                            <TextInput
                                style={style.description}
                                keyboardType='default'
                                placeholder='Compartí lo que pensás'
                                onChangeText={text =>
                                    this.setState({ description: text, error: '', msj: '' })
                                }
                                value={this.state.description}
                            />
                            <TouchableOpacity onPress={() => this.mostrarCamara()} style={style.mostrarCamara}>
                                <Text style={style.mostrarCamaraTxt}><AntDesign name="camerao" size={24} color="white" /> Agregar foto</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.pickImage()} style={style.mostrarCamara}>
                                <Text style={style.mostrarCamaraTxt}><MaterialIcons name="add-photo-alternate" size={24} color="white" /> Agregar foto de la galeria</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.photo !== '' ?
                            <View style={style.imagenYDelete}>
                                <Image
                                    style={style.image}
                                    source={{ uri: this.state.photo }}
                                    // require: rutas relativas
                                    // uri: rutas absolutas
                                />
                                <TouchableOpacity onPress={() => this.setState({ photo: '' })} style={style.btnDelete}><Text style={style.delete}>Borrar imagen</Text></TouchableOpacity>
                            </View>
                            : null}
                        <TouchableOpacity onPress={() => this.crearPost()} style={style.btnPost}>
                            <Text style={style.textBtn}>Compartir</Text>
                        </TouchableOpacity>
                    </React.Fragment>
                : 
                    <View style={style.camView}>
                        <CameraPost style={style.cameraComponent} onImageUpload={(url) => this.onImageUpload(url)} />
                        <TouchableOpacity onPress={() => this.setState({ cameraOpen: false })} style={style.btnOff}>
                            <Entypo name="circle-with-cross" size={40} color="red" />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }


};
 
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(0,0,0)',
        color: 'rgb(255,255,255)',
        padding: 15,
        justifyContent: 'center'
    },
    error: {
        color: 'rgb(255, 0, 0)',
    },
    inputsYBtns: {
        flex: 1
    },
    imagenYDelete: {
        flex: 1
    },
    btnDelete:{
            border: 'solid',
            borderWidth: 1,
            borderColor: 'rgb(255, 0, 0)',
            borderLeftColor: 'red',
            borderTopColor: 'red',
            borderRightColor: 'red',
            borderBottomColor: 'red',
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderStyle: 'solid',
            padding: 7.5,
            width: '30%',
            marginVertical: 10,
        },
    delete: {
        color: 'rgb(255, 0, 0)',
        fontSize: 14,
    },
    description: {
        backgroundColor: 'rgb(255,255,255)',
        padding: 20,
        fontSize: 16,
        marginVertical: 15
    },
    title: {
        fontSize: 22,
        fontWeight: '600'
    },
    btnOff: {
        position: 'absolute',  
        right: 5, 
        top: 5
    },
    camView: {
        width: '100%',
        height: '100%'
    },
    btnPost: {
        border: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(150,150,150)',
        borderLeftColor: 'white',
        borderTopColor: 'white',
        borderRightColor: 'white',
        borderBottomColor: 'white',
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderStyle: 'solid',
        padding: 7.5,
        width: '30%',
    },
    textBtn: {
        fontSize: 16,
        textAlign: 'center',
        color: 'rgb(230, 230, 230)'
    },
    mostrarCamara: {
        backgroundColor: 'rgb(20,150,20)',
        padding: 10,
        marginBottom: 15,
    },
    mostrarCamaraTxt: {
        color: 'rgb(240,240,240)'
    },
    image: {
        height: '50%',
        aspectRatio: 20 / 10
    }
})
export default AddPost;