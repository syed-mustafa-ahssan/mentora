import React from 'react';

const StatCard = ({ title, value, icon, change }) => {
  return (
    <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700 hover:border-indigo-500 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
          <p className="mt-2 text-xs text-green-500 flex items-center">
            <span>{change}</span>
          </p>
        </div>
        <div className="bg-zinc-700 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;