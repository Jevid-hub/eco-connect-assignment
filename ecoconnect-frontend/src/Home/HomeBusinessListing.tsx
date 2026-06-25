import type { HomeBusiness } from "../pages/Home";

// TYPE DEFINING
interface BusinessListingProps {
  businesses: HomeBusiness[];
  onSelect: (businessId: string) => void;
}

// RECIVING PROPS AND APPLYING LIFTING UP
const BusinessListing = ({ businesses, onSelect }: BusinessListingProps) => {
  if (businesses.length === 0) {
    return <p className="text-gray-400">No businesses found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {businesses.map((business) => (
        <div
          key={business.BusinessId}
          onClick={() => onSelect(business.BusinessId)}
          className="bg-[#F4B183]/60 rounded-xl p-5 cursor-pointer hover:opacity-90"
        >
          <h3 className="font-bold text-[#B5481F] text-lg text-left">{business.title}</h3>
          <p className="text-sm text-gray-700 mt-1 text-left">{business.summary}</p>
        </div>
      ))}
    </div>
  );
};

export default BusinessListing;