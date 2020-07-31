import React, { useState } from 'react'
import {Input} from 'antd';
import { Button } from 'antd';
import {storage, db} from "./Firebase.js";
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {

   const [caption, setCaption] = useState('');
   //const [url, setUrl] = useState("");
   const [progress, setProgress] = useState(0);
   const [image, setImage] = useState(null);

    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0])
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message)
            },
            () => {
                firebase.storage().ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );
    };
    
    return (
        <div className="Imageupload">
            <progress className="imageupload__progress" max="100" value={progress} />
            <Input placeholder="Enter a caption" onChange={event=> setCaption(event.target.value)} value={caption} />
            <Input type="file" onChange={handleChange} />
            <Button type="primary" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload;