import { Pencil, Trash2 } from "lucide-react";
import type { ProfileBusiness } from "../pages/Profile";

// TYPE DEFINING
interface BusinessListingProps {
    businesses: ProfileBusiness[];
    onEdit: (business: ProfileBusiness) => void;
    onDelete: (businessId: string) => void;
}

// RECIVING PROPS AND APPLYING LIFTING UP
const BusinessListing = ({ businesses, onEdit, onDelete }: BusinessListingProps) => {
    if (businesses.length === 0) {
        return <p className="text-gray-400">No businesses yet.</p>;
    }

    return (
        <div>
            {businesses.map((business) => (
                <div key={business.BusinessId} className="py-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500 mt-1 text-left">{business.summary}</p>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold ">{business.title}</h3>
                        <button onClick={() => onEdit(business)} aria-label="Edit business">
                            <Pencil size={14} className="text-gray-500" />
                        </button>
                        <button
                            onClick={() => onDelete(business.BusinessId)}
                            aria-label="Delete business"
                        >
                            <Trash2 size={14} className="text-gray-500" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BusinessListing;