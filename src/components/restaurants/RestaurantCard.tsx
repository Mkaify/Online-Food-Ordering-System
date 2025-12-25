import Link from "next/link";
import Image from "next/image";
import { Star, Clock } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  cuisine: string;
}

export default function RestaurantCard({
  id,
  name,
  description,
  image,
  rating,
  reviewCount,
  deliveryTime,
  cuisine,
}: RestaurantCardProps) {
  const validId = id.toString();
  
  return (
    <Link
      href={`/restaurants/${validId}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          unoptimized={process.env.NODE_ENV === 'development'}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-500">({reviewCount})</span>
          </div>
        </div>
        <p className="text-gray-600 mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{cuisine}</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 