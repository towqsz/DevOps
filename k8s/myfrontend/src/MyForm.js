import React, {useState, useEffect} from "react";
import axios from 'axios';

const MyForm = (props) => {
    const [id, setId] = useState("");
    const [owner, setOwner] = useState("");
    const [ownerGet, setOwnerGet] = useState("");
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState("");
    const [number, setNumber] = useState("");

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('/api/getall')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
    }, []);

    const handlePostClick = (event) => {
        setId(event.target.getAttribute("id"))
        setOwner(event.target.getAttribute("owner"))
        setModel(event.target.getAttribute("model"))
        setBrand(event.target.getAttribute("brand"))
        setNumber(event.target.getAttribute("number"))
    }
    
    const handleNumberChange = (event) => {
        setNumber(event.target.value);
        props.changeParentHandler(event.target.value);
    };

    const handleSubmit = (event) => {
        console.log(`Dane do wysłania ${owner} ${model} ${brand} ${number}`);
        axios.post('/api/phones', {
            owner: owner,
            model: model,
            brand: brand,
            number: number
        })
            .then(function (response){
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    
        event.preventDefault();
        props.changeParentHandler(10);
        axios.get('/api/getall')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));

    };

    const handleDelete = (event) => {
        console.log(`Dane do wysłania ${owner} ${model} ${brand} ${number}`);
        axios.post('/api/delete', {
            id: id,
            owner: owner,
            model: model,
            brand: brand,
            number: number
        })
            .then(function (response){
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    
        event.preventDefault();
        props.changeParentHandler(10);
        axios.get('/api/getall')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));

    };

    const handleUpdate = (event) => {
        console.log(`Dane do wysłania ${owner} ${model} ${brand} ${number}`);
        axios.post('/api/update', {
            id: id,
            owner: owner,
            model: model,
            brand: brand,
            number: number
        })
            .then(function (response){
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    
        event.preventDefault();
        props.changeParentHandler(10);
        axios.get('/api/getall')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));

    };

    const handleSubmitGet = (event) => {
        console.log(ownerGet)
        if (`${ownerGet}` === ``) {
            axios.get('/api/getall')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
            return
        }
        console.log(`Dane do wysłania ${ownerGet}`);
        console.log(`/api/phones/${ownerGet}`);
        axios.get(`/api/phones/${ownerGet}`)
            .then(function (response){
                console.log(response);
                setPosts(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    
        event.preventDefault();
    };

    return (
        <>
        
        <br/><br/>
            <div>ADD PHONE:<br/>
                Owner: <input type='text' value={owner} onChange={event => setOwner(event.target.value)}/>
                Model: <input type='text' value={model} onChange={event => setModel(event.target.value)}/>
                Brand: <input type='text' value={brand} onChange={event => setBrand(event.target.value)}/>
                Number <input type='text' value={number} onChange={event => setNumber(event.target.value)}/>

                <input type='submit' value='OK' onClick={handleSubmit} />
                <input type='submit' value='Delete' onClick={handleDelete} />
                <input type='submit' value='Update' onClick={handleUpdate} />
            </div>
            <div><br/><br/>
                GET BY OWNER:<br/><br/>
                <input type='text' value={ownerGet} onChange={event => setOwnerGet(event.target.value)}/>
                <input type='submit' value='OK' onClick={handleSubmitGet} />
            </div>
            <br/>
            <div>
            {posts
                .map(phone => (<div key={phone.id} id={phone.id} owner={phone.owner} model={phone.model} brand={phone.brand} number={phone.number}
                 onClick={handlePostClick}>
                    Owner: {phone.owner}, Model: {phone.model}, Brand:{phone.brand}, Number: {phone.number}</div>))}
        </div>
        </>
    );

};

export default MyForm;