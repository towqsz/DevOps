import React, {useState, useEffect} from "react";
import axios from 'axios';

const Post = (props) => {

    const [posts, setPosts] = useState([]);
    const [number, setNumber] = useState(-1);

    useEffect(() => {
        axios.get('/api/getall')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
    }, []);

    const handlePostClick = (event) => {
        console.log(event.target)
    }
    
    const handleNumberChange = (event) => {
        setNumber(event.target.value);
        props.changeParentHandler(event.target.value);
        setPosts(useEffect());
    };

    return (
        <>
        <div>
            {posts
                //.filter(post => post.title.startsWith('a'))
                .slice(0, props.noPosts)
                .map(phone => (<div key={phone.id} onClick={handlePostClick}>
                    Owner: {phone.owner}, Model: {phone.model}, Brand:{phone.brand}, Number: {phone.number}</div>))}
        </div>
        <div>
            <div>Number {number}</div>
            <input onChange={handleNumberChange}/>
        </div>
        </>
    );

};

export default Post;