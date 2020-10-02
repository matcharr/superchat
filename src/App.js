import React, { useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyCjcvVeiequyQp1I8-e3L0NYcYJV8l738k",
    authDomain: "superchat-c8d1b.firebaseapp.com",
    databaseURL: "https://superchat-c8d1b.firebaseio.com",
    projectId: "superchat-c8d1b",
    storageBucket: "superchat-c8d1b.appspot.com",
    messagingSenderId: "559299144007",
    appId: "1:559299144007:web:823d0dd2f42e0268678462",
    measurementId: "G-PESD7ZJKQF"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

    const [user] = useAuthState(auth);
    return (
      <div className = "App" >
        <header className = "App-header" >

        </header>

        <section>
          {user ? <ChatRoom /> : <SignIn />}  
        </section> 
      </div>
    );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
      <button type="submit">🕊️</button>
    </form>
    </>
  )
}

function  ChatMessage(props) {
  const {text, uid, photoURL } = props.message;

  const messagesClass = uid === auth.currentUser.uid ? 'sent';
  
  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}
export default App;