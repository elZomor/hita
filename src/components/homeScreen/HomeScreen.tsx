import {Header} from "../header/Header.tsx";
import {Filters} from "../filters/Filters.tsx";
import {ActorCard} from "../performerCard/PerformerCard.tsx";
import {useEffect, useState} from "react";
import {Actor} from "../../models/Actor.ts";
import {baseUrl} from "../../constants.ts";
import {get_request} from "../../rest_utils.ts";
import {useAuth} from "@clerk/clerk-react";

export default function App() {
    const [actors, setActors] = useState<Actor[]>([]);
    const [loading, setLoading] = useState(true);
    const {getToken} = useAuth();

    useEffect(() => {
        async function fetchActors() {
            try {
                const response = await get_request('hita/performers', await getToken());
                const data = await response.json();

                const transformedActors = data.results.map((performer: any) => ({
                    id: performer.id,
                    name: `${performer.hita_member.first_name} ${performer.hita_member.last_name}`,
                    specialties: performer.skills_tags.map((tag: any) => tag.name),
                    location: performer.hita_member.location,
                    availability: performer.status,
                    imageUrl: baseUrl + performer.gallery.find((img: any) => img.is_profile_picture)?.file || "", // Default to empty string if no image
                    bio: performer.bio || "", // Optional: Include a bio if available in your API
                }));
                console.log(transformedActors[0].imageUrl)
                setActors(transformedActors);
            } catch (error) {
                console.error("Failed to fetch actors:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchActors();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header/>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-row gap-8">
                    <Filters/>

                    <div className="flex-1">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {actors.map((actor) => (
                                    <ActorCard key={actor.id} actor={actor}/>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}