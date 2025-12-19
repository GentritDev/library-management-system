import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
const BookCard = ({ book, onDelete}) => {
    const navigate = useNavigate();
  const status = book.readingStatus || book.status;

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'reading':
                return 'bg-blue-100 text-blue-700';

            case 'to-read':
                return 'bg-yellow-100 text-yellow-700';
            default: 
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusEmoji = (status) => {
        switch (status) {
      case 'completed':
        return '✅';
      case 'reading':
        return '📖';
      case 'to-read':
        return '📚';
      default:
        return '📕';
    }
  };


  const handleDelete = () => {
    if(window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
        onDelete(book.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Book header with colored bar */}
      <div className={`h-2 ${
        status === 'completed' ? 'bg-green-500':
        status === 'reading' ? 'bg-blue-500' : 
        'bg-yellow-500'
        }`}> 

      </div>


      <div className="p-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
          {book.title}
        </h3>

        {/** Author */}
        <p className="text-gray-600 mb-2 flex items-center">
          <span className="font-semibold mr-2">Author:</span>
          {book.author}
        </p>

        {/** Genre */}
        <p className="text-gray-600 mb-2 flex items-center">
          <span className="font-semibold mr-2">Genre: </span>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
            {book.genre}
          </span>
        </p>


        {/** Pages */}

        {book.pages && (
          <p className="text-gray-600 mb-2 flex items-center">
            <span className="font-semibold mr-2">Pages:</span>
            {book.pages}
          </p>
        )}

        {/** Published Year */}

        {book.publishedYear && (
          <p className="text-gray-600 mb-2 flex items-center">
            <span className="font-semibold mr-2">Year:</span>
            {book.publishedYear}
          </p>
        )}

        {/** Status  */}

        <div className="mt-4 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
          {getStatusEmoji(status)} {status}
        </span>
        </div>

        {/*Description */}

        {book.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {book.description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2 mt-4 border-t border-gray-200">
          <button
          onClick={() => navigate(`/books/edit/${book.id}`)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Edit

          </button>
        <button
        onClick={handleDelete}
        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
          Delete
        </button>
        </div>
      </div>

    </div>
  );
};

export default BookCard;