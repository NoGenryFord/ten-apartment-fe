import { Link } from 'react-router-dom';
import type { Apartment } from '../types';

interface Props {
    apartment: Apartment;
}

export const ApartmentCard = ({ apartment }: Props) => {
    const coverImage = apartment.photos && apartment.photos.length > 0
        ? apartment.photos[0].photo
        : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // ЗАГЛУШКА ВРЕМЕННО

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Фото */}
            <div className="h-48 overflow-hidden">
                <img
                    src={coverImage}
                    alt={apartment.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Контент */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    {apartment.type?.name || 'Апартаменты'}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{apartment.name}</h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                    {apartment.description}
                </p>

                {/* Если поиск был по датам, BE вернет total_price */}
                {apartment.total_price && (
                    <div className="mb-4">
                        <span className="text-sm text-gray-500">For choose date: </span>
                        <span className="text-lg font-bold text-gray-900">{apartment.total_price} ₽</span>
                    </div>
                )}

                <Link
                    to={`/apartment/${apartment.id}`}
                    className="w-full text-center bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors mt-auto"
                >
                    Details
                </Link>
            </div>
        </div>
    );
};