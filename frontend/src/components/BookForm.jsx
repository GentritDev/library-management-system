import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BookForm = ({ initialData = null, onSubmit, isEditing = false}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        pages: '',
        publishedYear: '',
        description: '',
        status: 'to-read',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    //Populate form if editing 

    useEffect(() => {
        if(initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                title: initialData.title || '',
                author: initialData.author || '',
                genre: initialData.genre || '',
                pages: initialData.pages || '',
                publishedYear: initialData.publishedYear || '',
                description: initialData.description || '',
                status: initialData.status || 'to-read',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        // Validation
        if (!formData.title.trim() || !formData.author.trim()) {
            setError('Title and Author are required');
            setLoading(false);
            return;
        }

        try {
           const dataToSubmit = {
                title: formData.title. trim(),
                author: formData.author.trim(),
                genre: formData.genre.trim() || null,
                pages: formData. pages ?  parseInt(formData.pages) : null,  // Convert to number
                publishedYear:  formData.publishedYear ? parseInt(formData.publishedYear) : null,  // Convert to number
                description: formData.description. trim() || null,
                status: formData.status,
            };

            console.log('Submitting book data:', dataToSubmit); 

            await onSubmit(dataToSubmit);
        } catch (err) {
            console.error('Error submitting:', err);  
            setError(err.message || 'Failed to save book');
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}
         className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {isEditing ? 'Edit Book' : 'Add New Book'}
            </h2>

            {error && (
                <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Title */}
            <div className="mb-6">
             <label className="block text-gray-700 font-semibold mb-2">
                Title <span className="text-red-500">*</span>
             </label>
             <input type="text"
             name="title"
             value={formData.title}
             onChange={handleChange}
             required
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus: ring-blue-500" 
             placeholder="Enter book title"
             />
            </div>

            {/* Author */}

            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                    Author <span className="text-red-500">*</span>
                </label>
                <input type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus: ring-blue-500" 
                />

            </div>

            {/** Genre */}
            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Genre</label>
                <input type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g., Fiction, Mystery, Science Fiction"
                />
            </div>

            {/** Pages & Published Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Pages</label>
                    <input type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of pages" 
                    />
                </div>


            <div>
                <label className="block text-gray-700 font-semibold mb-2">Published Year</label>
                <input type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Year" />
            </div>
            </div>

            {/** Status */}
            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Status</label>
                <select 
                name="status" 
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus: ring-blue-500">
                    <option value="to-read">To Read</option>
                    <option value="reading">Reading</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Description */}

            <div className="mb-6">
                <label  className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea name="description"
                 value={formData.description}
                 onChange={handleChange}
                 rows="4"
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Book description or notes...">

                 </textarea>
            </div>

            {/* buttons */}
            <div className="flex gap-4">
                <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading  ? 'Saving...' : isEditing ? 'Update' : 'Add Book' }



                </button>

                <button
                type="button"
                onClick={()=> navigate('/dashboard')}
                className = "px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                        Cancel
                </button>

            </div>

        </form>
    )
}

export default BookForm;