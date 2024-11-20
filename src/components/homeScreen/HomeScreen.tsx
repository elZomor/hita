import {Header} from "../header/Header.tsx";
import {Filters} from "../filters/Filters.tsx";
import {actors} from "../../assets/data.ts";
import {ActorCard} from "../performerCard/PerformerCard.tsx";

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-row gap-8">
                    <Filters />

                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {actors.map((actor) => (
                                <ActorCard key={actor.id} actor={actor} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}