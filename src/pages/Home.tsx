import { useQuery } from '@tanstack/react-query';
import { getApartments } from '../features/apartments/api';
import { ApartmentCard } from '../components/ApartmentCard';

export const Home = () => {
    const { data: apartments, isLoading, isError } = useQuery({
        queryKey: ['apartments'],
        queryFn: getApartments,
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* !!! ЛОГИКИ ТУТ ПОКА-ЧТО НЕТ !!! */}
            <div className="bg-gray-900 text-white py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Find best apartment</h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        10 exlusive apartments in best city districts. Booking directly without overpaying.
                    </p>

                    {/* Блок поиска (UI) */}
                    <div className="bg-white p-2 rounded-2xl md:rounded-full max-w-3xl mx-auto flex flex-col md:flex-row gap-2 shadow-xl">
                        <input
                            type="date"
                            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl md:rounded-full outline-none w-full"
                        />
                        <input
                            type="date"
                            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl md:rounded-full outline-none w-full"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl md:rounded-full font-semibold transition-colors whitespace-nowrap">
                           Find Free
                        </button>
                    </div>
                </div>
            </div>

            {/* Каталог */}
            <div className="max-w-6xl mx-auto px-4 mt-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Our apartments</h2>

                {isLoading && <p className="text-center text-gray-500 py-10">Load apartments...</p>}
                {isError && <p className="text-center text-red-500 py-10">Error data loading.</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {apartments?.map((apartment) => (
                        <ApartmentCard key={apartment.id} apartment={apartment} />
                    ))}
                </div>
            </div>
        </div>
    );
};