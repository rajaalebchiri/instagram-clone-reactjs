import React, { useEffect, useState } from 'react'
import './Post.css';
import 'antd/dist/antd.css'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { db } from './Firebase';
import { Form, Input, Select, Tooltip, Button } from 'antd';
import firebase from 'firebase';

function Post({username, caption, imageUrl, postId, user}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            })
        }

        return () => {
            unsubscribe();
        };

    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    };

    return (
        <div className="post">

            {/* Header :  avatar + username */}
            <div className="post__header">
                <Avatar className="post__avatar" size="large" icon={<UserOutlined />} />
                <h3>{username}</h3>
            </div>

            {/* image */}
            <img src={imageUrl} alt="post__image" className="post__image"/>
            
            {/* username + caption */}
            <div className="post__text">
                <strong>{username}:  </strong>{caption}
            </div>

            {/* Post__comments */}
            <div>

                {/* Comments */}
                <div className="post__comments">
                    {comments.map( (comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))}
                </div>
                {/* Comments */}

                {/* Adding Comments */}
                {user && (
                <Form className="post__commentBox">
                    <Input 
                        className="post__input"
                        placeholder="Add a comment ...."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button 
                        className="post__button"
                        type="primary" 
                        disabled = {!comment}
                        htmlType="submit"
                        onClick={postComment}
                    >
                        Post
                    </Button>
                </Form>
                )}
                {/* Adding Comments */}

            </div>

        </div>
    )
}

export default Post;

