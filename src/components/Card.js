import {React, Component} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { db, auth } from '../firebase/config';
import firebase from "firebase";
import { FontAwesome, AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';
import Comment from "../screens/Comment";


class Card extends Component{
    constructor(props){
      
        super(props);
        this.state = {
            props: props,
            cantidadDeLikes: this.props.data.data.likes.length,
            miLike: false,
            owner: false
        }
    };



    componentDidMount() {
        
        if (this.props.data.data.likes.includes(auth.currentUser.email)) {
            this.setState({
                miLike: true
            })
        } 
   
        if (auth.currentUser.email === this.props.data.data.owner){
            this.setState({
                owner: true
            })
        }
    }

  
    botonLike(){
       
        if(this.state.miLike === true){
         
            this.setState({
                miLike: false,
                cantidadDeLikes: this.state.cantidadDeLikes -1,
            })
            this.disLike()
      
        } else{
            this.setState({
                miLike: true,
                cantidadDeLikes: this.state.cantidadDeLikes +1,
            })
            this.likes()
        }
    }


    likes() {
        db.collection('posts')
        // obtengo un documento especifico .doc(this.props.data.id), lo de adentro es el identificador al q le asigno el like
        .doc(this.props.data.id)
        .update({
            // actualizo el campo likes de un documento de firestore 
            // el mail que agrego es el auth.currectUser.email
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
        // utiliza then para deolver la promesa 
        // realiza una accion despues de que se completo la actualizacion, muestra like en la consola 
        .then(()=> 
        console.log('like')
           )
        .catch(error=>console.log(error))
    }


    disLike() {
        db.collection('posts')
        // obtengo un documento especifico .doc(this.props.data.id), lo de adentro es el identificador al q le quito el like
        .doc(this.props.data.id)
        .update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
        .then(()=> 
            console.log('disLike')
           )
        .catch(error=>console.log(error))
    }

    // esta funcion se encarga de eliminar un post especifico de la coleccion posts en firebase firestone 
    deletePost(){
        // esto nos hace refenencia a la coleccion posts en firestone 
        db.collection("posts")
        // con esto accedo a un documento especifico dentro de la coleccion 
        .doc(this.props.data.id)
        // llamo al metodo delete en el documento para eliminarlo de la coleccion 
        .delete()
        // uso el metodo then para realizar alguna accion despues que la eliminacion se haya completado
        // en este caso se imprime post eliminado 
        .then(() => {
            console.log('Post eliminado');
        })
        // catch es un metodo utilizado en javascript para capturar y manejar errores de bloques de codigo 
        // capturamos cualquier error que pueda ocurrir durante la solicitud 
        // si se produce un error se registra en la consola, y lo podemos manejar de manera adecuada
        .catch((e) => { console.log(e);
        });
    }


    render(){
        return(

            <View style={style.cardContainer}>
                    <View style={style.flex}>
                        <TouchableOpacity onPress={() => this.props.homeProps.navigation.navigate('UsersProfile', { email: this.props.data.data.owner })}>
                            <Text style={style.creador}>{this.props.data.data.owner}</Text>
                        </TouchableOpacity>   

                        {this.state.owner === true ? 
                            <TouchableOpacity onPress={() => this.deletePost()}>
                                <FontAwesome name="trash-o" size={24} color="red" />
                            </TouchableOpacity>
                        : null }
                    </View>
                    <Image
                        style={style.image}
                        source={{ uri: this.props.data.data.photo }}
                    />
                    <Text style={style.contenido}>{this.props.data.data.description}</Text>
                    <View style={style.btnContainer}>
                        <TouchableOpacity onPress={() => this.botonLike()}>
                            {this.state.miLike === false ?
                                <AntDesign name="hearto" size={24} color="white" />

                                : <AntDesign name="heart" size={24} color="#0d9900" />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this.props.homeProps.navigation.navigate('Comment', {id: this.props.data.id})}>
                            <FontAwesome5 style={style.btnComment} name="comment" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={style.contenido}>{this.state.cantidadDeLikes} likes</Text>
                    <TouchableOpacity onPress={()=> this.props.homeProps.navigation.navigate('Comment', {id: this.props.data.id})}>
                        <Text style={style.contenido}>{this.props.data.data.comments.length} comentarios</Text>
                    </TouchableOpacity>
                    
                </View> 
        )
    }
}
 
const style = StyleSheet.create({
    cardContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: 'rgb(180,180,180)',
        borderStyle: 'solid',
        width: '100vw'
    },
    flex: {
        flexDirection: 'row',
        flex: 2,
        width: '100%',
        justifyContent: 'space-between'
    },
    creador: {
        fontWeight: 600,
        color: 'rgb(230,230,230)',
        fontSize: 18,
        marginBottom: 3
    },
    btnContainer: {
        flexDirection: 'row',
        flex: 2,
    },
    btnComment: {
        marginLeft: 8
    },
    contenido: {
        fontSize: 16,
        color: 'rgb(230,230,230)',
        marginTop: 3
    },
    image: {
        width: '100%',
        height: 200
    },
    containerComments: {
        height: '100vh',
        width: '100vw',
    },
    crossComments: {
        marginBottom: 15
    }
})


export default Card;