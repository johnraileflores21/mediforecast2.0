import React from "react";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";

interface CountCardProps {
  title: string;
  count: number;
  icon: IconType;
  backgroundColor: string;
  path: string;
}

const CountCard: React.FC<CountCardProps> = ({
  title,
  count,
  icon: Icon,
  backgroundColor,
  path
}) => {

  const navigate = useNavigate();

  return (
    <div
      className={`w-full h-36 rounded-lg p-6 shadow-md mb-4`}
      style={{ backgroundColor }}
      onClick={() => navigate(path)}
    >
      <div className="flex justify-between">
        <h1 className="text-xl font-bold text-white mt-1">{title}</h1>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-white mt-7">{count}</h1>
    </div>
  );
};

export default CountCard;
