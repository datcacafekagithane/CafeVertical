import * as Icons from "lucide-react";
import type { MenuItem } from "@shared/schema";

interface MenuItemProps {
  item: MenuItem;
  categoryColor: string;
}

export function MenuItem({ item, categoryColor }: MenuItemProps) {
  // Get the icon component dynamically
  const IconComponent = Icons[item.iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  
  // Create color classes based on category color
  const colorClasses = {
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    teal: "bg-teal-100 text-teal-600",
    pink: "bg-pink-100 text-pink-600",
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  const iconColorClass = colorClasses[categoryColor as keyof typeof colorClasses] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 hover:transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${iconColorClass}`}>
            {IconComponent && <IconComponent className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">{item.name}</span>
              <span className="text-gray-600 ml-2">₺{item.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
