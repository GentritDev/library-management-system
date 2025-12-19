import { useNavigate } from "react-router-dom";
import { booksAPI } from '../services/api';
import BookForm from '../components/BookForm'

const AddBook = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await booksAPI.createBook(formData);
            navigate('/dashboard');

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add book');

        }
    };


    return (
       
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookForm onSubmit={handleSubmit} isEditing={false} />
            </main>
       
    );
};

export default AddBook;