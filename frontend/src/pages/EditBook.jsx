import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { booksAPI } from '../services/api';
import Navbar from '../components/Navbar';
import BookForm from '../components/BookForm';

const EditBook = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBook();

    }, [id]);


    const fetchBook = async () => {
        try {
            const response = await booksAPI.getBookById(id);
            setBook(response.data.data);
        } catch(error) {
            console.error('Failed to fetch book: ', error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (formData) => {
        try {
            await booksAPI.updateBook(id,formData);
            navigate('/dashboard');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update book');

        }
    };


    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <Navbar />
                <div className='flex justify-center items-center py-20'>
                    <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'>

                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
           
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <BookForm 
                    initialData={book}
                    onSubmit={handleSubmit}
                    isEditing={true}
                />    
            </main> 
        </div>
    );
};

export default EditBook;