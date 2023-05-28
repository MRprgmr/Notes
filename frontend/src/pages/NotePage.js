import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg"
import { useNavigate } from 'react-router-dom'

const NotePage = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const navigate = useNavigate();
    const csrftoken = Cookies.get('csrftoken');

    useEffect(() => {
        getNote();
    }, []);

    const getNote = async () => {
        if (id === 'new') return;
        const response = await fetch(`/api/notes/${id}/`);
        const data = await response.json();
        setNote(data);
    }

    const createNote = async () => {
        fetch(`/api/notes/create/`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,

            },
            body: JSON.stringify(note),
        })
    }

    const updateNote = async () => {
        fetch(`/api/notes/${id}/update/`, {
            method: "PUT",
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(note),
        })
    }

    const deleteNote = async () => {
        fetch(`/api/notes/${id}/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        });
        navigate('/');
    }

    const handleSubmit = () => {
        if (id === 'new' && note !== null && note.body !== ''){
            createNote();
        } else if (id !== 'new' && note?.body === '') {
            deleteNote();
        } else if (id !== 'new') {
            updateNote();
        } 
        navigate('/');
    }

    return (
        <div className='note'>
            <div className='note-header'>
                <h3>
                    <ArrowLeft onClick={handleSubmit} />
                </h3>
                {id !== 'new' ? (
                    <button onClick={deleteNote}>Delete</button>
                ) : (
                    <button onClick={handleSubmit}>Done</button>
                )
                }

            </div>
            <textarea onChange={(e) => { setNote({ ...note, 'body': e.target.value }) }} value={note?.body}></textarea>
        </div>
    )
}

export default NotePage