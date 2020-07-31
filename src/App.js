import React, {useState}  from 'react';
import {useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db} from './Firebase';
import  firebase from "firebase";
import { Modal, Button } from 'antd';
import 'antd/dist/antd.css';
import { Input, Form} from 'antd';
import ImageUpload from './ImageUpload';
import InstagramEmbed from "react-instagram-embed";

function App() {

  // States
  const [posts, setPosts] =  useState([]);  
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser)

        if (authUser.displayName) {

        } else {
          return authUser.updateProfile({
            displayName: username
          })
        }

      } else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [user, username]);

  // Loading posts data from firebase
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc =>({ 
        id: doc.id,
        post: doc.data()
      })));
    })
  }, [])

  // Sign up function
  const signUp = (event) => {
    event.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
    setOpen(false)
  }

  // Login function
  const signIn = (event) => {
    event.preventDefault();
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }
   
  // view rendering
  return (
    <div className="App">
      

      {/* Auth modal */}
      <Modal title="Sign In" visible={openSignIn} onOk={() => setOpenSignIn(false)} onCancel={() => setOpenSignIn(false)}>
          <Form className="app__signup">
            <Form.Item label="Email">
              <Input placeholder="Enter your mail" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item label="Password">
              <Input placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button  onClick={signIn}>Sign In</Button>
            </Form.Item>
          </Form> 
      </Modal>
      <Modal title="Sign Up" visible={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
          <Form className="app__signup">
            <Form.Item label="Username">
              <Input placeholder="Enter your mail" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>
            <Form.Item label="Email">
              <Input placeholder="Enter your mail" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item label="Password">
              <Input placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button  onClick={signUp}>Sign Up</Button>
            </Form.Item>
          </Form> 
      </Modal>
      {/* Header */}
      <div className="app_header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="logo" className="app_header_image"/>
        {user ? (
        <Button onClick={() => firebase.auth().signOut()}>Logout</Button>
      
        ):(  
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Log In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>  
        )}
      </div>
      {/* Header end */}
      
      {/* Posts */}
      <div className="app__posts">
        <div className="app__postsLeft">
            {     
            posts.map(({id,post}) => (     
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))   
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
              url='https://www.instagram.com/p/Bqrb9zXBJxb/'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => { }}
              onSuccess={() => { }}
              onAfterRender={() => { }}
              onFailure={() => { }}
            />
        </div>
      </div>
      {/* Posts end */}
      {
        user?.displayName ? (
          <ImageUpload username={user.displayName}/>
        ) : (
            <h3>You need to login to upload</h3>
        )
      }
    </div>
  );
}
export default App;
