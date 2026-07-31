type ProductCardProps = {
  image: string;
  name: string;
  price: string;
  description: string;
};

function ProductCard({
  image,
  name,
  price,
  description,
}: ProductCardProps) {
  return (
    <div className="max-w-sm rounded-xl shadow-lg p-4 bg-white hover:scale-105 hover:shadow-2xl transition duration-300">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h2 className="text-xl font-bold mt-4">{name}</h2>

      <p className="text-green-600 text-lg font-semibold mt-2">
        {price}
      </p>

      <p className="text-gray-600 mt-2">
        {description}
      </p>

      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;